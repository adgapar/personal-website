import { listCommands, registerCommand } from './registry'
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
    lines: [
      { content: 'git: specify a subcommand', style: 'muted' },
      // the reply teaches its own vocabulary, and each word is the next tap
      { content: '', chips: ['git commit', 'git push', 'git pull', 'git blame', 'git status', 'git log'] },
    ],
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
    if (args[0] === 'adilet.fyi') {
      return egg("64 bytes from adilet.fyi: icmp_seq=1 ttl=64 time=0.0 ms (it's right here)")
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
  // The real one prints `y` on its own line until you stop it, which is the
  // whole joke — it is the program you pipe into something that keeps asking
  // for confirmation. Twenty lines and then the interrupt: without the `^C`
  // the output looks like a bug rather than like a command that had to be
  // stopped, and the `^C` is the part that says which.
  handler: () => ({
    type: 'output',
    lines: [
      ...Array.from({ length: 20 }, () => ({ content: 'y', style: 'muted' as const })),
      { content: '^C', style: 'dim' as const },
    ],
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

// ─── what people type into terminals in 2026 ─────────────────────────────────
// The picture does the work. One line after it, like every other egg here.

registerCommand({
  name: 'claude',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'Claude Monet  ·  Impression, Sunrise  ·  1872', style: 'warm' },
      {
        content: '',
        image: {
          src: '/art/monet-impression-sunrise.jpg',
          alt: 'Claude Monet, Impression, Sunrise, 1872',
          caption: 'hover for the colours',
          ratio: 900 / 698,
        },
      },
      { content: 'you probably meant the other Claude. it also makes pictures.', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'codex',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'codex  ·  a book with pages', style: 'warm' },
      {
        content: '',
        image: {
          src: '/art/book-of-kells-chi-rho.jpg',
          alt: 'The Chi Rho page from the Book of Kells, around 800 AD',
          caption: 'Book of Kells, c. 800  ·  hover for the gold',
          ratio: 700 / 927,
        },
      },
      { content: 'it replaced scrolls. then we invented scrolling again.', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'gemini',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'Gemini  ·  the twins', style: 'warm' },
      {
        content: '',
        image: {
          src: '/art/gemini-uranias-mirror.jpg',
          alt: "Gemini from Urania's Mirror, 1824",
          caption: "Urania's Mirror, 1824  ·  hover for the colours",
          ratio: 900 / 629,
        },
      },
      { content: 'a star sign. up there a few thousand years before the chatbot.', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'cursor',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('latin for "runner". it slid along a slide rule before it learned to blink.'),
})

// same joke, one line, no picture needed
registerCommand({
  name: 'zoom',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("you're on mute."),
})

registerCommand({
  name: 'go',
  aliases: ['lfg'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'the board game. 2,500 years old, and it still took a lab to win one.', style: 'muted' },
      { content: "also, increasingly: let's fucking go.", style: 'warm' },
    ],
  }),
})

registerCommand({
  name: 'python',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('still the one I reach for. the snake, though — why would you keep one as a pet?'),
})

registerCommand({
  name: 'rust',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('what happens to iron left out. also to my attempt at learning it.'),
})

registerCommand({
  name: 'brew',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'coffee is downstairs. always specialty, mostly filter or cold brew.', style: 'muted' },
      { content: 'once paid €8 for a single cup. no further questions.', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'docker',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('the shipping container did it first. same box, any ship, any crane.'),
})

registerCommand({
  name: 'slack',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('cut me some.'),
})

registerCommand({
  name: 'notion',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("an idea you haven't committed to yet."),
})

registerCommand({
  name: 'swift',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('a bird that sleeps mid-flight. months without landing.'),
})

registerCommand({
  name: 'java',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('an island first. coffee second.'),
})

registerCommand({
  name: 'ruby',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("the red one. july's stone."),
})

registerCommand({
  name: 'perl',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('named after a pearl. the good spelling was taken.'),
})

// ─── the javascript end of the shelf ─────────────────────────────────────────

registerCommand({
  name: 'npm',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('officially not an acronym. their own site invents a new expansion every reload.'),
})

registerCommand({
  name: 'npm install',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'downloading the internet...', style: 'muted' },
      { content: 'added 1,284 packages. one of them checks whether a number is even.', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'pnpm',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('npm, but it stops keeping four copies of everything. this site uses it.'),
})

registerCommand({
  name: 'node',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('a knot. a joint. a place where lines meet. now: the thing running all of it.'),
})

registerCommand({
  name: 'deno',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('node, rearranged. same author, second attempt.'),
})

registerCommand({
  name: 'bun',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('bread. small, warm, faster than expected.'),
})

