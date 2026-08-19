'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { TITLE_BAR, WINDOW_FRAME, WINDOW_FRAME_LIFTED } from '@/lib/window-style'

/**
 * A window for the things that are not the terminal.
 *
 * The terminal's own frame is WindowChrome, which carries tabs, a remembered
 * maximize state and a close button that refuses to close — all correct for the
 * one window that is always open, and all wrong for a window whose whole point
 * is that it opens and closes. This is the same frame with the opposite manners:
 * no tabs, no maximize, and a close button that means it.
 *
 * Positioned exactly the way WindowChrome is, down to the class list: fixed and
 * full-bleed below sm, a centred block above it. That is not a coincidence to be
 * tidied up later — it is this desk's standing rule that a phone runs one app at
 * a time, and reusing `window-shell` means the drag offset and the safe-area
 * insets are the same code that already handles them for the terminal.
 *
 * Sits at z-45: above the terminal, below the dock. A magnified dock icon
 * passing over an open app is what the real dock does.
 */

interface Props {
  title: string
  onClose: () => void
  /** shown in the title bar, right of the name — a score, a state, a hint */
  status?: string
  children: React.ReactNode
}

type Offset = { x: number; y: number }

export default function AppWindow({ title, onClose, status, children }: Props) {
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)
  const frame = useRef<HTMLDivElement>(null)
  const origin = useRef<{ pointer: Offset; offset: Offset } | null>(null)

  // Escape closes it, the way a full-screen app and a dialog both do. Bound to
  // the window rather than the frame so it works whatever has focus inside.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // pinned to the viewport below sm, so a drag has nothing to move — asked
      // of the medium, not the input, exactly as WindowChrome asks it
      if (!window.matchMedia('(min-width: 640px)').matches) return
      if ((e.target as HTMLElement).closest('button, a')) return
      origin.current = { pointer: { x: e.clientX, y: e.clientY }, offset }
      setDragging(true)
      e.currentTarget.setPointerCapture(e.pointerId)
    },
    [offset],
  )

  const onPointerMove = useCallback((e: ReactPointerEvent<HTMLDivElement>) => {
    const start = origin.current
    if (!start) return
    const next = {
      x: start.offset.x + (e.clientX - start.pointer.x),
      y: start.offset.y + (e.clientY - start.pointer.y),
    }
    // never let the title bar leave the viewport, or there is no way back
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
      role="dialog"
      aria-label={title}
      className={`term term-glass window-shell pointer-events-auto fixed inset-0 z-[45] flex flex-col sm:relative sm:inset-auto sm:z-auto sm:w-auto ${
        dragging ? '' : 'sm:transition-transform duration-300'
      }`}
      style={{
        ...(dragging ? WINDOW_FRAME_LIFTED : WINDOW_FRAME),
        // the same two numbers window-shell already reads for the terminal, and
        // the same rule drops them below sm where the window is the screen
        ['--win-tx' as string]: `${offset.x}px`,
        ['--win-ty' as string]: `${offset.y}px`,
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => setOffset({ x: 0, y: 0 })}
        title="drag to move · double-click to recentre"
        className={`relative flex items-center gap-3 px-3 py-2 select-none sm:touch-none ${
          dragging ? 'sm:cursor-grabbing' : 'sm:cursor-grab'
        }`}
        style={TITLE_BAR}
      >
        <span className="text-[11px] tracking-widest text-[var(--muted)] uppercase">{title}</span>
        {status && <span className="truncate text-[11px] tracking-wide text-[var(--warm)]">{status}</span>}

        {/* One dot, because one is all that would do anything. The terminal shows
            three because it has three states; two dead ones next to this would be
            decoration dressed as controls. */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close (esc)"
          style={{ background: 'var(--ctl-close)' }}
          className="ml-auto flex h-[11px] w-[11px] shrink-0 items-center justify-center rounded-full text-[8px] leading-none text-transparent transition-[filter,color] duration-150 hover:text-[rgba(38,32,20,0.55)] hover:brightness-95"
        >
          ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  )
}
