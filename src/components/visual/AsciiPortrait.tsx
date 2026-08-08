'use client'

import { useEffect, useState } from 'react'

/**
 * The portrait rendered as terminal characters — no image element at all, just
 * text on the page. Optionally resolves to the real photograph on hover, so the
 * machine's reading of a face gives way to the face.
 */

// darkest → lightest, chosen to read as tone in a monospace grid
const RAMP = '@%#*+=-:. '

interface Props {
  src: string
  /** character columns; rows are derived from the image aspect ratio */
  cols?: number
  /** crossfade to the real photo on hover */
  revealOnHover?: boolean
  className?: string
}

export default function AsciiPortrait({
  src,
  cols = 44,
  revealOnHover = true,
  className,
}: Props) {
  const [rows, setRows] = useState<string[] | null>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    let cancelled = false
    const img = new window.Image()
    img.crossOrigin = 'anonymous'
    img.src = src

    img.onload = () => {
      if (cancelled) return

      // monospace cells are about twice as tall as they are wide
      const aspect = img.height / img.width
      const rowCount = Math.max(1, Math.round((cols * aspect) / 2))

      const canvas = document.createElement('canvas')
      canvas.width = cols
      canvas.height = rowCount
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.drawImage(img, 0, 0, cols, rowCount)
      const { data } = ctx.getImageData(0, 0, cols, rowCount)

      const out: string[] = []
      for (let y = 0; y < rowCount; y++) {
        let line = ''
        for (let x = 0; x < cols; x++) {
          const i = (y * cols + x) * 4
          // Rec. 601 luma
          const luma =
            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255
          const boosted = Math.min(1, Math.max(0, (luma - 0.08) * 1.25))
          line += RAMP[Math.min(RAMP.length - 1, Math.floor(boosted * RAMP.length))]
        }
        out.push(line)
      }
      setRows(out)
    }

    return () => {
      cancelled = true
    }
  }, [src, cols])

  if (!rows) {
    return (
      <div
        className={className}
        style={{ minHeight: '10rem' }}
        aria-label="rendering portrait"
      />
    )
  }

  return (
    <div
      className={`relative shrink-0 select-none ${className ?? ''}`}
      onMouseEnter={revealOnHover ? () => setRevealed(true) : undefined}
      onMouseLeave={revealOnHover ? () => setRevealed(false) : undefined}
    >
      <pre
        aria-label="Adilet Gaparov, rendered as text"
        className="font-mono text-[var(--muted)] transition-opacity duration-500"
        style={{
          fontSize: '6px',
          lineHeight: '6px',
          letterSpacing: '0.5px',
          opacity: revealed ? 0.12 : 1,
          margin: 0,
        }}
      >
        {rows.join('\n')}
      </pre>

      {revealOnHover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt="Adilet Gaparov"
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full rounded-sm object-cover transition-opacity duration-500"
          style={{ opacity: revealed ? 1 : 0 }}
        />
      )}
    </div>
  )
}
