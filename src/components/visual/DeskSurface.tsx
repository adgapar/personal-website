'use client'

import { useSyncExternalStore } from 'react'
import { Water } from '@paper-design/shaders-react'

/**
 * The desk: shallow water over sand.
 *
 * Five backgrounds were tried before this one. A photograph competed with the
 * writing and won. A flat colour read as blank. Paper fibre looked like dirt. A
 * mesh gradient looked like a smear. A ruled grid looked like a spreadsheet.
 *
 * This one is different for a reason that has nothing to do with taste: it moves.
 * Motion is what makes glass legible — a still backdrop behind a translucent
 * window is indistinguishable from a fill, no matter how the numbers are tuned,
 * and every earlier attempt failed that test. Caustics drift, so the terminal is
 * visibly something you are looking through.
 *
 * And it means something. Elche is twenty minutes from the sea, so the warm
 * ground stops being beige-because-beige and becomes sand under water.
 *
 * Tuned much quieter than it wants to be. Speed 0.22 rather than the 0.55 it was
 * judged at: a wallpaper you notice while reading is a wallpaper that failed.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(REDUCED_MOTION).matches,
    () => false,
  )
}

export default function DeskSurface() {
  const still = usePrefersReducedMotion()

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <Water
        colorBack="#dedad0"
        colorHighlight="#fffdf4"
        // all four dialled down from the lab: this sits behind prose
        highlights={0.2}
        layering={0.3}
        edges={0.14}
        waves={0.22}
        caustic={0.26}
        size={0.55}
        scale={0.95}
        // stopped entirely for anyone who asked for that. A moving background is
        // the exact thing the setting is for.
        speed={still ? 0 : 0.22}
        frame={still ? 2400 : undefined}
        fit="cover"
        width="100%"
        height="100%"
        maxPixelCount={1_600_000}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      {/* the light falling where the windows sit */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(85% 62% at 50% 6%, rgba(255,253,246,0.5) 0%, rgba(255,253,246,0) 66%)',
        }}
      />
    </div>
  )
}
