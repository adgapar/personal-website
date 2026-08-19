'use client'

import Image from 'next/image'
import Link from 'next/link'
import {
  Fragment,
  useCallback,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from 'react'
import { posts } from '@/data/posts'
import { profile } from '@/data/profile'
import {
  getServerSnapshot,
  getSnapshot,
  subscribe,
} from '@/lib/window-state-store'

/**
 * The dock: the launchers that are not tabs.
 *
 * The desk already had one rule and this keeps it — an icon earns a place here
 * when nothing else already opens that thing. The five tabs open the five
 * sessions, so no tab has an icon; what is left is the reader, which is an app
 * rather than a page, and the three places off this desk where the work
 * actually lives. The contact tab still lists every channel, including the ones
 * missing here. The dock is not that list. It is the four things worth one
 * click from anywhere, and the divider says which side of the machine each is on.
 *
 * The reader used to sit at the top left of the desk as a lone icon. One place
 * for launchers beats two, and the bottom edge is where a desktop keeps the
 * things it launches.
 *
 * Magnification is the reason a dock is a dock. The swell is a gaussian on the
 * distance from the cursor, and every tile pushes its neighbours away by half of
 * its own growth — which is what holds the gap between two tiles at exactly the
 * gap, however large either of them gets. Anything less and the icons overlap
 * as they grow, which is the failure that makes an imitation dock look like one.
 *
 * Above the window rather than under it, which is what the real one does: drag
 * the terminal down and it slides beneath the dock, and a magnified icon rises
 * over the terminal's bottom edge. What it must never do is stand on the
 * window's own bottom edge, because that edge is the prompt and the status bar —
 * so the desk keeps enough padding below the window for the dock to sit in, and
 * the two only meet when you drag them together.
 *
 * The one exception is a maximized window. That is this desktop's full screen,
 * and a dock over a full-screen app is furniture covering the thing you opened;
 * macOS hides it there too.
 *
 * Nothing is only here: `reader` works at any prompt, and every off-site link is
 * on the contact tab.
 */

/** the paper tile at rest — 36px of art in a 3px mount inside a 1px rule */
const TILE = 44
/** how large the tile under the cursor grows */
const MAX = 1.5
/** how far the swell reaches, in pixels — about one tile to each side */
const SIGMA = 60

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)'

interface Item {
  key: string
  href: string
  /** what the tooltip says — short, because it is a name and not a sentence */
  label: string
  /** the accessible name, which can afford to say more */
  description: string
  external?: boolean
  art: ReactNode
}

/* The marks are the real ones. A drawn glyph could stand for any site; the
   Substack, GitHub and X marks stand for exactly one each, which is the whole
   job of an icon in a dock. Ink on paper, like everything else on this desk. */
function Mark({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center">
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className="h-[18px] w-[18px] fill-[var(--fg)]"
      >
        {children}
      </svg>
    </span>
  )
}

