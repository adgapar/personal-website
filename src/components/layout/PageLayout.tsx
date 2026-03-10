import WindowChrome from './WindowChrome'
import SiteNav from './SiteNav'

interface Props {
  section: string
  children: React.ReactNode
}

export default function PageLayout({ section, children }: Props) {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--fg)] font-mono text-sm flex flex-col">
      <div className="max-w-3xl w-full mx-auto flex flex-col flex-1 border-x border-[var(--border)]">
        <WindowChrome />
        <SiteNav />
        <main className="flex-1 p-8">
          <div className="mb-6 text-[var(--muted)]">
            <span className="text-[var(--accent)]">$</span> {section}
          </div>
          {children}
        </main>
      </div>
    </div>
  )
}
