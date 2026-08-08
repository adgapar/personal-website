import { siteToMarkdown } from '@/lib/markdown'
import { pages } from '@/lib/sessions'
import { getWritingPage } from '@/lib/writing-page'

export const dynamic = 'force-static'

export function GET() {
  // substitute the writing page for the one that lists real posts
  const withPosts = pages.map((p) => (p.slug === 'writing' ? getWritingPage() : p))

  return new Response(siteToMarkdown(withPosts), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
