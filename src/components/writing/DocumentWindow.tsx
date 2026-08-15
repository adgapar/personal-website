'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TITLE_BAR } from '@/lib/window-style'

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
    <div className="flex min-h-0 w-full flex-1 flex-col overflow-hidden">
          {/* the document's own toolbar — under the app's title bar */}
          <div
            className="flex shrink-0 items-center gap-2 border-b border-[var(--border)] px-3 py-1.5 font-mono select-none"
            style={TITLE_BAR}
          >
            <span className="min-w-0 flex-1 truncate text-[10px] tracking-widest text-[var(--muted)]">
              {title}.md — {showSource ? 'source' : 'reader'}
            </span>
            <div className="flex shrink-0 items-center gap-1 whitespace-nowrap">
              <button
                type="button"
                onClick={copy}
                title="copy this post as markdown"
                // these are the two things you can do to a document, so they
                // read as buttons at rest rather than only under the pointer
                className={`border px-2 py-0.5 text-[10px] leading-4 tracking-wide transition-colors duration-200 ${
                  copied
                    ? 'border-[var(--success)] text-[var(--success)]'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--surface)]'
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
                className={`border px-2 py-0.5 text-[10px] leading-4 tracking-wide transition-colors duration-200 ${
                  showSource
                    ? 'border-[var(--accent)] bg-[var(--accent)] text-[var(--surface)]'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--surface)]'
                }`}
              >
                {showSource ? '¶ rendered' : '.md'}
              </button>
            </div>
          </div>

      {/* the page — scrolls inside the pane, like any reader */}
      <article className="paper min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-8 sm:px-14 sm:py-14">
            <header className="mb-10">
              <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] tracking-widest text-[#8a8178]">
                <span>{date}</span>
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
              <h1 className="text-[1.75rem] leading-tight font-semibold text-[#1f1b16]">
                {title}
              </h1>
              {subtitle && (
                <p className="mt-3 text-[1.05rem] leading-snug text-[#5d564c] italic">
                  {subtitle}
                </p>
              )}
            </header>

            {image && !showSource && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="mb-10 w-full border border-[#ddd6c8]"
                style={{ imageRendering: 'pixelated' }}
              />
            )}

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
                dangerouslySetInnerHTML={{ __html: html }}
              />
            )}

      </article>

      {/* navigation is chrome, not part of the document — and at the foot of
          the pane it stays reachable without scrolling to the end */}
      <div
        className="flex shrink-0 items-center gap-3 border-t border-[var(--border)] px-3 py-2 font-mono text-[10px] tracking-widest"
        style={TITLE_BAR}
      >
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
