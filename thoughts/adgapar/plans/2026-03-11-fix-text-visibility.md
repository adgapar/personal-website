---
date: 2026-03-11T00:00:00Z
author: adgapar
topic: "Fix Text Visibility & Responsive Layout"
tags: [plan, personal-website, css, accessibility, colors, responsive]
status: in-progress
last_updated: 2026-03-11
last_updated_by: adgapar
---

# Fix Text Visibility — Color Token Contrast Plan

## Overview

Some text on the site is nearly invisible due to two CSS color tokens (`--dim` and `--muted`) being too dark relative to the near-black background. This plan corrects both tokens to improve readability while preserving the visual hierarchy.

## Current State Analysis

**Background**: `--bg: #0c0b0a` (near-black)

| Token | Current Value | Approx Contrast | Problem |
|-------|--------------|-----------------|---------|
| `--dim` | `#252321` | ~1.2:1 | Dates in `updates.log`, row numbers — virtually invisible |
| `--muted` | `#504e49` | ~2.5:1 | `focus` value in `whois`, secondary text throughout — hard to read |

**WCAG AA** requires 4.5:1 for normal text, 3:1 for large/decorative text.

### Key Discoveries:
- `--dim` and `--muted` are defined in one place: `src/app/globals.css:8-9`
- All consumers reference CSS variables — no hardcoded hex values to hunt down
- `--dim` is used exclusively for text (row numbers, dates): `TerminalSession.tsx:182,184,218,247`
- `--muted` is used for secondary text AND the `quote` style's left border: `TerminalLine.tsx:26,70`
- `--border: #2a2826` is a separate token used for structural borders — not affected

## Desired End State

A clean 4-level text hierarchy with readable contrast at every level:

| Token | New Value | Role |
|-------|-----------|------|
| `--bright` | `#f0ece5` | Emphasis / headings (unchanged) |
| `--fg` | `#d8d4cd` | Body text (unchanged) |
| `--muted` | `#7c7970` | Secondary text — readable but clearly subordinate |
| `--dim` | `#504e49` | Tertiary text — de-emphasized but still legible |

After the fix:
- `updates.log` dates are visible (dim, not invisible)
- `whois focus` value is readable
- All muted secondary text across the site is legible

## Quick Verification Reference

- Build: `pnpm build`
- Dev server: `pnpm dev`
- Type check: `pnpm tsc --noEmit`

Key files:
- `src/app/globals.css` — Phase 1 only
- `src/components/terminal/TerminalSession.tsx` — Phase 2
- `src/components/layout/PageLayout.tsx` — Phase 2
- `src/components/layout/SiteNav.tsx` — Phase 2

## What We're NOT Doing

