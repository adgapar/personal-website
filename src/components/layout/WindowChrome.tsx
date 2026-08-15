'use client'

import {
  useCallback,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent as ReactPointerEvent,
} from 'react'
import { TITLE_BAR, WINDOW_FRAME, WINDOW_FRAME_LIFTED } from '@/lib/window-style'
import {
  getServerSnapshot,
  getSnapshot,
  setWindowState,
  subscribe,
} from '@/lib/window-state-store'

/**
 * The terminal as a window on a desktop — the photo behind is wallpaper.
 *
 * Draggable by the title bar, so whether the window covers the wallpaper's
 * subject is the reader's decision rather than something we have to design
 * around. Double-click the title bar to put it back.
 *
 * Position and min/max state live in window-state-store, not here — every route
 * renders its own PageLayout, so this component remounts on each tab click.
 *
 * Deliberately not a Win95 pastiche: one bevel, one shadow, a title bar. Enough
 * to say "window" without dragging in grey plastic that would fight the palette.
 */

interface Props {
  title: string
  children: React.ReactNode
}

type Offset = { x: number; y: number }

export default function WindowChrome({ title, children }: Props) {
  const { minimized, maximized, offset } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )
  const setMinimized = (v: boolean) => setWindowState({ minimized: v })
  const setOffset = (v: Offset) => setWindowState({ offset: v })

  const [nagging, setNagging] = useState(false)
  const [dragging, setDragging] = useState(false)

  // a minimized window collapses to its title bar — filling the screen with an
  // empty frame is not a state anyone wants. `maximized` is remembered, so
  // restoring puts it back to fullscreen.
  const fullscreen = maximized && !minimized

  const frame = useRef<HTMLDivElement>(null)
  const origin = useRef<{ pointer: Offset; offset: Offset } | null>(null)

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      if (fullscreen) return
      // let the window buttons be buttons
      if ((e.target as HTMLElement).closest('button')) return
      origin.current = {
        pointer: { x: e.clientX, y: e.clientY },
        offset,
      }
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [offset, fullscreen],
  )

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const start = origin.current
    if (!start) return

    const next = {
      x: start.offset.x + (e.clientX - start.pointer.x),
      y: start.offset.y + (e.clientY - start.pointer.y),
    }

    // keep the title bar reachable — never let the window leave the viewport
    const rect = frame.current?.getBoundingClientRect()
    if (rect) {
      const margin = 48
      const minX = -(rect.left - start.offset.x) - rect.width + margin
      const maxX = window.innerWidth - (rect.left - start.offset.x) - margin
      const minY = -(rect.top - start.offset.y) + 8
      const maxY = window.innerHeight - (rect.top - start.offset.y) - margin
      next.x = Math.min(Math.max(next.x, minX), maxX)
      next.y = Math.min(Math.max(next.y, minY), maxY)
    }

    setOffset(next)
  }, [])

  const endDrag = useCallback(() => {
    origin.current = null
    setDragging(false)
  }, [])

  return (
    <div
      ref={frame}
      className={
        // pointer-events-auto: the wrapper disables them so the desktop behind
        // stays reachable, and the window takes them back for itself
        fullscreen
          ? 'pointer-events-auto fixed inset-0 z-40 flex flex-col'
          : `pointer-events-auto relative flex w-full max-w-3xl flex-col ${
              dragging ? '' : 'transition-[max-width,transform] duration-300'
            }`
      }
      style={{
        // One height for every tab. The tabs are inside this window, so the
        // window is the thing that does not move when you switch between them —
        // a frame that resized per tab made the furniture the moving part.
        // Short pages simply have room left over.
        ['--term-max-h' as string]: fullscreen
          ? 'calc(100vh - 6.75rem)'
          : 'min(68vh, calc(100dvh - 13rem))',
        ...(dragging ? WINDOW_FRAME_LIFTED : WINDOW_FRAME),
        transform: fullscreen ? undefined : `translate(${offset.x}px, ${offset.y}px)`,
        ...(fullscreen
          ? {
              // nothing to be raised above when it fills the screen
              borderColor: 'transparent',
              borderRadius: 0,
              boxShadow: 'none',
              background: 'var(--surface)',
            }
          : {}),
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => setOffset({ x: 0, y: 0 })}
        title={fullscreen ? undefined : 'drag to move · double-click to recentre'}
        className={`relative flex touch-none items-center gap-3 border-b border-[var(--border)] px-6 py-2 select-none sm:px-8 ${
          fullscreen ? '' : dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={TITLE_BAR}
      >
        {/* The title is centred and the controls sit right, so the bar has no
            left-hand furniture to fight the content's left edge. */}
        <span className="pointer-events-none absolute inset-x-0 text-center text-[11px] tracking-wide text-[var(--chrome)]">
          {nagging ? 'nice try — this one stays open' : title}
        </span>

        {/* Three dots, the one conventional place colour belongs. Grey glyphs at
            3.3:1 were invisible and had no hit area — you could not see them and
            you could not aim at them. The glyph appears inside on hover, so the
            bar is still quiet at rest. */}
        <div className="group/ctl ml-auto flex items-center gap-2">
          {[
            {
              key: 'min',
              tint: 'var(--ctl-min)',
              label: minimized ? 'Restore' : 'Minimize',
              glyph: minimized ? '+' : '–',
              onClick: () => setMinimized(!minimized),
            },
            {
              key: 'max',
              tint: 'var(--ctl-max)',
              label: maximized ? 'Restore size' : 'Maximize',
              glyph: maximized ? '⤢' : '□',
              onClick: () =>
                setWindowState({ maximized: !maximized, offset: { x: 0, y: 0 } }),
            },
            {
              key: 'close',
              tint: 'var(--ctl-close)',
              label: 'Close',
              glyph: '✕',
              onClick: () => {
                setNagging(true)
                setTimeout(() => setNagging(false), 2200)
              },
            },
          ].map((ctl) => (
            <button
              key={ctl.key}
              type="button"
              onClick={ctl.onClick}
              aria-label={ctl.label}
              title={ctl.label}
              style={{ background: ctl.tint }}
              className="flex h-[11px] w-[11px] items-center justify-center rounded-full text-[8px] leading-none text-transparent transition-[filter,color] duration-150 hover:brightness-95 group-hover/ctl:text-[rgba(38,32,20,0.55)]"
            >
              {ctl.glyph}
            </button>
          ))}
        </div>
      </div>

      {/* Hidden, not unmounted. A minimized window that threw away the session
          would be a reset button with a "─" on it — the scrollback, the command
          history and the reveal animation all live in React state below here. */}
      <div
        // `hidden` as a class, not the attribute: Tailwind's `flex` is an author
        // rule and would win over the attribute's display:none
        className={
          minimized
            ? 'hidden'
            : fullscreen
              ? 'flex min-h-0 flex-1 flex-col'
              : 'flex flex-col'
        }
        aria-hidden={minimized || undefined}
      >
        {children}
      </div>
    </div>
  )
}
