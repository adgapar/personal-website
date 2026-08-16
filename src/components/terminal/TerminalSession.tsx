'use client'

import {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type KeyboardEvent,
} from 'react'
import Link from 'next/link'
import CommandBlock from './CommandBlock'
import TerminalLine from './TerminalLine'
import DitheredAvatar from '@/components/visual/DitheredAvatar'
import { executeCommand, hasCommand, listCommands } from '@/lib/commands'
import type { TerminalLine as TLine } from '@/lib/commands/types'
import type { PageCommand, SessionBlock } from '@/lib/sessions'

const NAV_COMMANDS = ['about', 'cv', 'writing', 'contact', 'play']

// Columns only from sm up. A 176px column is a third of a phone's width, and
// three of them made a table that scrolled sideways inside a scrollback that
// scrolled down inside a page that did not scroll at all. Below sm the row
// stacks instead — see the table branch of renderBlock.
const COL_WIDTHS = [
  'sm:w-44 sm:shrink-0',
  'sm:w-44 sm:shrink-0',
  'sm:w-24 sm:shrink-0',
  'sm:w-20 sm:shrink-0',
]
function colClass(index: number, total: number, widths?: string[]) {
  const scale = widths ?? COL_WIDTHS
  return index < total - 1 ? (scale[index] ?? 'sm:w-24 sm:shrink-0') : ''
}

/** in-app routes get client-side navigation; everything else opens away */
function isInternal(href: string) {
  return href.startsWith('/')
}

/**
 * The prompt, shortened for a narrow window: `adilet@cv:~$` becomes `cv:~$`.
 *
 * Fourteen characters of prompt is a third of a phone's line, spent every line
 * on a name that does not change and a host that was never in question. What is
 * left is the part that does change — which session you are in — which is the
 * only reason a real prompt carries any of this. Same convention as a shell
 * that has been told its own $PS1 is too long.
 */
function shortenPrompt(prompt: string) {
  const at = prompt.indexOf('@')
  return at === -1 ? prompt : prompt.slice(at + 1)
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
  // help is the documented way in, so every name it prints runs itself. It was
  // a sentence of names joined with dots — fine to read, and on a phone a list
  // of words you then had to spell back at it one letter at a time.
  const lines: TLine[] = [
    { label: 'navigate', content: '', chips: NAV_COMMANDS },
  ]
  if (commands.length > 0) {
    lines.push(D)
    lines.push({ label: 'this page', content: '', style: 'muted' })
    commands.forEach((c) =>
      lines.push({ label: c.name, content: c.description, style: 'muted' })
    )
  }
  lines.push(D)
  lines.push({ label: 'always', content: '', chips: ['help', 'clear'] })
  lines.push(D)
  lines.push({
    label: 'and',
    content: "it's a terminal — try what you'd type in one. some of it answers back.",
    style: 'muted',
  })
  lines.push({ label: 'or', content: '', chips: ['fortune'] })
  return lines
}

interface Props {
  blocks: SessionBlock[]
  /**
   * Render as an already-finished session: no typing, no reveal, and no stealing
   * focus. For a window that is on screen but not the one being driven.
   */
  instant?: boolean
  commands?: PageCommand[]
  prompt?: string
  placeholder?: string
  onNavigate?: (href: string) => void
}

