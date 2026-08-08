import type { TerminalLine } from '@/lib/commands/types'

export type Project = {
  id: string
  name: string
  type: string
  /** shown inline in the list, so nothing has to be opened to get the gist */
  summary: string
  tagStyle?: 'accent' | 'warm' | 'success' | 'muted'
  status: string
  details: TerminalLine[]
}

export const projects: Project[] = [
  {
    id: 'teya',
    name: 'Teya',
    type: 'home AI 🏠',
    tagStyle: 'accent',
    status: 'live',
    summary: 'a family agent for the home, running on a spare Android phone',
    details: [
      { label: 'name',   content: 'Teya', style: 'warm' },
      { label: 'type',   content: 'home AI agent  ·  Kotlin / Android', style: 'muted' },
      { label: 'status', content: 'live', style: 'success' },
      { label: '',       content: 'A warm, intelligent presence for the household — one that listens, understands, remembers, and does. A home should feel like it is looking after you, because it knows you.', style: 'default' },
      { label: '',       content: 'The idea that makes it buildable: a cheap Android phone is a supercharged Arduino, consumer-ready out of the box. Display, mic, speaker, GPS, calendar, and it can call a model directly. No server, no local agent stack.', style: 'muted' },
      { label: 'code',   content: 'github.com/adgapar/teya', style: 'accent', href: 'https://github.com/adgapar/teya' },
      { label: 'write-up', content: 'teya — how and why I built it', style: 'accent', href: '/blog/teya-intro' },
    ],
  },
  {
    id: 'blog',
    name: 'the blog',
    type: 'writing 🌍',
    tagStyle: 'warm',
    status: 'live',
    summary: 'essays on learning, building in public, and figuring things out',
    details: [
      { label: 'name',   content: 'the blog', style: 'warm' },
      { label: 'type',   content: 'personal blog  ·  self-hosted', style: 'muted' },
      { label: 'status', content: 'live', style: 'success' },
      { label: '',       content: 'Learning, AI, and building in public.', style: 'default' },
      { label: 'read',   content: 'every post, here', style: 'accent', href: '/writing' },
    ],
  },
  {
    id: 'newsletter',
    name: 'The Working Prototype',
    type: 'writing 🌍',
    tagStyle: 'warm',
    status: 'live',
    summary: 'newsletter on AI reliability and alignment, from a practitioner',
    details: [
      { label: 'name',   content: 'The Working Prototype', style: 'warm' },
      { label: 'type',   content: 'newsletter', style: 'muted' },
      { label: 'status', content: 'live', style: 'success' },
      { label: '',       content: 'Newsletter on practical AI and building with it.', style: 'default' },
      { label: 'url',    content: 'theworkingprototype.substack.com', style: 'accent', href: 'https://theworkingprototype.substack.com/' },
    ],
  },
  {
    id: 'consulting',
    name: 'BI Consulting',
    type: 'consulting 🇸🇪',
    tagStyle: 'muted',
    status: 'past',
    summary: 'data pipelines, dashboards and analytics for a Swedish company',
    details: [
      { label: 'name',   content: 'BI Consulting', style: 'warm' },
      { label: 'type',   content: 'consulting', style: 'muted' },
      { label: 'period', content: 'Jan 2024 – Feb 2025', style: 'muted' },
      { label: 'status', content: 'past', style: 'muted' },
      { label: '',       content: 'Data engineering and BI for a Swedish company. End-to-end pipelines, dashboards, and analytics infrastructure.', style: 'default' },
    ],
  },
  {
    id: 'ai-consulting',
    name: 'AI Consulting',
    type: 'consulting 🌍',
    tagStyle: 'muted',
    status: 'past',
    summary: 'agents for others — video analysis, moderation, an AI tutor',
    details: [
      { label: 'name',   content: 'AI Consulting', style: 'warm' },
      { label: 'type',   content: 'consulting', style: 'muted' },
      { label: 'period', content: 'Jun – Dec 2024', style: 'muted' },
      { label: 'status', content: 'past', style: 'muted' },
      { label: '',       content: 'Building AI agents for others.', style: 'default' },
      { label: '',       content: '· TikTok video analyzer for a marketing startup', style: 'muted' },
      { label: '',       content: '· Content moderation service', style: 'muted' },
      { label: '',       content: '· AI tutor for a coding bootcamp', style: 'muted' },
    ],
  },
]
