'use client'

import Image from 'next/image'
import { useState } from 'react'
import BitmapIcon from './BitmapIcon'

interface Props {
  src: string
  alt?: string
  size?: number
}

/**
 * The portrait as printed matter: one-bit ink by default, resolving to the real
 * photograph on hover or tap. The machine rendering becomes the person.
 *
 * Same construction as every icon on the desk. The shader version rendered three
 * grey levels, which on a white window read as a heavy grey block rather than as
 * print — and it spun up a WebGL context to do it.
 */
export default function DitheredAvatar({
  src,
  alt = 'Adilet Gaparov',
  size = 144,
}: Props) {
  const [revealed, setRevealed] = useState(false)

  return (
    <button
      type="button"
      aria-label={revealed ? `Hide photo of ${alt}` : `Reveal photo of ${alt}`}
      onMouseEnter={() => setRevealed(true)}
      onMouseLeave={() => setRevealed(false)}
      onFocus={() => setRevealed(true)}
      onBlur={() => setRevealed(false)}
      onClick={() => setRevealed((r) => !r)}
      className="relative shrink-0 cursor-pointer overflow-hidden rounded-sm"
      style={{ width: size, height: size }}
    >
      <span
        className="absolute inset-0 transition-opacity duration-[400ms] ease-out"
        style={{ opacity: revealed ? 0 : 1 }}
      >
        {/* A finer grid than the desk icons and no extra contrast: an icon wants
            a hard silhouette, a face wants its midtones, and pushing this one
            the way an icon is pushed turned the portrait into a stencil. */}
        <BitmapIcon
          src={src}
          grid={Math.round(size / 1.6)}
          size={size}
          // paper on a dark window, not ink on a white one — this only ever
          // renders inside the terminal
          ink={[236, 233, 226]}
          contrast={1.05}
        />
      </span>
      <Image
        src={src}
        alt={alt}
        width={size * 2}
        height={size * 2}
        className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[400ms] ease-out"
        style={{ opacity: revealed ? 1 : 0 }}
        priority
      />
    </button>
  )
}