export default function TerminalSession({
  blocks: allBlocks,
  instant = false,
  commands = [],
  prompt = 'adilet@home:~$',
  placeholder = "type 'help'",
  onNavigate,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  /** true only while the reveal is taking focus by itself — see the effect below */
  const autoFocusing = useRef(false)

  // some blocks exist for the markdown and agent views only — a full post index
  // is worth indexing but would bury the session it sits in
  const blocks = useMemo(() => allBlocks.filter((b) => !b.termSkip), [allBlocks])

  const [inputValue, setInputValue] = useState('')
  /** what has been run in this session — echoed command plus its output */
  const [entries, setEntries] = useState<{ input: string; lines: TLine[] }[]>([])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  // A ref, not state: how far back through history you are never appears on
  // screen — only the input value it produces does — so making it state was
  // re-rendering the whole session to remember a number nothing reads.
  const historyIndex = useRef(-1)
  // Tab cycles against what was typed, not against what it just inserted —
  // otherwise accepting `git blame` leaves nothing that still starts with it.
  const [cycle, setCycle] = useState(0)
  const [base, setBase] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(instant ? blocks.length : 0)
  // drives the on-screen key strip, which should arrive and leave with the
  // keyboard rather than sit there taking 40px from a session nobody is typing at
  const [focused, setFocused] = useState(false)

  useEffect(() => {
    if (instant) return

    // Reset on every mount — handles router cache restoration with stale state
    setVisibleCount(0)
    let cancelled = false

    const timers: ReturnType<typeof setTimeout>[] = []
    blocks.forEach((_, i) => {
      timers.push(
        setTimeout(() => { if (!cancelled) setVisibleCount(i + 1) }, 200 + i * 420)
      )
    })
    timers.push(
      setTimeout(() => {
        if (cancelled) return
        // Flagged so the input's own onFocus can tell this apart from a reader
        // tapping the prompt. That handler scrolls to the bottom to stay clear
        // of the on-screen keyboard, which is right for a tap and wrong here —
        // it would open every page at the end of its own session.
        autoFocusing.current = true
        inputRef.current?.focus({ preventScroll: true })
        autoFocusing.current = false
      }, 200 + blocks.length * 420 + 120)
    )
    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  // blocks is a stable module-level constant; animated never changes per page
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // New output should bring the prompt into view. The reveal animation must not:
  // scrolling on every block meant every page opened at the bottom, with the
  // first line cut in half under the tab bar.
  const settled = useRef(false)
  useEffect(() => {
    if (!settled.current) {
      settled.current = true
      return
    }
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [entries])

  const focusInput = useCallback(() => inputRef.current?.focus({ preventScroll: true }), [])

  /**
   * What Tab will complete — everything, hidden commands included. Seventy-five
   * of them that nobody finds is a worse outcome than a slightly smaller
   * surprise, and typing `sudo` blind still answers back.
   */
  const completions = useMemo(() => {
    const registered = listCommands().map((c) => c.name)
    return [...new Set([...NAV_COMMANDS, ...commands.map((c) => c.name), ...registered])].sort()
  }, [commands])

  const matches = useMemo(() => {
    const typed = (base ?? inputValue).toLowerCase()
    // One character, not two. The threshold was there so a single letter would
    // not dump the whole set, but it also meant the completion — the one thing
    // that makes a 91-command vocabulary reachable without knowing it — stayed
    // switched off until you had already guessed most of a word. One letter is
    // between four and a dozen candidates, which is a list, not a dump.
    if (typed.trim().length < 1) return []
    return completions.filter((c) => c.startsWith(typed))
  }, [base, inputValue, completions])

  /** the greyed-out remainder shown after the cursor */
  const ghost =
    base === null && matches.length > 0 && matches[0] !== inputValue
      ? matches[cycle % matches.length].slice(inputValue.length)
      : ''

  /** append a command and its output to the scrollback */
  const echo = useCallback((input: string, lines: TLine[]) => {
    setEntries((prev) => [...prev, { input, lines }])
  }, [])

  /** clicking a list row runs its command, same path as typing it */
  const runCommand = useCallback(
    (input: string) => {
      const result = executeCommand(input)
      echo(input, result.lines ?? [])
      setCommandHistory((prev) => [input, ...prev].slice(0, 100))
      if (result.type === 'navigate' && result.href) {
        setTimeout(() => onNavigate?.(result.href!), 400)
      } else if (result.type === 'open' && result.href) {
        setTimeout(() => window.open(result.href!, '_blank', 'noopener,noreferrer'), 400)
      }
    },
    [onNavigate, echo],
  )

  // Tab, ↑ and ↓ lifted out of the key handler, because a phone keyboard has
  // none of the three and the on-screen key strip below drives the same code.
  /** first Tab pins what was typed, each one after moves to the next match */
  const cycleCompletion = useCallback(() => {
    if (matches.length === 0) return
    const next = base === null ? 0 : (cycle + 1) % matches.length
    if (base === null) setBase(inputValue)
    setCycle(next)
    setInputValue(matches[next])
  }, [matches, base, cycle, inputValue])

  const historyBack = useCallback(() => {
    const next = Math.min(historyIndex.current + 1, commandHistory.length - 1)
    historyIndex.current = next
    setInputValue(commandHistory[next] ?? '')
  }, [commandHistory])

  const historyForward = useCallback(() => {
    const next = Math.max(historyIndex.current - 1, -1)
    historyIndex.current = next
    setInputValue(next === -1 ? '' : (commandHistory[next] ?? ''))
  }, [commandHistory])

  /** a character the phone keyboard hides behind a layer switch */
  const insert = useCallback((ch: string) => {
    setInputValue((v) => v + ch)
    setBase(null)
    setCycle(0)
  }, [])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault()
        cycleCompletion()
        return
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        historyBack()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        historyForward()
      } else if (e.key === 'Enter') {
        const input = inputValue.trim()
        if (!input) return

        setCommandHistory((prev) => [input, ...prev].slice(0, 100))
        historyIndex.current = -1
        setInputValue('')
        setBase(null)
        setCycle(0)

        if (input === 'help') {
          echo(input, buildHelp(commands))
          return
        }

        if (input === 'clear') {
          setEntries([])
          return
        }

        const staticCmds = blocks.flatMap((b) => (b.cmd ? [b.cmd] : []))
        if (staticCmds.includes(input)) {
          echo(input, [{ content: '↑ already shown above', style: 'muted' }])
          return
        }

        const allowed = [...NAV_COMMANDS, ...commands.map((c) => c.name)]
        const isAllowed = allowed.some(
          (cmd) => input === cmd || input.startsWith(cmd + ' ')
        )

        if (!isAllowed && !hasCommand(input)) {
          echo(input, [
            { content: `not available here  ·  type 'help' to see what's possible`, style: 'muted' },
          ])
          return
        }

        const result = executeCommand(input)
        echo(input, result.lines ?? [])

        if (result.type === 'navigate' && result.href) {
          setTimeout(() => onNavigate?.(result.href!), 400)
        } else if (result.type === 'open' && result.href) {
          setTimeout(() => window.open(result.href!, '_blank', 'noopener,noreferrer'), 400)
        }
      }
    },
    [inputValue, commands, blocks, onNavigate, echo, cycleCompletion, historyBack, historyForward]
  )

  /** the `$` at the head of a line, long on the desk and short on a phone */
  const Prompt = () => (
    <span className="shrink-0 font-medium text-[var(--accent)] select-none">
      <span className="sm:hidden">{shortenPrompt(prompt)}</span>
      <span className="hidden sm:inline">{prompt}</span>
    </span>
  )

  /** One session block, lifted out of the render to keep the tree readable. */
  const renderBlock = (block: SessionBlock) => (
    <CommandBlock cmd={block.cmd} instant={instant}>
      {block.action ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); runCommand(block.action!.run) }}
            // a real tap target on a phone; the desk keeps the tighter box
            className="border border-[var(--accent)] px-3 py-2 text-xs tracking-widest text-[var(--accent)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-[var(--bg)] sm:px-2.5 sm:py-1"
          >
            {block.action.label}
          </button>
          {block.action.hint && (
            <span className="text-xs text-[var(--muted)]">{block.action.hint}</span>
          )}
        </div>
      ) : block.list ? (
      <div className="space-y-3">
        {block.list.items.map((item, j) => (
          <div
            key={j}
            onClick={item.run ? (e) => { e.stopPropagation(); runCommand(item.run!) } : undefined}
            className={item.run ? 'group -mx-2 rounded-sm px-2 py-0.5 hover:bg-black/[0.035]' : undefined}
          >
          {/* Five things on one line needs about 60 characters and a phone has
              forty. Wrapping them was worse than either layout: `ml-auto` sent
              the status word to a line of its own, right-aligned, attached to
              nothing.

              So the row has two shapes. On a phone the title is the line, and
              the date, the org and the state fall under it as one quiet strip.
              From sm up `contents` dissolves that strip and all five become
              columns of the same row again, exactly as before. */}
          <div className="flex items-baseline gap-x-3">
            <span className="text-[var(--dim)] w-4 shrink-0 select-none">{j + 1}</span>
            <div className="min-w-0 flex-1 sm:flex sm:flex-wrap sm:items-baseline sm:gap-x-3">
              {/* the title is the content of the row, so it is ink — amber
                  is reserved for one job now: arguments in a command */}
              <span
                className={`block sm:order-2 ${item.run ? 'group-hover:text-[var(--accent)]' : ''}`}
              >
                {item.title}
              </span>
              <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 text-xs sm:contents">
                {item.meta && (
                  <span className="text-[var(--dim)] sm:order-1 sm:w-24 sm:shrink-0">
                    {item.meta}
                  </span>
                )}
                {/* a tag is a word. The box around it was one more shape to
                    count in a list that already has five columns. */}
                {item.tag && (
                  <span className="tracking-wide text-[var(--muted)] sm:order-3 sm:shrink-0">
                    {item.tag}
                  </span>
                )}
                {item.status && (
                  <span
                    className={`sm:order-4 sm:ml-auto sm:shrink-0 sm:text-[length:inherit] ${statusColor('status', item.status)}`}
                  >
                    {item.status}
                  </span>
                )}
              </div>
            </div>
          </div>
          {item.summary && (
            <div className="pl-7 text-xs text-[var(--muted)]">{item.summary}</div>
          )}
          </div>
        ))}
        {block.list.hint && (
          <div className="text-[var(--muted)] text-xs pt-1">{block.list.hint}</div>
        )}
      </div>
    ) : block.table ? (
      <div className="space-y-1">
        {/* Column headings over stacked rows would be labelling columns that are
            not there. Gone below sm, where the first cell is the row's name and
            the rest read as its detail. */}
        <div className="hidden gap-6 text-[var(--muted)] text-xs tracking-widest uppercase pb-1 border-b border-[var(--border)] sm:flex">
          <span className="w-4 shrink-0">#</span>
          {block.table.headers.map((h, j) => (
            <span key={j} className={colClass(j, block.table!.headers.length, block.table!.colWidths)}>{h}</span>
          ))}
        </div>
        {block.table.rows.map((row, j) => {
          const [first, ...rest] = row.cols
          // same two-shape trick as the list: stacked on a phone, and `contents`
          // puts every cell back on one row from sm up
          const rowContent = (
            <>
              <span className="w-4 shrink-0 text-[var(--dim)] select-none">{j + 1}</span>
              <div className="min-w-0 flex-1 sm:contents">
                <span className={colClass(0, row.cols.length, block.table!.colWidths)}>
                  {first}
                </span>
                {rest.length > 0 && (
                  <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5 text-xs text-[var(--muted)] sm:contents">
                    {rest.map((col, k) => (
                      <span
                        key={k}
                        className={`${colClass(k + 1, row.cols.length, block.table!.colWidths)} sm:text-[length:inherit] ${statusColor(block.table!.headers[k + 1] ?? '', col)}`}
                      >
                        {col}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )
          const rowClass =
            'flex gap-3 items-baseline hover:text-[var(--accent)] transition-colors duration-200 group sm:gap-6'
          return row.href && isInternal(row.href) ? (
            <Link key={j} href={row.href} className={rowClass}>
              {rowContent}
            </Link>
          ) : row.href ? (
            <a key={j} href={row.href} {...externalLinkProps(row.href)} className={rowClass}>
              {rowContent}
            </a>
          ) : (
            <div key={j} className="flex gap-3 items-baseline sm:gap-6">{rowContent}</div>
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
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-[var(--dim)] text-xs shrink-0 whitespace-nowrap w-[5.5rem]">{entry.date}</span>
              {entry.tag && (
                <span className="shrink-0 text-xs tracking-wide text-[var(--muted)]">{entry.tag}</span>
              )}
              <span className="text-[var(--muted)]">{entry.content}</span>
              {entry.href &&
                (isInternal(entry.href) ? (
                  <Link
                    href={entry.href}
                    className="text-[var(--accent)] hover:opacity-80 transition-opacity duration-200 text-xs tracking-wide shrink-0"
                  >
                    (read)
                  </Link>
                ) : (
                  <a
                    href={entry.href}
                    {...externalLinkProps(entry.href)}
                    className="text-[var(--accent)] hover:opacity-80 transition-opacity duration-200 text-xs tracking-wide shrink-0"
                  >
                    (link ↗)
                  </a>
                ))}
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
        // A 144px portrait beside the labels leaves 146px for the text on a
        // phone, which is narrower than "Founding AI Engineer". It goes above
        // them instead, and the labels get the full width.
        <div
          className={
            block.avatar ? 'flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-5' : undefined
          }
        >
          {block.avatar && <DitheredAvatar src={block.avatar} />}
          <div className="space-y-1.5">
            {block.lines.map((line, j) => (
              <TerminalLine key={j} line={line} onRun={runCommand} />
            ))}
          </div>
        </div>
      )}
    </CommandBlock>
  )

  /**
   * The keys a phone keyboard does not have.
   *
   * Every mobile terminal ships one of these — Termux, iSH, Working Copy — and
   * they all ship the same reason: a shell is driven by keys that no touch
   * keyboard has, and without them the shell is a text field. Tab is the whole
   * argument. There are 91 commands here and completion is the only way to
   * reach a vocabulary you do not already know, and until now it was bound to a
   * key that does not exist on the device where you need it most.
   *
   * ↑ and ↓ are history, which is how you fix a typo in a command rather than
   * retyping it. `-` and `/` are on the symbol layer of every phone keyboard,
   * and they appear in half the commands worth finding — `rm -rf /`, `kill -9`,
   * `ls -l`. One tap instead of a layer switch and back.
   */
  const KEYS: { label: string; title: string; press: () => void; wide?: boolean }[] = [
    { label: 'tab', title: 'complete', press: cycleCompletion, wide: true },
    { label: '↑', title: 'previous command', press: historyBack },
    { label: '↓', title: 'next command', press: historyForward },
    { label: '-', title: 'dash', press: () => insert('-') },
    { label: '/', title: 'slash', press: () => insert('/') },
  ]

  return (
    <>
    <div
      ref={scrollRef}
      // How tall this is belongs to the window, not to the session — see
      // .term-scroll in globals.css. It fills a window that fills the screen, and
      // takes a fixed height inside one sitting on the desk.
      //
      // 13px below sm. At 15px a 358px window fits 35 monospace characters, so
      // "type 'help' for available commands" broke across two lines; 13px fits 45
      // and the session reads as lines again rather than as paragraphs.
      className="term-scroll flex cursor-text flex-col overflow-y-auto overscroll-contain font-mono text-[13px] text-[var(--fg)] sm:text-[15px]"
      onClick={focusInput}
    >
      {/* the same left edge as the tab row and the status bar */}
      <div className="w-full space-y-6 px-4 pt-5 pb-8 sm:space-y-8 sm:px-8 sm:pt-7 sm:pb-9">
        {/* what has been typed so far */}
        {blocks.slice(0, visibleCount).map((block, i) => (
          <div key={i}>{renderBlock(block)}</div>
        ))}

        {/* scrollback: each command above the output it produced */}
        {entries.map((entry, i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-baseline gap-3">
              <Prompt />
              <span className="text-[var(--fg)]">{entry.input}</span>
            </div>
            {entry.lines.length > 0 && (
              <div className="space-y-1.5">
                {entry.lines.map((line, j) => (
                  <TerminalLine key={j} line={line} onRun={runCommand} />
                ))}
              </div>
            )}
          </div>
        ))}

        {/* the live prompt, always last */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Prompt />
            {instant ? (
              // an unfocused window has no live prompt to type into, and must
              // not sit in the tab order
              <span className="cursor inline-block h-3 w-1.5 bg-[var(--dim)]" aria-hidden />
            ) : (
              // 16px on a phone, and not for legibility: Safari zooms the page
              // in whenever you focus an input smaller than that, and this page
              // does not scroll, so it zooms you into a corner you cannot get
              // back out of. The ghost sits in here too, so both keep the same
              // metrics and the completion still lines up under the caret.
              <span className="relative flex-1 text-base sm:text-[15px]">
                {/* the completion, drawn under the caret in the same metrics —
                    the typed part is invisible so the ghost lines up exactly */}
                {(ghost || (base !== null && matches.length > 1)) && (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 whitespace-pre text-[var(--fg)]"
                  >
                    <span className="invisible">{inputValue}</span>
                    <span className="text-[var(--dim)]">{ghost}</span>

                  </span>
                )}
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value)
                    historyIndex.current = -1
                    setCycle(0)
                    // typing abandons whatever Tab was cycling through,
                    // otherwise the menu keeps answering the previous prefix
                    setBase(null)
                  }}
                  onKeyDown={handleKeyDown}
                  // the keyboard shortens the window under it; put the prompt
                  // back at the bottom of what is left
                  onFocus={() => {
                    setFocused(true)
                    if (autoFocusing.current) return
                    const el = scrollRef.current
                    if (el) setTimeout(() => { el.scrollTop = el.scrollHeight }, 300)
                  }}
                  onBlur={() => setFocused(false)}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  // the return key should say what it does — this is a command
                  // line, not a form you are filling in
                  enterKeyHint="go"
                  placeholder={placeholder}
                  aria-label="terminal input"
                  className="relative w-full bg-transparent outline-none font-[inherit] text-[var(--fg)] caret-[var(--accent)] placeholder:text-[var(--dim)]"
                />
              </span>
            )}
          </div>

          {/* The candidates, visible rather than hidden behind a keystroke.
              Capped at ten now that one letter is enough to ask: `c` matches
              fourteen, and a menu that is four lines taller than the session is
              not a menu. Tab still cycles the whole set. */}
          {matches.length > 1 && (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pl-1 text-[11px]">
              {matches.slice(0, 10).map((name, i) => {
                const active = base !== null && i === cycle % matches.length
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setBase(inputValue)
                      setCycle(i)
                      setInputValue(name)
                      inputRef.current?.focus({ preventScroll: true })
                    }}
                    className={
                      active
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--dim)] hover:text-[var(--fg)]'
                    }
                  >
                    {name}
                  </button>
                )
              })}
              {matches.length > 10 && (
                <span className="text-[var(--dim)]">+{matches.length - 10}</span>
              )}
              {/* Desk only. On a phone the key strip below has a key with `tab`
                  written on it, so the same word floating at the end of the
                  candidates just reads as a candidate called "tab to cycle". */}
              <span className="hidden text-[10px] tracking-widest text-[var(--dim)] sm:inline">
                tab to cycle
              </span>
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Sits between the scrollback and the status bar, so it lands directly on
        top of the keyboard — the accessory-bar position. Phone only: a desk has
        these keys already. */}
    {!instant && (
      <div
        aria-label="terminal keys"
        className={`term-recess shrink-0 items-stretch gap-px border-t border-[var(--border)] px-1 sm:hidden ${
          focused ? 'flex' : 'hidden'
        }`}
      >
        {KEYS.map((key) => (
          <button
            key={key.label}
            type="button"
            title={key.title}
            aria-label={key.title}
            // The bar must not take focus, or the first tap closes the keyboard
            // and the second one reopens it — which is the failure mode that
            // makes most of these bars useless. mousedown rather than
            // pointerdown: preventing the default on pointerdown also cancels
            // the click that follows it.
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => {
              e.stopPropagation()
              key.press()
            }}
            // a ground of their own, so they read as keys rather than as five
            // glyphs adrift on a bar — the gap-px above lets the recess through
            // between them, which is the only separation a key needs
            className={`bg-white/[0.05] py-2.5 text-[13px] text-[var(--muted)] transition-colors duration-150 active:bg-white/[0.11] active:text-[var(--accent)] ${
              key.wide ? 'flex-[1.4]' : 'flex-1'
            }`}
          >
            {key.label}
          </button>
        ))}
      </div>
    )}
    </>
  )
}
