import { writingPage, type PageMeta, type SessionBlock } from './sessions'
import { getPosts } from './writing'

/**
 * The writing tab, with the real post index appended.
 *
 * Server-only: reads the filesystem via ./writing. The result is plain data, so
 * a server component can build it and hand it to the client PageLayout — which
 * is why the post list can't just live in sessions.ts.
 */

export function getWritingPage(): PageMeta {
  const newsletter = getPosts('newsletter')
  const blog = getPosts('blog')

  const newsletterIndex: SessionBlock = {
    cmd: `ls -t newsletter/  # ${newsletter.length} issues`,
    mdHeading: 'newsletter issues',
    lines: [],
    log: {
      entries: newsletter.map((post) => ({
        date: post.date,
        content: post.title,
        href: post.canonical,
      })),
    },
  }

  const blogIndex: SessionBlock = {
    cmd: `ls -t blog/  # ${blog.length} posts`,
    mdHeading: 'blog posts',
    lines: [],
    log: {
      entries: blog.map((post) => ({
        date: post.date,
        content: post.title,
        href: `/blog/${post.slug}`,
        mdHref: `/md/blog/${post.slug}`,
      })),
    },
  }

  const blocks = [...writingPage.blocks]
  // each index sits under the section it belongs to
  blocks.splice(2, 0, newsletterIndex)
  blocks.push(blogIndex)

  return {
    slug: 'writing',
    route: '/writing',
    title: 'Writing',
    summary: `${blog.length} blog posts and ${newsletter.length} newsletter issues.`,
    session: { ...writingPage, blocks },
  }
}
