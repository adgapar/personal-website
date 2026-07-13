# adilet.fyi

Personal website, built as an interactive terminal UI. Live at [adilet.fyi](https://adilet.fyi).

## Stack

- [Next.js](https://nextjs.org) 16 (App Router) + TypeScript
- Tailwind CSS v4
- Deployed on [Vercel](https://vercel.com)

## Structure

- `src/lib/sessions.ts` — page content (blocks, prompts, commands)
- `src/data/` — profile info and project entries
- `src/lib/commands/` — terminal command registry, output, navigation
- `src/components/terminal/` — terminal UI components
- `src/components/layout/` — page layout and nav

## Development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to see it running.
