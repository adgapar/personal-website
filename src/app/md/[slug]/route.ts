import { pageToMarkdown } from '@/lib/markdown'
import { pageBySlug, pages } from '@/lib/sessions'

export const dynamic = 'force-static'

export function generateStaticParams() {
  return pages.map((page) => ({ slug: page.slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const page = pageBySlug(slug)

  if (!page) {
    const available = pages.map((p) => `/md/${p.slug}`).join('\n')
    return new Response(`# Not found\n\nAvailable pages:\n\n${available}\n`, {
      status: 404,
      headers: { 'Content-Type': 'text/markdown; charset=utf-8' },
    })
  }

  return new Response(pageToMarkdown(page), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
