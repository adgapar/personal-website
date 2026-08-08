import LabClient from './LabClient'

export const metadata = {
  title: 'substrate lab',
  robots: { index: false, follow: false },
}

export default function LabPage() {
  return <LabClient />
}
