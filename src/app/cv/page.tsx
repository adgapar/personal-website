import PageLayout from '@/components/layout/PageLayout'
import { pageMeta } from '@/lib/sessions'

export const metadata = {
  alternates: { types: { 'text/markdown': '/md/cv' } },
}

export default function CvPage() {
  return <PageLayout page={pageMeta.cv} />
}
