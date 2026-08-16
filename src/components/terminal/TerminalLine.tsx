import DitheredPlate from '@/components/visual/DitheredPlate'
import type { TerminalLine as TerminalLineType } from '@/lib/commands/types'

interface Props {
  line: TerminalLineType
  /** run a command the reader tapped — see `chips` on TerminalLine */
  onRun?: (input: string) => void
}

const styleMap: Record<string, string> = {
  default: 'text-[var(--fg)]',
  warm:    'text-[var(--warm)]',
  success: 'text-[var(--success)]',
  error:   'text-[var(--error)]',
  info:    'text-[var(--info)]',
  accent:  'text-[var(--accent)]',
  muted:   'text-[var(--muted)]',
  dim:     'text-[var(--dim)]',
  divider: 'text-[var(--border)]',
}

export default function TerminalLine({ line, onRun }: Props) {
  // A row of commands you can run by tapping. Words, not buttons: the site
  // already decided that a box around a word is one more shape to count, and
  // seventy-two boxed eggs would be a control panel. They are accent-coloured
  // because that is what the `$` is, and padded past their own size so a thumb
  // has something to hit without the row growing.
  if (line.chips?.length) {
    return (
      <div className="flex flex-col gap-x-5 sm:flex-row sm:items-baseline">
        {line.label !== undefined && (
          <span className="shrink-0 text-[10px] tracking-widest text-[var(--muted)] uppercase sm:w-20">
            {line.label}
          </span>
        )}
        {/* negative margins cancel the buttons' own hit padding, so the first
            chip sits on the same left edge as prose on the line above */}
        <div className="-mx-1.5 -my-1 flex flex-wrap items-baseline gap-x-1 gap-y-0">
          {line.chips.map((name) => (
            <button
              key={name}
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRun?.(name)
              }}
              className="px-1.5 py-1 text-[var(--accent)] transition-colors duration-150 hover:text-[var(--fg)]"
            >
              {name}
            </button>
          ))}
        </div>
      </div>
    )
  }

  if (line.image) {
    return (
      <DitheredPlate
        src={line.image.src}
        alt={line.image.alt}
        caption={line.image.caption}
        ratio={line.image.ratio}
      />
    )
  }

  // Key-value row: label + content side by side
  if (line.label !== undefined) {
    // A value in a key/value row is content, so it is ink. Amber here was
    // decoration — five rows, two of them coloured for no reason a reader can
    // see. `warm` keeps its meaning everywhere else: command arguments.
    const valueClass =
      line.style && line.style !== 'warm'
        ? (styleMap[line.style] ?? styleMap.default)
        : styleMap.default
    return (
      <div className="flex flex-col gap-x-5 sm:flex-row sm:items-baseline">
        <span className="text-[var(--muted)] text-[10px] tracking-widest uppercase shrink-0 sm:w-20">
          {line.label}
        </span>
        {line.href ? (
          <a
            href={line.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline underline-offset-2 hover:opacity-80 transition-opacity duration-200"
          >
            {line.content}
          </a>
        ) : (
          <span className={valueClass}>{line.content}</span>
        )}
      </div>
    )
  }

  const className = styleMap[line.style ?? 'default'] ?? styleMap.default

  // Divider
  if (line.style === 'divider') {
    return (
      <div className="border-t border-[var(--border)] my-2 opacity-60" />
    )
  }

  // Command echo — $ blue · verb white · args amber
  if (line.style === 'command') {
    const [verb, ...rest] = line.content.split(' ')
    const args = rest.join(' ')
    return (
      <div className="flex items-baseline gap-2 tracking-wide">
        <span className="text-[var(--accent)] select-none">$</span>
        <span className="text-[var(--fg)]">{verb}</span>
        {args && <span className="text-[var(--warm)]">{args}</span>}
      </div>
    )
  }

  // Blockquote — left accent border
  if (line.style === 'quote') {
    return (
      <div className="border-l border-[var(--muted)] pl-4 text-[var(--fg)] whitespace-pre-wrap break-words leading-relaxed">
        {line.content}
      </div>
    )
  }

  // Link
  if (line.href) {
    return (
      <div className={`${className} whitespace-pre-wrap break-words leading-relaxed`}>
        {line.prefix && <span className="text-[var(--accent)] mr-2">{line.prefix}</span>}
        {line.content}{' '}
        <a
          href={line.href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--accent)] hover:opacity-80 transition-opacity duration-200 text-[10px] tracking-wide"
        >
          (link)
        </a>
      </div>
    )
  }

  return (
    <div className={`${className} whitespace-pre-wrap break-words leading-relaxed`}>
      {line.prefix && <span className="text-[var(--accent)] mr-2">{line.prefix}</span>}
      {line.content}
    </div>
  )
}
