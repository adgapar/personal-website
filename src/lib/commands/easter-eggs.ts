import { registerCommand } from './registry'
import type { TerminalLine } from './types'

function egg(content: string, style: TerminalLine['style'] = 'muted') {
  return { type: 'output' as const, lines: [{ content, style }] }
}

// git commands
registerCommand({
  name: 'git commit',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('on branch main. nothing to commit. everything is intentional.'),
})

registerCommand({
  name: 'git push',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('pushed. the internet has been updated.'),
})

registerCommand({
  name: 'git pull',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('already up to date.'),
})

registerCommand({
  name: 'git blame',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('blame: adilet gaparov — he ships, sometimes too fast'),
})

registerCommand({
  name: 'git status',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'modified:   career.md', style: 'muted' },
      { content: 'modified:   life.md', style: 'muted' },
      { content: 'untracked:  next-thing/', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'git log',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'commit a1b2c3d', style: 'accent' },
      { content: 'Author: Adilet Gaparov', style: 'muted' },
      { content: 'Date:   a long time ago on the steppe', style: 'muted' },
      { content: '', style: 'default' },
      { content: '    initial commit: born in Kazakhstan, raised on the steppe', style: 'default' },
    ],
  }),
})

// system easter eggs
registerCommand({
  name: 'sudo',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('nice try.'),
})

registerCommand({
  name: 'sudo !!',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('i said no.'),
})

registerCommand({
  name: 'rm -rf /',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('lol, no.'),
})

registerCommand({
  name: 'rm',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('lol, no.'),
})

registerCommand({
  name: 'vim',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("you're already in one."),
})

registerCommand({
  name: 'nano',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('downgrading to nano? bold choice.'),
})

registerCommand({
  name: 'exit',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("you can't leave. we've been here for years."),
})

registerCommand({
  name: 'logout',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("you can't leave. we've been here for years."),
})

registerCommand({
  name: 'make coffee',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("brewing... ☕ done. it's on your end though."),
})

registerCommand({
  name: 'kill -9',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('process not found: yourself'),
})

registerCommand({
  name: 'whoami',
  description: '',
  hidden: true,
  type: 'output',
  handler: () =>
    egg('adilet gaparov. founding ai engineer. digital nomad. dad. kazakh. 24 countries and counting.'),
})

registerCommand({
  name: 'ping',
  description: '',
  hidden: true,
  type: 'output',
  handler: (args) => {
    if (args[0] === 'adgapar.dev') {
      return egg('64 bytes from adgapar.dev: icmp_seq=1 ttl=64 time=0.0 ms (it\'s right here)')
    }
    return egg('pong')
  },
})

registerCommand({
  name: 'ssh',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('connection refused. go knock.'),
})

registerCommand({
  name: 'uptime',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('up 30+ years, 4 languages loaded, 1 family running, 0 regrets'),
})

registerCommand({
  name: 'history',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('cloud @ microsoft → ml @ volvo → risk @ capchase → ai @ orbio → ???'),
})

registerCommand({
  name: 'hello',
  aliases: ['hi', 'hey'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('hey 👋 type `help` to see what this terminal can do.', 'accent'),
})

registerCommand({
  name: 'yes',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: Array.from({ length: 20 }, () => ({ content: 'y', style: 'muted' as const })),
  }),
})

registerCommand({
  name: 'cat',
  description: '',
  hidden: true,
  type: 'output',
  handler: (args) => {
    if (args[0] !== 'cv') {
      return { type: 'output', lines: [{ content: `cat: ${args[0] ?? ''}: no such file`, style: 'error' }] }
    }
    return { type: 'output', lines: [] }
  },
})
