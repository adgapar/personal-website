'use client'

import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useState } from 'react'

// WebGL must not run during SSR
const ImageDithering = dynamic(
  () => import('@paper-design/shaders-react').then((m) => m.ImageDithering),
  { ssr: false },
)

interface Props {
  src: string
  alt?: string
  size?: number
}

/**
 * The portrait as printed matter: dithered ink by default, resolving to the
 * real photograph on hover or tap. The machine rendering becomes the person.
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
      className="relative shrink-0 cursor-pointer overflow-hidden rounded-sm bg-[var(--bg)]"
      style={{ width: size, height: size }}
    >
      <ImageDithering
        image={src}
        colorBack="#0c0b0a"
        colorFront="#e4e0d8"
        colorHighlight="#fbbf24"
        type="8x8"
        size={1.2}
        colorSteps={3}
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
