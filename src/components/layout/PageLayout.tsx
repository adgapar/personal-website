'use client'

import { useRouter, usePathname } from 'next/navigation'
import SiteNav from './SiteNav'
import TerminalSession from '@/components/terminal/TerminalSession'
import type { PageSession } from '@/lib/sessions'

interface Props {
  session: PageSession
  animated?: boolean
}

export default function PageLayout({ session, animated }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] font-mono text-sm flex flex-col items-center">
      <div className="max-w-4xl w-full flex flex-col flex-1">
        <SiteNav />
        <TerminalSession
          key={pathname}
          blocks={session.blocks}
          commands={session.commands}
          prompt={session.prompt}
          placeholder={session.placeholder}
          animated={animated}
          onNavigate={(href) => router.push(href)}
        />
      </div>
    </div>
  )
}