- Not touching `--border: #2a2826` (structural borders don't need text contrast)
- Not re-assigning which style (`muted` vs `dim`) any line uses
- Not touching `--bg`, `--fg`, `--bright`, `--accent`, `--warm`, `--success`, `--error`, `--info`
- Not redesigning the terminal aesthetic or layout structure

## Implementation Approach

**Phase 1** — Shift `--dim`/`--muted` up the brightness scale (one file, no components).

**Phase 2** — Make layout responsive: widen the content area on large screens, scale font up, and fix padding + table overflow on mobile. Currently everything is pinned at `max-w-2xl` (672px) with `text-xs` (12px) — looks tiny on a 32" display and overflows on mobile due to fixed-width columns.

---

## Phase 1: Update Color Tokens in globals.css

### Overview

Replace the two under-contrasted tokens in the single CSS source-of-truth file. No component changes needed — all consumers reference CSS variables.

### Changes Required:

#### 1. CSS Custom Properties
**File**: `src/app/globals.css`

Change lines 8–9 from:
```css
--muted:   #504e49;
--dim:     #252321;
```

To:
```css
--muted:   #7c7970;
--dim:     #504e49;
```

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles cleanly: `pnpm tsc --noEmit`
- [ ] Build succeeds: `pnpm build`
- [ ] Token values updated: `grep -n "muted\|dim" src/app/globals.css`

#### Manual Verification:
- [ ] Open homepage — `updates.log` dates (e.g. "2026-02") are now clearly readable
- [ ] `whois adilet` — the `focus` row value is legible
- [ ] Muted secondary text (hint lines, label keys, work history details) is readable without straining
- [ ] Row numbers in project/work tables are visible but still clearly de-emphasized
- [ ] `quote` style left border (used in `cat about.txt`) looks appropriate — slightly lighter than before
- [ ] No text feels blown out or competing with primary content (`--fg`/`--bright`)

**Implementation Note**: After completing this phase, pause for manual verification in the browser. Once confirmed, create a commit: `fix: improve text contrast for --muted and --dim tokens`.

---

## Phase 2: Responsive Layout — Wide Screen + Mobile Fixes

### Overview

The terminal is pinned to `max-w-2xl` (672px) with `text-xs` (12px) everywhere. On a 32" display this looks tiny; on mobile the fixed-width table columns overflow and clip text. This phase makes width and font scale with the viewport.

### Current Layout Problems:
- `PageLayout.tsx:18` — outer wrapper `max-w-4xl`, inner `max-w-2xl` in TerminalSession
- `TerminalSession.tsx:159` — `text-xs` base font, not scaled
- `TerminalSession.tsx:162` — `px-10` padding is ~80px on mobile (375px screen → 295px usable)
- `TerminalSession.tsx:11` — `COL_WIDTHS = ['w-44', 'w-44', 'w-24', 'w-20']` fixed, no mobile fallback
- `SiteNav.tsx:19,28` — nav text hardcoded `text-[11px]`

### Changes Required:

#### 1. Responsive max-width + font scaling
**File**: `src/components/terminal/TerminalSession.tsx`

- Line 159: Change `text-xs` → `text-xs lg:text-sm` (scales up on large screens)
- Line 162: Change `px-10 max-w-2xl` → `px-4 sm:px-8 lg:px-12 max-w-2xl lg:max-w-3xl xl:max-w-4xl`

#### 2. Responsive padding on outer layout
**File**: `src/components/layout/PageLayout.tsx`

- Line 18: Change `max-w-4xl` → `max-w-4xl xl:max-w-5xl` (gives TerminalSession room to grow)

#### 3. Nav font scaling
**File**: `src/components/layout/SiteNav.tsx`

- Line 19, 28: Change `text-[11px]` → `text-[11px] lg:text-xs` on all nav text

#### 4. Mobile table overflow
**File**: `src/components/terminal/TerminalSession.tsx`

- Line 11: Add `min-w-0` fallback handling — wrap table/list containers in `overflow-x-auto` OR reduce fixed column widths at mobile breakpoints
- Line 162: `px-4 sm:px-8` (already covered above) will also help with cut-off text

### Success Criteria:

#### Automated Verification:
- [ ] TypeScript compiles cleanly: `pnpm tsc --noEmit`
- [ ] Build succeeds: `pnpm build`

#### Manual Verification:
- [ ] On a wide screen (≥1920px): content area is noticeably wider, text is more readable
- [ ] On a 32" 4K display: text reads at ~13-14px scale, not microscopic
- [ ] On mobile (375px): no text is horizontally clipped; tables scroll or wrap gracefully
- [ ] Nav links are visible and proportional on all breakpoints
- [ ] Terminal aesthetic is preserved — still centered, not stretched full-width

**Implementation Note**: After completing this phase, pause for manual verification across viewport sizes (mobile, laptop, wide screen). Once confirmed, create a commit: `feat: responsive layout — widen content on large screens, fix mobile overflow`.

---

## Testing Strategy

Visual spot-check in the browser at multiple viewport sizes. Key pages/commands to verify:
1. **Homepage** — `whois adilet` focus row; `updates.log` dates; check on mobile + wide screen
2. **work.log** — muted period/status lines; table columns on mobile
3. **projects/** — muted detail bullets, row numbers, table overflow on mobile
4. Any page with hint/footer lines (e.g. `"type 'open <n>' for details"`)
5. Use browser DevTools device emulation: 375px (iPhone SE), 1440px (laptop), 2560px (wide)

## References

- Research notes: `thoughts/adgapar/research/2026-03-11-content-improvement-research.md`
