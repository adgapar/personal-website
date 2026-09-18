import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import ProjectBrowser from '@/components/studio/ProjectBrowser'
import { projects } from '@/data/projects'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Small tools, home experiments, and things I’m building. Projects by Adilet Gaparov.',
  alternates: { canonical: '/projects' },
  openGraph: { title: 'Projects — Adilet Gaparov', url: '/projects', description: 'Small tools, home experiments, and things I’m building.' },
}

export default function ProjectsPage() {
  return (
    <ProjectBrowser active="projects">
      <main className="project-index">
        <div className="project-intro"><p className="studio-kicker">The workshop / selected projects</p><h1>Built here.</h1><p>Tools I use, experiments I live with, and the stories behind them.</p></div>
        <div className="project-grid">
          <Link href="/tapas" className="project-card project-tapas"><div className="project-art"><Image src="/tapas/icon.png" width={150} height={150} alt="" /><span>Small tools.<br />Good company.</span></div><div className="project-card-copy"><span className="studio-kicker">01 / Local-first Mac app</span><h2><strong className="tapas-wordmark">tapas</strong> <span>→</span></h2><p>Free local transcription. Full transcripts in your files. Give your own agent the source material, then build notes, routines, and workflows your way.</p><span className="project-open">Explore tapas →</span></div></Link>
          <Link href="/blog/teya-intro" className="project-card project-teya"><div className="project-art"><div className="teya-device" aria-hidden><span>teya</span><span>◡</span><span>at home.</span></div><span>A little more<br />at home.</span></div><div className="project-card-copy"><span className="studio-kicker">02 / Home AI experiment</span><h2>Teya <span>→</span></h2><p>A family agent running on a spare Android phone. A home that looks after you.</p><span className="project-open">Read the story →</span></div></Link>
        </div>
        <section className="project-archive"><p className="studio-kicker">Earlier work</p>{projects.filter(p => p.status === 'past').map(p => <article key={p.id}><h2>{p.name}</h2><p>{p.summary}</p></article>)}</section>
        <footer className="project-footer"><span>Built by Adilet. Still figuring things out.</span><Link href="/reader">Notes from the process →</Link></footer>
      </main>
    </ProjectBrowser>
  )
}
