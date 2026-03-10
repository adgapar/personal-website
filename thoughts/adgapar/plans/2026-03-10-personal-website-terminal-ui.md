---
date: 2026-03-10T00:00:00-07:00
author: adgapar
topic: "Personal Website — Terminal UI Implementation Plan"
tags: [plan, personal-website, nextjs, terminal-ui, vercel]
status: in-progress
last_updated: 2026-03-10
last_updated_by: adgapar
---

# Personal Website — Terminal UI Implementation Plan

## Overview

Build a personal website for adgapar with a terminal-like UI inspired by mariya.fyi. The site functions as a full personal hub: portfolio, professional identity, blog aggregation, newsletter, and a static photo gallery. Visitors interact via typed commands in a terminal interface on the homepage; navigation commands route to dedicated section pages while output commands render inline.

**Stack:** Next.js 15 (App Router, Turbopack) · TypeScript · Tailwind CSS v4 · pnpm · Vercel

---

## Current State Analysis

- Greenfield repo: only `.gitignore` and `thoughts/` directory exist
- No framework scaffolded yet
- No dependencies installed
- External content: blog lives at adgapar.dev (Ghost), newsletter at Substack

## Desired End State

A deployed personal website at a `*.vercel.app` URL (custom domain later) that:
- Loads with an animated boot sequence followed by an auto-run `whois adgapar` output
- Accepts typed commands with `help` as the discovery entry point
- Routes to section pages (`/about`, `/work`, `/projects`, `/blog`, `/newsletter`, `/photos`, `/contact`) via navigation commands
- Displays CV inline in the terminal via `cat cv` command
- Returns witty easter egg responses for unexpected commands
- Works on mobile via tap-button chips alongside the terminal input
- Scores 90+ on Lighthouse performance

### Key Discoveries:
- mariya.fyi pattern: boot messages → auto-whois → free terminal. Nav commands say "→ navigating to X" and route. All section pages maintain the terminal aesthetic with a nav strip at the top.
- Terminal is homepage-only (`/`). Section pages use a shared terminal-themed layout with site nav links.
- `cat cv` is an output command — renders CV inline in the terminal as formatted text. No PDF, no page route for CV.
- **Terminal is present on EVERY page** (corrected from earlier assumption). Each section page has its own contextual terminal with page-relevant commands (e.g. blog page: `ls posts/`, `less posts/[slug]`; research page: `open [1-7]`).
- **Nav format (verified)**: `~/adilet  [about] · [work] · [projects] · [blog] · [newsletter] · [photos] · [contact]` — bracketed links with `·` bullet separators and `~/adilet` home prefix.
- **macOS window chrome**: Each page/terminal has fake close/minimize/maximize buttons in the header, like a terminal window.
- **Page header**: `adgapar — [section]` title pattern.

---

## Quick Verification Reference

Common commands to verify the implementation:
- Build: `pnpm build`
- Dev server: `pnpm dev`
- Lint: `pnpm lint`
- Type check: `pnpm tsc --noEmit`

Key files to check:
- `src/app/page.tsx` — homepage terminal
- `src/components/terminal/Terminal.tsx` — terminal engine
- `src/lib/commands/registry.ts` — command registry
- `src/data/` — all static content data

---

## What We're NOT Doing

- No CMS, admin panel, or database
- No RSS sync from Ghost or Substack — link-out only (with curated featured post list in data files)
- No Instagram API integration — photos are static files committed to the repo
- No blog migration from Ghost
- No heavy animations that impact Lighthouse scores
- No `uses` section in v1 (deferred to v2)
- No auth, no API routes, no server actions (pure static/ISR site)
- No CV PDF — CV is displayed inline via `cat cv` command in the terminal

---

## Implementation Approach

Build incrementally in 7 phases. Each phase is independently deployable and verifiable. Content (profile info, project list, easter egg responses) is authored in TypeScript data files under `src/data/` — not a CMS — keeping the stack purely static.

