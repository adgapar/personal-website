/**
 * Commands are pure functions with no access to React state, so a command that
 * needs to reach the page publishes here and a component subscribes. (View mode
 * and the open app have their own stores, which commands call directly; this is
 * for the ones that are events rather than state — a thing that happens once and
 * is then over.)
 *
 * A set of listeners, not one. It held a single `listener`, so a second
 * subscriber would have silently replaced the first.
 */

/** a moment of sunlight across the whole desk — see `uv` */
type UiEvent = { kind: 'sunlight' }

type Listener = (event: UiEvent) => void

const listeners = new Set<Listener>()

export function subscribeToUiEvents(fn: Listener): () => void {
  listeners.add(fn)
  return () => {
    listeners.delete(fn)
  }
}

export function publishUiEvent(event: UiEvent): void {
  listeners.forEach((listener) => listener(event))
}
