'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sections = [
  { name: 'about',      href: '/' },
  { name: 'cv',         href: '/cv' },
  { name: 'writing',    href: '/writing' },
  { name: 'photos',     href: '/photos' },
  { name: 'contact',    href: '/contact' },
]

export default function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap items-center gap-x-6 gap-y-1 px-10 py-4">
      <span className="text-[11px] tracking-widest text-[var(--muted)] select-none">
        ~/adilet
      </span>
      {sections.map(({ name, href }) => {
        const isActive = pathname === href
        return (
          <Link
            key={href}
            href={href}
            className={`text-[11px] tracking-widest transition-colors duration-200 ${
              isActive
                ? 'text-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            {name}
          </Link>
        )
      })}
    </nav>
  )
}
