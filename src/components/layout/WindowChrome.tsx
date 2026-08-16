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
 * Carries the `term` class, which is where the dark palette lives. The desk, the
 * icons and the reader stay in daylight; only what is inside this frame is a
 * machine. See globals.css.
 */

interface Props {
  title: string
  /** the session tabs — they live in the top row, not in a strip below it */
  tabs?: React.ReactNode
  children: React.ReactNode
}

type Offset = { x: number; y: number }

export default function WindowChrome({ title, tabs, children }: Props) {
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
      // Below sm the window is pinned to the viewport, so a drag has nothing to
      // move. Asked of the medium rather than the input: a touchscreen laptop
      // still has a desk, and a mouse on a phone-width window still does not.
      if (!window.matchMedia('(min-width: 640px)').matches) return
      // let the buttons be buttons and the tabs be tabs
      if ((e.target as HTMLElement).closest('button, a')) return
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
      // the window still has a name; the tabs just say it better than a strip
      // repeating it above them would
      role="group"
      aria-label={title}
      className={
        // pointer-events-auto: the wrapper disables them so the desktop behind
        // stays reachable, and the window takes them back for itself
        //
        // Below sm every window is maximized, whatever the store says. A phone
        // runs one app at a time and there is nothing to arrange it against; the
        // floating-window layout spent a third of the viewport on desk and
        // chrome to show a 452px porthole onto 1700px of text.
        fullscreen
          ? 'term term-glass window-shell window-filled pointer-events-auto fixed inset-0 z-40 flex flex-col'
          : `term term-glass window-shell pointer-events-auto fixed inset-0 z-40 flex flex-col sm:relative sm:inset-auto sm:z-auto sm:w-full sm:max-w-3xl ${
              dragging ? '' : 'sm:transition-[max-width,transform] duration-300'
            }`
      }
      style={{
        // One height for every tab. The tabs are inside this window, so the
        // window is the thing that does not move when you switch between them —
        // a frame that resized per tab made the furniture the moving part.
        // Short pages simply have room left over.
        //
        // Unset when the window fills the screen — the scrollback takes the
        // space left over from the bars instead, which is the only figure that
        // stays right as the keyboard opens and closes.
        ...(fullscreen
          ? {}
          : { ['--term-max-h' as string]: 'min(68vh, calc(100dvh - 13rem))' }),
        ...(dragging ? WINDOW_FRAME_LIFTED : WINDOW_FRAME),
        // Handed to CSS as two numbers rather than applied as a transform here,
        // so the narrow-screen rule can drop it: below sm the window is pinned to
        // the viewport, and a drag offset left over from a wider layout would
        // push it off the edge with no way to get it back.
        ...(fullscreen
          ? {}
          : {
              ['--win-tx' as string]: `${offset.x}px`,
              ['--win-ty' as string]: `${offset.y}px`,
            }),
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
        // touch-none only from sm up: below it the bar is not a drag handle, and
        // swallowing touch there just makes the top of the window feel dead
        className={`relative flex items-stretch select-none sm:touch-none sm:gap-3 sm:px-4 ${
          fullscreen ? '' : dragging ? 'sm:cursor-grabbing' : 'sm:cursor-grab'
        }`}
        style={TITLE_BAR}
      >
        {/* The tabs are the top of the window, the way a terminal emulator does
            it — no title strip above them saying the same thing twice. The one
            that is open has no ground of its own, so it is the body's surface
            carried up into the row: a folder tab rather than a button. */}
        {tabs}

        {nagging && (
          <span className="hidden items-center text-[11px] tracking-wide text-[var(--warm)] sm:flex">
            nice try — this one stays open
          </span>
        )}

        {/* Three dots, the one conventional place colour belongs. Grey glyphs at
            3.3:1 were invisible and had no hit area — you could not see them and
            you could not aim at them. The glyph appears inside on hover, so the
            bar is still quiet at rest.

            Gone below sm, and not as a space saving: all three name operations a
            phone does not have. There is nothing to minimize a window away from,
            maximize is the only state it is ever in, and close would put you on
            an empty desk. Three 11px dots that lie about what they do are worth
            less than the 90px of tab strip they were sitting on. */}
        <div className="group/ctl ml-auto hidden items-center gap-2 self-center pr-1 sm:flex">
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
        // min-h-0 flex-1 below sm for the same reason as fullscreen: the window
        // is the viewport there, so the scrollback should take whatever the tab
        // row and the status bar leave — measured, not guessed at with a vh sum
        className={
          minimized
            ? 'hidden'
            : fullscreen
              ? 'flex min-h-0 flex-1 flex-col'
              : 'flex min-h-0 flex-1 flex-col sm:flex-none'
        }
        aria-hidden={minimized || undefined}
      >
        {children}
      </div>
    </div>
  )
}
