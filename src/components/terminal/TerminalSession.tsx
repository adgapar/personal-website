'use client'

import { useRef, useCallback, useEffect, useState, type KeyboardEvent } from 'react'
import Link from 'next/link'
import TerminalLine from './TerminalLine'
import DitheredAvatar from '@/components/visual/DitheredAvatar'
import { executeCommand, hasCommand } from '@/lib/commands'
import type { TerminalLine as TLine } from '@/lib/commands/types'
import type { PageCommand, SessionBlock } from '@/lib/sessions'

const NAV_COMMANDS = ['about', 'cv', 'writing', 'contact']

const COL_WIDTHS = ['w-44 shrink-0', 'w-44 shrink-0', 'w-24 shrink-0', 'w-20 shrink-0']
function colClass(index: number, total: number, widths?: string[]) {
  const scale = widths ?? COL_WIDTHS
  return index < total - 1 ? (scale[index] ?? 'w-24 shrink-0') : ''
}

/** in-app routes get client-side navigation; everything else opens away */
function isInternal(href: string) {
  return href.startsWith('/')
}

function externalLinkProps(href: string) {
  return href.startsWith('mailto:')
    ? {}
    : { target: '_blank', rel: 'noopener noreferrer' as const }
}

function statusColor(header: string, value: string): string {
  if (header !== 'status') return 'text-[var(--muted)]'
  const v = value.toLowerCase()
  if (['live', 'current', 'active'].includes(v)) return 'text-[var(--success)]'
  if (['cancelled', 'archived', 'dead', 'abandoned'].includes(v)) return 'text-[var(--error)]'
  return 'text-[var(--muted)]'
}

function buildHelp(commands: PageCommand[]): TLine[] {
  const D: TLine = { content: '', style: 'default' }
  const lines: TLine[] = [
    { label: 'navigate', content: NAV_COMMANDS.join('  ·  '), style: 'default' },
  ]
  if (commands.length > 0) {
    lines.push(D)
    lines.push({ label: 'this page', content: '', style: 'muted' })
    commands.forEach((c) =>
      lines.push({ label: c.name, content: c.description, style: 'muted' })
    )
  }
  lines.push(D)
  lines.push({ label: 'always', content: "help  ·  clear", style: 'muted' })
  return lines
}

interface Props {
  blocks: SessionBlock[]
  commands?: PageCommand[]
  prompt?: string
  placeholder?: string
  animated?: boolean
  onNavigate?: (href: string) => void
}

