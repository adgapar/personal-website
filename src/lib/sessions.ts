import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import type { TerminalLine } from './commands/types'

export type TableRow = { cols: string[]; href?: string }
export type ListItem = {
  title: string
  tag?: string
  tagStyle?: 'accent' | 'warm' | 'success' | 'muted'
  meta: string
  status?: string
  /** second line, so a list reads without opening anything */
  summary?: string
  /** clicking the row runs this command */
  run?: string
}
export type LogEntry = {
  date: string
  tag?: string
  content: string
  href?: string
  /** used instead of href in the markdown views, so agents get the source */
  mdHref?: string
}

export type SessionBlock = {
  id?: string       // optional in-page destination
  cmd?: string        // if set, renders "$ cmd" above output
  mdHeading?: string  // section heading used by the markdown/agent view
  mdSkip?: boolean    // terminal-only chrome, omitted from markdown
  /** the mirror of mdSkip: agents get it, the terminal does not. For content
   *  that is worth indexing in full but would bury a session in listing. */
  termSkip?: boolean
  lines: TerminalLine[]
  /** a button in the output — runs a command, the way clicking a list row does */
  action?: { label: string; run: string; hint?: string }
  linkRow?: boolean   // render lines as inline text links
  avatar?: string     // if set, renders a small profile image above lines
  table?: {           // columnar table
    headers: string[]
    rows: TableRow[]
    hint?: string
    colWidths?: string[]  // override the default column widths
  }
  list?: {            // two-line list: title + meta row + optional status
    items: ListItem[]
    hint?: string
  }
  log?: {             // dated log entries with optional tag badge
    entries: LogEntry[]
  }
}

export type PageCommand = {
  name: string
  description: string
}

export type PageSession = {
  blocks: SessionBlock[]
  prompt: string
  commands: PageCommand[]  // shown in help + used for validation
  placeholder?: string
}

/**
 * No session header on any tab, and both halves of it were saying something the
 * reader had already been told. The machine boots once, at the door, with a
 * screen of its own — a second "loading writing... done" on every tab click is
 * not a machine starting up, it is a page pretending to. And "type 'help'" is
 * already sitting in the prompt's own placeholder, one line below where it was
 * printed.
 *
 * The play tab is the exception, and for the opposite reason: nothing is loaded
 * there, so the banner is the only thing that says what the shell is. See below.
 */

// ─── Homepage ────────────────────────────────────────────────────────────────

const updatesBlock: SessionBlock = {
  id: 'updates',
  cmd: 'tail updates.log',
  mdHeading: 'updates',
  lines: [],
    log: { entries: [
      { date: '2026-07', tag: 'writing', content: 'What kind of poker player is an AI?', href: 'https://theworkingprototype.substack.com/p/what-kind-of-poker-player-is-an-ai' },
      { date: '2026-06', tag: 'writing', content: 'Riding the wave', href: '/blog/riding-the-wave' },
      { date: '2026-02', tag: 'talk', content: '10,000 interviews without a human 🇰🇿', href: 'https://www.youtube.com/watch?v=_5IoO2fA1FM' },
      { date: '2025-12', tag: 'life', content: 'My sister visited Elche. First time together since Chicago, 2017.' },
      { date: '2025-02', tag: 'life', content: 'Madrid → Elche. Traded traffic for sunshine.' },
    ] },
}

export const homeSession: SessionBlock[] = [
  {
    cmd: 'whois adilet',
    mdHeading: 'about',
    avatar: '/profile.jpg',
    lines: [
      { content: 'Adilet Gaparov · Adi', style: 'warm' },
      { content: profile.bio, style: 'default' },
      { content: 'From Kazakhstan 🇰🇿. At home in Elche 🇪🇸 with my family of four.', style: 'muted' },
    ],
  },
  {
    cmd: 'cat about.txt',
    mdHeading: 'what keeps me busy',
    lines: [
      { content: 'I came to agents through cloud at Microsoft, ML at Volvo Cars, and software and risk models at Capchase. I like building things that get used, then figuring out where they break.', style: 'quote' },
      { content: 'I write The Working Prototype about practical AI, and a blog about learning, building, and life outside work. Small projects have a habit of turning into apps.', style: 'quote' },
    ],
  },
  {
    cmd: 'ls studio/',
    mdHeading: 'explore',
    lines: [
      { label: 'projects', content: 'Tapas, Teya, and other experiments', href: '/projects', style: 'accent' },
      { label: 'writing', content: 'essays & The Working Prototype', href: '/reader', style: 'accent' },
      { label: 'background', content: 'the path from cloud to AI agents', href: '/cv', style: 'accent' },
    ],
  },
  {
    mdHeading: 'say hello',
    linkRow: true,
    lines: [
      { content: 'email me', href: `mailto:${profile.email}` },
      { content: 'X', href: profile.links.twitter },
      { content: 'Substack', href: profile.links.newsletter },
      { content: 'GitHub', href: profile.links.github },
      { content: 'LinkedIn', href: profile.links.linkedin },
      { content: 'more ways to connect', href: '/contact' },
    ],
  },
  updatesBlock,
]

