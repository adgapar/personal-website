/**
 * Where the machine is: running POST, waiting at the checkpoint, or up.
 *
 * The boot starts on its own — nobody should have to press a button to see a
 * personal site — but it holds at the end until the reader continues, the way a
 * BIOS waits on "press any key". Otherwise the output flashes past unread.
 *
 * Module-level for the same reason as the window state: it must survive
 * component remounts and must not replay when you click between tabs.
 */

export type BootPhase = 'booting' | 'ready' | 'closing' | 'done'

const STORAGE_KEY = 'adilet:booted'

let phase: BootPhase | null = null
const listeners = new Set<() => void>()

function read(): BootPhase {
  // people who asked for less motion get the site, not a light show
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'done'
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) === '1' ? 'done' : 'booting'
  } catch {
    // storage blocked — boot anyway and don't try to remember
    return 'booting'
  }
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getSnapshot(): BootPhase {
  if (phase === null) phase = read()
  return phase
}

/** Assume a boot on the server, so the first paint is the machine, not the page. */
export function getServerSnapshot(): BootPhase {
  return 'booting'
}

/** POST finished — hold here so the output can be read. */
export function reachCheckpoint(): void {
  if (phase !== 'booting') return
  phase = 'ready'
  emit()
}

/** Continue was pressed — run the CRT handover before handing over. */
export function beginHandover(): void {
  if (phase === 'closing' || phase === 'done') return
  phase = 'closing'
  emit()
}

/**
 * True for a moment after the handover, so the desktop can warm up like a tube
 * instead of appearing. Latched, not derived from phase — phase is already
 * 'done' by the time the desktop mounts.
 */
let handedOverAt = 0

export function justBooted(): boolean {
  return handedOverAt > 0 && Date.now() - handedOverAt < 900
}

export function finishBoot(): void {
  if (phase === 'done') return
  phase = 'done'
  handedOverAt = Date.now()
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // fine — it just boots again on a fresh load
  }
  emit()
}
