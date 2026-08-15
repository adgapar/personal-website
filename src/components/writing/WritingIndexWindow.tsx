'use client'

import Link from 'next/link'
import BitmapIcon from '@/components/visual/BitmapIcon'

/**
 * The reader's home screen — a contents page rather than a terminal listing,
 * shown in the same right-hand pane a post would open in.
 *
 * The frame, the title bar and the left pane belong to ReaderShell. The list on
 * the left is for jumping; this is the overview, so it carries what a sidebar
 * cannot — subtitles, and the difference between something published here and
 * something published on Substack.
 */

export type IndexPost = {
  slug: string
  title: string
  date: string
  subtitle?: string
  href: string
  external?: boolean
  /** served path of the post's header image */
  cover?: string
}

function Row({ post }: { post: IndexPost }) {
  const inner = (
    <>
      {/* Every post already ships a header image and the index showed none of
          them. One bit on paper reads as a newspaper cut, and it gives 25
          near-identical rows something to tell them apart. */}
      {post.cover && <BitmapIcon
        src={post.cover}
        grid={30}
        size={44}
        ink={[36, 31, 25]}
        contrast={1.7}
        className="mt-[3px] shrink-0 border border-[#ddd6c8]"
      />}
      <span className="block space-y-0.5">
        <span className="block font-mono text-[11px] text-[#a89e8d] tabular-nums">{post.date}</span>
        <span className="block text-[1.05rem] leading-snug text-[#1f1b16] group-hover:underline">
          {post.title}
          {post.external && <span className="pl-1.5 text-[0.7em] text-[#a89e8d]">↗</span>}
        </span>
        {post.subtitle && (
          <span className="block text-[0.9rem] leading-snug text-[#5d564c]">{post.subtitle}</span>
        )}
      </span>
    </>
  )

  // break-inside-avoid: in the two-column layout a row must not be split down
  // the middle, with its date at the foot of one column and its title at the
  // head of the next
  const className =
    'group flex items-start gap-3.5 break-inside-avoid border-b border-[#e5ded0] py-3 last:border-0'

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
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
      <article className="paper min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:px-14 sm:py-12">
        {/* the contents page has the window to itself, so it sets its own
            measure — a title stretched over 1000px is not a contents page */}
        <div className="mx-auto w-full max-w-2xl lg:max-w-none">
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
          {/* two columns only where there is width for them — on a phone this
              stays one column, which is the only thing that reads there */}
          <div className="lg:columns-2 lg:gap-x-12">
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
        </div>
      </article>
    </div>
  )
}
