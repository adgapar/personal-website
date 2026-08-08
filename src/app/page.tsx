import PageLayout from '@/components/layout/PageLayout'
import { pageMeta } from '@/lib/sessions'

export const metadata = {
  alternates: { types: { 'text/markdown': '/md/about' } },
}

export default function Home() {
  return <PageLayout page={pageMeta.about} />
}
