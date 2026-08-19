'use client'

import { type CSSProperties } from 'react'
import { useMotionAllowed } from '@/lib/use-motion'

/**
 * A line of text where every character can be addressed on its own.
 *
 * Two eggs need this and they need it for opposite reasons — one moves its
 * glyphs, one recolours them — so the awkward part lives here once.
 *
 * The awkward part: splitting a sentence straight into per-character
 * inline-blocks makes a row of inline-blocks, and that row breaks anywhere it
 * likes, so on a phone the sentence wraps mid-word. Words are kept whole as
 * nowrap blocks with a real text space between them; the space is the only
 * place the line can break, which is why it stays text and never becomes a
 * glyph.
 *
 * Motion is the whole point of every caller, so under `prefers-reduced-motion`
 * there is nothing to degrade to but the sentence, and that is what renders.
 */

interface Props {
  content: string
  /** class and style for glyph `i`, counted across the whole line, spaces excluded */
  glyph: (index: number) => { className?: string; style?: CSSProperties }
  className?: string
  /** what a screen reader gets, if the sentence alone is not it */
  label?: string
}

export default function GlyphLine({ content, glyph, className = '', label }: Props) {
  const moving = useMotionAllowed()

  if (!moving) {
    return <div className={`leading-relaxed break-words whitespace-pre-wrap ${className}`}>{content}</div>
  }

  const words = content.split(' ')
  let index = 0

  return (
    <div className={`relative leading-relaxed ${className}`}>
      {/* one string to a screen reader — the per-glyph spans are choreography,
          not content */}
      <span className="sr-only">{label ?? content}</span>
      <span aria-hidden>
        {words.map((word, w) => (
          <span key={w}>
            <span className="inline-block whitespace-nowrap">
              {[...word].map((char, c) => {
                const { className: cls, style } = glyph(index++)
                return (
                  <span key={c} className={`inline-block ${cls ?? ''}`} style={style}>
                    {char}
                  </span>
                )
              })}
            </span>
            {w < words.length - 1 && ' '}
          </span>
        ))}
      </span>
    </div>
  )
}
