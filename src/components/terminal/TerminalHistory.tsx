'use client'

import { useEffect, useRef } from 'react'
import TerminalLine from './TerminalLine'
import type { HistoryEntry } from './useTerminal'

interface Props {
  history: HistoryEntry[]
}

export default function TerminalHistory({ history }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  return (
    <div role="log" aria-live="polite" aria-label="terminal output" className="space-y-0.5">
      {history.map((entry) => (
        <div key={entry.id}>
          {entry.lines.map((line, i) => (
            <TerminalLine key={i} line={line} />
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  )
}
