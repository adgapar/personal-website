import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import type { TerminalLine } from './commands/types'

export type TableRow = { cols: string[]; href?: string }
export type ListItem = { title: string; tag?: string; tagStyle?: 'accent' | 'warm' | 'success' | 'muted'; meta: string; status?: string }
export type LogEntry = { date: string; tag?: string; content: string; href?: string }

export type SessionBlock = {
  cmd?: string        // if set, renders "$ cmd" above output
  mdHeading?: string  // section heading used by the markdown/agent view
  mdSkip?: boolean    // terminal-only chrome, omitted from markdown
  lines: TerminalLine[]
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

function sectionHeader(page: string): SessionBlock {
  return {
    mdSkip: true,
    lines: [
      { content: `→ loading ${page}...  done`, style: 'success' },
      { content: "→ type 'help' for available commands", style: 'muted' },
    ],
  }
}

// ─── Homepage ────────────────────────────────────────────────────────────────

export const homeSession: SessionBlock[] = [
  {
    mdSkip: true,
    lines: [
      { content: '→ starting session...  done', style: 'success' },
      { content: "→ type 'help' for available commands", style: 'muted' },
    ],
  },
  {
    cmd: 'whois adilet',
    mdHeading: 'profile',
    avatar: '/profile.jpg',
    lines: [
      { label: 'name',     content: `${profile.name}  ·  ${profile.nickname}`, style: 'warm' },
      { label: 'role',     content: profile.role, style: 'warm' },
      { label: 'org',      content: profile.org, style: 'default' },
      { label: 'location', content: profile.location, style: 'default' },
      { label: 'focus',    content: 'AI agents · recruitment · voice AI · building in public', style: 'default' },
    ],
  },
  {
    cmd: 'cat about.txt',
    mdHeading: 'about',
    lines: [
      { content: profile.longBio, style: 'quote' },
    ],
  },
  {
    cmd: 'cat links.txt',
    mdHeading: 'links',
    linkRow: true,
    lines: [
      { content: 'github',     href: profile.links.github },
      { content: 'twitter',   href: profile.links.twitter },
      { content: 'linkedin',  href: profile.links.linkedin },
      { content: 'threads',   href: profile.links.threads },
      { content: 'blog',      href: profile.links.blog },
      { content: 'newsletter', href: profile.links.newsletter },
    ],
  },
  {
    cmd: 'tail -n 5 updates.log',
    mdHeading: 'recent',
    lines: [],
    log: {
      entries: [
        { date: '2026-07', tag: 'newsletter', content: 'what kind of poker player is an AI',                              href: 'https://theworkingprototype.substack.com/p/what-kind-of-poker-player-is-an-ai' },
        { date: '2026-06', tag: 'blog',       content: 'riding the wave',                                                 href: 'https://www.adgapar.dev/riding-the-wave/' },
        { date: '2026-02', tag: 'talk',       content: '10,000 interviews without a human 🇰🇿',                         href: 'https://www.youtube.com/watch?v=_5IoO2fA1FM' },
        { date: '2025-12',                    content: 'sister visited Elche — first time together since Chicago, 2017' },
        { date: '2025-02',                    content: 'moved from Madrid to Elche. traded traffic for sunshine.' },
      ],
    },
  },
]

// ─── About (same content as home, no animation) ──────────────────────────────

export const aboutSession: SessionBlock[] = homeSession

// ─── CV ───────────────────────────────────────────────────────────────────────

export const cvSession: SessionBlock[] = [
  sectionHeader('cv'),
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
    mdHeading: 'projects',
    lines: [],
    list: {
      items: projects.map((p) => ({ title: p.name, tag: p.type, tagStyle: p.tagStyle, meta: '', status: p.status })),
      hint: "type 'open <name>' or 'open projects/<n>'  ·  e.g. open blog  ·  open projects/1",
    },
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
]

// ─── Writing (blog + newsletter) ─────────────────────────────────────────────

export const writingSession: SessionBlock[] = [
  sectionHeader('writing'),
  {
    cmd: 'cat blog.txt',
    mdHeading: 'blog',
    lines: [
      { label: 'name',    content: 'adgapar.dev', style: 'warm', href: 'https://www.adgapar.dev' },
      { label: 'topics',  content: 'AI · learning · building in public · career · personal growth', style: 'default' },
      { label: 'format',  content: 'essays · short takes · things I\'m figuring out', style: 'muted' },
      { label: 'cadence', content: 'when inspiration strikes', style: 'muted' },
    ],
  },
  {
    cmd: 'cat newsletter.txt',
    mdHeading: 'newsletter',
    lines: [
      { label: 'name',    content: 'The Working Prototype', style: 'warm', href: 'https://theworkingprototype.substack.com/' },
      { label: 'about',   content: 'AI reliability, alignment & safety for people building agents — no PhD required', style: 'default' },
      { label: 'topics',  content: 'production lessons · research in builder language · system experiments', style: 'muted' },
      { label: 'format',  content: '1000–2000 words · technical enough, accessible enough', style: 'muted' },
      { label: 'cadence', content: 'monthly or more', style: 'muted' },
    ],
  },
]

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSession: SessionBlock[] = [
  sectionHeader('contact'),
  {
    cmd: 'nmap adgapar',
    mdHeading: 'contact',
    lines: [
      { content: 'host is up  ·  open to network, collaboration, discussions, AI conversations', style: 'success' },
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
        { cols: ['cold-sales', 'filtered', '—'] },
      ],
    },
  },
]

// ─── Page sessions (blocks + prompt + available commands) ────────────────────

export const aboutPage: PageSession = {
  blocks: aboutSession,
  prompt: 'adilet@home:~$',
  commands: [
    { name: 'whois adilet', description: 'show profile info' },
  ],
  placeholder: "try 'whois adilet' or navigate — type 'help'",
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
  commands: [],
  placeholder: "navigate — type 'help'",
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
    title: 'CV',
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

export function pageBySlug(slug: string): PageMeta | undefined {
  return pages.find((p) => p.slug === slug)
}
