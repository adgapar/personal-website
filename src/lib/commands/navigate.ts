import { registerCommand } from './registry'

const sections = [
  { name: 'about', href: '/about' },
  { name: 'work', href: '/work' },
  { name: 'projects', href: '/projects' },
  { name: 'blog', href: '/blog' },
  { name: 'newsletter', href: '/newsletter' },
  { name: 'photos', href: '/photos' },
  { name: 'contact', href: '/contact' },
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
