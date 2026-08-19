'use client'

import { useSyncExternalStore } from 'react'

/**
 * Whether this reader wants motion.
 *
 * An effect that reads matchMedia and calls setState is the obvious version, and
 * it is a cascading render on every mount plus a setting that only takes effect
 * on reload. This is the same answer written the way React asks for it: the media
 * query is an external store, so it is subscribed to. Turn the OS setting on
 * mid-session and everything animated stops.
 *
 * The server snapshot is `false`. Nothing on the server knows what the reader
 * prefers, so the first paint is always the still version — which is also the
 * safe one to hydrate against.
 */

const QUERY = '(prefers-reduced-motion: reduce)'

function subscribe(onChange: () => void): () => void {
  const query = window.matchMedia(QUERY)
  query.addEventListener('change', onChange)
  return () => query.removeEventListener('change', onChange)
}

function getSnapshot(): boolean {
  return !window.matchMedia(QUERY).matches
}

function getServerSnapshot(): boolean {
  return false
}

export function useMotionAllowed(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
