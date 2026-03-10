import type { TerminalLine as TerminalLineType } from '@/lib/commands/types'

interface Props {
  line: TerminalLineType
}

const styleMap: Record<string, string> = {
  success: 'text-green-400',
  error: 'text-red-400',
  info: 'text-slate-400',
  accent: 'text-[var(--accent)]',
  muted: 'text-gray-500',
  command: 'text-[var(--fg)]',
  divider: 'text-gray-600',
  default: 'text-[var(--fg)]',
}

export default function TerminalLine({ line }: Props) {
  const className = styleMap[line.style ?? 'default'] ?? styleMap.default

  if (line.style === 'divider') {
    return <div className={`${className} select-none`}>{line.content || '─'.repeat(40)}</div>
  }

  const prefix = line.style === 'command' ? '$ ' : ''
  const content = `${prefix}${line.content}`

  if (line.href) {
    return (
      <div className={className}>
        <a
          href={line.href}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 hover:text-[var(--accent)] transition-colors"
        >
          {content}
        </a>
      </div>
    )
  }

  return <div className={`${className} whitespace-pre-wrap break-words`}>{content}</div>
}
