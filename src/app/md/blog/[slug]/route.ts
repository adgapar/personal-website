import { getPost, getPosts } from '@/lib/writing'

/** The post's own markdown, unrendered — the source is already the right format. */
export const dynamic = 'force-static'

export function generateStaticParams() {
  return getPosts('blog').map((post) => ({ slug: post.slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const post = getPost('blog', slug)

  if (!post) {
    return new Response('# Not found\n', {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }

  const head = [`# ${post.title}`, post.subtitle ? `> ${post.subtitle}` : '', `*${post.date}*`]
    .filter(Boolean)
    .join('\n\n')

  return new Response(`${head}\n\n${post.body}\n`, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
