'use client'

import { useRef, useCallback, type KeyboardEvent } from 'react'
import { useTerminal } from './useTerminal'
import TerminalHistory from './TerminalHistory'
import { executeCommand } from '@/lib/commands/registry'

interface Props {
  onNavigate?: (href: string) => void
  /** If true, skip boot sequence and enable input immediately (used in Phase 2 dev) */
  skipBoot?: boolean
}

export default function Terminal({ onNavigate, skipBoot = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const {
    history,
    inputValue,
    commandHistory,
    inputEnabled,
    appendOutput,
    clearHistory,
    setInputValue,
    pushCommandHistory,
    navigateCommandHistory,
  } = useTerminal(skipBoot)

  const focusInput = useCallback(() => {
    inputRef.current?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        navigateCommandHistory('up', commandHistory)
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        navigateCommandHistory('down', commandHistory)
      } else if (e.key === 'Enter') {
        const input = inputValue.trim()
        if (!input) return

        const result = executeCommand(input)
        pushCommandHistory(input)

        if (result.type === 'clear') {
          clearHistory()
          return
        }

        appendOutput(result.lines ?? [], input)

        if (result.type === 'navigate' && result.href) {
          setTimeout(() => {
            onNavigate?.(result.href!)
          }, 400)
        } else if (result.type === 'open' && result.href) {
          setTimeout(() => {
            window.open(result.href!, '_blank', 'noopener,noreferrer')
          }, 400)
        }
      }
    },
    [inputValue, commandHistory, appendOutput, clearHistory, pushCommandHistory, navigateCommandHistory, onNavigate]
  )

  return (
    <div
      className="flex flex-col min-h-screen bg-[var(--bg)] text-[var(--fg)] font-mono text-sm p-6 cursor-text"
      onClick={focusInput}
    >
      <div className="flex-1 mb-4">
        <TerminalHistory history={history} />
      </div>

      {inputEnabled && (
        <div className="flex items-center gap-1">
          <span className="text-[var(--accent)] select-none">$</span>
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label="terminal input"
            className="flex-1 bg-transparent outline-none text-[var(--fg)] caret-[var(--accent)] text-[16px]"
          />
        </div>
      )}
    </div>
  )
}
