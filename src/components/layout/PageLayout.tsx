'use client'

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
          <WindowChrome
            title={`${page.session.prompt}  —  terminal`}
            tabs={<TerminalTabs />}
          >
            {/* Nothing floats over the scrollback any more. The window itself
                is the glass now, so a bar with content sliding under it was a
                second, redundant version of the same idea — and the scrollback
                collided with the status bar's own labels. */}
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
