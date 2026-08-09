import { notFound } from 'next/navigation'
import { marked } from 'marked'
import DocumentWindow from '@/components/writing/DocumentWindow'
import { excerpt, getPost, getPosts, wrapTables } from '@/lib/writing'

/**
 * Newsletter issues render here too, because Substack refuses to be framed
 * (frame-ancestors 'self') and we already sync the source. Substack stays
 * canonical — it keeps the email list and the search ranking; this is a reading
 * copy so the whole archive lives in one place and is machine-readable.
 */

export function generateStaticParams() {
  return getPosts('newsletter').map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost('newsletter', slug)
  if (!post) return {}
  const description = post.subtitle || excerpt(post)

  return {
    title: post.title,
    description,
    alternates: {
      // Substack published it first and keeps the ranking
      canonical: post.canonical,
      types: { 'text/markdown': `/md/newsletter/${slug}` },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : undefined,
    },
  }
}

export default async function NewsletterPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const posts = getPosts('newsletter')
  const index = posts.findIndex((p) => p.slug === slug)
  const post = index >= 0 ? posts[index] : undefined
  if (!post) notFound()

  const html = wrapTables(await marked.parse(post.body))
  const newer = posts[index - 1]
  const older = posts[index + 1]

  const markdown = [
    `# ${post.title}`,
    post.subtitle ? `> ${post.subtitle}` : '',
    `*${post.date}  ·  originally published on Substack: ${post.canonical}*`,
    post.body,
  ]
    .filter(Boolean)
    .join('\n\n')

  return (
    <DocumentWindow
      title={post.title}
      subtitle={post.subtitle}
      date={post.date}
      html={html}
      mdHref={`/md/newsletter/${post.slug}`}
      image={post.image}
      markdown={markdown}
      source="newsletter"
      canonical={post.canonical}
      prev={older && { slug: older.slug, title: older.title }}
      next={newer && { slug: newer.slug, title: newer.title }}
    />
  )
}
