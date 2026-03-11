import type { TerminalLine } from '@/lib/commands/types'

export type Project = {
  id: string
  name: string
  type: string
  tagStyle?: 'accent' | 'warm' | 'success' | 'muted'
  status: string
  details: TerminalLine[]
}

export const projects: Project[] = [
  {
    id: 'blog',
    name: 'adgapar.dev',
    type: 'writing 🌍',
    tagStyle: 'warm',
    status: 'live',
    details: [
      { label: 'name',   content: 'adgapar.dev', style: 'bright' },
      { label: 'type',   content: 'personal blog', style: 'muted' },
      { label: 'status', content: 'live', style: 'success' },
      { label: '',       content: 'Learning, AI, and building in public.', style: 'default' },
      { label: 'url',    content: 'adgapar.dev', style: 'accent', href: 'https://www.adgapar.dev' },
    ],
  },
  {
    id: 'newsletter',
    name: 'The Working Prototype',
    type: 'writing 🌍',
    tagStyle: 'warm',
    status: 'live',
    details: [
      { label: 'name',   content: 'The Working Prototype', style: 'bright' },
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
    details: [
      { label: 'name',   content: 'BI Consulting', style: 'bright' },
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
    details: [
      { label: 'name',   content: 'AI Consulting', style: 'bright' },
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
