import Image from 'next/image'

/** The studio's dark ink backdrop, beneath the paper windows. */
export default function DeskSurface() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden sm:block">
      <Image src="/studio/dark-ink.svg" alt="" fill priority sizes="100vw" className="object-cover" />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 38%, #7596ac24, transparent 75%)' }} />
    </div>
  )
}
