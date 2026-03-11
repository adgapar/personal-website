'use client'

import PageLayout from '@/components/layout/PageLayout'
import { aboutPage } from '@/lib/sessions'

export default function Home() {
  return <PageLayout session={aboutPage} animated />
}
