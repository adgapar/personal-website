'use client'

import GlyphLine from './GlyphLine'

/**
 * A line of text that rusts.
 *
 * `rust` is the one egg whose subject is a duration. Iron left out does not
 * change position, it changes colour, and it does it slowly and unevenly — so
 * this is the only moving egg that never moves: the glyphs stay exactly where
 * they were set and go brown where they stand.
 *
 * Slow on purpose. A wipe that crosses the line in half a second reads as a
 * loading bar; this takes fifteen seconds or so to finish, so it is still going
 * while you read it, and it holds the rusted colour afterwards rather than
 * resetting — the line you scroll back to is browner than the one you typed.
 */

/** the stagger — rust arrives somewhere first and spreads */
const PER_GLYPH_MS = 190

/**
 * Rust does not sweep, it blotches, so each glyph is pushed off its place in the
 * queue and given its own pace. Derived from the index rather than random: a
 * server and a client have to agree, and a fixed jitter is still a jitter.
 */
function blotch(i: number) {
  const scatter = ((i * 37) % 11) - 5          // ±5 places out of order
  const pace = 4000 + ((i * 53) % 7) * 900     // 4.0s – 9.4s to go fully brown
  return {
    delay: Math.max(0, (i + scatter) * PER_GLYPH_MS),
    duration: pace,
  }
}

interface Props {
  content: string
  className?: string
}

export default function Oxidising({ content, className = '' }: Props) {
  return (
    <GlyphLine
      content={content}
      className={className}
      glyph={(i) => {
        const { delay, duration } = blotch(i)
        return {
          className: 'oxidising',
          style: { animationDelay: `${delay}ms`, animationDuration: `${duration}ms` },
        }
      }}
    />
  )
}
