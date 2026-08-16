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
      // no scroll container: the row is as tall and wide as the tabs need, and
      // wraps rather than scrolling if a window ever gets narrow enough
      className="flex min-w-0 flex-wrap items-stretch"
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
            className={`relative shrink-0 px-4 py-2.5 text-[12px] tracking-wide transition-colors duration-150 ${
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
    </div>
  )
}
