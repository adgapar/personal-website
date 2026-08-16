'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Sessions as tabs, the way a terminal emulator does it.
 *
 * These are real links over real routes — deep links, the back button, and the
 * /md/<slug> and /llms.txt views all keep working. The tabs are presentation.
 */

const sessions = [
  { name: 'about', href: '/' },
  { name: 'cv', href: '/cv' },
  { name: 'writing', href: '/writing' },
  { name: 'contact', href: '/contact' },
  { name: 'play', href: '/play' },
]

export default function TerminalTabs() {
  const pathname = usePathname()

  return (
    <div
      // Five tabs need about 400px and a phone has 390. Wrapping was the old
      // answer and it was the worst one available: the second row slid under the
      // window controls, and the title bar grew to a quarter of the viewport to
      // hold a navigation of five words.
      //
      // Scrolling instead. The row is one tab tall at every width, and the tab
      // cut off at the right edge is the thing that says there are more — which
      // is what a terminal emulator with too many sessions open does too.
      className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto sm:flex-none sm:overflow-visible"
    >
      {sessions.map(({ name, href }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            // The open tab has no ground of its own: it is the window's own
            // surface carried up into the row, so it reads as one sheet with the
            // session below it. The others are recessed into shadow. A tab with
            // its own colour looked like a control sitting on the terminal
            // rather than a part of it.
            // py-3 below sm puts the row at 44px, which is the smallest thing a
            // thumb reliably hits; px-3.5 buys back the width that costs
            className={`relative shrink-0 px-3.5 py-3 text-[12px] tracking-wide transition-colors duration-150 sm:px-4 sm:py-2.5 ${
              active
                ? 'text-[var(--fg)]'
                : 'term-recess text-[var(--chrome)] hover:text-[var(--fg)]'
            }`}
          >
            {/* the lit edge along the top of the open tab */}
            {active && (
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]"
              />
            )}
            {name}
          </Link>
        )
      })}

      {/* The row runs to the edge. On the desk the space after the last tab
          holds the window controls, so it belongs to the title bar and is drawn
          as one; on a phone the controls are gone and that same gap read as a
          sixth tab that had failed to load. Recessed like the idle tabs, it
          reads as the empty part of the strip, which is what it is. It
          collapses to nothing as soon as the tabs need the width. */}
      <span aria-hidden className="term-recess min-w-0 flex-1 sm:hidden" />
    </div>
  )
}
