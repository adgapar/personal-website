import type { MetadataRoute } from 'next'
import { pages } from '@/lib/sessions'
import { getPosts } from '@/lib/writing'

const SITE = 'https://adilet.fyi'

/** Matters most right after a domain move, when search engines have to relearn
 *  where everything lives. /design is noindexed and stays out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts('blog')
  const newest = posts[0]?.date

  return [
    ...pages.map((page) => ({
      url: `${SITE}${page.route}`,
      lastModified: page.slug === 'writing' && newest ? new Date(newest) : new Date(),
      priority: page.route === '/' ? 1 : 0.8,
    })),
    {
      // the reader app's contents page — a real destination, not just a view
      url: `${SITE}/reader`,
      lastModified: newest ? new Date(newest) : new Date(),
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      priority: 0.7,
    })),
  ]
}
