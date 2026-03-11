export type CommandType = 'navigate' | 'output' | 'open' | 'system'

export type LineStyle =
  | 'default'
  | 'bright'
  | 'success'
  | 'error'
  | 'info'
  | 'accent'
  | 'muted'
  | 'dim'
  | 'command'
  | 'divider'
  | 'quote'

export interface TerminalLine {
  content: string
  style?: LineStyle
  href?: string
  label?: string   // if set, renders as two-column key → value row
  prefix?: string  // if set, renders in accent before content
}

export interface CommandResult {
  type: 'output' | 'navigate' | 'open' | 'clear'
  lines?: TerminalLine[]
  href?: string
  external?: boolean
}

export interface Command {
  name: string
  aliases?: string[]
  description: string
  hidden?: boolean
  type: CommandType
  handler: (args: string[], rawInput: string) => CommandResult
}
