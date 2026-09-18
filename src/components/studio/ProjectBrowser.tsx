import Link from 'next/link'
import DeskSurface from '@/components/visual/DeskSurface'
import Dock from '@/components/layout/Dock'
import WindowClose from '@/components/layout/WindowClose'

export default function ProjectBrowser({ active, children }: { active: 'projects' | 'tapas'; children: React.ReactNode }) {
  const address = active === 'tapas' ? 'adilet.fyi/tapas' : 'adilet.fyi/projects'
  return (
    <div className="project-desktop">
      <DeskSurface />
      <Dock independent />
      <div className="project-browser">
        <header className="browser-tabs">
          <nav aria-label="Project tabs"><Link href="/projects" aria-current={active === 'projects' ? 'page' : undefined}>Projects</Link><Link href="/tapas" aria-current={active === 'tapas' ? 'page' : undefined}>tapas</Link></nav>
          <WindowClose label="Close browser and return to terminal" />
        </header>
        <div className="browser-toolbar"><Link href="/projects" aria-label="Project index">⌂</Link><span className="browser-address"><span aria-hidden>◇</span> {address}</span><Link href="/" className="browser-terminal">&gt;_ <span>terminal</span></Link></div>
        <div className="browser-content">{children}</div>
      </div>
    </div>
  )
}
