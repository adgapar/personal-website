/**
 * Covers the app on a phone held the wrong way, rather than squeezing it into
 * a shape it was not drawn for. Sits over the whole panel — not swapped in
 * for it — so nothing underneath unmounts and has to remeasure itself when
 * the phone turns back.
 */
export default function RotateOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-[var(--surface)] text-center">
      <span aria-hidden className="text-2xl text-[var(--muted)]">
        ⟲
      </span>
      <p className="text-[11px] tracking-widest text-[var(--muted)] uppercase">
        rotate your device
      </p>
    </div>
  )
}
