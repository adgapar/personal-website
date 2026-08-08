import { siteToMarkdown } from '@/lib/markdown'
import { pages } from '@/lib/sessions'
import { getPosts } from '@/lib/writing'
import { getWritingPage } from '@/lib/writing-page'

/**
 * Everything, inline — the site plus the full text of every post.
 *
 * /llms.txt is the index and stays small; this is the whole corpus in one fetch,
 * following the llms.txt / llms-full.txt convention. Without it an agent gets a
 * list of titles and has to guess whether the writing is worth chasing.
 */
export const dynamic = 'force-static'

export function GET() {
  const withPosts = pages.map((p) => (p.slug === 'writing' ? getWritingPage() : p))

  const posts = getPosts('blog')
    .map((post) =>
      [
        `# ${post.title}`,
        post.subtitle ? `> ${post.subtitle}` : '',
        `*${post.date}  ·  https://adilet.fyi/blog/${post.slug}*`,
        post.body,
      ]
        .filter(Boolean)
        .join('\n\n'),
    )
    .join('\n\n---\n\n')

  const body = [
    siteToMarkdown(withPosts),
    '---',
    '# Blog posts, in full',
    '',
    'Newsletter issues are published on Substack and are not reproduced here.',
    '',
    posts,
  ].join('\n\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  })
}