The terminal engine is a custom React component (not a library) to keep it lightweight, fully controlled, and styled exactly as needed. Command handling follows a registry pattern: each command is a typed object with a `handler` function that returns a `CommandResult` describing what to render or where to navigate.

---

## File Structure

```
personal-website/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: font, theme, metadata
│   │   ├── page.tsx                # Homepage → <Terminal />
│   │   ├── globals.css             # CSS custom properties (theme tokens)
│   │   ├── about/page.tsx
│   │   ├── work/page.tsx
│   │   ├── projects/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── newsletter/page.tsx
│   │   ├── photos/page.tsx
│   │   └── contact/page.tsx
│   ├── components/
│   │   ├── terminal/
│   │   │   ├── Terminal.tsx        # Reusable terminal: state, input, history
│   │   │   ├── TerminalHistory.tsx # Renders history entries
│   │   │   ├── TerminalLine.tsx    # Single styled output line
│   │   │   └── CommandChips.tsx    # Mobile tap buttons (homepage)
│   │   └── layout/
│   │       ├── SiteNav.tsx         # ~/adilet [about] · [work] · ... nav
│   │       ├── WindowChrome.tsx    # macOS-style close/min/max buttons
│   │       └── PageLayout.tsx      # Shared wrapper: WindowChrome + SiteNav + Terminal
│   ├── lib/
│   │   └── commands/
│   │       ├── types.ts            # Command interfaces, enums
│   │       ├── registry.ts         # All commands registered here
│   │       ├── navigate.ts         # Navigation command handlers
│   │       ├── output.ts           # Output-only command handlers
│   │       └── easter-eggs.ts      # Hidden easter egg handlers
│   └── data/
│       ├── profile.ts              # Name, role, bio, social links
│       ├── work.ts                 # Work experience entries
│       ├── projects.ts             # Project entries
│       ├── blog.ts                 # Curated featured blog posts
│       ├── newsletter.ts           # Newsletter info
│       ├── cv.ts                   # CV content (rendered inline by `cat cv`)
│       └── media.ts                # Photo/video manifest
├── public/
│   └── media/                      # Static photos and videos
├── thoughts/                       # Brainstorm and plan docs
├── .gitignore
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.ts
```

---

## Phase 1: Project Scaffold

### Overview
Bootstrap the Next.js 15 project with pnpm, TypeScript, Tailwind CSS v4, App Router, and Turbopack. Set up ESLint, create the folder structure, add a placeholder homepage, and confirm the dev server runs.

### Changes Required:

