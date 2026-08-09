import WritingIndexWindow from '@/components/writing/WritingIndexWindow'
import WritingShell from '@/components/writing/WritingShell'
import { getPosts } from '@/lib/writing'

export const metadata = {
  title: 'writing',
  alternates: { types: { 'text/markdown': '/md/writing' } },
}

export default function WritingPage() {
  const toIndex = (source: 'blog' | 'newsletter') =>
    getPosts(source).map((post) => ({
      slug: post.slug,
      title: post.title,
      date: post.date,
      subtitle: post.subtitle,
      href: `/${source}/${post.slug}`,
    }))

  return (
    <WritingShell>
      <WritingIndexWindow blog={toIndex('blog')} newsletter={toIndex('newsletter')} />
    </WritingShell>
  )
}
