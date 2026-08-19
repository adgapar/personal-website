'use client'

import { useMemo, useSyncExternalStore } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Dock from './Dock'
import DeskSurface from '@/components/visual/DeskSurface'
import SiteNav from './SiteNav'
import StatusBar from './StatusBar'
import TerminalTabs from './TerminalTabs'
import WindowChrome from './WindowChrome'
import { useViewMode } from './ViewModeProvider'
import AgentView from '@/components/agent/AgentView'
import TerminalSession from '@/components/terminal/TerminalSession'
import SnakeApp from '@/components/apps/SnakeApp'
import Sunlight from '@/components/visual/Sunlight'
import {
  closeApp,
  getServerSnapshot as getAppServerSnapshot,
  getSnapshot as getAppSnapshot,
  subscribe as subscribeToApp,
} from '@/lib/app-store'
import { justBooted } from '@/lib/boot-store'
import type { PageMeta } from '@/lib/sessions'

interface Props {
  page: PageMeta
}

export default function PageLayout({ page }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const { mode } = useViewMode()

  // which app is open on top of the terminal, if any — a command can open one,
  // so it lives in a store rather than in state here
  const app = useSyncExternalStore(subscribeToApp, getAppSnapshot, getAppServerSnapshot)

  const isAgent = mode === 'agent'
  // plays once, right after the CRT handover
  const warmingUp = useMemo(() => justBooted(), [])

  return (
    <div
      // Agent mode is the machine's view of the page, so it belongs to the
      // machine's world: the `term` palette on a solid dark ground, with no desk
      // under it. It was inheriting the desk — a lit surface built for windows
      // to sit on, with nothing sitting on it.
      className={`relative flex flex-col items-center font-mono text-base ${
        isAgent ? 'term bg-[var(--surface)] text-[var(--fg)]' : 'desk text-[var(--fg)]'
      } ${warmingUp ? 'screen-on ' : ''}${
        isAgent
          ? // a document scrolls
            'min-h-screen'
          : // a desktop does not — windows dragged past the edge are clipped,
            // and the terminal has its own scrollback inside the window
            'h-[100dvh] overflow-hidden'
      }`}
    >
      {!isAgent && <DeskSurface />}
      {!isAgent && <Dock />}

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
        // no padding below sm: there is no desk to inset the window from, and
        // the 32px it was spending is the scarcest dimension on a phone
        // pb-20 rather than py-10: the dock stands on the bottom edge of the
        // desk, and the window is centred on what is left over rather than on
        // the whole desk. The dock is drawn above the window, so this padding is
        // what keeps it from resting on the prompt — the window can still be
        // dragged under it, which is the window's own business.
        <div className="pointer-events-none relative z-10 flex h-full w-full items-center justify-center overflow-hidden sm:px-8 sm:pt-10 sm:pb-20">
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

      {/* An open app gets its own wrapper rather than sharing the terminal's:
          that one is a centring flex row, so a second window placed inside it
          would stand *beside* the terminal instead of over it. Same shape
          otherwise — spans the desk so the window centres on it, no pointer
          events of its own so the desk behind stays clickable, and the same
          bottom inset that keeps the dock off the window's own edge. */}
      {/* `uv`. Renders nothing until the command fires, and nothing at all under
          reduced motion. */}
      {!isAgent && <Sunlight />}

      {!isAgent && app === 'snake' && (
        <div className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center overflow-hidden sm:px-8 sm:pt-10 sm:pb-20">
          <SnakeApp onClose={closeApp} />
        </div>
      )}
    </div>
  )
}
