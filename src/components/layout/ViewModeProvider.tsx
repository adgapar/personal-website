'use client'

import {
  createContext,
  useContext,
  useMemo,
  useSyncExternalStore,
} from 'react'
import {
  getServerSnapshot,
  getSnapshot,
  setViewMode,
  subscribe,
  type ViewMode,
} from '@/lib/view-mode-store'

export type { ViewMode }

interface ViewModeContextValue {
  mode: ViewMode
  setMode: (mode: ViewMode) => void
  toggleMode: () => void
}

const ViewModeContext = createContext<ViewModeContextValue | null>(null)

export function useViewMode() {
  const ctx = useContext(ViewModeContext)
  if (!ctx) throw new Error('useViewMode must be used inside ViewModeProvider')
  return ctx
}

export default function ViewModeProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const value = useMemo(
    () => ({
      mode,
      setMode: setViewMode,
      toggleMode: () => setViewMode(mode === 'human' ? 'agent' : 'human'),
    }),
    [mode],
  )

  return (
    <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>
  )
}
