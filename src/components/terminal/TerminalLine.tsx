import type { TerminalLine as TerminalLineType } from '@/lib/commands/types'

interface Props {
  line: TerminalLineType
}

const styleMap: Record<string, string> = {
  bright:  'text-[var(--bright)]',
  default: 'text-[var(--fg)]',
  success: 'text-[var(--success)]',
  error:   'text-[var(--error)]',
  info:    'text-[var(--info)]',
  accent:  'text-[var(--accent)]',
  muted:   'text-[var(--muted)]',
  dim:     'text-[var(--dim)]',
  command: 'text-[var(--fg)]',
  divider: 'text-[var(--border)]',
}

export default function TerminalLine({ line }: Props) {
  // Key-value row: label + content side by side
  if (line.label !== undefined) {
    const valueClass = styleMap[line.style ?? 'bright'] ?? styleMap.bright
    return (
      <div className="flex items-baseline gap-5">
        <span className="text-[var(--muted)] text-[10px] tracking-widest uppercase shrink-0 w-20">
          {line.label}
        </span>
        {line.href ? (
          <a
            href={line.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`${valueClass} underline underline-offset-2 hover:text-[var(--accent)] transition-colors duration-200`}
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
        <span className="text-[var(--bright)]">{verb}</span>
        {args && <span className="text-[var(--warm)]">{args}</span>}
      </div>
    )
  }

  // Blockquote — left accent border
  if (line.style === 'quote') {
    return (
      <div className="border-l border-[var(--muted)] pl-4 text-[var(--bright)] whitespace-pre-wrap break-words leading-relaxed">
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
          className="text-[var(--warm)] hover:text-[var(--accent)] transition-colors duration-200 text-[10px] tracking-wide"
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
