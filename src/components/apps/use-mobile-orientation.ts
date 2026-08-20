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
 * `mobile` is the same sm breakpoint AppWindow already uses to decide a
 * window is the whole screen rather than a box on a desk. Snake and Paint
 * both want to know when that screen is portrait, so it can be asked to turn
 * rather than squeezed into a shape that loses most of its width to margin.
 */
export function useMobileOrientation() {
  const mobile = useMedia('(max-width: 639px)')
  const portrait = useMedia('(orientation: portrait)')
  return { mobile, portrait }
}
