'use client'

import { useMemo, useState } from 'react'
import { pageToMarkdown } from '@/lib/markdown'
import type { PageMeta } from '@/lib/sessions'

/**
 * Agent mode: the page *is* markdown. Not a prettified document — the literal
 * source, selectable and one click from the clipboard.
 */
export default function AgentView({ page }: { page: PageMeta }) {
  const markdown = useMemo(() => pageToMarkdown(page), [page])
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  const bytes = new Blob([markdown]).size

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-10">
      <div className="mb-3 space-y-2 text-[11px] tracking-widest">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="text-[var(--dim)]">
            text/markdown · {bytes} bytes
          </span>
          <button
            type="button"
            onClick={copy}
            className={`ml-auto border px-3 py-1 transition-colors ${
              copied
                ? 'border-[var(--success)] text-[var(--success)]'
                : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
            }`}
          >
            {copied ? '✓ copied' : '⧉ copy markdown'}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-[var(--dim)]">no JS required:</span>
          <a
            href={`/md/${page.slug}`}
            className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--fg)]"
          >
            /md/{page.slug}
          </a>
          <a
            href="/llms.txt"
            className="text-[var(--accent)] underline underline-offset-2 hover:text-[var(--fg)]"
          >
            /llms.txt
          </a>
        </div>
      </div>

      {/* the source set back from the page, not boxed on top of it */}
      <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-black/25 p-5 text-xs leading-relaxed break-words whitespace-pre-wrap text-[var(--fg)] selection:bg-[var(--accent)] selection:text-[#12110f]">
        {markdown}
      </pre>
    </div>
  )
}
