import { openAppSoon, type DeskApp } from '../app-store'
import { registerCommand } from './registry'

const apps: { name: DeskApp; description: string }[] = [
  { name: 'snake', description: 'play snake' },
  { name: 'paint', description: 'open the painting canvas' },
]

for (const { name, description } of apps) {
  registerCommand({
    name,
    description,
    type: 'output',
    handler: () => {
      openAppSoon(name, 400)
      return {
        type: 'output',
        lines: [{ content: `opening ${name}...`, style: 'dim' }],
      }
    },
  })
}
