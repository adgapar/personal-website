'use client'

import { useCallback, useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import AppWindow from './AppWindow'
import RotateOverlay from './RotateOverlay'
import { useMobileOrientation } from './use-mobile-orientation'
import {
  CANVAS,
  PALETTE,
  PAPER,
  SIZES,
  pushSnapshot,
  storeRatio,
  toCanvasPoint,
  type Paper,
  type Tool,
} from '@/lib/paint'

/**
 * Paint, for the `claude` egg.
 *
 * The egg prints a Monet and says you probably meant the other Claude, the one
 * that makes pictures — so it hands you the means to make one. The paints are the
 * sixteen a terminal has always had (see lib/paint.ts), in this site's inks
 * rather than raw ANSI, so the tool belongs to the terminal it opened from.
 *
 * Strokes are drawn segment by segment rather than as one accumulating path. A
 * path that grows for the length of a stroke is re-rasterised from the beginning
 * on every pointer event, so a long line gets slower the longer it gets; a fresh
 * two-point path each time is indistinguishable with a round cap and a round
 * join, and costs the same at the end of a stroke as at the start.
 *
 * Undo holds whole bitmaps, capped — the pixels are the document, and there is
 * no smaller honest representation of "what it looked like before" for a tool
 * where every stroke is freehand. Eight of them is the budget.
 *
 * The sheet is the size of the hole it is in. On a desk that is Paint's landscape
 * 400x280, because a window there is as tall as its contents and the paper is
 * what says how tall that is. On a phone the window is the whole screen, so the
 * paper is measured from what the toolbox and the palette leave behind and comes
 * out portrait — a fixed landscape sheet in a portrait screen spends two thirds
 * of the display on margin, which was the bug this app shipped with.
 */

export default function PaintApp({ onClose }: { onClose: () => void }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const ctx = useRef<CanvasRenderingContext2D | null>(null)
  /** the box the paper is cut to fit */
  const easel = useRef<HTMLDivElement>(null)
  /** where the last segment ended, in canvas pixels */
  const last = useRef<{ x: number; y: number } | null>(null)
  const undo = useRef<ImageData[]>([])

  const [tool, setTool] = useState<Tool>('brush')
  const [colour, setColour] = useState<string>(PALETTE[0].hex)
  const [size, setSize] = useState<number>(SIZES[1])
  const [canUndo, setCanUndo] = useState(false)
  const [paper, setPaper] = useState<Paper>(CANVAS)

  // A phone in portrait sees RotateOverlay instead of the easel — the sheet
  // stays mounted underneath it, so nothing here has to remeasure once the
  // phone turns back.
  const { mobile, portrait } = useMobileOrientation()
  const rotate = mobile && portrait

  /**
   * Cut the paper to the space there is, once.
   *
   * Only on a phone: there the window is the screen, so the box around the canvas
   * has a real height handed to it by the flexbox, and the paper should be all of
   * it. On a desk the box is as tall as whatever is inside it, so measuring it
   * would be asking the paper how big the paper is; CANVAS answers instead.
   *
   * Once, not on every resize. Re-cutting the sheet means deciding what happens
   * to the picture and throwing away an undo stack whose bitmaps are the old
   * size, and it would fire on an iOS toolbar sliding away. A phone turned
   * sideways mid-drawing instead shows the same sheet scaled to fit — the maxima
   * below keep it inside the window, and toCanvasPoint reads the live rect, so
   * the ink still lands under the finger.
   */
  useEffect(() => {
    if (window.matchMedia('(min-width: 640px)').matches) return
    const box = easel.current
    if (!box) return
    const width = Math.floor(box.clientWidth)
    const height = Math.floor(box.clientHeight)
    // a box that has not been laid out yet is not a sheet of paper
    if (width < 80 || height < 80) return
    setPaper({ width, height })
  }, [])

  /**
   * Set up the backing store for the sheet.
   *
   * The canvas is some number of its own pixels but a screen may have two or
   * three device pixels for each — without scaling the store to match, every
   * stroke is soft. Scaling the context once means everything after it can be
   * written in the canvas's own coordinates and never think about it again.
   *
   * Runs again when the paper is cut, which happens before anything is drawn on
   * it, so there is no picture here to lose.
   */
  useEffect(() => {
    const node = canvas.current
    if (!node) return
    const ratio = storeRatio(paper, window.devicePixelRatio)
    node.width = Math.round(paper.width * ratio)
    node.height = Math.round(paper.height * ratio)
    const context = node.getContext('2d')
    if (!context) return
    context.scale(ratio, ratio)
    context.lineCap = 'round'
    context.lineJoin = 'round'
    context.fillStyle = PAPER
    context.fillRect(0, 0, paper.width, paper.height)
    ctx.current = context
    // The sheet is only ever cut once, before there is a picture on it, so there
    // is nothing here to keep. Dropping the stack anyway is the cheap guard
    // against putImageData ever being handed a bitmap of the wrong size.
    undo.current = []
  }, [paper])

  /** remember the whole bitmap, so a stroke can be taken back as a unit */
  const remember = useCallback(() => {
    const node = canvas.current
    const context = ctx.current
    if (!node || !context) return
    // in device pixels, which is what the store actually holds
    undo.current = pushSnapshot(undo.current, context.getImageData(0, 0, node.width, node.height))
    setCanUndo(true)
  }, [])

  const stepBack = useCallback(() => {
    const context = ctx.current
    const previous = undo.current[undo.current.length - 1]
    if (!context || !previous) return
    undo.current = undo.current.slice(0, -1)
    // putImageData ignores the context transform, which is what we want: the
    // snapshot is already in device pixels
    context.putImageData(previous, 0, 0)
    setCanUndo(undo.current.length > 0)
  }, [])

  const clear = useCallback(() => {
    const context = ctx.current
    if (!context) return
    remember()
    context.fillStyle = PAPER
    context.fillRect(0, 0, paper.width, paper.height)
  }, [remember, paper])

  const ink = tool === 'eraser' ? PAPER : colour

  const onPointerDown = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const node = canvas.current
      const context = ctx.current
      if (!node || !context) return
      remember()
      const point = toCanvasPoint(e.clientX, e.clientY, node.getBoundingClientRect(), paper)
      last.current = point
      // a tap with no drag should still leave a mark, so the press paints a dot
      context.fillStyle = ink
      context.beginPath()
      context.arc(point.x, point.y, size / 2, 0, Math.PI * 2)
      context.fill()
      // capture, so a stroke that leaves the canvas keeps drawing to its edge
      // rather than stopping dead the moment the pointer crosses the frame
      node.setPointerCapture(e.pointerId)
    },
    [ink, size, remember, paper],
  )

  const onPointerMove = useCallback(
    (e: ReactPointerEvent<HTMLCanvasElement>) => {
      const node = canvas.current
      const context = ctx.current
      const from = last.current
      if (!node || !context || !from) return
      const to = toCanvasPoint(e.clientX, e.clientY, node.getBoundingClientRect(), paper)
      context.strokeStyle = ink
      context.lineWidth = size
      context.beginPath()
      context.moveTo(from.x, from.y)
      context.lineTo(to.x, to.y)
      context.stroke()
      last.current = to
    },
    [ink, size, paper],
  )

  const endStroke = useCallback(() => {
    last.current = null
  }, [])

  return (
    <AppWindow title="paint" onClose={onClose} status={tool === 'eraser' ? 'eraser' : undefined}>
      {/* The Windows layout: toolbox down the left, colours in a strip along the
          bottom, canvas in what is left. Worth copying exactly, because it is the
          arrangement anyone who has opened Paint already knows — and it needs no
          responsive branch, since a narrow tool column and a wide palette are the
          right shape on a phone too. */}
      <div className="relative flex min-h-0 flex-1 flex-col gap-3 p-3 sm:p-4">
        <div className="flex min-h-0 flex-1 gap-3">
          {/* the toolbox */}
          <div className="flex w-[54px] shrink-0 flex-col gap-3">
            {(['brush', 'eraser'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTool(t)}
                aria-pressed={tool === t}
                className={`text-left text-[9px] tracking-widest uppercase transition-colors duration-150 ${
                  tool === t ? 'text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--fg)]'
                }`}
              >
                {t}
              </button>
            ))}

            {/* Nibs as bars of increasing thickness, which is how Paint showed
                them under the toolbox — and it shows the actual stroke width
                rather than standing for it. */}
            <div className="flex flex-col gap-1.5 border-t border-[var(--hair)] pt-3">
              {SIZES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-label={`brush size ${s}`}
                  aria-pressed={size === s}
                  className="flex h-4 w-full items-center"
                >
                  <span
                    className="block w-full rounded-full transition-colors duration-150"
                    style={{
                      height: s,
                      background: size === s ? 'var(--accent)' : 'var(--muted)',
                    }}
                  />
                </button>
              ))}
            </div>

            <div className="mt-auto flex flex-col gap-1 border-t border-[var(--hair)] pt-3">
              <button
                type="button"
                onClick={stepBack}
                disabled={!canUndo}
                className="text-left text-[9px] tracking-widest uppercase text-[var(--muted)] transition-colors duration-150 hover:text-[var(--fg)] disabled:opacity-35 disabled:hover:text-[var(--muted)]"
              >
                undo
              </button>
              {/* "clear all", not "clear" — it takes the whole canvas, and the
                  shorter word reads like it might only take the selection */}
              <button
                type="button"
                onClick={clear}
                className="text-left text-[9px] tracking-widest uppercase text-[var(--muted)] transition-colors duration-150 hover:text-[var(--fg)]"
              >
                clear all
              </button>
            </div>
          </div>

          {/* The easel, and the thing the paper is measured against. min-w-0 and
              min-h-0, or the sheet's own size becomes the floor this box can
              shrink to and the window overflows the phone it is measuring. */}
          <div
            ref={easel}
            className="flex min-h-0 min-w-0 flex-1 items-start justify-center overflow-hidden"
          >
            <canvas
              ref={canvas}
              role="img"
              aria-label="a drawing canvas"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={endStroke}
              onPointerCancel={endStroke}
              // touch-none: a drag here is a brush stroke, never a page scroll
              className="touch-none rounded-[2px] shadow-[2px_2px_0_rgba(0,0,0,0.25)]"
              style={{
                // the sheet's own size, in CSS pixels — on a phone that is the
                // easel exactly, so there is no margin left to explain
                width: paper.width,
                height: paper.height,
                // and a ceiling for the sideways phone, which is the only way
                // the easel ever ends up smaller than the sheet it cut
                maxWidth: '100%',
                maxHeight: '100%',
                cursor: 'crosshair',
                background: PAPER,
              }}
            />
          </div>
        </div>

        {/* The palette, along the bottom. The current colour sits at its left end
            in a larger well, which is the one piece of state the strip has to
            show — Paint put the foreground swatch in exactly that spot. */}
        <div className="flex shrink-0 items-center gap-2.5 border-t border-[var(--hair)] pt-3">
          <span
            aria-hidden
            title={tool === 'eraser' ? 'erasing' : 'current colour'}
            className="block h-9 w-9 shrink-0 rounded-[2px] border border-[var(--hair)]"
            style={{ background: ink }}
          />
          {/* grid-cols-8 and row-major, so each bright colour sits directly under the
              normal one it brightens — the second row is not a second set, it is
              the same set turned up */}
          <div className="grid grid-cols-8 gap-1">
            {PALETTE.map((c) => (
              <button
                key={c.name}
                type="button"
                onClick={() => {
                  setColour(c.hex)
                  // picking a colour means you want to paint with it, not to keep
                  // erasing in it
                  setTool('brush')
                }}
                aria-label={c.name}
                title={c.name}
                aria-pressed={tool === 'brush' && colour === c.hex}
                className={`h-4 w-4 rounded-[1px] transition-transform duration-150 hover:scale-110 ${
                  tool === 'brush' && colour === c.hex
                    ? 'ring-1 ring-[var(--bright)] ring-offset-1 ring-offset-[var(--surface)]'
                    : ''
                }`}
                style={{ background: c.hex }}
              />
            ))}
          </div>
        </div>
        {rotate && <RotateOverlay />}
      </div>
    </AppWindow>
  )
}