// ─── About (same content as home, no animation) ──────────────────────────────

export const aboutSession: SessionBlock[] = homeSession

// ─── CV ───────────────────────────────────────────────────────────────────────

export const cvSession: SessionBlock[] = [
  {
    cmd: 'cat background.txt',
    mdHeading: 'background',
    lines: [
      { content: 'Cloud at Microsoft, ML at Volvo Cars, software and risk models at Capchase. Now I’m a founding AI engineer at Orbio AI, building AI products and the systems behind them.', style: 'quote' },
    ],
  },
  {
    cmd: 'ls work',
    mdHeading: 'work',
    lines: [],
    list: {
      items: [
        { title: 'Founding AI Engineer', tag: 'Orbio AI 🇪🇸',      tagStyle: 'accent', meta: 'Apr 2025 –',     status: 'current' },
        { title: 'Global Mentor',        tag: 'IE University 🇪🇸', tagStyle: 'warm',   meta: 'Jul 2023 –',   status: 'current' },
        { title: 'Software Engineer',    tag: 'Capchase 🇪🇸',      tagStyle: 'accent', meta: 'Apr 2022–2025', status: 'past' },
        { title: 'Bootcamp Instructor',  tag: 'outpeer.kz 🌍',     tagStyle: 'warm',   meta: 'Aug 2022–2025', status: 'past' },
        { title: 'Data Scientist',       tag: 'Volvo Cars 🇸🇪',    tagStyle: 'muted',  meta: 'Aug 2020–2022', status: 'past' },
        { title: 'Sales Engineer',       tag: 'Microsoft 🇰🇿',     tagStyle: 'muted',  meta: 'May 2016–2018', status: 'past' },
      ],
      hint: "type 'open <name>' or 'open work/<n>'  ·  e.g. open orbio  ·  open work/1",
    },
  },
  {
    cmd: 'ls -l ./projects/',
    termSkip: true,
    mdHeading: 'projects',
    lines: [],
    list: {
      items: projects.map((p) => ({
        title: p.name,
        tag: p.type,
        tagStyle: p.tagStyle,
        meta: '',
        status: p.status,
        summary: p.summary,
        run: `open ${p.id}`,
      })),
      hint: "click a row for detail  ·  or type 'open <name>'  ·  e.g. open teya",
    },
  },
  {
    mdSkip: true,
    lines: [],
    action: { label: 'browse projects ↗', run: 'projects', hint: 'tools and experiments in their own window' },
  },
  {
    cmd: 'ls education',
    mdHeading: 'education',
    lines: [],
    table: {
      headers: ['degree', 'school', 'period'],
      rows: [
        { cols: ['MSc Business Analytics & Big Data', 'IE University 🇪🇸',           '2019 – 2020'] },
        { cols: ['BSc Robotics & Mechatronics',       'Nazarbayev University 🇰🇿',   '2011 – 2016'] },
        { cols: ['Visiting International Student',    'U. of Wisconsin-Madison 🇺🇸', '2015'] },
      ],
    },
  },
  {
    cmd: 'whereis adilet',
    mdHeading: 'elsewhere',
    lines: [
      { label: 'linkedin', content: 'the formal version, with dates', style: 'default', href: profile.links.linkedin },
      { label: 'github',   content: 'the code', style: 'default', href: profile.links.github },
    ],
  },
]

// ─── Writing (blog + newsletter) ─────────────────────────────────────────────

