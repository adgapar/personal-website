import PageLayout from '@/components/layout/PageLayout'
import { getWritingPage } from '@/lib/writing-page'

export const metadata = {
  title: 'writing',
  alternates: { types: { 'text/markdown': '/md/writing' } },
}

/** A terminal tab like every other tab. The posts open in the reader app. */
export default function WritingPage() {
  return <PageLayout page={getWritingPage()} />
}