registerCommand({
  name: 'javascript',
  aliases: ['js'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('nothing to do with java. that was a marketing decision in 1995.'),
})

registerCommand({
  name: 'typescript',
  aliases: ['ts'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('javascript that tells you before it fails, instead of after.'),
})

registerCommand({
  name: 'react',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('to respond to something. usually an incident. this page is built with it.'),
})

registerCommand({
  name: 'vercel',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('where this is deployed. hello from the edge, wherever that is today.'),
})

// ─── the ones actually in daily use ──────────────────────────────────────────

registerCommand({
  name: 'uv',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("ultraviolet: light past what your eyes handle. also the only package manager I never wait for."),
})

registerCommand({
  name: 'uv run',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('already finished.'),
})

registerCommand({
  name: 'uv sync',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('done. checked again — still done.'),
})

registerCommand({
  name: 'uv pip',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('installed before you finished typing it. that is the whole joke.'),
})

registerCommand({
  name: 'ruff',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('a pleated collar, 16th century. now: the thing with opinions about your imports.'),
})

// ─── the rest of the filesystem ──────────────────────────────────────────────

registerCommand({
  name: 'touch',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('creates an empty file. that is the whole command.'),
})

registerCommand({
  name: 'touch grass',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("it's outside. past the door, left at the terminal."),
})

registerCommand({
  name: 'mv',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('moved: kazakhstan → sweden → spain. the command was faster.'),
})

registerCommand({
  name: 'cd',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg("there is one directory here, and you're standing in it."),
})

registerCommand({
  name: 'mkdir',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('made. empty, like the last one.'),
})

registerCommand({
  name: 'chmod',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('you already have permission.'),
})

registerCommand({
  name: 'cp',
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('copied. now there are two of whatever that was.'),
})

// ─── one at random, for whoever cannot be bothered to guess ──────────────────

/**
 * `fortune`, which is a real thing a shell has had since 1979 and which does
 * exactly this: prints something you did not ask for.
 *
 * It exists for the phone. The whole premise of the play tab is "type a tool you
 * use every day and it answers back", which is a guessing game whose input
 * device is a keyboard — fine on a desk, and on glass it is a spelling test with
 * a joke as the prize. This is the same game with the typing taken out. It does
 * not print the list, so the surprise survives: you never learn how many there
 * are, only that there was another one.
 *
 * Anything with a side effect stays out of the pool. A random command that
 * switches the whole page to agent mode, repaints the desk, or ends the session
 * is not a fortune, it is a trap.
 */
const NOT_A_FORTUNE = new Set([
  'fortune',  // no
  'eggs',     // the index, which is the one thing this must not hand over
  'clear',    // empties the scrollback that just told you what happened
  'agent',    // switches the whole page out from under you
  'dither',   // repaints the desk
  'exit',
  'logout',
  'history',  // prints your own session back at you — hollow at random
  'man',      // wants an argument
  'git',      // a stub that asks for a subcommand
])

registerCommand({
  name: 'fortune',
  aliases: ['lucky'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => {
    const pool = listCommands().filter(
      (c) => c.hidden && c.type === 'output' && !NOT_A_FORTUNE.has(c.name),
    )
    const pick = pool[Math.floor(Math.random() * pool.length)]
    if (!pick) return egg('nothing happens.')

    const rolled = pick.handler([], pick.name)
    return {
      type: 'output',
      // echoed as a command, because that is what it is — the reader should see
      // which one came up and be able to type it themselves next time
      lines: [{ content: pick.name, style: 'command' }, ...(rolled.lines ?? [])],
    }
  },
})

// ─── the index, for the person who wrote them ────────────────────────────────

/**
 * Not a secret — this ships in the bundle, so anyone determined can read it.
 * It is a lock on a door, so the list is not the first thing a visitor trips
 * over, and so I can check what exists without opening the source.
 */
const EGGS_KEY = '42'

registerCommand({
  name: 'eggs',
  aliases: ['secrets'],
  description: '',
  hidden: true,
  type: 'output',
  handler: (args) => {
    if (args[0] !== EGGS_KEY) {
      return {
        type: 'output',
        lines: [
          { content: 'eggs: locked.', style: 'muted' },
          { content: 'usage: eggs <the answer>', style: 'dim' },
          { content: 'to life, the universe, and everything.', style: 'dim' },
        ],
      }
    }

    const hidden = listCommands()
      .filter((c) => c.hidden && c.name !== 'eggs')
      .map((c) => c.name)
      .sort()

    // Was three to a row, each padEnd(26) — a 78-character block laid out for a
    // window that is always wide enough. A phone gives it 45, so the reveal at
    // the end of the riddle arrived as a wrapped mess. As a list it flows to
    // whatever width it has, and every one of them runs itself, which on a
    // touchscreen is the difference between a list and an inventory of things
    // to go and spell.
    return {
      type: 'output',
      lines: [
        { content: `${hidden.length} hidden commands`, style: 'warm' },
        { content: '', style: 'muted' },
        { content: '', chips: hidden },
        { content: '', style: 'muted' },
        { content: 'two-word ones need both words.', style: 'dim' },
      ],
    }
  },
})

// the original hidden command, from Colossal Cave Adventure (1977). its real
// response when you use it in the wrong place is exactly this.
registerCommand({
  name: 'xyzzy',
  aliases: ['plugh'],
  description: '',
  hidden: true,
  type: 'output',
  handler: () => egg('nothing happens.'),
})
