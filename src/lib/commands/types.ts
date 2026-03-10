export type CommandType = 'navigate' | 'output' | 'open' | 'system'

export type LineStyle =
  | 'default'
  | 'success'
  | 'error'
  | 'info'
  | 'accent'
  | 'muted'
  | 'command'
  | 'divider'

export interface TerminalLine {
  content: string
  style?: LineStyle
  href?: string
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
