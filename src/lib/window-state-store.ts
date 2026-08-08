/**
 * Window state lives outside React because every route renders its own
 * PageLayout — so WindowChrome unmounts and remounts on each tab click. Held
 * here, maximizing or minimizing survives navigation the way a real window does.
 *
 * maximized/minimized also persist across reloads; the drag offset does not,
 * since a remembered position can land badly after the viewport changes size.
 */

export type WindowState = {
  minimized: boolean
  maximized: boolean
  offset: { x: number; y: number }
}

const STORAGE_KEY = 'adilet:window'

const DEFAULT: WindowState = {
  minimized: false,
  maximized: false,
  offset: { x: 0, y: 0 },
}

let current: WindowState | null = null
const listeners = new Set<() => void>()

function read(): WindowState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const saved = JSON.parse(raw) as Partial<WindowState>
      return {
        ...DEFAULT,
        minimized: saved.minimized === true,
        maximized: saved.maximized === true,
      }
    }
  } catch {
    // unreadable or storage disabled — the default is fine
  }
  return DEFAULT
}

function persist(state: WindowState) {
  try {
    const { minimized, maximized } = state
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ minimized, maximized }))
  } catch {
    // storage disabled — state still holds for this session
  }
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): WindowState {
  if (current === null) current = read()
  return current
}

export function getServerSnapshot(): WindowState {
  return DEFAULT
}

export function setWindowState(patch: Partial<WindowState>): void {
  const next = { ...getSnapshot(), ...patch }
  current = next
  persist(next)
  listeners.forEach((listener) => listener())
}
