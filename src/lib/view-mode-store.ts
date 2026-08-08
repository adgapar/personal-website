export type ViewMode = 'human' | 'agent'

const STORAGE_KEY = 'adilet:view-mode'

/**
 * View mode lives outside React so terminal commands can flip it too, and so
 * hydration reads it through useSyncExternalStore rather than an effect.
 */

let current: ViewMode | null = null
const listeners = new Set<() => void>()

function isViewMode(value: unknown): value is ViewMode {
  return value === 'human' || value === 'agent'
}

function read(): ViewMode {
  // ?view=agent wins so the agent view is directly linkable
  const fromQuery = new URLSearchParams(window.location.search).get('view')
  if (isViewMode(fromQuery)) return fromQuery

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (isViewMode(stored)) return stored
  } catch {
    // storage disabled — fall through to the default
  }
  return 'human'
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): ViewMode {
  if (current === null) current = read()
  return current
}

export function getServerSnapshot(): ViewMode {
  return 'human'
}

export function setViewMode(next: ViewMode): void {
  if (current === next) return
  current = next

  try {
    window.localStorage.setItem(STORAGE_KEY, next)
  } catch {
    // storage disabled — the toggle still works for this session
  }

  const url = new URL(window.location.href)
  if (next === 'agent') url.searchParams.set('view', 'agent')
  else url.searchParams.delete('view')
  window.history.replaceState(null, '', url)

  listeners.forEach((listener) => listener())
}
