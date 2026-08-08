import { notFound } from 'next/navigation'
import { marked } from 'marked'
import DocumentWindow from '@/components/writing/DocumentWindow'
import { excerpt, getPost, getPosts } from '@/lib/writing'

export function generateStaticParams() {
  return getPosts('blog').map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPost('blog', slug)
  if (!post) return {}
  const description = post.subtitle || excerpt(post)

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/blog/${slug}`,
      types: { 'text/markdown': `/md/blog/${slug}` },
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description,
      url: `/blog/${slug}`,
      publishedTime: post.date,
      images: post.image ? [{ url: post.image, width: 1536, height: 1024 }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: post.image ? [post.image] : undefined,
    },
  }
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const posts = getPosts('blog')
  const index = posts.findIndex((p) => p.slug === slug)
  const post = index >= 0 ? posts[index] : undefined
  if (!post) notFound()

  const html = await marked.parse(post.body)

  // newest first, so the next one chronologically sits earlier in the list
  const newer = posts[index - 1]
  const older = posts[index + 1]

  const markdown = [
    `# ${post.title}`,
    post.subtitle ? `> ${post.subtitle}` : '',
    `*${post.date}*`,
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
      mdHref={`/md/blog/${post.slug}`}
      image={post.image}
      markdown={markdown}
      prev={older && { slug: older.slug, title: older.title }}
      next={newer && { slug: newer.slug, title: newer.title }}
    />
  )
}
