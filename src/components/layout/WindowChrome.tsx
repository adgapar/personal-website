'use client'

import { useCallback, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'

/**
 * The terminal as a window on a desktop — the photo behind is wallpaper.
 *
 * Draggable by the title bar, so whether the window covers the wallpaper's
 * subject is the reader's decision rather than something we have to design
 * around. Double-click the title bar to put it back.
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
  const [minimized, setMinimized] = useState(false)
  const [maximized, setMaximized] = useState(false)
  const [nagging, setNagging] = useState(false)
  const [offset, setOffset] = useState<Offset>({ x: 0, y: 0 })
  const [dragging, setDragging] = useState(false)

  const frame = useRef<HTMLDivElement>(null)
  const origin = useRef<{ pointer: Offset; offset: Offset } | null>(null)

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLDivElement>) => {
      // let the window buttons be buttons
      if ((e.target as HTMLElement).closest('button')) return
      origin.current = {
        pointer: { x: e.clientX, y: e.clientY },
        offset,
      }
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
      className={`relative flex w-full flex-col self-start ${
        maximized ? 'max-w-none' : 'max-w-4xl'
      } ${dragging ? '' : 'transition-[max-width,transform] duration-300'}`}
      style={{
        transform: `translate(${offset.x}px, ${offset.y}px)`,
        // bevel: light above, dark below, like a raised surface
        border: '1px solid var(--border)',
        borderTopColor: '#3a3733',
        borderLeftColor: '#332f2b',
        borderBottomColor: '#141210',
        borderRightColor: '#141210',
        boxShadow: dragging
          ? '0 40px 90px -10px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.6)'
          : '0 24px 70px -12px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.5)',
        background: 'rgba(12,11,10,0.93)',
      }}
    >
      <div
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onDoubleClick={() => setOffset({ x: 0, y: 0 })}
        title="drag to move · double-click to recentre"
        className={`flex touch-none items-center gap-2 border-b border-[var(--border)] px-3 py-1.5 select-none ${
          dragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          background:
            'linear-gradient(to bottom, rgba(45,41,37,0.95), rgba(26,24,21,0.95))',
        }}
      >
        <span className="text-[10px] tracking-widest text-[var(--muted)]">
          {title}
        </span>

        {nagging && (
          <span className="text-[10px] tracking-widest text-[var(--warm)]">
            nice try — this one stays open
          </span>
        )}

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => setMinimized((v) => !v)}
            aria-label={minimized ? 'Restore' : 'Minimize'}
            className="h-4 w-5 border border-[var(--border)] text-[9px] leading-none text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            {minimized ? '▢' : '─'}
          </button>
          <button
            type="button"
            onClick={() => {
              setMaximized((v) => !v)
              setOffset({ x: 0, y: 0 })
            }}
            aria-label={maximized ? 'Restore size' : 'Maximize'}
            className="h-4 w-5 border border-[var(--border)] text-[9px] leading-none text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            □
          </button>
          <button
            type="button"
            onClick={() => {
              setNagging(true)
              setTimeout(() => setNagging(false), 2200)
            }}
            aria-label="Close"
            className="h-4 w-5 border border-[var(--border)] text-[9px] leading-none text-[var(--muted)] hover:border-[var(--error)] hover:text-[var(--error)]"
          >
            ✕
          </button>
        </div>
      </div>

      {!minimized && <div className="flex flex-col">{children}</div>}
    </div>
  )
}
