'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { profile } from '@/data/profile'

export type IndexPost = {
  slug: string
  title: string
  date: string
  subtitle?: string
  href: string
  external?: boolean
  cover?: string
}

type Collection = 'all' | 'blog' | 'newsletter'

export default function WritingIndexWindow({ blog, newsletter }: { blog: IndexPost[]; newsletter: IndexPost[] }) {
  const [collection, setCollection] = useState<Collection>('all')
  const [query, setQuery] = useState('')
  const posts = [
    ...blog.map(post => ({ ...post, source: 'blog' as const })),
    ...newsletter.map(post => ({ ...post, source: 'newsletter' as const })),
  ].sort((a, b) => b.date.localeCompare(a.date))
  const results = posts.filter(post =>
    (collection === 'all' || post.source === collection) &&
    `${post.title} ${post.subtitle ?? ''}`.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <article className="reading-library">
      <header className="library-masthead">
        <span className="reading-label">Adilet Gaparov / collected writing</span>
        <h1>The reading room<span aria-hidden>.</span></h1>
        <p>Notes on building, AI, and life in between.</p>
        <a href={profile.links.newsletter} target="_blank" rel="noopener noreferrer">The Working Prototype on Substack ↗</a>
      </header>

      <section className="reading-featured" aria-label="Latest writing">
        {([
          { post: blog[0], label: 'Latest essay', source: 'blog' },
          { post: newsletter[0], label: 'The Working Prototype', source: 'newsletter' },
        ] as const).map(({ post, label, source }) => post && (
          <Link key={source} href={post.href} className={`reading-feature reading-feature-${source}`}>
            <div className="reading-feature-art">
              {post.cover ? <Image src={post.cover} alt="" width={640} height={420} sizes="(max-width: 639px) 90vw, 480px" /> : <span aria-hidden>¶</span>}
            </div>
            <div className="reading-feature-copy">
              <span className="reading-label">{label} <span>↗</span></span>
              <h2>{post.title}</h2>
              {post.subtitle && <p>{post.subtitle}</p>}
              <time dateTime={post.date}>{post.date}</time>
            </div>
          </Link>
        ))}
      </section>

      <section className="reading-archive" aria-label="Writing archive">
        <div className="reading-archive-heading"><h2>The archive</h2><span aria-live="polite">{results.length} pieces</span></div>
        <div className="reading-filters">
          <div role="group" aria-label="Writing collection">
            {(['all', 'blog', 'newsletter'] as const).map(value => <button key={value} type="button" aria-pressed={collection === value} onClick={() => setCollection(value)}>{value === 'all' ? 'All writing' : value === 'blog' ? 'Essays' : 'Newsletter'}</button>)}
          </div>
          <input type="search" aria-label="Search writing" placeholder="Find a piece…" value={query} onChange={event => setQuery(event.target.value)} />
        </div>
        <div className="reading-archive-list">
          {results.map(post => <Link key={post.href} href={post.href} className="reading-archive-row">
            <time dateTime={post.date}>{post.date}</time>
            <span>{post.title}</span>
            <small>{post.source === 'blog' ? 'essay' : 'newsletter'}</small>
            <span aria-hidden>↗</span>
          </Link>)}
          {results.length === 0 && <p className="reading-empty">No pieces match this search. Try another phrase or collection.</p>}
        </div>
      </section>
    </article>
  )
}
