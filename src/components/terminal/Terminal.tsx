'use client'

import { useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
import { useTerminal } from './useTerminal'
import TerminalHistory from './TerminalHistory'
import { executeCommand } from '@/lib/commands'

interface Props {
  onNavigate?: (href: string) => void
}

const BOOT_STEPS = [
  { delay: 150, lines: [{ content: '[ OK ] Starting session — adilet.gaparov', style: 'success' as const }] },
  { delay: 350, lines: [{ content: '[ OK ] User profile loaded', style: 'success' as const }] },
  { delay: 550, lines: [{ content: `[ INFO ] Last login: ${new Date().toDateString()}`, style: 'info' as const }] },
  { delay: 750, lines: [{ content: '', style: 'default' as const }] },
  { delay: 950, lines: [{ content: 'whois adgapar', style: 'command' as const }] },
]

export default function Terminal({ onNavigate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const bootRan = useRef(false)
  const {
    history,
    inputValue,
    commandHistory,
    inputEnabled,
    appendOutput,
    clearHistory,
    setInputValue,
    enableInput,
    pushCommandHistory,
    navigateCommandHistory,
  } = useTerminal(false)

  useEffect(() => {
    if (bootRan.current) return
    bootRan.current = true

    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_STEPS.forEach(({ delay, lines }) => {
      timers.push(setTimeout(() => appendOutput(lines), delay))
    })

    // Auto-run whois after boot text appears
    timers.push(
      setTimeout(() => {
        const result = executeCommand('whois adgapar')
        appendOutput(result.lines ?? [])
      }, 1100)
    )

    // Enable input
    timers.push(setTimeout(() => {
      enableInput()
      setTimeout(() => inputRef.current?.focus(), 50)
    }, 1300))

    return () => timers.forEach(clearTimeout)
  }, [appendOutput, enableInput])

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
          setTimeout(() => onNavigate?.(result.href!), 400)
        } else if (result.type === 'open' && result.href) {
          setTimeout(() => window.open(result.href!, '_blank', 'noopener,noreferrer'), 400)
        }
      }
    },
    [inputValue, commandHistory, appendOutput, clearHistory, pushCommandHistory, navigateCommandHistory, onNavigate]
  )

  return (
    <div
      className="min-h-screen bg-[var(--bg)] text-[var(--fg)] font-mono text-sm p-8 cursor-text"
      onClick={focusInput}
    >
      <div className="max-w-2xl mx-auto">
        <TerminalHistory history={history} />

        {inputEnabled && (
          <div className="flex items-center gap-1 mt-1">
            <span className="text-[var(--accent)] select-none">$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              aria-label="terminal input"
              className="flex-1 bg-transparent outline-none text-[var(--fg)] caret-[var(--accent)] text-[16px] w-full"
            />
          </div>
        )}
      </div>
    </div>
  )
}