#### 1. Initialize Next.js project
**File**: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`
**Changes**: Run `pnpm create next-app@latest .` with:
- TypeScript: yes
- Tailwind CSS: yes
- App Router: yes
- src/ directory: yes
- Turbopack: yes
- ESLint: yes
- Import alias: `@/*`

#### 2. Install and verify dependencies
**File**: `pnpm-lock.yaml`
**Changes**: After scaffold, run `pnpm install` to confirm lockfile is generated.

#### 3. Placeholder homepage
**File**: `src/app/page.tsx`
**Changes**: Replace default Next.js page with a minimal placeholder: `<main>adgapar — coming soon</main>`. Will be replaced in Phase 2.

#### 4. Placeholder layout
**File**: `src/app/layout.tsx`
**Changes**: Set `<html lang="en">`, add JetBrains Mono font from `next/font/google`, set basic metadata (title: "adgapar", description: "personal website").

#### 5. Create folder structure
**Files**: `src/lib/commands/`, `src/data/`, `src/components/terminal/`, `src/components/layout/`, `public/media/`
**Changes**: Create these directories. Add `.gitkeep` to empty dirs.

#### 6. Update .gitignore
**File**: `.gitignore`
**Changes**: Confirm `.next/`, `node_modules/`, `.env*` are present.

### Success Criteria:

#### Automated Verification:
- [ ] Dev server starts: `pnpm dev`
- [x] Build succeeds: `pnpm build`
- [x] Lint passes: `pnpm lint`
- [x] TypeScript compiles: `pnpm tsc --noEmit`
- [x] Lockfile exists: `ls pnpm-lock.yaml`

#### Manual Verification:
- [x] `http://localhost:3000` renders placeholder text
- [x] JetBrains Mono font loads (inspect element → computed font)
- [x] No console errors on load

**Implementation Note**: After Phase 1 passes, create commit: `[phase 1] scaffold Next.js 15 project with pnpm, TypeScript, Tailwind`

---

## Phase 2: Terminal Engine

### Overview
Build the core terminal component: command type system, command registry, input handling (keyboard events, history navigation with up/down arrows), and history renderer. No commands are wired up yet — just the engine infrastructure.

### Changes Required:

#### 1. Command type definitions
**File**: `src/lib/commands/types.ts`
**Changes**:
```ts
export type CommandType = 'navigate' | 'output' | 'open' | 'system'
export type LineStyle =
  | 'default' | 'success' | 'error' | 'info'
  | 'accent' | 'muted' | 'command' | 'divider'

export interface TerminalLine {
  content: string
  style?: LineStyle
  href?: string         // renders as <a> if present
}

export interface CommandResult {
  type: 'output' | 'navigate' | 'open' | 'clear'
  lines?: TerminalLine[]
  href?: string         // for 'navigate' and 'open'
  external?: boolean    // open in new tab
}

export interface Command {
  name: string
  aliases?: string[]
  description: string   // shown in `help`
  hidden?: boolean      // easter eggs hidden from help
  type: CommandType
  handler: (args: string[], rawInput: string) => CommandResult
}
```

#### 2. Command registry
**File**: `src/lib/commands/registry.ts`
**Changes**: Registry map + `executeCommand` + `getAllCommands` functions:
- `registerCommand(cmd)` — registers command and all its aliases
- `executeCommand(input)` — parses input, finds command, calls handler; returns "command not found" if unknown
- `getAllCommands()` — returns deduplicated list of all non-hidden commands

#### 3. Terminal state hook
**File**: `src/components/terminal/useTerminal.ts`
**Changes**: Custom hook managing:
- `history`: array of `{ id, command?, lines[] }` entries
- `inputValue`: current input text
- `commandHistory`: past commands for up/down recall
- `commandHistoryIndex`: current position in recall
- Methods: `appendOutput`, `clearHistory`, `handleInput`, `handleKeyDown` (Enter, ArrowUp, ArrowDown)

#### 4. TerminalLine component
**File**: `src/components/terminal/TerminalLine.tsx`
**Changes**: Single styled line. Maps `style` prop to Tailwind classes:
- `success` → green-400
- `error` → red-400
- `info` → slate-400
- `accent` → CSS var `--accent`
- `muted` → gray-500
- `command` → show `$ ` prefix
- `divider` → render `───────────` separator
- Default → off-white

#### 5. TerminalHistory component
**File**: `src/components/terminal/TerminalHistory.tsx`
**Changes**: Maps history entries to `<TerminalLine>` components. Auto-scrolls to bottom on new entries via `useEffect` + bottom anchor ref.

#### 6. Terminal main component
**File**: `src/components/terminal/Terminal.tsx`
**Changes**:
- Composes `useTerminal` hook + `<TerminalHistory>` + input row
- Input row: `<span>$ </span>` + `<input>`
- Click anywhere on terminal div → focus input
- Passes `executeCommand` results to `appendOutput` or triggers navigation/open

#### 7. Wire up to homepage
**File**: `src/app/page.tsx`
**Changes**: Replace placeholder with `<Terminal />`.

### Success Criteria:

#### Automated Verification:
- [x] Build succeeds: `pnpm build`
- [x] TypeScript compiles: `pnpm tsc --noEmit`
- [x] No lint errors: `pnpm lint`

#### Manual Verification:
- [ ] Terminal renders on homepage with `$ ` prompt
- [ ] Typing text updates the input field
- [ ] Pressing Enter shows "command not found: X. type 'help' for available commands."
- [ ] ArrowUp/Down navigates through command history
- [ ] Clicking anywhere on the page focuses the input
- [ ] Output scrolls to bottom when history grows long

**Implementation Note**: After Phase 2 passes, create commit: `[phase 2] terminal engine: command registry, input handling, history renderer`

---

## Phase 3: Boot Sequence + Core Commands + Easter Eggs

### Overview
Implement the full onboarding experience: animated boot sequence, auto-run `whois`, and wire up all core commands (`help`, `whois`, `clear`, `ls`, `pwd`, `date`, `uname`) plus a full suite of easter egg commands. Create the `src/data/profile.ts` data file.

### Changes Required:

#### 1. Profile data file
**File**: `src/data/profile.ts`
**Changes**:
```ts
export const profile = {
  name: 'Adilet Gaparov',
  handle: 'adgapar',
  nickname: 'Adi',
  role: 'Founding AI Engineer',
  org: 'Orbio AI',
  location: 'Elche, Spain',
  bio: 'I build systems that help people and organizations make smarter decisions—across risk, mobility, and now careers.',
  longBio: `Hi, I'm Adilet (people sometimes call me Adi). Founding AI engineer at Orbio AI, building agents for recruitment, onboarding and experience. My path has taken me through Microsoft, Volvo Cars, and Capchase—always focused on helping people make smarter decisions. I mentor graduate students at IE School of Science and Technology and write about learning, personal growth, and building with AI. Born and raised in Kazakhstan 🇰🇿, currently based in Elche 🇪🇸, with a family of 4 and 24 countries visited.`,
  languages: ['English', 'French', 'Spanish', 'Russian'],
  links: {
    blog: 'https://adgapar.dev',
    newsletter: 'https://theworkingprototype.substack.com/',
    github: 'https://github.com/adgapar',
    twitter: 'https://twitter.com/adgapar',
    linkedin: 'https://www.linkedin.com/in/adilet-gaparov/',
    threads: 'https://www.threads.com/@adilet.gaparov',
  },
}
```

#### 2. Boot sequence
**File**: `src/components/terminal/Terminal.tsx` (update)
**Changes**: On mount, run staggered boot sequence (input disabled during boot):
1. 200ms: `[ OK ] Starting session — adilet.gaparov`  (success)
2. 400ms: `[ OK ] User profile loaded`  (success)
3. 600ms: `[ INFO ] Last login: ${new Date().toDateString()}`  (info)
4. 800ms: blank line
5. 1000ms: `$ whois adgapar`  (command style)
6. 1200ms: execute `whois` → append output
7. 1400ms: enable input

#### 3. Output commands
**File**: `src/lib/commands/output.ts`
**Changes**: Register:

**`help`** — formatted command table listing all visible commands

**`whois [handle]`** — profile card:
```
───────────────────────────────────
  name        : Adilet Gaparov (Adi)
  role        : Founding AI Engineer
  org         : Orbio AI
  location    : Elche, Spain 🇪🇸
  blog        : adgapar.dev
  newsletter  : theworkingprototype.substack.com
  languages   : EN · FR · ES · RU
───────────────────────────────────
```

**`clear`** — returns `{ type: 'clear' }`

**`ls`** — directory-style section listing:
```
drwxr-xr-x  about/
drwxr-xr-x  work/
drwxr-xr-x  projects/
drwxr-xr-x  blog/
drwxr-xr-x  newsletter/
drwxr-xr-x  photos/
drwxr-xr-x  contact/
-rw-r--r--  cv.pdf
```

**`pwd`** — returns `/home/adilet`

**`date`** — returns `new Date().toLocaleString()`

**`uname`** — returns: `adgapar-os 1.0.0 personal-website #1 SMP · built in KZ · running in ES`

#### 4. Navigation commands
**File**: `src/lib/commands/navigate.ts`
**Changes**: Register `about`, `work`, `projects`, `blog`, `newsletter`, `photos`, `contact` — each returns:
```ts
{ type: 'navigate', href: '/about', lines: [{ content: '→ navigating to about...', style: 'accent' }] }
```

**`cat cv`** — output command (not navigation). Reads from `src/data/cv.ts` and renders the CV inline in the terminal:
```
───────────────────────────────────
  Adlan Gapar — CV
───────────────────────────────────
  experience
  ──────────
  [role] @ [company]       [period]
  [description]

  [role] @ [company]       [period]
  [description]

  education
  ─────────
  [degree] @ [institution] [year]

  skills
  ──────
  [skill categories and tools]
───────────────────────────────────
```
`cat cv` is registered in `output.ts`, not `navigate.ts`. The `cv` command (without `cat`) can be an alias or an easter egg pointing users to `cat cv`.

#### 5. Navigation handling in Terminal
**File**: `src/components/terminal/Terminal.tsx` (update)
**Changes**: After `executeCommand`, check `result.type`:
- `'navigate'` → append lines, then `router.push(href)` after 400ms delay (matching mariya.fyi's `go(url)` pattern)
- `'open'` → append lines, then `window.open(href, '_blank')` after 400ms (for external links like blog, newsletter)
- `'clear'` → call `clearHistory()`
- `'output'` → append lines (most commands, including `cat cv`)

#### 6. Easter egg commands
**File**: `src/lib/commands/easter-eggs.ts`
**Changes**: Register with `hidden: true`:

| Command | Response |
|---------|----------|
| `git commit` | `on branch main. nothing to commit. everything is intentional.` |
| `git push` | `pushed. the internet has been updated.` |
| `git pull` | `already up to date.` |
| `git blame` | `blame: adilet gaparov — he ships, sometimes too fast` |
| `git status` | `modified: career.md · modified: life.md · untracked: next-thing/` |
| `git log` | `commit a1b2c3 — "initial commit: born in Kazakhstan, raised on the steppe"` |
| `sudo` | `nice try.` |
| `sudo !!` | `i said no.` |
| `rm -rf /` | `lol, no.` |
| `vim` | `you're already in one.` |
| `nano` | `downgrading to nano? bold choice.` |
| `exit` | `you can't leave. we've been here for years.` |
| `make coffee` | `brewing... done. it's on your end though.` |
| `kill -9` | `process not found: yourself` |
| `whoami` | `adilet gaparov. founding ai engineer. digital nomad. dad. kazakh. 24 countries and counting.` |
| `ping` | `pong` |
| `ssh` | `connection refused. go knock.` |
| `uptime` | `up 30+ years, 4 languages loaded, 1 family running, 0 regrets` |
| `history` | `cloud @ microsoft → ml @ volvo → risk @ capchase → ai @ orbio → ???` |
| `hello` / `hi` | friendly greeting in return |
| `yes` | output `y` 20 times |

> **TODO for user**: Customize all easter egg responses before launch.

#### 7. Register all commands
**File**: `src/lib/commands/registry.ts` (update)
**Changes**: Import and register all commands from `output.ts`, `navigate.ts`, `easter-eggs.ts` at module init.

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds: `pnpm build`
- [ ] TypeScript compiles: `pnpm tsc --noEmit`
- [ ] No lint errors: `pnpm lint`
- [ ] Command files exist: `ls src/lib/commands/`

#### Manual Verification:
- [ ] On load: boot messages appear with staggered timing
- [ ] `whois adgapar` auto-runs after boot and shows profile card
- [ ] Input is disabled during boot, enabled after
- [ ] `help` shows formatted command table
- [ ] `clear` clears the terminal
- [ ] `ls` shows directory-style section listing
- [ ] `about` prints "→ navigating to about..." and navigates (404 OK in this phase)
- [ ] `cat cv` renders CV content inline in the terminal
- [ ] `git commit` returns easter egg response
- [ ] `sudo` returns "nice try."
- [ ] Unknown command returns error message with `help` hint
- [ ] ArrowUp/Down recalls previous commands

**Implementation Note**: After Phase 3 passes, create commit: `[phase 3] boot sequence, core commands, navigation routing, easter eggs`

---

## Phase 4: Section Pages

### Overview
Create all seven section pages with a shared terminal-themed layout (`SiteNav` + `PageLayout`). Pages are initially stubbed with placeholder content; real content is wired in Phase 5.

### Changes Required:

#### 1. WindowChrome component
**File**: `src/components/layout/WindowChrome.tsx`
**Changes**: Fake macOS terminal window header — three colored dots (red/yellow/green close/minimize/maximize) in the top-left. Purely decorative CSS. Wraps the entire site in a "terminal window" aesthetic matching mariya.fyi.

#### 2. SiteNav component
**File**: `src/components/layout/SiteNav.tsx`
**Changes**: Navigation bar matching mariya.fyi's verified format exactly:
```
~/adilet  [about] · [work] · [projects] · [blog] · [newsletter] · [photos] · [contact]
```
- `~/adilet` on left links to `/` (homepage terminal)
- Each section link in `[square brackets]`, separated by `·` bullet character
- Active page link uses accent color
- Monospace font, dark background

#### 3. PageLayout component
**File**: `src/components/layout/PageLayout.tsx`
**Changes**: Shared wrapper for all section pages:
- Renders `<WindowChrome />` at top (macOS dots)
- Renders `<SiteNav />` below it
- Page title in header: `adgapar — [section]` pattern (e.g. "adgapar — blog")
- `<main>` with terminal-themed styling (dark bg, monospace, max-width, padding)
- **Includes `<Terminal>` at the bottom** with page-specific command set
- Each page passes its own `commands` prop to `<Terminal>` for contextual commands

#### 4. All section pages (stubbed)
**Files**: `src/app/about/page.tsx`, `src/app/work/page.tsx`, `src/app/projects/page.tsx`, `src/app/blog/page.tsx`, `src/app/newsletter/page.tsx`, `src/app/photos/page.tsx`, `src/app/contact/page.tsx`
**Changes**: Each wraps `<PageLayout>` with placeholder content + a stubbed `commands` prop for the page terminal. Contextual commands defined in Phase 3/5 (e.g. blog page: `ls posts/`, `less posts/[slug]`).

#### 6. Root layout update
**File**: `src/app/layout.tsx`
**Changes**: Ensure global CSS (dark background, monospace font, CSS color tokens) applies universally.

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds: `pnpm build`
- [ ] All routes in build output: check `pnpm build` logs for `/about`, `/work`, `/projects`, `/blog`, `/newsletter`, `/photos`, `/contact`
- [ ] TypeScript compiles: `pnpm tsc --noEmit`

#### Manual Verification:
- [ ] Typing `about` in terminal navigates to `/about`
- [ ] `/about` renders with `SiteNav` at top
- [ ] All 7 nav links in `SiteNav` navigate correctly
- [ ] Clicking site name returns to homepage terminal
- [ ] All 7 section pages render (placeholder content OK)
- [ ] Consistent visual style across all pages (dark bg, monospace)
- [ ] No flash of unstyled content on navigation

**Implementation Note**: After Phase 4 passes, create commit: `[phase 4] section page routes with shared terminal-themed layout`

---

## Phase 5: Content Layer

### Overview
Fill all section pages with real content. Create TypeScript data files for every section, wire them to the pages, add the static photo gallery setup, and add `cv.pdf` to `public/`.

### Changes Required:

#### 1. Fill profile data
**File**: `src/data/profile.ts`
**Changes**: Replace all `[TODO]` placeholders with real values.

#### 2. Work experience data
**File**: `src/data/work.ts`
```ts
export interface WorkEntry {
  company: string
  role: string
  period: string        // e.g. "2023 – present"
  description: string
  tags?: string[]
}
export const work: WorkEntry[] = [ /* fill in */ ]
```

#### 3. Projects data
**File**: `src/data/projects.ts`
```ts
export interface Project {
  name: string
  description: string
  url?: string
  github?: string
  tags: string[]
  year: number
  status: 'active' | 'archived' | 'wip'
}
export const projects: Project[] = [ /* fill in */ ]
```

#### 4. Featured blog posts data
**File**: `src/data/blog.ts`
```ts
export interface BlogPost {
  title: string
  url: string
  date: string
  excerpt: string
  tags?: string[]
}
export const featuredPosts: BlogPost[] = [ /* hand-pick from adgapar.dev */ ]
```

#### 5. Newsletter data
**File**: `src/data/newsletter.ts`
```ts
export const newsletter = {
  name: 'Applied Safe AI',
  description: '[description]',
  url: 'https://[substack-url]',
  frequency: '[cadence]',
}
```

#### 6. Media manifest
**File**: `src/data/media.ts`
```ts
export interface MediaItem {
  filename: string
  caption?: string
  date?: string
  type: 'photo' | 'video'
}
export const media: MediaItem[] = [ /* add entries as files are added to public/media/ */ ]
```

#### 7. Add CV data
**File**: `src/data/cv.ts`
**Changes**: Structured CV content rendered by `cat cv`:
```ts
export interface CVEntry {
  role: string
  company: string
  period: string
  description?: string
}
export interface CVSection {
  title: string
  entries: CVEntry[]
}
export const cv = {
  sections: [
    { title: 'experience', entries: [ /* fill in */ ] },
    { title: 'education', entries: [ /* fill in */ ] },
  ] as CVSection[],
  skills: '[comma-separated skills / tools]',  // TODO: fill in
}
```

#### 8. Wire all section pages
**Files**: All `src/app/*/page.tsx`
**Changes**: Import from data files and render real content:
- `about` → profile bio, links
- `work` → timeline of work entries
- `projects` → list of projects with links and tags
- `blog` → curated post cards + "read more at adgapar.dev" link
- `newsletter` → newsletter description + Substack subscribe link
- `photos` → responsive grid using `next/image` from media manifest; empty state if no items
- `contact` → social links from profile data

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds: `pnpm build`
- [ ] TypeScript compiles: `pnpm tsc --noEmit`
- [ ] CV data file exists: `ls src/data/cv.ts`
- [ ] Media dir exists: `ls public/media/`

#### Manual Verification:
- [ ] `/about` shows real name, role, bio, links
- [ ] `/work` shows at least one work entry
- [ ] `/projects` shows at least one project
- [ ] `/blog` shows curated posts; external links open in new tab
- [ ] `/newsletter` shows description and Substack link
- [ ] `/photos` renders (empty state or real photos)
- [ ] `/contact` shows social links
- [ ] `cat cv` command renders CV inline in the terminal with all sections

**Implementation Note**: After Phase 5 passes, create commit: `[phase 5] content layer: data files, all section pages wired with real content`

---

## Phase 6: Mobile UX + Visual Polish

### Overview
Implement hybrid mobile experience (command chip buttons), finalize color theme, add cursor blink animation, ensure responsive layouts, and hit Lighthouse 90+ performance.

### Changes Required:

#### 1. Color theme tokens
**File**: `src/app/globals.css`
**Changes**:
```css
:root {
  --bg: #0d0d0d;
  --fg: #e8e6e3;
  --accent: #7dd3fc;   /* sky-300 — adjust to preference */
  --muted: #6b7280;
  --success: #4ade80;
  --error: #f87171;
  --info: #94a3b8;
  --border: #1f1f1f;
}
```
> Options for accent: sky-blue `#7dd3fc`, amber `#fbbf24`, teal `#2dd4bf`, lavender `#c4b5fd`

