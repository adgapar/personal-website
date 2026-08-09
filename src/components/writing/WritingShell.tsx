import ReaderShell from '@/components/writing/ReaderShell'
import { getPosts } from '@/lib/writing'

/** Shared so the wallpaper and navigator survive moving between pieces. */
export function readerNav() {
  return {
    blog: getPosts('blog').map(({ slug, title, date }) => ({
      slug,
      title,
      date,
      href: `/blog/${slug}`,
    })),
    newsletter: getPosts('newsletter').map(({ slug, title, date }) => ({
      slug,
      title,
      date,
      href: `/newsletter/${slug}`,
    })),
  }
}

export default function WritingShell({ children }: { children: React.ReactNode }) {
  const { blog, newsletter } = readerNav()
  return (
    <ReaderShell blog={blog} newsletter={newsletter}>
      {children}
    </ReaderShell>
  )
}
