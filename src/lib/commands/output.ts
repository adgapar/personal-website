import { registerCommand } from './registry'
import { profile } from '@/data/profile'
import { blogPosts, newsletterPosts } from '@/data/posts'
import { projects } from '@/data/projects'
import { jobs } from '@/data/jobs'
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
      { content: '  writing      blog posts and the newsletter', style: 'default' },
      { content: '  contact      get in touch', style: 'default' },
      { content: '  whois        show profile info', style: 'default' },
      { content: '  ls           list sections', style: 'default' },
      { content: '  clear        clear the terminal', style: 'default' },
      DIVIDER,
      { content: 'try something unexpected — there may be easter eggs', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'whois adilet',
  aliases: ['whois adgapar', 'whois'],
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
      { content: `  focus       : AI agents · recruitment · voice AI · building in public`, style: 'default' },
      { content: `  writing     : ${blogPosts.length} posts  ·  ${newsletterPosts.length} newsletter issues`, style: 'default' },
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
  name: 'ls work',
  description: 'list work experience',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: '  work history', style: 'accent' },
      DIVIDER,
      { content: '  Founding AI Engineer', style: 'warm' },
      { content: '  Orbio AI                                2024 – present', style: 'muted' },
      { content: '  Building AI agents for recruitment, onboarding & experience.', style: 'default' },
      { content: '', style: 'default' },
      { content: '  ML Engineer', style: 'warm' },
      { content: '  Capchase                                2022 – 2024', style: 'muted' },
      { content: '  Risk intelligence and underwriting systems for fintech SaaS.', style: 'default' },
      { content: '', style: 'default' },
      { content: '  ML Engineer', style: 'warm' },
      { content: '  Volvo Cars                              2021 – 2022', style: 'muted' },
      { content: '  Electrification models and connected car analytics.', style: 'default' },
      { content: '', style: 'default' },
      { content: '  Cloud Engineer', style: 'warm' },
      { content: '  Microsoft                               2019 – 2021', style: 'muted' },
      { content: '  Cloud solutions and enterprise customer enablement.', style: 'default' },
      DIVIDER,
      { content: "  visit /cv for full résumé", style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'open',
  description: 'open a project by name',
  type: 'output',
  handler: (_flags, rawInput) => {
    const query = rawInput.replace(/^open\s+/i, '').trim().toLowerCase()
    if (!query) {
      return {
        type: 'output',
        lines: [{ content: "usage: open <name>  ·  e.g. open orbio  ·  open work/2  ·  open projects/1", style: 'muted' }],
      }
    }

    const workMatch = query.match(/^work\/(\d+)$/)
    if (workMatch) {
      const idx = parseInt(workMatch[1], 10) - 1
      const job = jobs[idx]
      if (job) return { type: 'output', lines: job.details }
      return { type: 'output', lines: [{ content: `work/${workMatch[1]} not found  ·  valid range: 1–${jobs.length}`, style: 'muted' }] }
    }

    const projectsMatch = query.match(/^projects\/(\d+)$/)
    if (projectsMatch) {
      const idx = parseInt(projectsMatch[1], 10) - 1
      const project = projects[idx]
      if (project) return { type: 'output', lines: project.details }
      return { type: 'output', lines: [{ content: `projects/${projectsMatch[1]} not found  ·  valid range: 1–${projects.length}`, style: 'muted' }] }
    }

    const job = jobs.find((j) => j.id === query || j.name.toLowerCase().includes(query))
    if (job) return { type: 'output', lines: job.details }

    const project = projects.find((p) => p.id === query || p.name.toLowerCase().includes(query))
    if (project) return { type: 'output', lines: project.details }

    return {
      type: 'output',
      lines: [{ content: `'${query}' not found  ·  type 'help' to see what's available`, style: 'muted' }],
    }
  },
})

registerCommand({
  name: 'ls projects',
  description: 'list projects',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: '  projects', style: 'accent' },
      DIVIDER,
      ...projects.flatMap((p) => [
        { content: `  ${p.name}  ·  ${p.status}`, style: 'warm' as const },
        { content: `  ${p.summary}`, style: 'muted' as const },
      ]),
      DIVIDER,
      { content: "  type 'open <name>' for detail  ·  e.g. open teya", style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'ls blog',
  description: 'list blog posts',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: `  blog  ·  ${blogPosts.length} posts`, style: 'accent' },
      DIVIDER,
      ...blogPosts.map((post) => ({
        content: `  ${post.date}   ${post.title}`,
        style: 'default' as const,
        href: `/blog/${post.slug}`,
      })),
      DIVIDER,
      { content: "  click one, or type 'writing' for the full index", style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'ls newsletter',
  description: 'list newsletter issues',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: `  the working prototype  ·  ${newsletterPosts.length} issues`, style: 'accent' },
      DIVIDER,
      ...newsletterPosts.map((post) => ({
        content: `  ${post.date}   ${post.title}`,
        style: 'default' as const,
        href: `https://theworkingprototype.substack.com/p/${post.slug}`,
      })),
      DIVIDER,
      { content: '  published on substack  ·  by email', style: 'muted' },
    ],
  }),
})

registerCommand({
  name: 'cat newsletter.txt',
  description: 'view newsletter info',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: '  The Working Prototype', style: 'accent' },
      DIVIDER,
      { content: '  A newsletter on practical AI and building with it.', style: 'default' },
      { content: '  No fluff.', style: 'muted' },
      { content: '', style: 'default' },
      { content: '  → theworkingprototype.substack.com', style: 'info', href: 'https://theworkingprototype.substack.com/' },
      DIVIDER,
    ],
  }),
})

registerCommand({
  name: 'cat contact.txt',
  description: 'view contact info',
  type: 'output',
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: '  contact', style: 'accent' },
      DIVIDER,
      { content: `  github    → github.com/${profile.handle}`, style: 'default', href: profile.links.github },
      { content: `  twitter   → twitter.com/${profile.handle}`, style: 'default', href: profile.links.twitter },
      { content: `  linkedin  → linkedin.com/in/adilet-gaparov`, style: 'default', href: profile.links.linkedin },
      { content: `  threads   → threads.com/@adilet.gaparov`, style: 'default', href: profile.links.threads },
      { content: `  substack  → theworkingprototype.substack.com`, style: 'default', href: profile.links.newsletter },
      DIVIDER,
    ],
  }),
})

registerCommand({
  name: 'cat about.txt',
  description: 'about me',
  type: 'output',
  hidden: true,
  handler: () => ({
    type: 'output',
    lines: [
      DIVIDER,
      { content: `  ${profile.name} (${profile.nickname})`, style: 'accent' },
      DIVIDER,
      { content: profile.longBio, style: 'default' },
      { content: '', style: 'default' },
      { content: `  languages    : ${profile.languages.join(' · ')}`, style: 'muted' },
      DIVIDER,
    ],
  }),
})
