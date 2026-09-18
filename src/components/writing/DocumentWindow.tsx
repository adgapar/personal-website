'use client'

import Link from 'next/link'
import { useState } from 'react'

/**
 * A post, in the reader's right-hand pane — a page of paper rather than
 * terminal output. Prose wants ink on light, a measure of about 65 characters,
 * and a serif; the terminal's chrome is the wrong instrument for a thousand
 * words.
 *
 * A pane, not a window: the frame and title bar belong to ReaderShell, and this
 * carries only what changes with the document — its name, its two view buttons,
 * and the piece before and after it.
 */
export default function DocumentWindow({
  title,
  subtitle,
  date,
  html,
  mdHref,
  image,
  markdown,
  source = 'blog',
  canonical,
  prev,
  next,
}: {
  title: string
  subtitle?: string
  date: string
  html: string
  mdHref: string
  image?: string
  /** the post's own source, for the clipboard */
  markdown: string
  /** newsletter issues live here as a reading copy; Substack is canonical */
  source?: 'blog' | 'newsletter'
  canonical?: string
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
}) {
  const [copied, setCopied] = useState(false)
  const [textSize, setTextSize] = useState(18)
  const [progress, setProgress] = useState(0)
  const minutes = Math.max(1, Math.ceil(markdown.trim().split(/\s+/).length / 220))
  // the same file, rendered or as source — no reason to leave the window for it
  const [showSource, setShowSource] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    // Opaque toolbars sit outside the scrolling document.
    <div className="relative flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          {/* the document's own toolbar — under the app's title bar */}
          <div className="reader-toolbar flex shrink-0 min-h-10 items-center gap-2 border-b border-[var(--border)] px-3 font-mono select-none">
            <span className="min-w-0 flex-1 truncate text-[10px] tracking-widest text-[var(--muted)]">
              {showSource ? 'Markdown source' : 'Reading'}
            </span>
            <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
              <button className="reader-type-control" type="button" aria-label="Decrease text size" disabled={textSize <= 16 || showSource} onClick={() => setTextSize(size => size - 2)}>A−</button>
              <button className="reader-type-control" type="button" aria-label="Increase text size" disabled={textSize >= 24 || showSource} onClick={() => setTextSize(size => size + 2)}>A+</button>
              <button
                type="button"
                onClick={copy}
                title="copy this post as markdown"
                // these are the two things you can do to a document, so they
                // read as buttons at rest rather than only under the pointer
                className={`rounded-sm border border-[var(--hair)] px-2.5 py-1 text-[10px] leading-4 tracking-wide transition-colors duration-200 ${
                  copied
                    ? 'bg-[var(--success)] text-white'
                    : 'bg-black/[0.06] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white'
                }`}
              >
                {copied ? '✓ copied' : '⧉ copy .md'}
              </button>
              <button
                type="button"
                onClick={() => setShowSource((v) => !v)}
                aria-pressed={showSource}
                title={showSource ? 'back to the rendered post' : 'show the markdown source'}
                // pressed is filled, not outlined — a toggle should say which
                // of its two states you are in without reading the label
                className={`rounded-sm border border-[var(--hair)] px-2.5 py-1 text-[10px] leading-4 tracking-wide transition-colors duration-200 ${
                  showSource
                    ? 'bg-[var(--accent)] text-white'
                    : 'bg-black/[0.06] text-[var(--muted)] hover:bg-[var(--accent)] hover:text-white'
                }`}
              >
                {showSource ? '¶ rendered' : '.md'}
              </button>
            </div>
          </div>

      {/* the page — scrolls inside the pane, like any reader */}
      <article className="reader-article paper min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:px-14 sm:py-12"
        onScroll={event => {
          const element = event.currentTarget
          const distance = element.scrollHeight - element.clientHeight
          setProgress(distance > 0 ? Math.round(element.scrollTop / distance * 100) : 100)
        }}>
        <div className="reader-article-measure">
            <header className={`reader-article-header ${image && !showSource ? "has-cover" : ""}`}><div>
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-widest text-[#8a8178]">
                <span>{source === 'blog' ? 'Essay' : 'The Working Prototype'}</span>
                <span> / </span><time dateTime={date}>{date}</time>
                <span> / {minutes} min read</span>
                {canonical && (
                  <>
                    <span>·</span>
                    <span>first published on substack</span>
                    <a
                      href={canonical}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-[#1f1b16]"
                    >
                      read there ↗
                    </a>
                  </>
                )}
              </div>
              <h1 className="reader-article-title">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-[1.05rem] leading-snug text-[#5d564c] italic">
                  {subtitle}
                </p>
              )}
            </div>
            {image && !showSource && (
              <a href={image} target="_blank" rel="noopener noreferrer" className="reader-cover-link" aria-label={`View illustration for ${title} at full size (opens in a new tab)`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt={`Illustration for ${title}`} className="reader-article-cover" />
                <span>View full size ↗</span>
              </a>
            )}
            </header>

            {showSource ? (
              <>
                {/* the same bytes are fetchable, which is worth showing */}
                <a
                  href={mdHref}
                  className="mb-6 inline-block font-mono text-[10px] tracking-widest text-[#8a8178] underline underline-offset-4 hover:text-[#1f1b16]"
                >
                  GET {mdHref}
                </a>
                <pre className="paper-source">{markdown}</pre>
              </>
            ) : (
              <div
                className="prose-paper"
                style={{ fontSize: textSize }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}

        </div>
      </article>

      <div className="reading-progress" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}><span style={{ width: `${progress}%` }} /></div>
      {/* navigation is chrome, not part of the document — and at the foot of
          the pane it stays reachable without scrolling to the end */}
      <div className="reader-toolbar flex shrink-0 min-h-10 items-center gap-3 border-t border-[var(--border)] px-3 font-mono text-[10px] tracking-widest">
        <div className="min-w-0 flex-1">
          {prev && (
            <Link
              href={`/${source}/${prev.slug}`}
              className="flex min-w-0 items-center gap-1.5 text-[var(--muted)] hover:text-[var(--accent)]"
            >
              <span className="shrink-0">←</span>
              <span className="truncate">{prev.title}</span>
            </Link>
          )}
        </div>

        <Link
          href="/reader"
          className="shrink-0 text-[var(--dim)] hover:text-[var(--fg)]"
        >
          contents
        </Link>

        <div className="flex min-w-0 flex-1 justify-end">
          {next && (
            <Link
              href={`/${source}/${next.slug}`}
              className="flex min-w-0 items-center gap-1.5 text-[var(--muted)] hover:text-[var(--accent)]"
            >
              <span className="truncate">{next.title}</span>
              <span className="shrink-0">→</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
