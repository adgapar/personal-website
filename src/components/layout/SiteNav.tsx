'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useViewMode } from './ViewModeProvider'

const sections = [
  { name: 'about',      href: '/' },
  { name: 'cv',         href: '/cv' },
  { name: 'writing',    href: '/writing' },
  { name: 'contact',    href: '/contact' },
]

function ViewModeToggle() {
  const { mode, setMode } = useViewMode()

  return (
    <div
      className="ml-auto flex items-center gap-1 text-[11px] tracking-widest select-none"
      role="group"
      aria-label="Reading mode"
    >
      <span className="text-[var(--dim)]">[</span>
      {(['human', 'agent'] as const).map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => setMode(option)}
          aria-pressed={mode === option}
          title={
            option === 'human'
              ? 'terminal, shaders, the whole thing'
              : 'clean markdown — also at /llms.txt'
          }
          className={`transition-colors duration-200 ${
            mode === option
              ? 'text-[var(--accent)]'
              : 'text-[var(--muted)] hover:text-[var(--fg)]'
          }`}
        >
          {mode === option ? '● ' : '○ '}
          {option}
        </button>
      ))}
      <span className="text-[var(--dim)]">]</span>
    </div>
  )
}

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
      <ViewModeToggle />
    </nav>
  )
}
