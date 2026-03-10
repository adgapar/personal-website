'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const sections = ['about', 'work', 'projects', 'blog', 'newsletter', 'photos', 'contact']

export default function SiteNav() {
  const pathname = usePathname()

  return (
    <nav className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3 text-sm font-mono border-b border-[var(--border)]">
      <Link
        href="/"
        className="text-[var(--accent)] hover:opacity-80 transition-opacity"
      >
        ~/adilet
      </Link>
      {sections.map((section, i) => {
        const isActive = pathname === `/${section}`
        return (
          <span key={section} className="flex items-center gap-x-3">
            {i > 0 && <span className="text-[var(--muted)] select-none">·</span>}
            <Link
              href={`/${section}`}
              className={`transition-colors hover:text-[var(--accent)] ${
                isActive ? 'text-[var(--accent)]' : 'text-[var(--fg)]'
              }`}
            >
              [{section}]
            </Link>
          </span>
        )
      })}
    </nav>
  )
}
