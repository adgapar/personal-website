import Image from 'next/image'

/**
 * The desk: a hill, printed.
 *
 * Six backgrounds were tried before this one. A photograph competed with the
 * writing and won. A flat colour read as blank. Paper fibre looked like dirt. A
 * mesh gradient looked like a smear. A ruled grid looked like a spreadsheet.
 * Shallow water moved, which made the glass legible, and cost a full-viewport
 * WebGL shader running behind every page to do it.
 *
 * This is the wallpaper the metaphor was always pointing at. Bliss is the
 * desktop everyone means when they say desktop, and the version here is a
 * risograph of it: two inks on cream stock, halftoned, with the paper left
 * showing through the sky. Every other surface on this site is ink on paper —
 * the tiles in the dock, the reader's pages, the window's own frame — so the
 * thing they all sit on is now printed too, on the same stock.
 *
 * It is still, where the water moved, and it gets away with it for two reasons
 * the flat fields never could: the halftone gives the blur behind the glass a
 * texture to carry, and the horizon crosses behind the window, so there is a
 * hard edge running under the terminal that tells you it is a surface you are
 * looking through. What it will not do is compete for attention. Two flat
 * fields and one line have nothing to say after the first second, which is
 * exactly the job.
 *
 * No shader, no client hooks, no reduced-motion branch: nothing here moves.
 */

/* Below Tailwind's sm the window is the screen, so every pixel of this sits
   behind an opaque surface. Hidden in CSS rather than behind a media-query hook,
   because a static image needs no JavaScript to decide it is not visible. */
export default function DeskSurface() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden sm:block"
    >
      <Image
        src="/bg-bliss.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
      />
      {/* The stock is brighter than the desk it replaces, and the window is
          brighter still — without this the sheet and the sky were within a few
          percent of each other and the window stopped being an object on
          something. Ten percent of ink over the whole print puts the paper back
          at about the old desk's value and leaves the window sitting on it. */}
      <div className="absolute inset-0 bg-[rgba(30,26,18,0.10)]" />
    </div>
  )
}
