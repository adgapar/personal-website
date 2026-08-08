import ReaderShell from '@/components/writing/ReaderShell'
import { getPosts } from '@/lib/writing'

/**
 * A layout, so the wallpaper and the navigator persist while you move between
 * posts. Only the document below is swapped.
 */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  const posts = getPosts('blog').map(({ slug, title, date }) => ({ slug, title, date }))
  return <ReaderShell posts={posts}>{children}</ReaderShell>
}
