'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react'
import type { DitherShape } from '@/lib/dither'
import { subscribeToUiEvents } from '@/lib/ui-bus'
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
  /** set by the `dither` command; null means "use the route default" */
  shapeOverride: DitherShape | null
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
  const [shapeOverride, setShapeOverride] = useState<DitherShape | null>(null)

  // the `dither` command reaches the shader layer through here
  useEffect(
    () =>
      subscribeToUiEvents((event) => {
        if (event.kind === 'dither') setShapeOverride(event.shape)
      }),
    [],
  )

  const value = useMemo(
    () => ({
      mode,
      setMode: setViewMode,
      toggleMode: () => setViewMode(mode === 'human' ? 'agent' : 'human'),
      shapeOverride,
    }),
    [mode, shapeOverride],
  )

  return (
    <ViewModeContext.Provider value={value}>{children}</ViewModeContext.Provider>
  )
}
