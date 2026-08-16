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

/**
 * The boot screen has its own palette, on purpose. It is the one moment the site
 * is a switched-off screen rather than a lit desk, so it cannot borrow the
 * daylight tokens — dark green ink on near-black would be unreadable. Phosphor
 * green is gone with it: the machine reports in plain white now.
 */
const BOOT = {
  ground: '#0d0d0c',
  ink: '#e8e6e1',
  label: '#7b7973',
  rule: '#26251f',
  accent: '#7dd3fc',
}

const COLOR: Record<NonNullable<Line['style']>, string> = {
  ok: 'text-[#e8e6e1]',
  warm: 'text-[#e8e6e1]',
  dim: 'text-[#7b7973]',
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
      className={`fixed inset-0 z-50 overflow-y-auto px-5 py-8 font-mono text-xs sm:px-10 sm:py-12 ${
        closing ? 'crt-collapse' : ''
      }`}
      style={{
        background: BOOT.ground,
        color: BOOT.ink,
        // clear of the notch and the home bar, like every other full-screen surface
        paddingTop: 'max(2rem, env(safe-area-inset-top))',
        paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
      }}
      role="status"
      aria-live="polite"
      aria-label="Starting up"
      onClick={waiting ? beginHandover : undefined}
    >
      <div className="mx-auto max-w-xl space-y-1 sm:space-y-0.5">
        {LINES.slice(0, shown).map((line, i) => (
          <div key={i} className="flex flex-col gap-x-2 sm:flex-row">
            <span className="shrink-0 text-[#7b7973]">{line.label}</span>
            {/* dot leader, like a real POST report — no room for it on a phone */}
            <span
              aria-hidden
              className="hidden min-w-4 flex-1 overflow-hidden text-[#26251f] select-none sm:inline"
            >
              {'.'.repeat(120)}
            </span>
            <TypedText
              text={line.value}
              msPerChar={10}
              className={`pl-3 break-words sm:shrink-0 sm:pl-0 ${COLOR[line.style ?? 'dim']}`}
            />
          </div>
        ))}

        {paused && (
          <div className="pt-3 text-[#7b7973]">— paused — space to resume</div>
        )}

        {waiting && (
          <div className="mt-8 space-y-4">
            <div className="h-px bg-[#26251f]" />
            <button
              type="button"
              onClick={beginHandover}
              className="group flex w-full items-center gap-3 border border-[#26251f] px-4 py-3 text-[11px] tracking-widest text-[#7b7973] transition-colors hover:border-[#7dd3fc] hover:text-[#7dd3fc] sm:w-auto sm:py-2"
            >
              <span className="cursor text-[#7dd3fc]">▊</span>
              {/* A BIOS says "press any key" because a BIOS is talking to
                  something with keys. On a phone that is an instruction you
                  cannot follow, on the one screen that is blocking the site —
                  the whole surface has always been tappable, it just never said
                  so. Same sentence, told to whoever is reading it. */}
              <span className="sm:hidden">tap to continue</span>
              <span className="hidden sm:inline">press any key to continue</span>
              <span className="ml-auto transition-transform duration-200 group-hover:translate-x-1 sm:ml-0">
                →
              </span>
            </button>
          </div>
        )}
      </div>

      {!waiting && (
        <div
          className="absolute right-4 bottom-4 flex gap-2 text-[10px] tracking-widest text-[#7b7973] sm:right-10 sm:bottom-8 sm:gap-4"
          style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
        >
          {/* px-2 py-2 rather than bare text: 10px of glyph is not something a
              thumb can aim at, and skip is the control most worth hitting */}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="px-2 py-2 hover:text-[#e8e6e1] sm:p-0"
          >
            {paused ? '▶ resume' : '⏸ pause'}
          </button>
          <button
            type="button"
            onClick={finishBoot}
            className="px-2 py-2 hover:text-[#e8e6e1] sm:p-0"
          >
            skip ✕
          </button>
        </div>
      )}
    </div>
  )
}