#### 2. CommandChips component
**File**: `src/components/terminal/CommandChips.tsx`
**Changes**: Horizontally scrollable row of tappable command buttons below terminal input on mobile. On desktop, the plain-text `SiteNav` (on section pages) is sufficient — chips add discoverability on the homepage terminal where no nav is shown.
```
about   work   projects   blog   newsletter   photos   contact   help
```
- Style: plain monospace text, minimal — consistent with the plain-text nav aesthetic. Subtle separator between items (e.g. `·` or just spacing). No bordered boxes.
- Each item onClick: set terminal input + execute command
- Horizontally scrollable on small screens

#### 3. Terminal responsive layout
**File**: `src/components/terminal/Terminal.tsx` (update)
**Changes**:
- Add `<CommandChips>` below input row
- Terminal fills full viewport height on mobile
- Input `font-size: 16px` minimum (prevents iOS zoom on focus)

#### 4. Section page responsive layouts
**Files**: All `src/app/*/page.tsx`
**Changes**: Ensure readability at 375px: stacked timelines, single-column project lists, responsive photo grid (3→2→1 columns).

#### 5. Terminal cursor animation
**File**: `src/app/globals.css`
**Changes**:
```css
@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
.cursor { animation: blink 1s step-end infinite; }
```

#### 6. Accessibility
**Files**: Terminal components, section pages
**Changes**:
- `<input>` has `aria-label="terminal input"`
- Terminal history has `role="log"` + `aria-live="polite"`
- All links have descriptive text or `aria-label`
- Color contrast meets WCAG AA

