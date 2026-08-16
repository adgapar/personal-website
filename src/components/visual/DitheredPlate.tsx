'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

const ImageDithering = dynamic(
  () => import('@paper-design/shaders-react').then((m) => m.ImageDithering),
  { ssr: false },
)

/**
 * A picture inside terminal output: dithered into the site's palette, with the
 * original underneath. Hovering hands the real colours back.
 *
 * Same treatment as the portrait, but for wide images with a caption.
 */
export default function DitheredPlate({
  src,
  alt,
  caption,
  ratio = 1.29,
}: {
  src: string
  alt: string
  caption?: string
  /** width / height, so the box reserves the right space before WebGL starts */
  ratio?: number
}) {
  const [revealed, setRevealed] = useState(false)

  // Size by height, not width. A portrait image at the full column width is
  // taller than the terminal body and swallows the whole view.
  const height = '14rem'

  return (
    <figure className="my-2">
      <button
        type="button"
        aria-label={revealed ? `Dither ${alt}` : `Show ${alt} in colour`}
        onMouseEnter={() => setRevealed(true)}
        onMouseLeave={() => setRevealed(false)}
        onFocus={() => setRevealed(true)}
        onBlur={() => setRevealed(false)}
        onClick={() => setRevealed((r) => !r)}
        className="relative block cursor-pointer overflow-hidden border border-[var(--border)] bg-[var(--border)]"
        style={{
          height,
          width: `calc(${height} * ${ratio})`,
          maxWidth: '100%',
          aspectRatio: String(ratio),
        }}
      >
        <ImageDithering
          image={src}
          colorBack="#1d1c19"
          colorFront="#ece9e2"
          colorHighlight="#ece9e2"
          originalColors={false}
          type="8x8"
          size={1.6}
          colorSteps={4}
          fit="cover"
          speed={0}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            transition: 'opacity 400ms ease',
            opacity: revealed ? 0 : 1,
          }}
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[400ms] ease-out"
          style={{ opacity: revealed ? 1 : 0 }}
        />
      </button>
      {caption && (
        <figcaption className="pt-1.5 text-[10px] tracking-wide text-[var(--dim)]">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