// Deliberately empty here: every block needs the post counts, which come off
// the filesystem in ./writing-page.
export const writingSession: SessionBlock[] = []

// ─── Play ───────────────────────────────────────────────────────────────────

export const playSession: SessionBlock[] = [
  {
    mdSkip: true,
    lines: [
      { content: 'A shell with a sense of humor.', style: 'warm' },
      { content: 'Try a tool you use every day. Some work. Some talk back.', style: 'muted' },
      { label: 'start here', content: '', chips: ['help', 'fortune', 'snake', 'paint'] },
    ],
  },
]

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSession: SessionBlock[] = [
  {
    cmd: 'nmap adgapar',
    mdHeading: 'contact',
    lines: [
      { content: 'Host is up. Say hello about something you’re building, something I wrote, or just because.', style: 'success' },
    ],
  },
  {
    mdHeading: 'channels',
    lines: [],
    table: {
      headers: ['port', 'state', 'service'],
      rows: [
        { cols: ['email',      'open',     'direct conversations'],      href: `mailto:${profile.email}` },
        { cols: ['twitter',    'open',     'thinking out loud · public'], href: profile.links.twitter },
        { cols: ['linkedin',   'open',     'professional network'],       href: profile.links.linkedin },
        { cols: ['github',     'open',     'code · building together'],   href: profile.links.github },
        { cols: ['threads',    'open',     'casual · low stakes'],        href: profile.links.threads },
        { cols: ['substack',   'open',     'The Working Prototype'],      href: profile.links.newsletter },
        { cols: ['cold-sales', 'filtered', '—'] },
      ],
    },
  },
]

// ─── Page sessions (blocks + prompt + available commands) ────────────────────

export const aboutPage: PageSession = {
  blocks: aboutSession,
  prompt: 'adilet@studio:~$',
  commands: [
    { name: 'whois adilet', description: 'show profile info' },
  ],
  placeholder: "try projects, writing, or help",
}

export const cvPage: PageSession = {
  blocks: cvSession,
  prompt: 'adilet@cv:~$',
  commands: [
    { name: 'cv',   description: 'view full résumé' },
    { name: 'open', description: 'expand any entry  ·  e.g. open orbio  ·  open work/1' },
  ],
  placeholder: "try 'open orbio' — type 'help'",
}

export const writingPage: PageSession = {
  blocks: writingSession,
  prompt: 'adilet@writing:~$',
  commands: [
    { name: 'reader', description: 'open the reader — the posts, as pages' },
  ],
  placeholder: "try 'reader' — type 'help'",
}

export const playPage: PageSession = {
  blocks: playSession,
  prompt: 'adilet@play:~$',
  commands: [],
  // short, because the block above now carries the long version as a hint and
  // a placeholder that runs off the end of a phone's input is a worse invitation
  // than no placeholder at all
  placeholder: 'type anything',
}

export const contactPage: PageSession = {
  blocks: contactSession,
  prompt: 'adilet@contact:~$',
  commands: [],
  placeholder: "navigate — type 'help'",
}

// ─── Page registry ───────────────────────────────────────────────────────────
// One list every consumer reads from: the agent view, /llms.txt and /md/<slug>.

export type PageMeta = {
  slug: string
  route: string
  title: string
  summary: string
  session: PageSession
}

export const pageMeta = {
  about: {
    slug: 'about',
    route: '/',
    title: profile.name,
    summary: profile.bio,
    session: aboutPage,
  },
  cv: {
    slug: 'cv',
    route: '/cv',
    title: 'Background',
    summary: 'Work history, projects and education.',
    session: cvPage,
  },
  writing: {
    slug: 'writing',
    route: '/writing',
    title: 'Writing',
    summary: 'Blog and newsletter.',
    session: writingPage,
  },
  contact: {
    slug: 'contact',
    route: '/contact',
    title: 'Contact',
    summary: 'How to reach me.',
    session: contactPage,
  },
} satisfies Record<string, PageMeta>

export const pages: PageMeta[] = Object.values(pageMeta)

export const playMeta: PageMeta = {
  slug: 'play',
  route: '/play',
  title: 'Play',
  summary: 'An empty shell. Nothing to read — it is for typing in.',
  session: playPage,
}

export function pageBySlug(slug: string): PageMeta | undefined {
  return pages.find((p) => p.slug === slug)
}
