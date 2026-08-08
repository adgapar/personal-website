import type { DitherShape } from './dither'

/**
 * Commands are pure functions with no access to React state, so the `dither`
 * command publishes here and ViewModeProvider subscribes. (View mode has its
 * own store in view-mode-store.ts, which commands can call directly.)
 */

type UiEvent = { kind: 'dither'; shape: DitherShape | null }

type Listener = (event: UiEvent) => void

let listener: Listener | null = null

export function subscribeToUiEvents(fn: Listener): () => void {
  listener = fn
  return () => {
    if (listener === fn) listener = null
  }
}

export function publishUiEvent(event: UiEvent): void {
  listener?.(event)
}
