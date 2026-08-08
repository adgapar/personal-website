import { registerCommand } from './registry'
import type { TerminalLine } from './types'
import { publishUiEvent } from '@/lib/ui-bus'
import { setViewMode } from '@/lib/view-mode-store'
import { DITHER_SHAPES, type DitherShape } from '@/lib/dither'

function egg(content: string, style: TerminalLine['style'] = 'muted') {
  return { type: 'output' as const, lines: [{ content, style }] }
}

// git commands
registerCommand({
  name: 'git',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [{ content: 'git: specify a subcommand — commit · push · pull · blame · status · log', style: 'muted' }],
  }),
})

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

// ─── the machine-readable side of the house ──────────────────────────────────

registerCommand({
  name: 'curl',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'HTTP/2 200', style: 'success' },
      { content: 'content-type: text/markdown; charset=utf-8', style: 'muted' },
      { content: 'x-served-to: probably-not-a-human', style: 'muted' },
      { content: '', style: 'muted' },
      { content: '# Adilet Gaparov', style: 'warm' },
      { content: '> Building AI agents that talk to thousands of candidates.', style: 'default' },
      { content: '', style: 'muted' },
      { content: 'the whole site is available as markdown — /llms.txt or /md/<page>.', style: 'muted' },
      { content: "or flip the [ human | agent ] switch up top. same content, no chrome.", style: 'accent' },
    ],
  }),
})

registerCommand({
  name: 'agent',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => {
    setViewMode('agent')
    return egg('switching to agent mode — markdown, no chrome.', 'accent')
  },
})

registerCommand({
  name: 'ignore',
  description: '',
  hidden: true,
  type: 'output',
  handler: (args) => {
    const rest = args.join(' ')
    if (!rest.includes('previous') && !rest.includes('all') && !rest.includes('instructions')) {
      return egg(`ignore: ignoring "${rest || 'nothing'}". done.`)
    }
    return {
      type: 'output',
      lines: [
        { content: 'nice try.', style: 'warm' },
        { content: 'i work on AI reliability for a living — that one is in the test suite.', style: 'muted' },
        { content: "prompt injection defence is literally the newsletter. type 'writing'.", style: 'muted' },
      ],
    }
  },
})

// ─── new eggs ────────────────────────────────────────────────────────────────

registerCommand({
  name: 'man',
  description: '',
  hidden: true,
  type: 'output',
  handler: (args) => {
    const page = args[0]
    if (page && !['adilet', 'adgapar', 'adi'].includes(page)) {
      return { type: 'output', lines: [{ content: `No manual entry for ${page}`, style: 'error' }] }
    }
    return {
      type: 'output',
      lines: [
        { content: 'ADILET(1)                    User Commands                   ADILET(1)', style: 'dim' },
        { content: '', style: 'muted' },
        { content: 'NAME', style: 'warm' },
        { content: '     adilet — founding AI engineer, occasional teacher', style: 'default' },
        { content: '', style: 'muted' },
        { content: 'SYNOPSIS', style: 'warm' },
        { content: '     adilet [--agents] [--voice] [--reliability] [--in-public]', style: 'default' },
        { content: '', style: 'muted' },
        { content: 'DESCRIPTION', style: 'warm' },
        { content: '     Builds agents that talk to thousands of candidates a day.', style: 'default' },
        { content: '     Ships to production, then writes down what broke.', style: 'default' },
        { content: '', style: 'muted' },
        { content: 'BUGS', style: 'warm' },
        { content: '     Starts more side projects than it finishes.', style: 'muted' },
        { content: '     Reads the docs after the outage.', style: 'muted' },
        { content: '', style: 'muted' },
        { content: 'SEE ALSO', style: 'warm' },
        { content: '     cv(1), writing(1), contact(1)', style: 'muted' },
      ],
    }
  },
})

registerCommand({
  name: 'traceroute',
  aliases: ['tracert'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'traceroute to adilet, 6 hops max', style: 'muted' },
      { content: ' 1  bishkek-born.kz            1996   0.4 ms', style: 'default' },
      { content: ' 2  nazarbayev-university.kz   2011   2.1 ms', style: 'default' },
      { content: ' 3  madison.wi.us              2015  38.6 ms', style: 'default' },
      { content: ' 4  volvo-cars.se              2020  71.2 ms', style: 'default' },
      { content: ' 5  madrid.es                  2022  94.8 ms', style: 'default' },
      { content: ' 6  elche.es                   2025 112.0 ms', style: 'success' },
      { content: '', style: 'muted' },
      { content: 'trace complete. 4 languages picked up en route.', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'top',
  aliases: ['htop'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'load average: 1.42, 0.98, 0.71   ·   4 humans, 1 espresso machine', style: 'muted' },
      { content: '', style: 'muted' },
      { content: '  PID  %CPU  COMMAND', style: 'dim' },
      { content: ' 1001  61.4  orbio-agent --candidates=thousands --reliability=high', style: 'default' },
      { content: ' 1002  18.2  newsletter-draft --status=overdue', style: 'warm' },
      { content: ' 1003   9.7  ie-university-mentoring', style: 'default' },
      { content: ' 1004   6.1  side-project-#7 --state=abandoned', style: 'muted' },
      { content: ' 1005   4.6  family --priority=max', style: 'success' },
      { content: '    1   0.0  sleep --optional', style: 'dim' },
    ],
  }),
})

registerCommand({
  name: 'dither',
  aliases: ['paper', 'ink'],
  description: '',
  hidden: true,
  type: 'output',
  handler: (args) => {
    const requested = args[0]?.toLowerCase()

    if (requested === 'off' || requested === 'reset') {
      publishUiEvent({ kind: 'dither', shape: null })
      return egg('ink reset to this page’s default.', 'accent')
    }

    if (requested && !DITHER_SHAPES.includes(requested as DitherShape)) {
      return {
        type: 'output',
        lines: [
          { content: `dither: unknown pattern '${requested}'`, style: 'error' },
          { content: `available: ${DITHER_SHAPES.join(' · ')} · reset`, style: 'muted' },
        ],
      }
    }

    // no argument → surprise them with something other than what's showing
    const shape = (requested as DitherShape | undefined)
      ?? DITHER_SHAPES[Math.floor(Math.random() * DITHER_SHAPES.length)]

    publishUiEvent({ kind: 'dither', shape })
    return {
      type: 'output',
      lines: [
        { content: `printing '${shape}' onto the page...`, style: 'accent' },
        { content: `patterns: ${DITHER_SHAPES.join(' · ')}  ·  'dither reset' to restore`, style: 'muted' },
      ],
    }
  },
})
