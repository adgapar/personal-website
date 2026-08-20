'use client'

import { useSyncExternalStore } from 'react'

/**
 * Subscribes to a media query rather than reading it once, because a phone
 * changes both of these — width at the sm breakpoint, orientation on a
 * rotate — while the app stays open.
 */
function useMedia(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}

/**
 * Whether this is a phone, and which way it is held.
 *
 * `mobile` asks about the short side, not just the width: a phone in
 * landscape is often wider than the sm breakpoint (a 932px-wide iPhone,
 * held sideways), and it is still a phone with no desk to float a window
 * on. Checking width OR height against the breakpoint is what a device's
 * short axis actually looks like in either orientation, where checking
 * width alone only caught portrait.
 */
export function useMobileOrientation() {
  const mobile = useMedia('(max-width: 639px), (max-height: 639px)')
  const portrait = useMedia('(orientation: portrait)')
  return { mobile, portrait }
}
