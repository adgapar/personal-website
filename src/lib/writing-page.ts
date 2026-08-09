import { writingPage, type PageMeta, type SessionBlock } from './sessions'
import { getPosts } from './writing'

/**
 * The writing tab: what is here and how much of it, then a way in.
 *
 * The tab is a terminal like every other tab, so it stays a summary — two
 * `cat`s and a count each. The posts themselves are a different instrument
 * (ink on paper, a measure of 65 characters) and live in the reader app, which
 * this session opens rather than imitates.
 *
 * The full listings are still built, marked `termSkip`: agents reading
 * /md/writing and /llms.txt want the index, a reader at a prompt does not.
 *
 * Server-only: reads the filesystem via ./writing. The result is plain data, so
 * a server component can build it and hand it to the client PageLayout — which
 * is why the post list can't just live in sessions.ts.
 */

export function getWritingPage(): PageMeta {
  const newsletter = getPosts('newsletter')
  const blog = getPosts('blog')

  const blogAbout: SessionBlock = {
    cmd: 'cat blog.txt',
    mdHeading: 'blog',
    lines: [
      { content: 'Learning, building in public, career, and things I am figuring out.', style: 'default' },
      { content: `${blog.length} posts  ·  published here  ·  when inspiration strikes`, style: 'muted' },
    ],
  }

  const newsletterAbout: SessionBlock = {
    cmd: 'cat newsletter.txt',
    mdHeading: 'newsletter',
    lines: [
      { content: 'The Working Prototype', style: 'warm', href: 'https://theworkingprototype.substack.com/' },
      { content: 'AI reliability, alignment and safety for people building agents — no PhD required.', style: 'default' },
      { content: `${newsletter.length} issues  ·  on substack, by email  ·  archived here to read`, style: 'muted' },
    ],
  }

  // the way in — the same thing the desktop icon and the 'reader' command do
  const openReader: SessionBlock = {
    mdSkip: true,
    lines: [],
    action: {
      label: 'open reader',
      run: 'reader',
      hint: `${blog.length + newsletter.length} pieces  ·  or type 'reader'`,
    },
  }

  const listing = (source: 'blog' | 'newsletter', posts: ReturnType<typeof getPosts>): SessionBlock => ({
    termSkip: true,
    cmd: `ls -t ${source}/  # ${posts.length}`,
    mdHeading: source === 'blog' ? 'blog posts' : 'newsletter issues',
    lines: [],
    log: {
      entries: posts.map((post) => ({
        date: post.date,
        content: post.title,
        href: `/${source}/${post.slug}`,
        mdHref: `/md/${source}/${post.slug}`,
      })),
    },
  })

  const blocks = [
    ...writingPage.blocks,
    blogAbout,
    newsletterAbout,
    openReader,
    listing('blog', blog),
    listing('newsletter', newsletter),
  ]

  return {
    slug: 'writing',
    route: '/writing',
    title: 'Writing',
    summary: `${blog.length} blog posts and ${newsletter.length} newsletter issues.`,
    session: { ...writingPage, blocks },
  }
}
