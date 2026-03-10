import { registerCommand } from './registry'
import { profile } from '@/data/profile'
import type { TerminalLine } from './types'

const DIVIDER: TerminalLine = { content: '─'.repeat(43), style: 'muted' }

registerCommand({
  name: 'help',
  description: 'list available commands',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: 'available commands', style: 'accent' },
      DIVIDER,
      { content: '  about        who i am', style: 'default' },
      { content: '  work         professional experience', style: 'default' },
      { content: '  projects     things i\'ve built', style: 'default' },
      { content: '  blog         writing at adgapar.dev', style: 'default' },
      { content: '  newsletter   the working prototype — substack', style: 'default' },
      { content: '  photos       a visual log', style: 'default' },
      { content: '  contact      get in touch', style: 'default' },
      { content: '  whois        show profile info', style: 'default' },
      { content: '  cat cv       view résumé', style: 'default' },
      { content: '  ls           list sections', style: 'default' },
      { content: '  clear        clear the terminal', style: 'default' },
      DIVIDER,
      { content: 'try something unexpected — there may be easter eggs', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'whois',
  description: 'show profile info',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: `  name        : ${profile.name} (${profile.nickname})`, style: 'default' },
      { content: `  role        : ${profile.role}`, style: 'default' },
      { content: `  org         : ${profile.org}`, style: 'default' },
      { content: `  location    : ${profile.location} 🇪🇸`, style: 'default' },
      { content: `  blog        : adgapar.dev`, style: 'default' },
      { content: `  newsletter  : theworkingprototype.substack.com`, style: 'default' },
      { content: `  languages   : EN · FR · ES · RU`, style: 'default' },
      DIVIDER,
    ],
  }),
})

registerCommand({
  name: 'clear',
  description: 'clear the terminal',
  type: 'system',
  handler: () => ({ type: 'clear' }),
})

registerCommand({
  name: 'ls',
  description: 'list sections',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      { content: 'drwxr-xr-x  about/', style: 'default' },
      { content: 'drwxr-xr-x  work/', style: 'default' },
      { content: 'drwxr-xr-x  projects/', style: 'default' },
      { content: 'drwxr-xr-x  blog/', style: 'default' },
      { content: 'drwxr-xr-x  newsletter/', style: 'default' },
      { content: 'drwxr-xr-x  photos/', style: 'default' },
      { content: 'drwxr-xr-x  contact/', style: 'default' },
      { content: '-rw-r--r--  cv', style: 'default' },
    ],
  }),
})

registerCommand({
  name: 'pwd',
  description: 'print working directory',
  type: 'output',
  hidden: true,
  handler: () => ({ type: 'output', lines: [{ content: '/home/adilet', style: 'default' }] }),
})

registerCommand({
  name: 'date',
  description: 'print current date',
  type: 'output',
  hidden: true,
  handler: () => ({ type: 'output', lines: [{ content: new Date().toLocaleString(), style: 'default' }] }),
})

registerCommand({
  name: 'uname',
  description: 'system info',
  type: 'output',
  hidden: true,
  handler: () => ({
    type: 'output',
    lines: [{ content: 'adgapar-os 1.0.0 personal-website #1 SMP · built in KZ · running in ES', style: 'default' }],
  }),
})

registerCommand({
  name: 'cat cv',
  description: 'view résumé',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: '  Adilet Gaparov — CV', style: 'accent' },
      DIVIDER,
      { content: '  experience', style: 'accent' },
      { content: '  ──────────', style: 'muted' },
      { content: '  Founding AI Engineer · Orbio AI          2024 – present', style: 'default' },
      { content: '  Building AI agents for recruitment, onboarding & experience', style: 'muted' },
      { content: '', style: 'default' },
      { content: '  ML Engineer · Capchase                   2022 – 2024', style: 'default' },
      { content: '  Risk intelligence and underwriting systems', style: 'muted' },
      { content: '', style: 'default' },
      { content: '  ML Engineer · Volvo Cars                 2021 – 2022', style: 'default' },
      { content: '  Electrification models and ML infrastructure', style: 'muted' },
      { content: '', style: 'default' },
      { content: '  Cloud Engineer · Microsoft               2019 – 2021', style: 'default' },
      { content: '  Cloud solutions across enterprise customers', style: 'muted' },
      { content: '', style: 'default' },
      { content: '  education', style: 'accent' },
      { content: '  ─────────', style: 'muted' },
      { content: '  MSc Data Science · IE School of Science & Technology', style: 'default' },
      { content: '  Mentor, graduate students', style: 'muted' },
      { content: '', style: 'default' },
      { content: '  skills', style: 'accent' },
      { content: '  ──────', style: 'muted' },
      { content: '  Python · TypeScript · LLMs · RAG · Voice AI', style: 'default' },
      { content: '  Azure · AWS · Next.js · FastAPI · PostgreSQL', style: 'default' },
      DIVIDER,
    ],
  }),
})

// alias: "cv" alone hints to use "cat cv"
registerCommand({
  name: 'cv',
  description: 'view résumé',
  type: 'output',
  hidden: true,
  handler: () => ({
    type: 'output',
    lines: [{ content: 'hint: try `cat cv`', style: 'muted' }],
  }),
})
