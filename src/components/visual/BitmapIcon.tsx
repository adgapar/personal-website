'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * A picture of yours, reduced to one bit, in a paper edge.
 *
 * This is the whole icon system. There is no drawn artwork anywhere on the desk:
 * a glyph invented for `reader` looked like a page-with-a-folded-corner from any
 * icon set on the internet, said nothing about this site, and gave no way to draw
 * a second icon that was any better. A bitmap of the thing itself is specific by
 * construction, and the next icon is made the same way.
 *
 * The grid is deliberately coarser than the box it is shown in — a 30×30 bitmap
 * scaled to 48px is how a Mac icon actually looked. Dithering at 1:1 turns the
 * subject into grey mush at this size.
 *
 * Canvas rather than the shader library: it is 40 lines, it needs no WebGL
 * context per icon, and it renders identically on a machine with no GPU.
 */

/** ordered dither — a fixed 4×4 threshold matrix, the classic Bayer kernel */
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
]

interface Props {
  src: string
  /** bitmap resolution — the number of dots across, not the drawn size */
  grid?: number
  /** drawn size in CSS pixels */
  size?: number
  /** ink, as an [r, g, b] triple */
  ink?: [number, number, number]
  contrast?: number
  className?: string
}

export default function BitmapIcon({
  src,
  grid = 30,
  size = 48,
  ink = [27, 27, 31],
  contrast = 1.75,
  className,
}: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  // covers are served by convention, so a post without one must leave no trace
  // rather than an empty framed box
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    let cancelled = false
    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      if (cancelled) return

      // square crop from the centre, then down to the bitmap grid
      const side = Math.min(img.width, img.height)
      ctx.clearRect(0, 0, grid, grid)
      ctx.drawImage(
        img,
        (img.width - side) / 2,
        (img.height - side) / 2,
        side,
        side,
        0,
        0,
        grid,
        grid,
      )

      const frame = ctx.getImageData(0, 0, grid, grid)
      const px = frame.data

      // Auto-level before thresholding. Several of these photographs are dark,
      // and without stretching the tones they actually use, each one dithers
      // down to a solid black square.
      const lum = new Float32Array(grid * grid)
      for (let n = 0; n < lum.length; n++) {
        const i = n * 4
        lum[n] = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255
      }
      const sorted = Float32Array.from(lum).sort()
      const lo = sorted[Math.floor(sorted.length * 0.04)]
      const hi = sorted[Math.floor(sorted.length * 0.96)]
      const span = Math.max(0.08, hi - lo)

      for (let y = 0; y < grid; y++) {
        for (let x = 0; x < grid; x++) {
          const i = (y * grid + x) * 4
          const levelled = (lum[y * grid + x] - lo) / span
          const value = Math.min(1, Math.max(0, (levelled - 0.5) * contrast + 0.5))

          if (value < (BAYER[y % 4][x % 4] + 0.5) / 16) {
            px[i] = ink[0]
            px[i + 1] = ink[1]
            px[i + 2] = ink[2]
            px[i + 3] = 255
          } else {
            px[i + 3] = 0
          }
        }
      }

      ctx.putImageData(frame, 0, 0)
    }

    img.onerror = () => {
      if (!cancelled) setMissing(true)
    }

    img.src = src
    return () => {
      cancelled = true
    }
  }, [src, grid, ink, contrast])

  if (missing) return null

  return (
    <canvas
      ref={ref}
      width={grid}
      height={grid}
      aria-hidden
      className={className}
      style={{ width: size, height: size, imageRendering: 'pixelated' }}
    />
  )
}