export default function TerminalSession({
  blocks,
  commands = [],
  prompt = 'adilet@home:~$',
  placeholder = "type 'help'",
  animated = false,
  onNavigate,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  const [inputValue, setInputValue] = useState('')
  const [response, setResponse] = useState<TLine[] | null>(null)
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [visibleCount, setVisibleCount] = useState(animated ? 0 : blocks.length)

  useEffect(() => {
    if (!animated) {
      setVisibleCount(blocks.length)
      inputRef.current?.focus()
      return
    }

    // Reset on every mount — handles router cache restoration with stale state
    setVisibleCount(0)
    let cancelled = false

    const timers: ReturnType<typeof setTimeout>[] = []
    blocks.forEach((_, i) => {
      timers.push(
        setTimeout(() => { if (!cancelled) setVisibleCount(i + 1) }, 150 + i * 380)
      )
    })
    timers.push(
      setTimeout(() => { if (!cancelled) inputRef.current?.focus() }, 150 + blocks.length * 380 + 100)
    )
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  // blocks is a stable module-level constant; animated never changes per page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const focusInput = useCallback(() => inputRef.current?.focus(), [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const newIdx = Math.min(historyIndex + 1, commandHistory.length - 1)
        setHistoryIndex(newIdx)
        setInputValue(commandHistory[newIdx] ?? '')
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        const newIdx = Math.max(historyIndex - 1, -1)
        setHistoryIndex(newIdx)
        setInputValue(newIdx === -1 ? '' : commandHistory[newIdx] ?? '')
      } else if (e.key === 'Enter') {
        const input = inputValue.trim()
        if (!input) return

        setCommandHistory((prev) => [input, ...prev].slice(0, 100))
        setHistoryIndex(-1)
        setInputValue('')

        if (input === 'help') {
          setResponse(buildHelp(commands))
          return
        }

        if (input === 'clear') {
          setResponse(null)
          return
        }

        const staticCmds = blocks.flatMap((b) => (b.cmd ? [b.cmd] : []))
        if (staticCmds.includes(input)) {
          setResponse([{ content: '↑ already shown above', style: 'muted' }])
          return
        }

        const allowed = [...NAV_COMMANDS, ...commands.map((c) => c.name)]
        const isAllowed = allowed.some(
          (cmd) => input === cmd || input.startsWith(cmd + ' ')
        )

        if (!isAllowed && !hasCommand(input)) {
          setResponse([
            { content: `not available here  ·  type 'help' to see what's possible`, style: 'muted' },
          ])
          return
        }

        const result = executeCommand(input)
        setResponse(result.lines ?? [])

        if (result.type === 'navigate' && result.href) {
          setTimeout(() => onNavigate?.(result.href!), 400)
        } else if (result.type === 'open' && result.href) {
          setTimeout(() => window.open(result.href!, '_blank', 'noopener,noreferrer'), 400)
        }
      }
    },
    [inputValue, historyIndex, commandHistory, commands, blocks, onNavigate]
  )

  return (
    <div
      className="flex flex-col text-[var(--fg)] font-mono text-sm cursor-text"
      onClick={focusInput}
    >
      <div className="px-10 pt-8 pb-12 max-w-2xl w-full mx-auto space-y-8">
        {/* Static session blocks */}
        {blocks.slice(0, visibleCount).map((block, i) => (
          <div key={i}>
            {block.cmd && (() => {
              const [verb, ...rest] = block.cmd.split(' ')
              const args = rest.join(' ')
              return (
                <div className="flex items-baseline gap-2 mb-3 tracking-wide">
                  <span className="text-[var(--accent)] select-none">$</span>
                  <span className="text-[var(--fg)]">{verb}</span>
                  {args && <span className="text-[var(--warm)]">{args}</span>}
                </div>
              )
            })()}

            {block.list ? (
            <div className="space-y-3">
              {block.list.items.map((item, j) => (
                <div key={j} className="flex items-baseline gap-3">
                  <span className="text-[var(--dim)] w-4 shrink-0 select-none">{j + 1}</span>
                  {item.meta && (
                    <span className="text-[var(--dim)] text-xs shrink-0 w-24">{item.meta}</span>
                  )}
                  <span className="text-[var(--warm)]">{item.title}</span>
                  {item.tag && (() => {
                    const s = item.tagStyle ?? 'muted'
                    const cls =
                      s === 'accent'  ? 'text-[var(--accent)] border-[var(--accent)]' :
                      s === 'warm'    ? 'text-[var(--warm)] border-[var(--warm)]' :
                      s === 'success' ? 'text-[var(--success)] border-[var(--success)]' :
                                        'text-[var(--muted)] border-[var(--border)]'
                    return (
                      <span className={`text-xs border px-1.5 py-px rounded-sm tracking-wide shrink-0 opacity-70 ${cls}`}>{item.tag}</span>
                    )
                  })()}
                  {item.status && (
                    <span className={`shrink-0 ml-auto ${statusColor('status', item.status)}`}>{item.status}</span>
                  )}
                </div>
              ))}
              {block.list.hint && (
                <div className="text-[var(--muted)] text-xs pt-1">{block.list.hint}</div>
              )}
            </div>
          ) : block.table ? (
            <div className="space-y-1">
              <div className="flex gap-6 text-[var(--muted)] text-xs tracking-widest uppercase pb-1 border-b border-[var(--border)]">
                <span className="w-4 shrink-0">#</span>
                {block.table.headers.map((h, j) => (
                  <span key={j} className={colClass(j, block.table!.headers.length, block.table!.colWidths)}>{h}</span>
                ))}
              </div>
              {block.table.rows.map((row, j) => {
                const rowContent = (
                  <>
                    <span className="w-4 shrink-0 text-[var(--dim)] select-none">{j + 1}</span>
                    {row.cols.map((col, k) => (
                      <span
                        key={k}
                        className={`${colClass(k, row.cols.length, block.table!.colWidths)} ${k === 0 ? 'text-[var(--warm)]' : statusColor(block.table!.headers[k] ?? '', col)}`}
                      >
                        {col}
                      </span>
                    ))}
                  </>
                )
                const rowClass =
                  'flex gap-6 items-baseline hover:text-[var(--accent)] transition-colors duration-200 group'
                return row.href && isInternal(row.href) ? (
                  <Link key={j} href={row.href} className={rowClass}>
                    {rowContent}
                  </Link>
                ) : row.href ? (
                  <a key={j} href={row.href} {...externalLinkProps(row.href)} className={rowClass}>
                    {rowContent}
                  </a>
                ) : (
                  <div key={j} className="flex gap-6 items-baseline">{rowContent}</div>
                )
              })}
              {block.table.hint && (
                <div className="text-[var(--muted)] text-xs pt-1">{block.table.hint}</div>
              )}
            </div>
          ) : block.log ? (
            <div>
              {block.log.entries.map((entry, j) => (
                <div key={j}>
                  <div className="flex items-baseline gap-3">
                    <span className="text-[var(--dim)] text-xs shrink-0 w-16">{entry.date}</span>
                    {entry.tag && (
                      <span className="text-xs text-[var(--warm)] border border-[var(--warm)] px-1.5 py-px rounded-sm tracking-wide shrink-0 opacity-70">{entry.tag}</span>
                    )}
                    <span className="text-[var(--muted)]">{entry.content}</span>
                    {entry.href && (
                      <a href={entry.href} target="_blank" rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:opacity-80 transition-opacity duration-200 text-xs tracking-wide shrink-0">
                        (link)
                      </a>
                    )}
                  </div>
                  {j < block.log!.entries.length - 1 && (
                    <div className="border-t border-[var(--border)] my-2 opacity-40" />
                  )}
                </div>
              ))}
            </div>
          ) : block.linkRow ? (
              <div className="flex flex-wrap gap-x-5 gap-y-1">
                {block.lines.map((line, j) =>
                  line.href ? (
                    <a
                      key={j}
                      href={line.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--muted)] hover:text-[var(--accent)] transition-colors duration-200 tracking-wide"
                    >
                      {line.content}
                    </a>
                  ) : (
                    <span key={j} className="text-[var(--muted)] tracking-wide">
                      {line.content}
                    </span>
                  )
                )}
              </div>
            ) : (
              <div className={block.avatar ? 'flex gap-5 items-start' : undefined}>
                {block.avatar && <DitheredAvatar src={block.avatar} />}
                <div className="space-y-1.5">
                  {block.lines.map((line, j) => (
                    <TerminalLine key={j} line={line} />
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Input + response in a tight group */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-[var(--accent)] text-[10px] tracking-widest select-none shrink-0">
              {prompt}
            </span>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                setHistoryIndex(-1)
              }}
              onKeyDown={handleKeyDown}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              placeholder={placeholder}
              aria-label="terminal input"
              className="flex-1 bg-transparent outline-none font-[inherit] text-[var(--fg)] caret-[var(--accent)] placeholder:text-[var(--dim)]"
            />
          </div>

          {response !== null && response.length > 0 && (
            <div className="space-y-1.5">
              {response.map((line, i) => (
                <TerminalLine key={i} line={line} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
