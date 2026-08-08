import PageLayout from '@/components/layout/PageLayout'
import { getWritingPage } from '@/lib/writing-page'

export const metadata = {
  alternates: { types: { 'text/markdown': '/md/writing' } },
}

export default function WritingPage() {
  return <PageLayout page={getWritingPage()} />
}
