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
      className="flex items-end gap-px overflow-x-auto border-b border-[var(--border)] px-2 pt-1.5"
      style={{ background: 'rgba(20,18,16,0.6)' }}
    >
      {sessions.map(({ name, href }) => {
        const active = pathname === href
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={`-mb-px shrink-0 border border-b-0 px-3 py-1 text-[10px] tracking-widest transition-colors duration-150 ${
              active
                ? 'border-[var(--border)] text-[var(--accent)]'
                : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
            style={
              active
                ? // the active tab merges into the body below it
                  { background: 'rgba(12,11,10,0.93)', borderBottomColor: 'transparent' }
                : undefined
            }
          >
            {name}
          </Link>
        )
      })}
    </div>
  )
}
