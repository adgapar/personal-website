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
