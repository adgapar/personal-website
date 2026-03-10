---
date: 2026-03-10T00:00:00-07:00
author: adgapar
topic: "Personal Website with Terminal-Like UI"
tags: [brainstorm, personal-website, nextjs, terminal-ui, vercel]
status: complete
exploration_type: idea
last_updated: 2026-03-10
last_updated_by: adgapar
---

# Personal Website with Terminal-Like UI — Brainstorm

## Context

Building a personal website inspired by https://mariya.fyi/ — a beautiful terminal-like UI where visitors can type commands (e.g., `help`) to navigate the site. The site features interactive tabs/sections that feel like a terminal experience.

**Stack decisions already made:**
- Framework: Next.js
- Package manager: pnpm
- Bundler: Vite (via Next.js config or standalone)
- Deployment: Vercel

**Inspiration site features observed:**
- Terminal-like aesthetic (monospace font, dark background, prompt cursor)
- `type help` command reveals available commands/tabs
- Commands redirect to different sections
- Beautiful, polished feel despite the minimalist terminal theme

## Exploration

### Q: What is the primary purpose of this personal website?
All of the above — a full personal hub covering portfolio/work showcase, personal brand/identity, and writing/blog.

**Insights:** This is an ambitious scope. The terminal UI metaphor can unify all three: commands like `projects`, `about`, `blog` make the site feel cohesive even with diverse content. Navigation becomes a feature, not just chrome.

### Q: Who is the primary audience visiting your site?
General — friends, collaborators, and anyone curious about the person.

**Insights:** This liberates the design. No need to optimize for recruiter skim-ability or keyword SEO. The terminal UI gimmick is entirely appropriate here — it's a personal expression, not a conversion funnel. The experience itself IS the message. This also means personality and playfulness should come through.

### Q: How should the terminal UI handle visitors who don't know what to type?
Exactly like mariya.fyi.

**mariya.fyi onboarding (fetched):**
- Boot sequence on load: `[ OK ] Starting session`, `[ OK ] User profile loaded`, `[ INFO ] Last login: <date>`
- Auto-runs `$ whois mariya` to show profile info immediately
- Navigation via typed commands (`about`, `research`, `blog`, etc.)
- `help` lists all available commands
- Easter egg commands: `vim`, `nano`, `git blame`, `make coffee`, `kill -9`, etc.
- Click anywhere focuses the input field
- Color-coded output (green/red status, accent colors)
- Six nav sections shown at top as links too

**Insights:** The onboarding is a "boot + auto-whois" pattern — the site explains itself through simulated terminal output. No blank cursor guessing. Easter eggs reward curious users. This is the exact pattern to replicate and personalize.

### Q: What sections/commands should your site have?
Tentative list:
- `about` — who you are
- `cv` — maybe
- `work` — professional experience (separate from projects)
- `projects` — side projects / builds
- `blog` — personal blog (currently at adgapar.dev, hosted on Ghost)
- `newsletter` — Applied Safe AI newsletter (Substack)
- `contact` — how to reach you
- `uses` — maybe (tools/gear/setup)
- `photos` / `media` — maybe (photos/videos from Instagram, uploadable)

**Insights:** The site is a personal hub that aggregates multiple external properties (Ghost blog, Substack). This raises key architectural questions: does this site replace or link to those? The media/photos tab is unique — it implies an admin/upload workflow beyond static content.

### Q: How should this site relate to the Ghost blog and Substack newsletter?
For now: **link out**. Ghost and Substack stay where they are. However, want the ability to embed specific blog posts (iframe / Twitter-card-style embeds) as highlighted content.

**Insights:** "Link out with featured embeds" is a hybrid pattern. The `blog` command could show a curated list of hand-picked posts with rich previews, plus a "read more on adgapar.dev" link. This avoids full RSS sync complexity while still feeling content-rich.

### Q: The photos/media tab — what's the vision for it?
Static gallery — manually add image/video files to the repo, commit, and Vercel redeploys.

**Insights:** Simplest possible approach. Keeps the stack purely static/serverless. For a personal site, this is perfectly reasonable — content updates are infrequent. Could organize files under `public/media/` with a JSON manifest for metadata (caption, date). No backend or auth needed.

### Q: What's the visual feel you're going for?
"Surprise me — I trust the design process." No strong constraint on dark/light or color scheme.

**Insights:** Design freedom is wide open. During research/planning, worth exploring terminal themes beyond the cliché green-on-black: e.g., warm amber (retro CRT), soft nord/catppuccin palettes, or even an inverted light terminal. The mariya.fyi approach (dark with accent colors) is a strong baseline.

