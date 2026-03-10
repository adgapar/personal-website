'use client'

import { useRouter } from 'next/navigation'
import Terminal from '@/components/terminal/Terminal'

export default function Home() {
  const router = useRouter()

  return <Terminal onNavigate={(href) => router.push(href)} skipBoot />
}
