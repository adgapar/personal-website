'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import BitmapIcon from '@/components/visual/BitmapIcon'
import { posts } from '@/data/posts'

/**
 * Things that live on the desk rather than inside the terminal.
 *
 * The rule: an icon earns the desk when nothing else already opens that thing.
 * Icons for the five tabs would be a second navigation for the same five pages,
 * so the desk holds no pages — only the reader, and whatever apps come after it.
 *
 * Every icon is a 1-bit bitmap of a real picture in a paper edge, never a drawn
 * glyph. See BitmapIcon for why.
 *
 * Kept at z-[5] so a maximized or dragged window passes over it rather than
 * under, and nothing is hidden behind this: the writing tab has a button and
 * `reader` works at any prompt.
 *
 * Not rendered on the reader's own routes: it has its own shell there.
 */

export default function DesktopIcons() {
  const pathname = usePathname()
  if (pathname.startsWith('/reader')) return null

  // the newest piece wears the reader's icon — it changes every time you publish
  const newest = posts.find((post) => post.cover)

  return (
    // aligned to the desk's own margin, top-left, so the window can be dragged
    // anywhere without the icons ever being what it lands on
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden px-6 pt-8 sm:flex sm:px-10 sm:pt-10">
      <Link
        href="/reader"
        title={
          newest
            ? `open reader — writing, as pages · newest: ${newest.title}`
            : 'open reader — writing, as pages'
        }
        className="group pointer-events-auto flex w-[86px] flex-col items-center gap-2 rounded-sm p-1 text-center focus-visible:outline-none"
      >
        <span className="border border-[var(--fg)] bg-[var(--surface)] p-[3px] leading-none shadow-[2px_2px_0_rgba(27,27,31,0.16)] transition-transform duration-200 group-hover:-translate-y-0.5">
          <BitmapIcon src={newest?.cover ?? '/profile.jpg'} grid={30} size={44} />
        </span>
        <span className="font-mono text-[10px] tracking-widest text-[var(--muted)] transition-colors duration-200 group-hover:text-[var(--fg)] group-focus-visible:text-[var(--fg)]">
          reader
        </span>
      </Link>
    </div>
  )
}
