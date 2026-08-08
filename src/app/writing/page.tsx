import PageLayout from '@/components/layout/PageLayout'
import { pageMeta } from '@/lib/sessions'

export const metadata = {
  alternates: { types: { 'text/markdown': '/md/writing' } },
}

export default function WritingPage() {
  return <PageLayout page={pageMeta.writing} />
}