export default function Dock() {
  const { maximized, minimized } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  )

  // the newest piece wears the reader's icon — it changes every time you publish
  const newest = posts.find((post) => post.cover)

  const items: Item[] = [
    {
      key: 'reader',
      href: '/reader',
      label: 'reader',
      description: newest
        ? `open the reader — writing, as pages · newest: ${newest.title}`
        : 'open the reader — writing, as pages',
      art: (
        <Image
          src={newest?.cover ?? '/profile.jpg'}
          alt=""
          width={36}
          height={36}
          className="block h-9 w-9 rounded-[2px] object-cover"
        />
      ),
    },
    {
      key: 'substack',
      href: profile.links.newsletter,
      label: 'substack ↗',
      description: 'The Working Prototype on Substack — subscribe',
      external: true,
      art: (
        <Mark>
          <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z" />
        </Mark>
      ),
    },
    {
      key: 'github',
      href: profile.links.github,
      label: 'github ↗',
      description: `code on GitHub — @${profile.handle}`,
      external: true,
      art: (
        <Mark>
          <path d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 0-.8.4-1.3.7-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2 0-.4-.5-1.6.2-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.6.2 2.8.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.5.4.9 1.1.9 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3" />
        </Mark>
      ),
    },
    {
      key: 'x',
      href: profile.links.twitter,
      label: 'x ↗',
      description: `thinking out loud on X — @${profile.handle}`,
      external: true,
      art: (
        <Mark>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </Mark>
      ),
    },
  ]

  const anchors = useRef<(HTMLAnchorElement | null)[]>([])

  /**
   * `u` is the cursor, in the row's own coordinates; null is rest.
   *
   * Read from offsetLeft rather than from a formula over TILE, so the divider
   * between the app and the links costs nothing to account for: a laid-out
   * position is unaffected by the transforms this then writes over it.
   */
  const swell = useCallback((u: number | null) => {
    const nodes = anchors.current.filter(Boolean) as HTMLAnchorElement[]
    if (!nodes.length) return

    const still =
      u !== null && window.matchMedia(REDUCED_MOTION).matches

    const centres = nodes.map((n) => n.offsetLeft + n.offsetWidth / 2)
    const scales = centres.map((c) =>
      u === null || still
        ? 1
        : 1 + (MAX - 1) * Math.exp(-((u - c) ** 2) / (2 * SIGMA ** 2)),
    )

    nodes.forEach((node, i) => {
      // every other tile pushes this one away by half of its own growth, which
      // leaves the gap between any two of them unchanged and the row centred
      let tx = 0
      scales.forEach((s, j) => {
        if (j !== i) tx += 0.5 * (s - 1) * TILE * Math.sign(centres[i] - centres[j])
      })

      node.style.transform = `translate3d(${tx.toFixed(2)}px,0,0)`
      // the label rides above the tile, so it needs the tile's current height
      node.style.setProperty('--lift', `${(TILE * scales[i]).toFixed(2)}px`)

      const tile = node.firstElementChild as HTMLElement | null
      if (tile) tile.style.transform = `scale(${scales[i].toFixed(3)})`
    })
  }, [])

  const row = useRef<HTMLElement>(null)

  const onMove = useCallback(
    (e: React.PointerEvent) => {
      const rect = row.current?.getBoundingClientRect()
      if (rect) swell(e.clientX - rect.left)
    },
    [swell],
  )

  // a maximized window is this desktop's full screen — after the hooks, so the
  // subscription is the same on every render
  if (maximized && !minimized) return null

  return (
    // The strip spans the desk so the panel can be centred on it, and takes no
    // pointer events of its own — only the panel is solid, and the desk on
    // either side of it stays clickable.
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-50 hidden justify-center pb-3 sm:flex">
      <nav
        ref={row}
        aria-label="dock"
        onPointerMove={onMove}
        onPointerLeave={() => swell(null)}
        // px-4: the room a tile at the end of the row needs to grow sideways
        // into without leaving the glass. The tiles grow up and out of the top
        // instead of resizing the panel, the way the real one does.
        className="glass pointer-events-auto flex items-end gap-2.5 rounded-xl px-4 py-1.5 after:rounded-xl"
        style={{ boxShadow: '0 10px 30px -12px rgba(40, 34, 22, 0.45)' }}
      >
        {/* Flat in the panel, with no wrapper around each pair: the swell reads
            offsetLeft, which is measured from the nearest positioned ancestor,
            and a wrapper per item would make every tile report the same
            position — every icon then grew at once, wherever the cursor was. */}
        {items.map((item, i) => (
          <Fragment key={item.key}>
            {/* the rule that says the machine ends here: one app on the left,
                three places that are not this website on the right */}
            {item.external && i > 0 && items[i - 1].external !== true && (
              <span
                aria-hidden
                className="relative z-10 mb-1 h-7 w-px shrink-0 bg-[rgba(35,32,25,0.28)]"
              />
            )}
            {/* Link for both: an absolute URL renders as a plain anchor, so
                the off-site three cost nothing and the reader keeps its
                client-side navigation */}
            <Link
              ref={(node) => {
                anchors.current[i] = node
              }}
              href={item.href}
              aria-label={item.description}
              {...(item.external
                ? { target: '_blank', rel: 'noreferrer noopener' }
                : {})}
              onFocus={() => {
                const node = anchors.current[i]
                if (node) swell(node.offsetLeft + node.offsetWidth / 2)
              }}
              onBlur={() => swell(null)}
              // z-10: the sheen along the top edge of the glass is painted
              // after the panel's children, so without this it lies over the
              // icons rather than under them
              className="group/dock relative z-10 flex shrink-0 items-end transition-transform duration-150 ease-out focus-visible:outline-none"
            >
              <span
                // the tile grows from its own bottom edge, so the row it
                // stands on never moves
                // Rounded, but nothing like a macOS squircle. These are prints
                // in a paper mount, not glossy app icons, and a 22% radius on a
                // 36px photograph crops the corners off the picture. 4px is the
                // radius of a card with a trimmed edge — enough that the row
                // reads as a dock and not as a filmstrip.
                className="block origin-bottom rounded-[4px] border border-[var(--fg)] bg-[var(--surface)] p-[3px] leading-none shadow-[2px_2px_0_rgba(27,27,31,0.16)] transition-transform duration-150 ease-out"
              >
                {item.art}
              </span>

              {/* the name, above the tile and out of its way */}
              <span
                aria-hidden
                style={{ bottom: 'calc(var(--lift, 44px) + 10px)' }}
                className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap border border-[var(--hair)] bg-[var(--surface)] px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-[var(--fg)] opacity-0 shadow-[2px_2px_0_rgba(27,27,31,0.16)] transition-opacity duration-150 group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100"
              >
                {item.label}
              </span>
            </Link>
          </Fragment>
        ))}
      </nav>
    </div>
  )
}
