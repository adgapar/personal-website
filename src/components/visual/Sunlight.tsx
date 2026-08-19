'use client'

import { useEffect, useState } from 'react'
import { subscribeToUiEvents } from '@/lib/ui-bus'
import { useMotionAllowed } from '@/lib/use-motion'

/**
 * A moment of sunlight, for `uv`.
 *
 * Ultraviolet is the light past the end of what an eye can do, so the egg cannot
 * show you any — what it can do is what a bright day does to a room: the desk
 * washes warm for a second or two and a few shafts cross it, and then it is over
 * and the joke is that the part actually named is the part you did not see.
 *
 * Unmounted between bursts rather than left sitting at zero opacity: a fixed
 * overlay covering the viewport is a thing to get wrong later, and there is no
 * reason for one to exist when nothing is happening. `key` is the burst count, so
 * running `uv` twice restarts the animation instead of doing nothing the second
 * time — a CSS animation on an element that is already there will not replay.
 *
 * No blend mode. Screen or plus-lighter would be brighter and would behave
 * differently on the daylight desk than on the dark terminal, and this has to
 * look like weather on both.
 */

/** where each shaft crosses, and how late it arrives */
const SHAFTS = [
  { left: '8%', delay: '0ms' },
  { left: '34%', delay: '180ms' },
  { left: '61%', delay: '90ms' },
  { left: '84%', delay: '300ms' },
]

export default function Sunlight() {
  const [burst, setBurst] = useState(0)
  const moving = useMotionAllowed()

  useEffect(
    () =>
      subscribeToUiEvents((event) => {
        if (event.kind === 'sunlight') setBurst((n) => n + 1)
      }),
    [],
  )

  // Nothing to show under reduced motion. A single silent flash of the whole
  // screen is the one effect on this site that could actually bother someone,
  // and the command still prints its two lines.
  if (!burst || !moving) return null

  return (
    <div
      key={burst}
      aria-hidden
      className="sunlight-wash pointer-events-none fixed inset-0 z-[70]"
      onAnimationEnd={(e) => {
        // animationend bubbles, and the shafts each fire one of their own
        if (e.target === e.currentTarget) setBurst(0)
      }}
    >
      {SHAFTS.map((shaft) => (
        <span
          key={shaft.left}
          className="sunlight-shaft"
          style={{ left: shaft.left, animationDelay: shaft.delay }}
        />
      ))}
    </div>
  )
}
