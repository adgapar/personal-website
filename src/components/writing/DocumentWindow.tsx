'use client'

import Link from 'next/link'
import { useState } from 'react'
import { TITLE_BAR, WINDOW_FRAME } from '@/lib/window-style'

/**
 * A post opens as a document on the same desktop — a page of paper rather than
 * terminal output. Prose wants ink on light, a measure of about 65 characters,
 * and a serif; the terminal's chrome is the wrong instrument for a thousand
 * words.
 *
 * Closing it returns to the writing session, so the window metaphor holds.
 */
export default function DocumentWindow({
  title,
  subtitle,
  date,
  html,
  mdHref,
  image,
  markdown,
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
  prev?: { slug: string; title: string }
  next?: { slug: string; title: string }
}) {
  const [copied, setCopied] = useState(false)
  // the same file, rendered or as source — no reason to leave the window for it
  const [source, setSource] = useState(false)

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
    <div
      className="flex max-h-full w-full flex-col overflow-hidden"
      style={WINDOW_FRAME}
        >
          {/* title bar, same instrument as the terminal window */}
          <div
            className="flex items-center gap-2 border-b border-[var(--border)] px-3 py-1.5 font-mono select-none"
            style={TITLE_BAR}
          >
            <span className="truncate text-[10px] tracking-widest text-[var(--muted)]">
              {title}.md — {source ? 'source' : 'reader'}
            </span>
            <div className="ml-auto flex items-center gap-1">
              <button
                type="button"
                onClick={copy}
                title="copy this post as markdown"
                className={`border px-1.5 text-[9px] leading-4 ${
                  copied
                    ? 'border-[var(--success)] text-[var(--success)]'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {copied ? '✓ copied' : '⧉ copy .md'}
              </button>
              <button
                type="button"
                onClick={() => setSource((v) => !v)}
                aria-pressed={source}
                title={source ? 'back to the rendered post' : 'show the markdown source'}
                className={`border px-1.5 text-[9px] leading-4 ${
                  source
                    ? 'border-[var(--accent)] text-[var(--accent)]'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                }`}
              >
                {source ? '¶ rendered' : '.md'}
              </button>
              <Link
                href="/writing"
                aria-label="Close"
                title="back to writing"
                className="border border-[var(--border)] px-1.5 text-[9px] leading-4 text-[var(--muted)] hover:border-[var(--error)] hover:text-[var(--error)]"
              >
                ✕
              </Link>
            </div>
          </div>

      {/* the page — scrolls inside the window, like any reader */}
      <article className="paper flex-1 overflow-y-auto overscroll-contain px-6 py-10 sm:px-14 sm:py-14">
            <header className="mb-10">
              <div className="mb-4 font-mono text-[10px] tracking-widest text-[#8a8178]">
                {date}
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

            {image && !source && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="mb-10 w-full border border-[#ddd6c8]"
                style={{ imageRendering: 'pixelated' }}
              />
            )}

            {source ? (
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

        <footer className="mt-16 border-t border-[#ddd6c8] pt-6 font-mono text-[10px] tracking-widest">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-8">
            <div className="flex-1">
              {prev && (
                <Link href={`/blog/${prev.slug}`} className="group block">
                  <span className="text-[#a89e8d]">← previous</span>
                  <span className="mt-1 block font-sans text-[13px] leading-snug text-[#5d564c] group-hover:text-[#1f1b16]">
                    {prev.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="flex-1 sm:text-right">
              {next && (
                <Link href={`/blog/${next.slug}`} className="group block">
                  <span className="text-[#a89e8d]">next →</span>
                  <span className="mt-1 block font-sans text-[13px] leading-snug text-[#5d564c] group-hover:text-[#1f1b16]">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </div>
          <Link
            href="/writing"
            className="mt-8 inline-block text-[#8a8178] hover:text-[#1f1b16]"
          >
            ← all writing
          </Link>
        </footer>
      </article>
    </div>
  )
}
