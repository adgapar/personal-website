import { registerCommand } from './registry'

const sections = [
  { name: 'about', href: '/' },
  { name: 'cv',   href: '/cv' },
  { name: 'work', href: '/cv' },
  { name: 'projects', href: '/work' },
  { name: 'writing', href: '/writing' },
  { name: 'blog', href: '/writing' },
  { name: 'newsletter', href: '/writing' },
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