#### 7. OG metadata
**File**: `src/app/layout.tsx`
**Changes**: Add full OpenGraph + Twitter card metadata. Add `public/og.png` (1200×630, simple dark terminal-themed image).

### Success Criteria:

#### Automated Verification:
- [ ] Build succeeds: `pnpm build`
- [ ] TypeScript compiles: `pnpm tsc --noEmit`
- [ ] No lint errors: `pnpm lint`

#### Manual Verification:
- [ ] On mobile (375px): command chips visible and tappable below terminal
- [ ] Tapping a chip executes the command and navigates
- [ ] iOS: input doesn't trigger zoom on focus
- [ ] Cursor blinks after prompt
- [ ] "→ navigating to X..." visible before page transition
- [ ] All section pages readable on mobile
- [ ] Photo grid adapts: 3 cols → 2 cols → 1 col
- [ ] OG preview looks correct when URL pasted into Slack or Twitter

**Implementation Note**: After Phase 6 passes, create commit: `[phase 6] mobile UX, command chips, color theme, visual polish, accessibility`

---

## Phase 7: Vercel Deployment

### Overview
Deploy to Vercel, set up CI/CD (auto-deploy on push to main), verify production build, and confirm the site is production-ready.

### Changes Required:

#### 1. Vercel project setup
**Method**: Vercel dashboard (connect GitHub repo) or CLI (`vercel link && vercel --prod`)
**Changes**: Link repo, trigger first production deploy.

