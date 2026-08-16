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
      //
      // The idle tabs sit at 3.3:1 against the paper. You can read them when you
      // look for them, and they stop existing while you are reading — which is
      // the whole argument for the redesign.
      className="glass-term flex flex-wrap items-end gap-1 border-b border-[var(--border)] px-4 sm:px-6"
    >
      {sessions.map(({ name, href }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`-mb-px shrink-0 border-b-2 px-2.5 py-2 text-[12px] tracking-wide transition-colors duration-150 ${
              active
                ? 'border-[var(--accent)] font-medium text-[var(--fg)]'
                : 'border-transparent text-[var(--chrome)] hover:border-[var(--hair)] hover:text-[var(--fg)]'
            }`}
          >
            {name}
          </Link>
        )
      })}
    </div>
  )
}
