'use client'

import Link from 'next/link'
import { setWindowState } from '@/lib/window-state-store'

/** Closing a document returns to an open terminal, including after minimizing it. */
export default function WindowClose({ label = 'Close window and return to terminal' }: { label?: string }) {
  return <Link href="/" className="window-close-control" aria-label={label} title="Return to terminal" onClick={() => setWindowState({ minimized: false })}>
    <span aria-hidden>×</span>
  </Link>
}
