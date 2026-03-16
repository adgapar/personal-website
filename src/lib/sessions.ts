import { profile } from '@/data/profile'
import { projects } from '@/data/projects'
import type { TerminalLine } from './commands/types'

export type TableRow = { cols: string[]; href?: string }
export type ListItem = { title: string; tag?: string; tagStyle?: 'accent' | 'warm' | 'success' | 'muted'; meta: string; status?: string }
export type LogEntry = { date: string; tag?: string; content: string; href?: string }

export type SessionBlock = {
  cmd?: string        // if set, renders "$ cmd" above output
  lines: TerminalLine[]
  linkRow?: boolean   // render lines as inline text links
  avatar?: string     // if set, renders a small profile image above lines
  table?: {           // columnar table
    headers: string[]
    rows: TableRow[]
    hint?: string
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

const D: TerminalLine = { content: '', style: 'default' }

function sectionHeader(page: string): SessionBlock {
  return {
    lines: [
      { content: `→ loading ${page}...  done`, style: 'success' },
      { content: "→ type 'help' for available commands", style: 'muted' },
    ],
  }
}

// ─── Homepage ────────────────────────────────────────────────────────────────

export const homeSession: SessionBlock[] = [
  {
    lines: [
      { content: '→ starting session...  done', style: 'success' },
      { content: "→ type 'help' for available commands", style: 'muted' },
    ],
  },
  {
    cmd: 'whois adilet',
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
    lines: [
      { content: profile.longBio, style: 'quote' },
    ],
  },
  {
    cmd: 'cat links.txt',
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
    lines: [],
    log: {
      entries: [
        { date: '2026-03', tag: 'blog',       content: 'sorry for writing so late',                                      href: 'https://www.adgapar.dev/sorry-for-writing-so-late/' },
        { date: '2026-03', tag: 'newsletter', content: 'in character',                                                   href: 'https://theworkingprototype.substack.com/p/in-character' },
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
    lines: [],
    list: {
      items: projects.map((p) => ({ title: p.name, tag: p.type, tagStyle: p.tagStyle, meta: '', status: p.status })),
      hint: "type 'open <name>' or 'open projects/<n>'  ·  e.g. open blog  ·  open projects/1",
    },
  },
  {
    cmd: 'ls education',
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

// ─── Projects ────────────────────────────────────────────────────────────────

export const projectsSession: SessionBlock[] = [
  sectionHeader('projects'),
  {
    cmd: 'ls -l ./projects/',
    lines: [],
    table: {
      headers: ['name', 'type', 'status'],
      rows: projects.map((p) => ({ cols: [p.name, p.type, p.status] })),
      hint: "type 'open 1' or 'open <name>' for details",
    },
  },
]

// ─── Writing (blog + newsletter) ─────────────────────────────────────────────

export const writingSession: SessionBlock[] = [
  sectionHeader('writing'),
  {
    cmd: 'cat blog.txt',
    lines: [
      { label: 'name',    content: 'adgapar.dev', style: 'warm', href: 'https://www.adgapar.dev' },
      { label: 'topics',  content: 'AI · learning · building in public · career · personal growth', style: 'default' },
      { label: 'format',  content: 'essays · short takes · things I\'m figuring out', style: 'muted' },
      { label: 'cadence', content: 'when inspiration strikes', style: 'muted' },
    ],
  },
  {
    cmd: 'cat newsletter.txt',
    lines: [
      { label: 'name',    content: 'The Working Prototype', style: 'warm', href: 'https://theworkingprototype.substack.com/' },
      { label: 'about',   content: 'AI alignment for people who ship — no PhD required', style: 'default' },
      { label: 'topics',  content: 'agent design · alignment in practice · production lessons', style: 'muted' },
      { label: 'format',  content: '1000–2000 words · technical enough, accessible enough', style: 'muted' },
      { label: 'cadence', content: 'monthly or more', style: 'muted' },
    ],
  },
]

// ─── Photos ───────────────────────────────────────────────────────────────────

export const photosSession: SessionBlock[] = [
  sectionHeader('photos'),
  {
    cmd: 'ls photos/',
    lines: [
      { content: '24 countries  ·  3 continents  ·  1 camera', style: 'default' },
      { content: 'gallery coming soon', style: 'muted' },
    ],
  },
]

// ─── Contact ─────────────────────────────────────────────────────────────────

export const contactSession: SessionBlock[] = [
  sectionHeader('contact'),
  {
    cmd: 'nmap adgapar',
    lines: [
      { content: 'host is up  ·  open to network, collaboration, discussions, AI conversations', style: 'success' },
    ],
  },
  {
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

export const homePage: PageSession = {
  blocks: homeSession,
  prompt: 'adilet@home:~$',
  commands: [
    { name: 'whois adilet', description: 'show profile info' },
  ],
  placeholder: "try 'whois adilet' or navigate — type 'help'",
}

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

export const projectsPage: PageSession = {
  blocks: projectsSession,
  prompt: 'adilet@projects:~$',
  commands: [
    { name: 'open', description: 'open a project  ·  e.g. open blog' },
  ],
  placeholder: "try 'open 1' or navigate — type 'help'",
}

export const writingPage: PageSession = {
  blocks: writingSession,
  prompt: 'adilet@writing:~$',
  commands: [],
  placeholder: "navigate — type 'help'",
}

export const photosPage: PageSession = {
  blocks: photosSession,
  prompt: 'adilet@photos:~$',
  commands: [],
  placeholder: "navigate — type 'help'",
}

export const contactPage: PageSession = {
  blocks: contactSession,
  prompt: 'adilet@contact:~$',
  commands: [],
  placeholder: "navigate — type 'help'",
}
