import type { TerminalLine } from '@/lib/commands/types'

export type Job = {
  id: string
  name: string   // company name for matching
  details: TerminalLine[]
}

const D: TerminalLine = { content: '', style: 'default' }

export const jobs: Job[] = [
  {
    id: 'orbio',
    name: 'Orbio AI',
    details: [
      { label: 'role',    content: 'Founding AI Engineer', style: 'bright' },
      { label: 'company', content: 'Orbio AI', style: 'default' },
      { label: 'period',  content: 'Apr 2025 – present', style: 'muted' },
      { label: 'where',   content: 'Madrid', style: 'muted' },
      { label: 'status',  content: 'current', style: 'success' },
      D,
      { label: '',        content: 'Creating AI agents in the HR space: recruitment & onboarding.', style: 'default' },
    ],
  },
  {
    id: 'ie',
    name: 'IE University',
    details: [
      { label: 'role',    content: 'Global Mentor', style: 'bright' },
      { label: 'company', content: 'IE University of Science & Technology', style: 'default' },
      { label: 'period',  content: 'Jul 2023 – present', style: 'muted' },
      { label: 'where',   content: 'Madrid', style: 'muted' },
      { label: 'status',  content: 'current', style: 'success' },
      D,
      { label: '',        content: 'A way to stay close to my alma mater.', style: 'default' },
      { label: '',        content: 'Mentoring students from different programs as they figure out their path into tech.', style: 'default' },
      { label: '',        content: 'I share what I\'ve learned about career transitions and market shifts, one conversation at a time.', style: 'muted' },
    ],
  },
  {
    id: 'capchase',
    name: 'Capchase',
    details: [
      { label: 'role',    content: 'Software Engineer', style: 'bright' },
      { label: 'company', content: 'Capchase', style: 'default' },
      { label: 'period',  content: 'Apr 2022 – Apr 2025', style: 'muted' },
      { label: 'where',   content: 'Madrid', style: 'muted' },
      { label: 'status',  content: 'past  ·  promoted Jan 2023', style: 'muted' },
      D,
      { label: '',        content: 'Joined to explore fintech and the SaaS business model.', style: 'default' },
      { label: '',        content: '· Risk Intelligence and Critical Systems', style: 'muted' },
      { label: '',        content: '· Built risk monitoring for a non-dilutive funding product', style: 'muted' },
      { label: '',        content: '· Shipped buyer qualification system (KYB + underwriting) for B2B BNPL', style: 'muted' },
    ],
  },
  {
    id: 'outpeer',
    name: 'outpeer.kz',
    details: [
      { label: 'role',    content: 'Bootcamp Instructor & Mentor', style: 'bright' },
      { label: 'company', content: 'outpeer.kz', style: 'default' },
      { label: 'period',  content: 'Aug 2022 – Mar 2025', style: 'muted' },
      { label: 'status',  content: 'past', style: 'muted' },
      D,
      { label: '',        content: 'My way of giving back — helping grow Kazakhstan\'s next wave of tech talent.', style: 'default' },
      { label: '',        content: 'Taught and mentored 200+ professionals transitioning into Data Science and AI.', style: 'muted' },
      { label: '',        content: 'Covered CS basics, ML, NLP, and LLMs — practical, hands-on, real-world intuition.', style: 'muted' },
    ],
  },
  {
    id: 'volvo',
    name: 'Volvo Cars',
    details: [
      { label: 'role',    content: 'Data Scientist', style: 'bright' },
      { label: 'company', content: 'Volvo Cars', style: 'default' },
      { label: 'period',  content: 'Aug 2020 – Apr 2022', style: 'muted' },
      { label: 'where',   content: 'Sweden', style: 'muted' },
      { label: 'status',  content: 'past', style: 'muted' },
      D,
      { label: '',        content: 'Joined to explore electrification and mobility. Stayed for the fika, lagom, and a new take on work-life balance.', style: 'default' },
      { label: '',        content: '· ML models for demand forecasting and production planning', style: 'muted' },
      { label: '',        content: '· Insights on cloud costs and customer experience', style: 'muted' },
      { label: '',        content: '· Spent days on the factory floor to understand how cars are actually built', style: 'muted' },
    ],
  },
  {
    id: 'microsoft',
    name: 'Microsoft',
    details: [
      { label: 'role',    content: 'Sales Engineer', style: 'bright' },
      { label: 'company', content: 'Microsoft', style: 'default' },
      { label: 'period',  content: 'May 2016 – Sep 2018', style: 'muted' },
      { label: 'where',   content: 'Central & Eastern Europe', style: 'muted' },
      { label: 'status',  content: 'past  ·  promoted May 2018', style: 'muted' },
      D,
      { label: '',        content: 'Joined through the highly selective 2-year MACH/Aspire Program for top graduates.', style: 'default' },
      { label: '',        content: '· Partnered with customers across 9 emerging markets', style: 'muted' },
      { label: '',        content: '· Introduced Microsoft Teams and modern workplace tools before the world went remote', style: 'muted' },
    ],
  },
]
