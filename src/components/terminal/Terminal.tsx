'use client'

import { useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
import { useTerminal } from './useTerminal'
import TerminalLine from './TerminalLine'
import { executeCommand } from '@/lib/commands'
import type { TerminalLine as TLine } from '@/lib/commands/types'

interface Props {
  onNavigate?: (href: string) => void
}

const BOOT_STEPS: { delay: number; lines: TLine[] }[] = [
  { delay: 150, lines: [{ content: '[ OK ] Starting session — adilet.gaparov', style: 'success' }] },
  { delay: 350, lines: [{ content: '[ OK ] User profile loaded', style: 'success' }] },
  { delay: 550, lines: [{ content: `[ INFO ] Last login: ${new Date().toDateString()}`, style: 'info' }] },
  { delay: 750, lines: [{ content: '', style: 'default' }] },
  { delay: 950, lines: [{ content: 'whois adgapar', style: 'command' }] },
]

export default function Terminal({ onNavigate }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const bootRan = useRef(false)
  const {
    bootLines,
    output,
    inputValue,
    commandHistory,
    inputEnabled,
    appendBoot,
    setOutput,
    clearOutput,
    setInputValue,
    enableInput,
    pushCommandHistory,
    navigateCommandHistory,
  } = useTerminal()

  useEffect(() => {
    if (bootRan.current) return
    bootRan.current = true

    const timers: ReturnType<typeof setTimeout>[] = []

    BOOT_STEPS.forEach(({ delay, lines }) => {
      timers.push(setTimeout(() => appendBoot(lines), delay))
    })

    timers.push(
      setTimeout(() => {
        const result = executeCommand('whois adgapar')
        // Show whois output in the output panel
        setOutput(result.lines ?? [])
      }, 1100)
    )

    timers.push(
      setTimeout(() => {
        enableInput()
        setTimeout(() => inputRef.current?.focus(), 50)
      }, 1300)
    )

    return () => timers.forEach(clearTimeout)
  }, [appendBoot, setOutput, enableInput])

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
          clearOutput()
          return
        }

        setOutput(result.lines ?? [], input)

        if (result.type === 'navigate' && result.href) {
          setTimeout(() => onNavigate?.(result.href!), 400)
        } else if (result.type === 'open' && result.href) {
          setTimeout(() => window.open(result.href!, '_blank', 'noopener,noreferrer'), 400)
        }
      }
    },
    [inputValue, commandHistory, setOutput, clearOutput, pushCommandHistory, navigateCommandHistory, onNavigate]
  )

  // Lines to display: boot log until first command, then command output
  const displayLines = output !== null ? output : bootLines

  return (
    <div
      className="flex flex-col min-h-0 flex-1 bg-[var(--bg)] text-[var(--fg)] font-mono text-sm cursor-text"
      onClick={focusInput}
    >
      {/* Output area */}
      <div className="flex-1 p-8 pb-4">
        <div className="max-w-2xl space-y-0.5">
          {displayLines.map((line, i) => (
            <TerminalLine key={i} line={line} />
          ))}
        </div>
      </div>

      {/* Fixed input at bottom */}
      {inputEnabled && (
        <div className="sticky bottom-0 bg-[var(--bg)] border-t border-[var(--border)] px-8 py-4">
          <div className="max-w-2xl flex items-center gap-2">
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
              className="flex-1 bg-transparent outline-none text-[var(--fg)] caret-[var(--accent)] text-[16px]"
            />
          </div>
        </div>
      )}
    </div>
  )
}
