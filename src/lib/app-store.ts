/**
 * Which app is open on the desk, if any.
 *
 * Outside React for the same reason view mode is: a terminal command has to be
 * able to open one, and commands are pure functions with no access to component
 * state. Deliberately not persisted — an app you did not open reappearing after
 * a reload is a haunting, not a feature.
 *
 * One at a time. This desk has room for the terminal and one thing on top of
 * it, and a stack of draggable windows is a window manager, which is not what
 * anybody came here for.
 */

export type DeskApp = 'snake' | 'paint'

let current: DeskApp | null = null
const listeners = new Set<() => void>()

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): DeskApp | null {
  return current
}

export function getServerSnapshot(): DeskApp | null {
  return null
}

function notify(): void {
  listeners.forEach((listener) => listener())
}

export function openApp(app: DeskApp): void {
  current = app
  notify()
}

/**
 * Open one after a beat, so the command that opened it can be read first.
 *
 * A command handler runs before its own output is on screen, so opening the
 * window there covered the joke with the punchline still in flight — you got an
 * app and never saw why. The terminal already has this instinct: a `navigate`
 * result waits 400ms before it goes anywhere. This is the same courtesy sized for
 * a few lines of reading rather than one.
 *
 * At most one pending open. Typing `python` and then `claude` before the first
 * lands should give you paint, not both in sequence — and closing cancels a
 * window that has not arrived yet, rather than letting it appear after you have
 * already said no.
 */
let pending: ReturnType<typeof setTimeout> | null = null

export function openAppSoon(app: DeskApp, delayMs: number): void {
  if (pending) clearTimeout(pending)
  pending = setTimeout(() => {
    pending = null
    openApp(app)
  }, delayMs)
}

export function closeApp(): void {
  if (pending) {
    clearTimeout(pending)
    pending = null
  }
  current = null
  notify()
}
