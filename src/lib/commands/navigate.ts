import { registerCommand } from './registry'

const sections = [
  { name: 'tapas', href: '/tapas' },
  { name: 'about', href: '/' },
  { name: 'studio', href: '/' },
  { name: 'log', href: '/#updates' },
  { name: 'background', href: '/cv' },
  { name: 'cv',   href: '/cv' },
  { name: 'work', href: '/cv' },
  { name: 'projects', href: '/projects' },
  { name: 'writing', href: '/reader' },
  { name: 'blog', href: '/reader' },
  { name: 'newsletter', href: '/reader' },
  { name: 'contact', href: '/contact' },
  { name: 'play', href: '/play' },
]

sections.forEach(({ name, href }) => {
  registerCommand({
    name,
    description: `go to ${name}`,
    type: 'navigate',
    handler: () => ({
      type: 'navigate',
      href,
      lines: [{ content: `→ navigating to ${name}...`, style: 'accent' }],
    }),
  })
})

// The reader is an app rather than a section, so it gets its own verb — and it
// launches from any prompt, not only from the writing tab.
registerCommand({
  name: 'reader',
  aliases: ['read'],
  description: 'open the reader — posts as pages, not terminal output',
  type: 'navigate',
  handler: () => ({
    type: 'navigate',
    href: '/reader',
    lines: [{ content: '→ opening reader...', style: 'accent' }],
  }),
})
