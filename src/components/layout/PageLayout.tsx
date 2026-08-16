'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import DesktopIcons from './DesktopIcons'
import SiteNav from './SiteNav'
import StatusBar from './StatusBar'
import TerminalTabs from './TerminalTabs'
import WindowChrome from './WindowChrome'
import { useViewMode } from './ViewModeProvider'
import AgentView from '@/components/agent/AgentView'
import TerminalSession from '@/components/terminal/TerminalSession'
import { justBooted } from '@/lib/boot-store'
import type { PageMeta } from '@/lib/sessions'

// WebGL must not run during SSR; the flat --bg underneath is the fallback
const DeskTexture = dynamic(() => import('@/components/visual/DeskTexture'), {
  ssr: false,
})

interface Props {
  page: PageMeta
}

export default function PageLayout({ page }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { mode } = useViewMode()

  const isAgent = mode === 'agent'
  // plays once, right after the CRT handover
  const warmingUp = useMemo(() => justBooted(), [])

  return (
    <div
      className={`desk relative flex flex-col items-center font-mono text-base text-[var(--fg)] ${
        warmingUp ? 'screen-on ' : ''
      }${
        isAgent
          ? // a document scrolls
            'min-h-screen'
          : // a desktop does not — windows dragged past the edge are clipped,
            // and the terminal has its own scrollback inside the window
            'h-[100dvh] overflow-hidden'
      }`}
    >
      {/* One desk under both apps: stock, not a photograph. A picture behind the
          window competed with the writing in front of it and won; paper fibre
          gives the surface tone without ever asking to be looked at. */}
      {!isAgent && <DeskTexture />}
      {!isAgent && <DesktopIcons />}

      {isAgent ? (
        <div className="relative z-10 max-w-4xl w-full flex flex-col flex-1">
          <SiteNav />
          <AgentView page={page} />
        </div>
      ) : (
        // The photo behind is wallpaper; this is a window sitting on it.
        // pointer-events-none so the desktop underneath stays clickable — this
        // wrapper spans the viewport but only the window itself is solid.
        // centred on the desk: now that the window is only as tall as its
        // content, anchoring it to the top left a growing empty margin below it
        <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center overflow-hidden px-4 py-6 sm:px-8 sm:py-10">
          <WindowChrome title={`${page.session.prompt}  —  terminal`}>
            {/* The tab row and the status bar float over the scrollback rather
                than sitting above and below it, so the session passes under
                them and blurs — the same construction as the reader's bars.
                TerminalSession pads itself to clear them. */}
            <div className="relative flex min-h-0 flex-col">
              <div className="absolute inset-x-0 top-0 z-20">
                <TerminalTabs />
              </div>
              <TerminalSession
                key={pathname}
                blocks={page.session.blocks}
                commands={page.session.commands}
                prompt={page.session.prompt}
                placeholder={page.session.placeholder}
                onNavigate={(href) => router.push(href)}
              />
              <div className="absolute inset-x-0 bottom-0 z-20">
                <StatusBar hint={page.session.placeholder} />
              </div>
            </div>
          </WindowChrome>
        </div>
      )}
    </div>
  )
}
