'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { TITLE_BAR, WINDOW_FRAME } from '@/lib/window-style'
import DeskSurface from '@/components/visual/DeskSurface'
import Dock from '@/components/layout/Dock'
import WindowClose from '@/components/layout/WindowClose'

/**
 * The reader: one window on the desk, with the list of pieces in its own pane on
 * the left and whatever is open on the right.
 *
 * One window, not two side by side — a sidebar and the thing it selects are one
 * app, and two frames would claim they are separate programs that happen to be
 * arranged neatly. The frame, the title bar and the left pane belong to the
 * shell; the right pane is the only part a route replaces.
 *
 * This is a layout, not a page, so it survives navigation between posts — the
 * wallpaper is not re-initialised and the list is not rebuilt. Moving from one
 * post to the next swaps only the right pane, the way an app would.
 */

export type NavPost = { slug: string; title: string; date: string; href: string }

type Source = 'blog' | 'newsletter'

export default function ReaderShell({
  blog,
  newsletter,
  children,
}: {
  blog: NavPost[]
  newsletter: NavPost[]
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const total = blog.length + newsletter.length

  // On the contents page the list is already the whole right pane, so a second
  // copy of it on the left says the same thing twice. The left pane is what the
  // contents page turns into once something is open: a way to the next piece
  // without going back.
  const reading = pathname !== '/reader'
  const [focused, setFocused] = useState(false)

  // One source at a time, so the pane stays half as long as both lists joined —
  // and stays that length as the archive grows. The other source is not hidden:
  // its tab carries its count, which is the invitation to go and look.
  const openSource: Source | null = pathname.startsWith('/newsletter/')
    ? 'newsletter'
    : pathname.startsWith('/blog/')
      ? 'blog'
      : null
  const [tab, setTab] = useState<Source>(openSource ?? 'blog')

  // Opening a piece from the other source moves the tab with you; a tab you
  // chose by hand survives until then. Adjusted during render rather than in an
  // effect — React re-runs this component before painting, so the pane never
  // shows the wrong list for a frame.
  const [lastOpened, setLastOpened] = useState(openSource)
  if (openSource && openSource !== lastOpened) {
    setLastOpened(openSource)
    setTab(openSource)
  }

  const sources: { key: Source; items: NavPost[] }[] = [
    { key: 'blog', items: blog },
    { key: 'newsletter', items: newsletter },
  ]
  const items = tab === 'blog' ? blog : newsletter

  // Put the open piece where it can be seen. Without this, opening a newsletter
  // issue leaves the pane parked at the top of the list, so the one row that
  // says where you are is the one row you have to hunt for.
  const listRef = useRef<HTMLDivElement>(null)
  const activeRef = useRef<HTMLAnchorElement>(null)
  useEffect(() => {
    const box = listRef.current
    const row = activeRef.current
    if (!box || !row) return
    // set scrollTop directly rather than scrollIntoView, which would also
    // scroll every ancestor it can find
    box.scrollTop = Math.max(
      0,
      row.offsetTop - box.clientHeight / 2 + row.clientHeight / 2,
    )
  }, [pathname, tab])

  return (
    <div className="desk relative flex h-[100dvh] flex-col overflow-hidden">
      <DeskSurface />
      <Dock independent />

      {/* no inset below sm: the frame has no corners, edge or shadow there, so
          8px of desk around a flat rectangle only says the window missed */}
      <div className="relative z-10 flex min-h-0 flex-1 justify-center sm:px-6 sm:pt-6 sm:pb-20">
        {/* the window */}
        <div
          // the window is as wide as the view needs: a contents page alone is a
          // page, and only the two-pane reading view earns the extra 15rem
          // window-shell for the safe-area insets it carries below sm — this
          // window reaches the screen edges there too, so its title bar has the
          // same notch to keep clear of
          className={`reader-shell window-shell flex h-full w-full flex-col overflow-hidden transition-[max-width] duration-300 ${
            focused ? 'reader-focused max-w-6xl' : 'max-w-6xl'
          }`}
          style={WINDOW_FRAME}
        >
          {/* one title bar, for the whole app */}
          <div
            className="flex shrink-0 items-center gap-2 border-b border-[var(--border)] px-3 py-1.5 font-mono select-none"
            style={TITLE_BAR}
          >
            <Link
              href="/reader"
              className="text-[10px] tracking-widest text-[var(--muted)] hover:text-[var(--accent)]"
            >
              reading room
            </Link>
            <span className="text-[10px] tracking-widest text-[var(--chrome)]">
              {total} pieces
            </span>
            {reading && <button type="button" aria-pressed={focused} onClick={() => setFocused(value => !value)} className="reader-focus-toggle ml-auto">{focused ? 'Show library' : 'Focus reading'}</button>}
            <WindowClose label="Close reader and return to terminal" />
          </div>

          {/* the body: list on the left, what is open on the right */}
          <div className="flex min-h-0 flex-1">
            {reading && !focused && (
            <nav className="reader-sidebar hidden w-[15rem] shrink-0 flex-col border-r border-[var(--border)] lg:flex xl:w-[17rem]">
              <div className="reader-library-heading"><Link href="/reader">← All writing</Link><h2>On the shelf</h2></div>
              {/* one source at a time — the other tab shows what it holds */}
              <div
                className="flex shrink-0 gap-px border-b border-[var(--border)] px-2 pt-2 font-mono"
                role="tablist"
              >
                {sources.map(({ key, items: list }) => {
                  const on = tab === key
                  return (
                    <button
                      key={key}
                      type="button"
                      role="tab"
                      aria-selected={on}
                      onClick={() => setTab(key)}
                      className={`-mb-px flex items-baseline gap-1.5 border-b-2 px-2 py-1.5 text-[10px] tracking-widest transition-colors duration-150 ${
                        on
                          ? 'border-[var(--fg)] text-[var(--fg)]'
                          : 'border-transparent text-[var(--muted)] hover:text-[var(--fg)]'
                      }`}
                    >
                      {key}
                      <span className={on ? 'text-[var(--dim)]' : undefined}>
                        {list.length}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div
                ref={listRef}
                className="relative min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 font-mono"
              >
                {items.map((post) => {
                  const active = pathname === post.href
                  return (
                    <Link
                      key={post.href}
                      href={post.href}
                      ref={active ? activeRef : undefined}
                      aria-current={active ? 'page' : undefined}
                      // Titles are ink, not muted: this is the list you steer
                      // the app with, and every row was secondary to nothing.
                      // Selected is a filled row rather than a tinted one — a
                      // 5%-white wash on light glass was invisible.
                      className={`block rounded-sm px-2.5 py-1.5 text-xs leading-snug transition-colors ${
                        active
                          ? 'bg-[var(--accent)] text-white shadow-[0_1px_2px_rgba(20,16,8,0.2)]'
                          : 'text-[var(--fg)] hover:bg-black/[0.06]'
                      }`}
                    >
                      <span
                        className={`block text-[10px] ${
                          active ? 'text-white/75' : 'text-[var(--muted)]'
                        }`}
                      >
                        {post.date}
                      </span>
                      {post.title}
                    </Link>
                  )
                })}
              </div>

              <Link
                href="/"
                className="shrink-0 border-t border-[var(--border)] px-3 py-2 font-mono text-[10px] tracking-widest text-[var(--muted)] hover:text-[var(--accent)]"
                style={TITLE_BAR}
              >
                ← terminal
              </Link>
            </nav>
            )}

            {/* the open pane */}
            <div className="flex min-h-0 min-w-0 flex-1 flex-col">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
