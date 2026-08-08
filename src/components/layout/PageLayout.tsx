'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import SiteNav from './SiteNav'
import StatusBar from './StatusBar'
import TerminalTabs from './TerminalTabs'
import WindowChrome from './WindowChrome'
import { useViewMode } from './ViewModeProvider'
import AgentView from '@/components/agent/AgentView'
import TerminalSession from '@/components/terminal/TerminalSession'
import { presetForRoute, shapeForRoute } from '@/lib/dither'
import { justBooted } from '@/lib/boot-store'
import type { PageMeta } from '@/lib/sessions'

// WebGL must not run during SSR
const PaperBackground = dynamic(
  () => import('@/components/visual/PaperBackground'),
  { ssr: false },
)

interface Props {
  page: PageMeta
}

export default function PageLayout({ page }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { mode, shapeOverride } = useViewMode()

  const isAgent = mode === 'agent'
  // plays once, right after the CRT handover
  const warmingUp = useMemo(() => justBooted(), [])

  return (
    <div
      className={`bg-[var(--bg)] text-[var(--fg)] font-mono text-base flex flex-col items-center ${
        warmingUp ? 'screen-on ' : ''
      }${
        isAgent
          ? // a document scrolls
            'min-h-screen'
          : // a desktop does not — windows dragged past the edge are clipped,
            // and the terminal has its own scrollback inside the window
            'h-screen overflow-hidden'
      }`}
    >
      {!isAgent && (
        <PaperBackground
          shape={shapeOverride ?? shapeForRoute(pathname)}
          preset={presetForRoute(pathname)}
        />
      )}

      {isAgent ? (
        <div className="relative z-10 max-w-4xl w-full flex flex-col flex-1">
          <SiteNav />
          <AgentView page={page} />
        </div>
      ) : (
        // the photo behind is wallpaper; this is a window sitting on it
        <div className="relative z-10 flex h-full w-full justify-center overflow-hidden px-4 py-6 sm:px-8 sm:py-10">
          <WindowChrome title={`${page.session.prompt}  —  terminal`}>
            <TerminalTabs />
            <TerminalSession
              key={pathname}
              blocks={page.session.blocks}
              commands={page.session.commands}
              prompt={page.session.prompt}
              placeholder={page.session.placeholder}
              onNavigate={(href) => router.push(href)}
            />
            <StatusBar hint={page.session.placeholder} />
          </WindowChrome>
        </div>
      )}
    </div>
  )
}
