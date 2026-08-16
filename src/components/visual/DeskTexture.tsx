'use client'

import { StaticMeshGradient } from '@paper-design/shaders-react'

/**
 * The desk: an abstract field, not a material and not a picture.
 *
 * Three attempts got here. A photograph competed with the writing and won. A
 * flat colour read as blank. Paper fibre looked like dirt at full size, and —
 * worse — was invisible to the one thing that needed it: blur destroys detail
 * finer than its own radius, so the reader's glass sidebar averaged the grain
 * back into a single tone and looked like a paint swatch.
 *
 * A mesh gradient is the shape of variation that survives all three tests. It is
 * large and soft, so blur keeps it and the glass shows a gradient across its
 * width. It has no subject, so there is nothing to look at. And the colours are
 * the desk's own, a few steps either side, so at full size it reads as light
 * falling across a surface rather than as artwork.
 *
 * Static — speed 0. An animated background behind prose is a thing that moves
 * while you are trying to read.
 */
export default function DeskTexture() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <StaticMeshGradient
        // Hue, not contrast. Proved with a test: force the desk red and the
        // sidebar goes red, so the glass was always transparent — it just had
        // four shades of the same beige to show, which looks like one beige.
        // Sand, clay, stone and a cool blue-grey: close in value so the desk
        // stays quiet, far enough apart in hue that glass over them reads as
        // glass.
        colors={['#e8e2d4', '#dcd2c2', '#d2d6d4', '#c9d1d8']}
        positions={2}
        waveX={0.85}
        waveXShift={0.45}
        waveY={0.9}
        waveYShift={0.3}
        mixing={1}
        // just enough tooth to stop the gradient looking like a CSS gradient
        grainMixer={0.16}
        grainOverlay={0.08}
        rotation={288}
        scale={1.25}
        speed={0}
        fit="cover"
        width="100%"
        height="100%"
        maxPixelCount={1_400_000}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      {/* the light the desk catches where the window sits */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(105% 70% at 50% 12%, rgba(255,253,247,0.5) 0%, rgba(255,253,247,0) 64%)',
        }}
      />
    </div>
  )
}
