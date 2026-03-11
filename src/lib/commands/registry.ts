import type { Command, CommandResult } from './types'

const registry = new Map<string, Command>()

export function registerCommand(cmd: Command): void {
  registry.set(cmd.name, cmd)
  cmd.aliases?.forEach((alias) => registry.set(alias, cmd))
}

export function executeCommand(input: string): CommandResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { type: 'output', lines: [] }
  }

  const parts = trimmed.toLowerCase().split(/\s+/)
  const name = parts[0]
  const args = parts.slice(1)

  // Support multi-word commands like "git blame", "cat cv", "rm -rf /"
  const twoWordKey = parts.slice(0, 2).join(' ')
  const cmd = registry.get(twoWordKey) ?? registry.get(name)

  if (!cmd) {
    return {
      type: 'output',
      lines: [
        {
          content: `command not found: ${name}. type 'help' for available commands.`,
          style: 'error',
        },
      ],
    }
  }

  return cmd.handler(args, trimmed)
}

export function getAllCommands(): Command[] {
  return [...new Set(registry.values())]
}

export function hasCommand(input: string): boolean {
  const parts = input.trim().toLowerCase().split(/\s+/)
  const twoWordKey = parts.slice(0, 2).join(' ')
  return registry.has(twoWordKey) || registry.has(parts[0])
}
