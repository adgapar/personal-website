'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { presetForRoute } from '@/lib/dither'
import { TITLE_BAR, WINDOW_FRAME } from '@/lib/window-style'

const PaperBackground = dynamic(
  () => import('@/components/visual/PaperBackground'),
  { ssr: false },
)

/**
 * The desktop the reader lives on: wallpaper, a navigator window, and the open
 * document.
 *
 * This is a layout, not a page, so it survives navigation between posts — the
 * wallpaper is not re-initialised and the navigator is not rebuilt. Moving from
 * one post to the next swaps only the document, the way an app would.
 *
 * The left window is a file list rather than the full terminal session: once a
 * reader is open, what you want beside it is the other posts.
 */

export type NavPost = { slug: string; title: string; date: string; href: string }

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

  return (
    <div className="h-[100dvh] overflow-hidden bg-[var(--bg)]">
      <PaperBackground shape="sphere" preset={presetForRoute('/writing')} />

      <div className="relative z-10 flex h-full items-start justify-center gap-4 px-2 py-2 sm:gap-6 sm:px-6 sm:py-8 xl:gap-8">
        {/* navigator */}
        <nav
          className="hidden h-full w-full max-w-[15rem] shrink-0 flex-col overflow-hidden lg:flex xl:max-w-xs"
          style={WINDOW_FRAME}
        >
          <div
            className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-1.5 font-mono select-none"
            style={TITLE_BAR}
          >
            <span className="text-[10px] tracking-widest text-[var(--muted)]">
              ~/writing
            </span>
            <span className="ml-auto text-[10px] tracking-widest text-[var(--dim)]">
              {blog.length + newsletter.length}
            </span>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-2 py-3 font-mono">
            {[
              { label: 'blog', items: blog },
              { label: 'newsletter', items: newsletter },
            ].map(({ label, items }) => (
              <div key={label} className="mb-4">
                <div className="mb-1 flex items-center gap-2 border-b border-[var(--border)] px-2 pb-1">
                  <span className="text-[10px] tracking-widest text-[var(--warm)] uppercase">
                    {label}
                  </span>
                  <span className="ml-auto text-[10px] text-[var(--dim)]">
                    {items.length}
                  </span>
                </div>
                {items.map((post) => {
                  const active = pathname === post.href
                  return (
                    <Link
                      key={post.href}
                      href={post.href}
                      aria-current={active ? 'page' : undefined}
                      className={`block rounded-sm px-2 py-1.5 text-xs leading-snug transition-colors ${
                        active
                          ? 'bg-white/[0.05] text-[var(--accent)]'
                          : 'text-[var(--muted)] hover:bg-white/[0.03] hover:text-[var(--fg)]'
                      }`}
                    >
                      <span className="block text-[10px] text-[var(--dim)]">{post.date}</span>
                      {post.title}
                    </Link>
                  )
                })}
              </div>
            ))}
          </div>

          <Link
            href="/"
            className="border-t border-[var(--border)] px-3 py-2 font-mono text-[10px] tracking-widest text-[var(--muted)] hover:text-[var(--accent)]"
            style={TITLE_BAR}
          >
            ← terminal
          </Link>
        </nav>

        {/* the open document */}
        <div className="flex h-full w-full max-w-3xl flex-col lg:max-w-2xl xl:max-w-3xl">
          {children}
        </div>
      </div>
    </div>
  )
}
