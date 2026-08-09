'use client'

import Link from 'next/link'
import TerminalTabs from '@/components/layout/TerminalTabs'
import { TITLE_BAR, WINDOW_FRAME } from '@/lib/window-style'

/**
 * The writing section as a contents page rather than a terminal listing.
 *
 * The navigator beside it is for jumping; this is the overview, so it carries
 * what a sidebar cannot — subtitles, and the difference between something
 * published here and something published on Substack.
 */

export type IndexPost = {
  slug: string
  title: string
  date: string
  subtitle?: string
  href: string
  external?: boolean
}

function Row({ post }: { post: IndexPost }) {
  const inner = (
    <>
      <span className="font-mono text-[11px] text-[#a89e8d] tabular-nums">{post.date}</span>
      <span className="block text-[1.05rem] leading-snug text-[#1f1b16] group-hover:underline">
        {post.title}
        {post.external && <span className="pl-1.5 text-[0.7em] text-[#a89e8d]">↗</span>}
      </span>
      {post.subtitle && (
        <span className="block text-[0.9rem] leading-snug text-[#5d564c]">{post.subtitle}</span>
      )}
    </>
  )

  const className = 'group block space-y-0.5 border-b border-[#e5ded0] py-3 last:border-0'

  return post.external ? (
    <a href={post.href} target="_blank" rel="noopener noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link href={post.href} className={className}>
      {inner}
    </Link>
  )
}

export default function WritingIndexWindow({
  blog,
  newsletter,
}: {
  blog: IndexPost[]
  newsletter: IndexPost[]
}) {
  return (
    <div
      className="flex max-h-full w-full flex-col overflow-hidden"
      style={WINDOW_FRAME}
    >
      <div
        className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-1.5 font-mono select-none"
        style={TITLE_BAR}
      >
        <span className="truncate text-[10px] tracking-widest text-[var(--muted)]">
          ~/writing — {blog.length + newsletter.length} pieces
        </span>
      </div>

      <TerminalTabs />

      <article className="paper flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:px-14 sm:py-12">
        <header className="mb-10">
          <h1 className="text-[1.75rem] leading-tight font-semibold text-[#1f1b16]">
            Writing
          </h1>
          <p className="mt-2 text-[1rem] text-[#5d564c] italic">
            Essays here, and a newsletter on AI reliability over on Substack.
          </p>
        </header>

        <section className="mb-14">
          <div className="mb-3 flex items-baseline gap-3 border-b-2 border-[#1f1b16] pb-1.5">
            <h2 className="text-[1.15rem] font-semibold text-[#1f1b16]">Blog</h2>
            <span className="font-mono text-[10px] tracking-widest text-[#8a8178]">
              {blog.length} posts · here
            </span>
          </div>
          <div>
            {blog.map((post) => (
              <Row key={post.slug} post={post} />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-baseline gap-3 border-b-2 border-[#1f1b16] pb-1.5">
            <h2 className="text-[1.15rem] font-semibold text-[#1f1b16]">
              The Working Prototype
            </h2>
            <span className="font-mono text-[10px] tracking-widest text-[#8a8178]">
              {newsletter.length} issues · substack
            </span>
          </div>
          <div>
            {newsletter.map((post) => (
              <Row key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </article>
    </div>
  )
}
