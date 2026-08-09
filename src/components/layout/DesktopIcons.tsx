'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Apps that live on the desktop rather than inside the terminal.
 *
 * On the desktop *below* the window, aligned to its left edge — a corner icon
 * floats in the wallpaper with nothing to relate to, while this reads as one
 * surface: window, then the things sitting on the desk under it.
 *
 * Opaque paper on purpose. The wallpaper is a photograph, so anything drawn in
 * thin dark strokes disappears into it. This is the same paper the reader opens
 * documents on, which makes the icon say what it opens.
 *
 * Kept at z-[5] so a maximized or dragged window passes over it rather than
 * under, and nothing is hidden behind this route: the writing tab has a button
 * and `reader` works at any prompt.
 *
 * Not rendered on the reader's own routes: it has its own shell there.
 */

const apps = [
  { name: 'reader', href: '/reader', caption: 'writing, as pages' },
]

/** A sheet of paper with a turned corner, drawn rather than spelled — box
 *  characters at this size collapse into a hamburger menu. */
function PageGlyph() {
  return (
    <span
      className="relative block h-12 w-10 shadow-[0_2px_10px_rgba(0,0,0,0.55)] transition-transform duration-200 group-hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(rgba(255,253,248,0.97), rgba(240,235,224,0.97))',
        clipPath: 'polygon(0 0, 68% 0, 100% 22%, 100% 100%, 0 100%)',
      }}
    >
      {/* the turned corner, shaded so the fold reads as a fold */}
      <span
        className="absolute top-0 right-0 block h-[22%] w-[32%]"
        style={{
          background: 'rgba(150,140,124,0.55)',
          clipPath: 'polygon(0 0, 100% 100%, 0 100%)',
        }}
      />
      {/* lines of text, short one last */}
      <span className="absolute inset-x-[18%] top-[46%] flex flex-col gap-[3px]">
        {['100%', '100%', '62%'].map((w, i) => (
          <span
            key={i}
            className="block h-[2px] rounded-full bg-[#2a2520] opacity-45"
            style={{ width: w }}
          />
        ))}
      </span>
    </span>
  )
}

export default function DesktopIcons() {
  const pathname = usePathname()
  if (pathname.startsWith('/reader')) return null

  return (
    // the screen's right margin, not the window's — the window is centred at
    // max-w-4xl, so its own top-right corner is where the chrome buttons are
    <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] hidden justify-start px-4 pt-6 sm:flex sm:px-8 sm:pt-10">
      <div className="flex items-start gap-2">
        {apps.map((app) => (
          <Link
            key={app.href}
            href={app.href}
            title={`open ${app.name} — ${app.caption}`}
            className="group pointer-events-auto flex w-20 flex-col items-center gap-2 rounded-sm p-2 text-center focus-visible:outline-none"
          >
            <PageGlyph />
            {/* the label needs its own ground: it sits on a photograph */}
            <span className="rounded-sm bg-black/55 px-1.5 py-0.5 font-mono text-[10px] tracking-widest text-[var(--fg)] backdrop-blur-[2px] transition-colors duration-200 group-hover:bg-[var(--accent)] group-hover:text-[var(--bg)] group-focus-visible:bg-[var(--accent)] group-focus-visible:text-[var(--bg)]">
              {app.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
