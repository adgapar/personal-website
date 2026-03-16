'use client'

import { useRef, useCallback, useEffect, type KeyboardEvent } from 'react'
import { useTerminal } from './useTerminal'
import TerminalLine from './TerminalLine'
import { executeCommand } from '@/lib/commands'
import type { TerminalLine as TLine } from '@/lib/commands/types'

interface Props {
  onNavigate?: (href: string) => void
  initCommand?: string
  showBoot?: boolean
}

const BOOT_STEPS: { delay: number; lines: TLine[] }[] = [
  { delay: 150, lines: [{ content: '[ OK ] Starting session — adilet.gaparov', style: 'success' }] },
  { delay: 350, lines: [{ content: '[ OK ] User profile loaded', style: 'success' }] },
  { delay: 550, lines: [{ content: `[ INFO ] Last login: ${new Date().toDateString()}`, style: 'info' }] },
  { delay: 750, lines: [{ content: '', style: 'default' }] },
  { delay: 950, lines: [{ content: 'whois adgapar', style: 'command' }] },
]

export default function Terminal({ onNavigate, initCommand = 'whois adgapar', showBoot = false }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const bootRan = useRef(false)
  const {
    bootLines,
    initOutput,
    response,
    inputValue,
    commandHistory,
    inputEnabled,
    appendBoot,
    setInitOutput,
    setResponse,
    clearResponse,
    setInputValue,
    enableInput,
    pushCommandHistory,
    navigateCommandHistory,
  } = useTerminal()

  useEffect(() => {
    if (bootRan.current) return
    bootRan.current = true

    if (showBoot) {
      const timers: ReturnType<typeof setTimeout>[] = []

      BOOT_STEPS.forEach(({ delay, lines }) => {
        timers.push(setTimeout(() => appendBoot(lines), delay))
      })

      // Auto-run initCommand — stored as persistent init content
      timers.push(setTimeout(() => {
        const result = executeCommand(initCommand)
        setInitOutput(result.lines ?? [])
      }, 1100))

      timers.push(setTimeout(() => {
        enableInput()
        setTimeout(() => inputRef.current?.focus(), 50)
      }, 1300))

      return () => timers.forEach(clearTimeout)
    } else {
      // Section page — instant load, no boot drama
      const result = executeCommand(initCommand)
      setInitOutput([{ content: initCommand, style: 'command' }, ...(result.lines ?? [])])
      enableInput()
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [appendBoot, setInitOutput, enableInput, initCommand, showBoot])

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

        // Already showing this content — don't re-run on section pages
        if (!showBoot && input === initCommand) {
          setResponse([{ content: '↑ already loaded · scroll up to see output', style: 'muted' }], input)
          return
        }

        const result = executeCommand(input)
        pushCommandHistory(input)

        if (result.type === 'clear') {
          clearResponse()
          return
        }

        setResponse(result.lines ?? [], input)

        if (result.type === 'navigate' && result.href) {
          setTimeout(() => onNavigate?.(result.href!), 400)
        } else if (result.type === 'open' && result.href) {
          setTimeout(() => window.open(result.href!, '_blank', 'noopener,noreferrer'), 400)
        }
      }
    },
    [inputValue, commandHistory, initCommand, showBoot, setResponse, clearResponse, pushCommandHistory, navigateCommandHistory, onNavigate]
  )

  return (
    <div
      className="flex flex-col flex-1 bg-[var(--bg)] text-[var(--fg)] font-mono text-base cursor-text"
      onClick={focusInput}
    >
      <div className="flex-1 p-8 pb-4 space-y-4">
        <div className="max-w-2xl space-y-0.5">
          {/* Boot lines — always visible */}
          {bootLines.map((line, i) => (
            <TerminalLine key={`boot-${i}`} line={line} />
          ))}
        </div>

        {/* init output — always visible, never replaced */}
        {initOutput.length > 0 && (
          <div className="max-w-2xl space-y-0.5">
            {initOutput.map((line, i) => (
              <TerminalLine key={`init-${i}`} line={line} />
            ))}
          </div>
        )}

        {/* Command response — replaces on each new command */}
        {response !== null && response.length > 0 && (
          <div className="max-w-2xl space-y-0.5">
            {response.map((line, i) => (
              <TerminalLine key={`resp-${i}`} line={line} />
            ))}
          </div>
        )}
      </div>

      {/* Input — fixed at bottom */}
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
