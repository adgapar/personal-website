import PageLayout from '@/components/layout/PageLayout'
import { playMeta } from '@/lib/sessions'

export const metadata = {
  title: 'play',
}

export default function PlayPage() {
  return <PageLayout page={playMeta} />
}
