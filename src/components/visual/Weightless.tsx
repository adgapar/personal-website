'use client'

import GlyphLine from './GlyphLine'

/**
 * A line of text that stops falling.
 *
 * `antigravity` is the only egg whose subject is a force, and the only material
 * this terminal has is glyphs — so the glyphs are what lets go. Each character
 * crouches once, launches on its own beat, and then hangs there, bobbing, and
 * never comes back down. It stays that way in the scrollback: further up the
 * session there is a line still up in the air.
 */

/** one beat per glyph, left to right, so the line peels off the ground instead
 *  of leaving it all at once */
const PER_GLYPH_MS = 26
/** how long a glyph takes to get up there — the bob has to start exactly here */
const LIFTOFF_MS = 780

/** Dust that only goes up. Fixed rather than random: this has to look composed,
 *  and a server and a client have to agree on it. */
const SPECKS = [
  { char: '·', left: '4%',  delay: '0.1s', duration: '3.4s' },
  { char: '✦', left: '21%', delay: '1.2s', duration: '4.1s' },
  { char: '·', left: '38%', delay: '0.6s', duration: '3.8s' },
  { char: '*', left: '52%', delay: '2.1s', duration: '4.6s' },
  { char: '·', left: '68%', delay: '1.7s', duration: '3.2s' },
  { char: '✦', left: '81%', delay: '0.9s', duration: '4.4s' },
  { char: '·', left: '93%', delay: '2.6s', duration: '3.9s' },
]

interface Props {
  content: string
  className?: string
}

export default function Weightless({ content, className = '' }: Props) {
  return (
    <div className="relative">
      <span aria-hidden className="pointer-events-none absolute inset-0 select-none overflow-hidden">
        {SPECKS.map((speck, i) => (
          <span
            key={i}
            className="cosmic-speck absolute bottom-0 text-[var(--dim)]"
            style={{ left: speck.left, animationDelay: speck.delay, animationDuration: speck.duration }}
          >
            {speck.char}
          </span>
        ))}
      </span>

      <GlyphLine
        content={content}
        className={className}
        glyph={(i) => ({
          className: 'letting-go',
          style: {
            animationDelay: `${i * PER_GLYPH_MS}ms, ${i * PER_GLYPH_MS + LIFTOFF_MS}ms`,
            // neighbours tilt opposite ways, so the line looks weightless rather
            // than tipped over
            ['--tilt' as string]: `${(i % 2 ? -1 : 1) * (1 + (i % 3))}deg`,
          },
        })}
      />
    </div>
  )
}
