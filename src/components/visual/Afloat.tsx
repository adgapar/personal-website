'use client'

import { useMotionAllowed } from '@/lib/use-motion'

/**
 * A container ship, at sea.
 *
 * `docker` is named after the trade that put a box on a boat, and the whole point
 * of the box is that it floats on anything — so the egg gets weather. Two
 * motions, because one would read as a sticker sliding over a background: the sea
 * is a row of tildes each rising on a stagger, so the crest travels along the
 * line rather than the whole row pumping at once, and the ship rides on top of
 * it, crossing the line and bobbing as it goes. The tilt is what sells the bob —
 * a box moving straight up and down is an elevator.
 *
 * The ship is drawn as rows of coloured runs rather than one string of glyphs,
 * because the colour is the recognition. A silhouette in one ink is a smudge at
 * 12px; boxes in container red and orange over a grey hull is a container ship at
 * any size, and every row is exactly WIDTH characters so the stacks land on the
 * deck instead of near it.
 *
 * Under `prefers-reduced-motion` it is drawn once and left alone — still a ship
 * on the water, just moored.
 */

/** every row is exactly this wide, in characters — the alignment depends on it */
const WIDTH = 22

/* Ink. Container lines really do paint them this way, and alternating the red
   runs with the orange ones is what stops the deck reading as one long brick. */
const INK = {
  /** dark enough to be a hull, light enough to survive the terminal's dark ground */
  hull: '#5b6472',
  /** the superstructure, which is white on almost every ship afloat */
  bridge: '#d9d4c9',
  red: '#c4472e',
  orange: '#e08a3c',
} as const

type Run = readonly [text: string, ink: keyof typeof INK | null]

/**
 * Two rows, bottom last. Long and low, because that is the whole shape of the
 * thing — the earlier three-row version was a tugboat with delusions. Twenty-two
 * characters rather than thirty: the proportions are what read as a cargo ship,
 * not the absolute length, and thirty was most of the width of a window that is
 * only as wide as a phone on the narrow side.
 *
 * The deck is drawn in ▄, the lower half of the character cell, so the
 * containers read as a shallow strip rather than a second storey; the hull is
 * full-height beneath it. That half-cell is what makes the silhouette flat.
 *
 * ▟ and ▙ are three-quarter blocks, so putting them at the ends of a solid bar
 * cuts the top corners off it — a raked stern and a raked bow, and the cheapest
 * way to make a row of glyphs read as a hull.
 *
 * The bridge is full-height and white, at the stern, which is both what these
 * ships look like and the one detail that says which way it is pointing.
 */
const ROWS: readonly (readonly Run[])[] = [
  // the deck: the superstructure aft, then containers most of the way forward,
  // in alternating runs because a single unbroken run reads as a wall
  [
    [' ', null],
    ['██', 'bridge'],
    [' ', null],
    ['▄▄▄', 'red'],
    [' ', null],
    ['▄▄▄▄', 'orange'],
    [' ', null],
    ['▄▄▄', 'red'],
    [' ', null],
    ['▄▄▄▄', 'orange'],
    [' ', null],
  ],
  // the hull
  [['▟████████████████████▙', 'hull']],
]

if (process.env.NODE_ENV !== 'production') {
  ROWS.forEach((row, i) => {
    const width = row.reduce((n, [text]) => n + [...text].length, 0)
    if (width !== WIDTH) {
      // a row that is a character out puts the containers half off the deck, and
      // it is invisible in the source — every glyph here is the same width
      console.warn(`Afloat: row ${i} is ${width} characters, expected ${WIDTH}`)
    }
  })
}

/** enough sea to overflow the widest column, then clipped to whatever it gets */
const SEA = '~'.repeat(72)
/** how far apart two neighbouring crests are, in ms */
const WAVE_STAGGER = 90

export default function Afloat() {
  const moving = useMotionAllowed()

  return (
    <div
      role="img"
      aria-label="a container ship, afloat"
      className="relative my-1 overflow-hidden leading-[1.1] select-none"
      // two rows of ship and one of sea, with room left over for the bob
      style={{ height: '3.7em' }}
    >
      {/* inset-x-0, so the sailing element is exactly as wide as the scene: a
          translateX percentage resolves against the element's own width, so a
          shrink-to-fit wrapper would move the ship by its own thirteen
          characters instead of across the water. */}
      <span
        aria-hidden
        className={`absolute inset-x-0 bottom-[0.75em] block ${moving ? 'sailing' : ''}`}
      >
        {/* the hull sits *in* the water rather than on top of it — the bottom
            row overlaps the tildes by a fraction of a line */}
        <span className={`inline-block ${moving ? 'bobbing' : ''}`}>
          {ROWS.map((row, r) => (
            <span key={r} className="block whitespace-pre">
              {row.map(([text, ink], i) => (
                <span key={i} style={ink ? { color: INK[ink] } : undefined}>
                  {text}
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>

      {/* The sea, one glyph at a time so the crest can travel. */}
      <span aria-hidden className="absolute bottom-0 left-0 whitespace-pre text-[var(--accent)] opacity-70">
        {[...SEA].map((char, i) => (
          <span
            key={i}
            className={`inline-block ${moving ? 'swelling' : ''}`}
            style={moving ? { animationDelay: `${i * WAVE_STAGGER}ms` } : undefined}
          >
            {char}
          </span>
        ))}
      </span>
    </div>
  )
}
