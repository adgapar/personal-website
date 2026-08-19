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

export type DeskApp = 'snake'

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

export function openApp(app: DeskApp): void {
  current = app
  listeners.forEach((listener) => listener())
}

export function closeApp(): void {
  current = null
  listeners.forEach((listener) => listener())
}
