import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

/**
 * Reads posts out of content/, which `pnpm sync-content` fills from ../mi.
 *
 * Server-only — it touches the filesystem, so it must never be imported into a
 * client component.
 *
 * Frontmatter is plain `Key: value` lines before the first blank line, not YAML.
 * That is the format the writing workspace already uses, so the site reads what
 * is authored rather than asking the author to change.
 */

export type Source = 'blog' | 'newsletter'

export type Post = {
  source: Source
  slug: string
  title: string
  subtitle?: string
  date: string
  /** header image, already rewritten to a served path */
  image?: string
  /** the generation prompt, kept because it explains the pixel art */
  imagePrompt?: string
  /** where it is canonically published */
  canonical?: string
  body: string
}

const ROOTS: Record<Source, string> = {
  blog: join(process.cwd(), 'content/blog'),
  newsletter: join(process.cwd(), 'content/newsletter'),
}

const CANONICAL: Record<Source, (slug: string) => string | undefined> = {
  // moving here, so this site is canonical
  blog: () => undefined,
  // Substack keeps the email list and the SEO
  newsletter: (slug) => `https://theworkingprototype.substack.com/p/${slug}`,
}

/** `20260626-riding-the-wave.md` → slug `riding-the-wave`, date `2026-06-26` */
function parseFilename(file: string) {
  const match = file.match(/^(\d{4})(\d{2})(\d{2})-(.+)\.md$/)
  if (!match) return null
  const [, y, m, d, slug] = match
  return { slug, date: `${y}-${m}-${d}` }
}

function parseFrontmatter(raw: string) {
  const lines = raw.split('\n')
  const meta: Record<string, string> = {}
  let i = 0

  for (; i < lines.length; i++) {
    const line = lines[i]
    if (!line.trim()) break
    const m = line.match(/^([A-Z][A-Za-z ]*):\s*(.*)$/)
    if (!m) break
    meta[m[1].toLowerCase()] = m[2].trim()
  }

  // posts separate frontmatter from body with a rule; it is punctuation, not
  // content, and markdown would turn it into a heading or an <hr>
  while (i < lines.length && /^-{3,}\s*$/.test(lines[i])) i++

  return { meta, body: lines.slice(i).join('\n').trim() }
}

/** bodies reference images relative to the post; they are served from public/ */
function servedPath(source: Source, rel: string): string {
  return `/writing/${source}/${rel.replace(/^\.?\//, '')}`
}

const RELATIVE_IMAGE = /(src=")(background-images\/|content-images\/)/g

function read(source: Source, file: string): Post | null {
  const named = parseFilename(file)
  if (!named) return null

  const raw = readFileSync(join(ROOTS[source], file), 'utf8')
  const { meta, body } = parseFrontmatter(raw)

  return {
    source,
    slug: named.slug,
    // the filename date is authoritative; frontmatter Date is a duplicate
    date: meta.date || named.date,
    title: meta.title || named.slug.replace(/-/g, ' '),
    subtitle: meta.subtitle || undefined,
    image: meta.image ? servedPath(source, meta.image) : undefined,
    imagePrompt: meta['image prompt'] || undefined,
    canonical: CANONICAL[source](named.slug),
    body: body.replace(RELATIVE_IMAGE, (_m, attr, dir) => `${attr}/writing/${source}/${dir}`),
  }
}

/**
 * Posts cross-link to each other by whatever URL they had when they were
 * written — the old Ghost domain, or in one case a Substack that never hosted
 * the post at all. Any link whose final segment is a post we host is pointed at
 * our copy. Only slugs we actually have are touched, so genuine outbound links
 * (including newsletter issues that really do live on Substack) are left alone.
 */
function relinkPosts(posts: Post[], hosted: Set<string>): Post[] {
  const EXTERNAL_POST = /\]\(https?:\/\/[^)\s]*?\/(?:p\/)?([a-z0-9-]+)\/?\)/g

  return posts.map((post) => ({
    ...post,
    body: post.body.replace(EXTERNAL_POST, (match, slug: string) =>
      hosted.has(slug) ? `](/blog/${slug})` : match,
    ),
  }))
}

function readAll(source: Source): Post[] {
  const dir = ROOTS[source]
  if (!existsSync(dir)) return []

  return readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => read(source, f))
    .filter((p): p is Post => p !== null)
    .sort((a, b) => b.date.localeCompare(a.date))
}

/** slugs we serve ourselves — blog only; newsletter stays on Substack */
let hostedSlugs: Set<string> | null = null
function getHosted(): Set<string> {
  hostedSlugs ??= new Set(readAll('blog').map((p) => p.slug))
  return hostedSlugs
}

export function getPosts(source: Source): Post[] {
  return relinkPosts(readAll(source), getHosted())
}

export function getAllPosts(): Post[] {
  return [...getPosts('blog'), ...getPosts('newsletter')].sort((a, b) =>
    b.date.localeCompare(a.date),
  )
}

export function getPost(source: Source, slug: string): Post | undefined {
  return getPosts(source).find((p) => p.slug === slug)
}

/** first paragraph, for indexes and meta descriptions */
export function excerpt(post: Post, max = 180): string {
  const first =
    post.subtitle ??
    post.body
      .split('\n\n')
      .find((p) => p.trim() && !p.startsWith('#') && !p.startsWith('!')) ??
    ''
  const clean = first.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/[*_`]/g, '').trim()
  return clean.length > max ? `${clean.slice(0, max).trimEnd()}…` : clean
}
