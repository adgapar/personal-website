import WritingIndexWindow from '@/components/writing/WritingIndexWindow'
import WritingShell from '@/components/writing/WritingShell'
import { getPosts } from '@/lib/writing'

export const metadata = {
  title: 'reader',
  alternates: { types: { 'text/markdown': '/md/writing' } },
}

/**
 * The reader app's home screen — a contents page, opened from the writing tab,
 * the dock, or the `reader` command. Posts under /blog and /newsletter
 * share this shell, so moving between them stays inside the app.
 */
export default function ReaderPage() {
  const toIndex = (source: 'blog' | 'newsletter') =>
    getPosts(source).map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      subtitle: post.subtitle,
      cover: post.image,
      href: `/${source}/${post.slug}`,
    }))

  return (
    <WritingShell>
      <WritingIndexWindow blog={toIndex('blog')} newsletter={toIndex('newsletter')} />
    </WritingShell>
  )
}