### Q: Domain situation — where will this site live?
Not sure yet. TBD — not a blocker for design/build.

**Insights:** Domain strategy can be decided late. For Vercel deployment, the site gets a `*.vercel.app` URL immediately, and a custom domain can be pointed at it any time. Keep this as an open question.

### Q: What should NOT be on this site (anti-goals)?
All of the above:
- No heavy animations / slow loads
- No generic / template-y feel — must feel hand-crafted
- No overengineering — avoid CMS complexity, admin panels, databases

**Insights:** These three constraints together define quality: fast, original, and simple. The terminal UI metaphor is actually anti-template by nature (almost nobody builds this way), so the aesthetic constraint is already satisfied by the concept. The performance and simplicity constraints point toward: static generation, minimal JS, avoid heavy deps.

### Q: Mobile experience — how should the site behave on phones?
Hybrid: terminal + visible tap buttons. Show tappable command buttons alongside the text input on mobile (and optionally on desktop too).

**Insights:** The hybrid approach is the right call. Tap buttons make the interaction discoverable without ruining the terminal aesthetic — they can be styled as `[about]` `[projects]` chips or a subtle row of commands. mariya.fyi shows nav links at the top for exactly this reason.

### Note: Easter Eggs (user-inspired)
User was delighted by mariya.fyi easter eggs:
- `git blame` → meaningful response
- `git commit` → "on branch main. nothing to commit. everything is intentional."
- `git pull` → "already up to date."
- `git push` → "pushed. the internet has been updated."

**Insights:** Easter eggs are a first-class feature, not an afterthought. They reward curious/technical visitors, showcase personality, and create shareable moments. These should be deeply personal — referencing the user's actual work, interests, and sense of humor. Worth spending time crafting these during content planning.

## Synthesis

### Key Decisions
- **Stack:** Next.js (App Router) + pnpm + Vercel deployment. Static generation preferred.
- **UI Pattern:** Terminal-like interface inspired by mariya.fyi — boot sequence on load, auto-runs `whois <name>`, full command input, `help` lists all commands.
- **Sections/commands:** `about`, `work`, `projects`, `blog` (link-out to Ghost), `newsletter` (link-out to Substack), `cv`, `uses` (TBD), `photos` (static gallery), `contact`
- **Blog/Newsletter:** External platforms stay. This site links out, with optional curated featured-post embeds.
- **Photos/media:** Static files committed to repo under `public/media/`, no backend needed.
- **Mobile:** Hybrid — terminal input + visible tap buttons (styled command chips). Terminal stays functional, just augmented.
- **Easter eggs:** First-class feature. Personal, witty responses to unexpected commands (git commands, `sudo`, `rm -rf /`, etc.). These define the site's voice.
- **Visual:** Design freedom — research phase decides palette/theme. Baseline: dark terminal with signature accent color.

### Open Questions
- Does `cv` show inline terminal-formatted output, or just a download link for a PDF?
- Include `uses` in v1 or defer to v2?
- Vite vs Next.js Turbopack — user mentioned Vite; clarify whether standalone Vite+React or Next.js with its default bundler is intended
- Domain strategy: new domain vs taking over adgapar.dev
- What specific easter egg commands and responses to include (content work)
- Should featured blog post embeds be hardcoded JSON or editable via a data file?

### Constraints Identified
- No overengineering — no CMS, no admin panels, no database (static/serverless only)
- No generic/template-y feel — must feel hand-crafted and personal
- No heavy JS / slow load — performance matters
- Blog stays on Ghost (adgapar.dev), newsletter stays on Substack — no migration in v1
- Photos managed via git (commit to deploy), not an upload API

### Core Requirements
1. Terminal UI on the homepage — boot sequence, prompt, command input
2. `help` command lists all available commands with descriptions
3. Navigation commands (`about`, `projects`, etc.) render content inline in the terminal OR route to dedicated pages
4. Easter egg command system with witty, personal responses
5. Hybrid mobile experience — command buttons alongside text input
6. Six+ main sections: about, work, projects, blog, newsletter, cv, photos, contact
7. Blog and newsletter sections link out to Ghost and Substack respectively
8. Static photo gallery rendered from files in `public/media/`
9. Deployed on Vercel with CI/CD on push to main
10. Fast — static generation, minimal client-side JS, no unnecessary deps

## Next Steps

- **→ /create-plan** — Build a detailed technical implementation plan using this brainstorm as input context.
