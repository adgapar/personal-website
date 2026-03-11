import PageLayout from '@/components/layout/PageLayout'
import { writingPage } from '@/lib/sessions'

export default function WritingPage() {
  return <PageLayout session={writingPage} />
}
