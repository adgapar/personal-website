'use client'

import { useRouter } from 'next/navigation'
import Terminal from '@/components/terminal/Terminal'
import WindowChrome from '@/components/layout/WindowChrome'
import SiteNav from '@/components/layout/SiteNav'

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[var(--bg)] font-mono flex flex-col">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1 border-x border-[var(--border)]">
        <WindowChrome />
        <SiteNav />
        <Terminal onNavigate={(href) => router.push(href)} />
      </div>
    </div>
  )
}
