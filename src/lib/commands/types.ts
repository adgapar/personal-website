export type CommandType = 'navigate' | 'output' | 'open' | 'system'

export type LineStyle =
  | 'default'
  | 'warm'
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
  /** if set, the line is a picture — dithered, with the original on hover */
  image?: { src: string; alt: string; caption?: string; ratio?: number }
  /**
   * Command names the reader can run by tapping, instead of a sentence listing
   * them that you then have to retype.
   *
   * Two problems, one field. A terminal teaches its own vocabulary by naming it
   * in output — `git` replies with its six subcommands — and on a keyboard that
   * is a fine way to teach, because reading a word and typing it are nearly the
   * same act. On a phone they are not: every name in that reply is a thing you
   * must now spell on glass. And a list joined with ' · ' into one string cannot
   * reflow, so the same sentence that reads as a row on the desk wraps into a
   * paragraph at 45 characters.
   *
   * As a list rather than a sentence, it flows to the width it has and each
   * name runs itself. `label` still works alongside, so a chips row can sit in
   * the same two-column shape as any other key/value line.
   */
  chips?: string[]
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
