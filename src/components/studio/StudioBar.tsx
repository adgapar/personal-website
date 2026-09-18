import Link from 'next/link'

export default function StudioBar() {
  return (
    <header className="studio-bar">
      <Link href="/" className="studio-brand"><span aria-hidden>✳</span> adilet <span className="studio-label">/ personal studio</span></Link>
      <nav aria-label="Studio apps"><Link href="/">Terminal</Link><Link href="/projects">Projects</Link><Link href="/reader">Writing</Link></nav>
      <span className="studio-location">Elche, Spain</span>
    </header>
  )
}
