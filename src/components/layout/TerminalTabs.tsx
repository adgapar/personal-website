'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sessions = [
  { name: 'studio', href: '/' },
  { name: 'play', href: '/play' },
]
const detailSessions = [
  { name: 'background', href: '/cv' },
  { name: 'contact', href: '/contact' },
  { name: 'writing', href: '/writing' },
]

/** Introduction and playground; detail tabs appear when opened by link or command. */
export default function TerminalTabs() {
  const pathname = usePathname()
  const tabs = [...sessions, ...detailSessions.filter(tab => tab.href === pathname)]

  return (
    <nav aria-label="Terminal sessions" className="no-scrollbar flex min-w-0 flex-1 items-stretch overflow-x-auto sm:flex-none sm:overflow-visible">
      {tabs.map(({ name, href }) => (
        <Link key={href} href={href} aria-current={pathname === href ? 'page' : undefined}
          className={`relative shrink-0 px-3.5 py-3 text-[12px] tracking-wide transition-colors duration-150 sm:px-4 sm:py-2.5 ${pathname === href ? 'text-[var(--fg)]' : 'term-recess text-[var(--chrome)] hover:text-[var(--fg)]'}`}>
          {pathname === href && <span aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-[var(--accent)]" />}
          {name}
        </Link>
      ))}
      <span aria-hidden className="term-recess min-w-0 flex-1 sm:hidden" />
    </nav>
  )
}
