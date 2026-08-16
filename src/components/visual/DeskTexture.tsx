'use client'

import { PaperTexture } from '@paper-design/shaders-react'

/**
 * The desk, as a sheet of stock rather than a flat colour.
 *
 * It exists for two reasons, and the second is the one that matters.
 *
 * The first is that a single flat fill is what made the light build read as
 * blank — a surface with no tone is not a surface.
 *
 * The second: the reader's sidebar is glass, and glass over a flat colour cannot
 * look like glass. Blur needs variation to work on; blurring one colour returns
 * that colour, so the pane reads as a differently tinted panel rather than as
 * something you are seeing through. Fibre and fold behind it are what turn a
 * tint into a material.
 *
 * Held very low on purpose. This is stock, not wallpaper — the last time this
 * site put a picture behind the text, the picture won.
 */
export default function DeskTexture() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <PaperTexture
        colorBack="#dedad0"
        colorFront="#a99f8c"
        contrast={0.34}
        roughness={0.52}
        fiber={0.42}
        fiberSize={0.14}
        crumples={0.18}
        crumpleSize={0.42}
        folds={0.3}
        foldCount={3}
        drops={0}
        fade={0}
        seed={5.8}
        scale={0.75}
        fit="cover"
        width="100%"
        height="100%"
        maxPixelCount={1_400_000}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      />
      {/* the light the desk catches where the window sits, kept on top of the
          stock so the grain is lit rather than tinted */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(115% 75% at 50% 18%, rgba(255,253,247,0.55) 0%, rgba(255,253,247,0) 62%)',
        }}
      />
    </div>
  )
}