#### 2. Security headers
**File**: `next.config.ts`
**Changes**:
```ts
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
]
// Add to next.config.ts headers() function
```

#### 3. Confirm CI/CD
**Changes**: Push a small change to `main`, verify Vercel auto-deploys successfully.

#### 4. Domain readiness
**Changes**: Verify `*.vercel.app` URL fully works. Document how to attach a custom domain (Vercel dashboard → Settings → Domains).

### Success Criteria:

#### Automated Verification:
- [ ] Production build succeeds: check Vercel dashboard build logs
- [ ] Local build passes: `pnpm build`
- [ ] Deployed URL responds: `curl -I https://[project].vercel.app` returns 200

#### Manual Verification:
- [ ] Production URL loads terminal homepage
- [ ] Boot sequence runs in production
- [ ] All navigation commands work in production
- [ ] All section pages load
- [ ] CV PDF opens from production URL
- [ ] Site works on real mobile device
- [ ] Lighthouse Performance ≥ 90 on production URL
- [ ] Push to main → Vercel auto-deploys within 2 minutes

**Implementation Note**: After Phase 7 passes, create commit: `[phase 7] production deployment, security headers, CI/CD verified`

---

## Testing Strategy

- **Unit tests**: Not required for v1. `executeCommand` in the command registry is the best candidate if unit tests are added later.
- **Visual testing**: Manual across Chrome, Firefox, Safari; mobile on iOS Safari + Chrome Android.
- **Performance**: Lighthouse on the deployed production URL. Target: Performance ≥ 90, Accessibility ≥ 90.
- **Regression**: After each phase, verify previously working phases still pass their manual checks.

---

## References
- Inspiration: https://mariya.fyi/
- Brainstorm: `thoughts/adgapar/brainstorms/2026-03-10-personal-website-terminal-ui.md`
