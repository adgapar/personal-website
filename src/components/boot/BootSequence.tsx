'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import TypedText from '@/components/terminal/TypedText'
import {
  beginHandover,
  finishBoot,
  getServerSnapshot,
  getSnapshot,
  reachCheckpoint,
  subscribe,
} from '@/lib/boot-store'

/**
 * POST before the desktop. Makes the site something you switched on rather than
 * a page that was already there.
 *
 * It starts on its own, can be paused mid-run, and holds at a checkpoint when
 * the checks finish — otherwise the output flashes past before anyone reads it.
 * Skippable throughout, and it runs once per session.
 */

type Line = { label: string; value: string; style?: 'ok' | 'warm' | 'dim' }

const LINES: Line[] = [
  { label: 'ADILET BIOS', value: 'adilet.fyi', style: 'dim' },
  { label: 'Manufactured', value: 'Astana, Kazakhstan  ·  1993', style: 'ok' },
  { label: 'Firmware', value: 'MSc  ·  IE Madrid 2020  ·  top of class', style: 'ok' },
  { label: 'Locales', value: 'kk · ru · en · fr · es', style: 'ok' },
  { label: 'Volumes mounted', value: '/microsoft  /volvo_cars  /capchase  /orbio_ai', style: 'ok' },
  { label: 'Root filesystem', value: '/elche  ·  family of four', style: 'ok' },
  { label: 'Starting session', value: 'ready when you are', style: 'ok' },
]

const LINE_MS = 260

const COLOR: Record<NonNullable<Line['style']>, string> = {
  ok: 'text-[var(--success)]',
  warm: 'text-[var(--warm)]',
  dim: 'text-[var(--dim)]',
}

export default function BootSequence() {
  const phase = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const [shown, setShown] = useState(0)
  const [paused, setPaused] = useState(false)

  // one timer at a time, so pausing genuinely stops the sequence
  useEffect(() => {
    if (phase !== 'booting' || paused) return

    if (shown < LINES.length) {
      const id = setTimeout(() => setShown(shown + 1), shown === 0 ? 220 : LINE_MS)
      return () => clearTimeout(id)
    }

    // let the last value finish typing, then hold
    const id = setTimeout(reachCheckpoint, 500)
    return () => clearTimeout(id)
  }, [phase, paused, shown])

  useEffect(() => {
    if (phase === 'done') return

    const onKey = (e: KeyboardEvent) => {
      if (phase === 'ready') {
        beginHandover()
        return
      }
      if (phase === 'closing') return
      if (e.key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      } else if (e.key === 'Escape' || e.key === 'Enter') {
        finishBoot()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [phase])

  // the collapse animation owns this window of time
  useEffect(() => {
    if (phase !== 'closing') return
    const id = setTimeout(finishBoot, 560)
    return () => clearTimeout(id)
  }, [phase])

  if (phase === 'done') return null

  const waiting = phase === 'ready'
  const closing = phase === 'closing'

  return (
    <div
      className={`fixed inset-0 z-50 overflow-hidden bg-[#050505] px-6 py-8 font-mono text-xs sm:px-10 sm:py-12 ${
        closing ? 'crt-collapse' : ''
      }`}
      role="status"
      aria-live="polite"
      aria-label="Starting up"
      onClick={waiting ? beginHandover : undefined}
    >
      <div className="mx-auto max-w-xl space-y-0.5">
        {LINES.slice(0, shown).map((line, i) => (
          <div key={i} className="flex gap-2">
            <span className="shrink-0 text-[var(--muted)]">{line.label}</span>
            {/* dot leader, like a real POST report */}
            <span
              aria-hidden
              className="min-w-4 flex-1 overflow-hidden text-[var(--border)] select-none"
            >
              {'.'.repeat(120)}
            </span>
            <TypedText
              text={line.value}
              msPerChar={10}
              className={`shrink-0 ${COLOR[line.style ?? 'dim']}`}
            />
          </div>
        ))}

        {paused && (
          <div className="pt-3 text-[var(--warm)]">— paused — space to resume</div>
        )}

        {waiting && (
          <div className="mt-8 space-y-4">
            <div className="h-px bg-[var(--border)]" />
            <button
              type="button"
              onClick={beginHandover}
              className="group flex items-center gap-3 border border-[var(--border)] px-4 py-2 text-[11px] tracking-widest text-[var(--muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <span className="cursor text-[var(--accent)]">▊</span>
              press any key to continue
              <span className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>
        )}
      </div>

      {!waiting && (
        <div className="absolute right-6 bottom-6 flex gap-4 text-[10px] tracking-widest text-[var(--dim)] sm:right-10 sm:bottom-8">
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="hover:text-[var(--fg)]"
          >
            {paused ? '▶ resume' : '⏸ pause'}
          </button>
          <button type="button" onClick={finishBoot} className="hover:text-[var(--fg)]">
            skip ✕
          </button>
        </div>
      )}
    </div>
  )
}
