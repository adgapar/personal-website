---
date: 2026-03-11T00:00:00Z
topic: "Personal Website Build — Learnings & Patterns"
status: living
---

# Personal Website — Build Learnings

Notes on what worked, what didn't, and patterns worth reusing.

---

## UX Patterns

### Table + `open <n>` ⭐
Show a list as a compact table with numbered rows. Users type `open 1` or `open <name>` to expand into a detail view (label layout). The hint line at the bottom of the table teaches the interaction without being obtrusive.

**Use for:** any list with expandable detail — projects, blog posts, bookmarks, etc.

```ts
table: {
  headers: ['name', 'type', 'status'],
  rows: projects.map((p) => ({ cols: [p.name, p.type, p.status] })),
  hint: "type 'open 1' or 'open <name>' for details",
}
```

### Status column with color semantics
Add a `status` column to any table. The renderer maps values to colors automatically:
- `live` / `current` / `active` → green (`--success`)
- `cancelled` / `archived` / `abandoned` → red (`--error`)
- `past` / anything else → muted grey

Works for both work history (current vs past jobs) and projects (live vs cancelled).

### Page-scoped commands
Each page defines a small set of allowed commands. Navigation always works everywhere. Static blocks can't be re-triggered ("↑ already shown above"). Easter eggs bypass the allowed-list check via `hasCommand()`.

### Quote block for bio / long text
Thin grey left border (`border-l`), bright white text. More editorial than plain text, less heavy than a box.

```ts
{ content: profile.longBio, style: 'quote' }
```

### `[OK]` / `[INFO]` prefix coloring
Detect `[LABEL]` prefix in success/info lines and color only the bracket part:
- `[OK]` → accent blue
- `[INFO]` → warm amber

The rest of the line stays muted.

### No command echo
Don't repeat the typed command above the response — the user just typed it, it's redundant. Show output directly. Cleaner, more aesthetic.

### Input + response tight grouping
Wrap prompt input and response in a single container with small gap (`space-y-2`). Keep this group separated from static session blocks by larger spacing (`space-y-8`). Prevents a jarring jump between input and output.

---

## Navigation

### Combining related pages
Fewer nav items = cleaner. Combine related content under one route:
- `work` + `projects` → `/work`
- `blog` + `newsletter` → `/writing`

Old routes redirect. Terminal commands for old names still navigate to the new route. Nav stays minimal.

### `~/handle` is not a link
The handle label in the nav (`~/adilet`) is a non-clickable `<span>`. Clicking it goes nowhere useful. About/home is a separate nav item.

---

## Visual Design

### Command color hierarchy
- `$` prompt → accent blue
- command verb → bright white
- arguments → warm amber

### Three text levels
- `--bright` (`#f0ece5`) — names, titles, primary values
- `--fg` (`#d8d4cd`) — body text
- `--muted` (`#504e49`) — labels, metadata, secondary info

### Label layout for structured data
Two-column key→value layout. Empty label `''` aligns a description line with the values above.

```ts
{ label: 'role',    content: 'Founding AI Engineer', style: 'bright' },
{ label: 'company', content: 'Orbio AI', style: 'default' },
{ label: '',        content: 'Building AI agents...', style: 'default' },
```

---

## Architecture

### Session blocks are static, commands are interactive
Pages show pre-rendered session blocks on load (like a script). The terminal input is an extra — page-scoped commands + nav + easter eggs. Don't blur the two.

### Easter eggs bypass the allowed list
Register easter eggs normally. In the allowed-command check, also call `hasCommand(input)` so hidden commands get through without being listed in help.

### Animation fix for Next.js router cache
Router cache can restore components with stale ref state. Fix: closure-local `cancelled` flag + reset `visibleCount(0)` at the top of the effect. Don't use refs for animation control.

---

## Content

### "current" vs "past" in work table
Mark the active job as `current` (renders green), previous roles as `past` (muted), cancelled projects as `cancelled` (red).

### URL consistency
Always use `www.adgapar.dev`, not `adgapar.dev`. Keep all URLs in `src/data/profile.ts` as the single source of truth.
