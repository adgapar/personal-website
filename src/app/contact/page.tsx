import PageLayout from '@/components/layout/PageLayout'
import { pageMeta } from '@/lib/sessions'

export const metadata = {
  alternates: { types: { 'text/markdown': '/md/contact' } },
}

export default function ContactPage() {
  return <PageLayout page={pageMeta.contact} />
}
