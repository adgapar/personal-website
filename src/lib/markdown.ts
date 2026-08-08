import { profile } from '@/data/profile'
import { pages, type PageMeta, type SessionBlock } from './sessions'
import type { TerminalLine } from './commands/types'

/**
 * Serializes the terminal's SessionBlock data to markdown.
 *
 * The blocks in sessions.ts are the single source of truth for site content —
 * the terminal, the agent view and these routes all read from them, so the two
 * audiences can never drift apart.
 */

const SITE_URL = 'https://adilet.fyi'

function escapeCell(value: string): string {
  return value.replace(/\|/g, '\\|')
}

function link(text: string, href?: string): string {
  return href ? `[${text}](${href})` : text
}

function lineToMarkdown(line: TerminalLine): string | null {
  const content = line.content.trim()

  if (line.label !== undefined) {
    // '' label means "continuation of the previous key" in the terminal
    if (line.label === '') return `  ${link(content, line.href)}`
    return `- **${line.label}**: ${link(content, line.href)}`
  }

  if (!content) return null

  if (line.style === 'divider') return '---'

  if (line.style === 'quote') {
    return content
      .split('\n')
      .map((para) => (para.trim() ? `> ${para.trim()}` : '>'))
      .join('\n')
  }

  return link(content, line.href)
}

function blockToMarkdown(block: SessionBlock): string | null {
  if (block.mdSkip) return null

  const parts: string[] = []
  if (block.mdHeading) parts.push(`## ${block.mdHeading}`)

  if (block.linkRow) {
    const links = block.lines
      .filter((l) => l.content.trim())
      .map((l) => `- ${link(l.content.trim(), l.href)}`)
    if (links.length) parts.push(links.join('\n'))
  } else if (block.table) {
    const { headers, rows } = block.table
    const head = `| ${headers.map(escapeCell).join(' | ')} |`
    const rule = `| ${headers.map(() => '---').join(' | ')} |`
    const body = rows.map((row) => {
      const cols = row.cols.map(escapeCell)
      // fold the row link onto the first cell so no information is lost
      if (row.href && cols[0]) cols[0] = link(cols[0], row.href)
      return `| ${cols.join(' | ')} |`
    })
    parts.push([head, rule, ...body].join('\n'))
  } else if (block.list) {
    const items = block.list.items.map((item) => {
      const detail = [item.tag, item.meta, item.status]
        .map((v) => v?.trim())
        .filter(Boolean)
        .join(' · ')
      const head = detail ? `- **${item.title}** — ${detail}` : `- **${item.title}**`
      return item.summary ? `${head}\n  ${item.summary}` : head
    })
    parts.push(items.join('\n'))
  } else if (block.log) {
    const entries = block.log.entries.map((entry) => {
      const label = entry.tag ? `*${entry.tag}* — ` : ''
      return `- \`${entry.date}\` ${label}${link(entry.content, entry.mdHref ?? entry.href)}`
    })
    parts.push(entries.join('\n'))
  } else {
    const lines = block.lines
      .map(lineToMarkdown)
      .filter((l): l is string => l !== null)
    if (lines.length) parts.push(lines.join('\n'))
  }

  // a heading with nothing under it is noise
  if (parts.length === 0 || (parts.length === 1 && block.mdHeading)) return null
  return parts.join('\n\n')
}

/** Markdown body for a single page, without the H1 title. */
export function sessionBodyToMarkdown(page: PageMeta): string {
  return page.session.blocks
    .map(blockToMarkdown)
    .filter((b): b is string => b !== null)
    .join('\n\n')
}

/** A complete standalone markdown document for one page. */
export function pageToMarkdown(page: PageMeta): string {
  const heading = page.slug === 'about' ? page.title : `${profile.name} — ${page.title}`
  return [`# ${heading}`, `> ${page.summary}`, sessionBodyToMarkdown(page)]
    .filter(Boolean)
    .join('\n\n')
    .concat('\n')
}

/**
 * Every page in one document, for /llms.txt.
 *
 * Takes the page list so a server route can pass a version with the real post
 * index in it — this module stays filesystem-free because AgentView imports it.
 */
export function siteToMarkdown(pageList: PageMeta[] = pages): string {
  const header = [
    `# ${profile.name}`,
    `> ${profile.bio}`,
    `${profile.role} at ${profile.org}. ${profile.location}.`,
    [
      `This file is the machine-readable version of ${SITE_URL}.`,
      `Individual pages: ${SITE_URL}/md/<slug>. Blog posts: ${SITE_URL}/md/blog/<slug>.`,
      `Every post inline, in one file: ${SITE_URL}/llms-full.txt`,
    ].join('\n'),
  ].join('\n\n')

  const body = pageList
    .map((page) => [`# ${page.title}  (${SITE_URL}${page.route})`, sessionBodyToMarkdown(page)].join('\n\n'))
    .join('\n\n---\n\n')

  return `${header}\n\n---\n\n${body}\n`
}
