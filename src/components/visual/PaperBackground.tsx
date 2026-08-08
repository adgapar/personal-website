'use client'

import { useMemo, useSyncExternalStore } from 'react'
import {
  Dithering,
  HalftoneCmyk,
  HalftoneDots,
  ImageDithering,
  PaperTexture,
} from '@paper-design/shaders-react'
import {
  DEFAULT_PRESET_ID,
  presetById,
  type DitherShape,
  type PaperPreset,
  type SubstrateLayer,
} from '@/lib/dither'
import { sourceField } from '@/lib/source-field'

/**
 * The page substrate: one or more shader layers over a generated colour field,
 * an optional CSS scanline pass and a vignette that protects the text column.
 */

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(REDUCED_MOTION_QUERY)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => false,
  )
}

const FILL = { position: 'absolute', inset: 0 } as const
const SIZE = { width: '100%', height: '100%' } as const

function Layer({
  layer,
  shape,
  image,
  quality,
  still,
}: {
  layer: SubstrateLayer
  shape: DitherShape
  image: string
  quality: number
  still: boolean
}) {
  const cap = Math.round(1_200_000 * quality)
  const common = { ...SIZE, maxPixelCount: cap, fit: 'cover' as const }

  switch (layer.kind) {
    case 'dither':
      return (
        <Dithering
          colorBack={layer.colorBack}
          colorFront={layer.color}
          shape={shape}
          type={layer.type}
          size={layer.size}
          scale={layer.scale}
          speed={still ? 0 : layer.speed}
          {...SIZE}
          maxPixelCount={cap}
          style={{ ...FILL, opacity: layer.opacity }}
        />
      )

    case 'imageDither':
      return (
        <ImageDithering
          image={image}
          colorBack={layer.colorBack}
          colorFront={layer.colorFront}
          colorHighlight={layer.colorHighlight}
          originalColors={layer.originalColors}
          inverted={layer.inverted ?? false}
          type={layer.type}
          size={layer.size}
          colorSteps={layer.colorSteps}
          scale={layer.scale ?? 1}
          offsetX={layer.offsetX ?? 0}
          offsetY={layer.offsetY ?? 0}
          speed={0}
          {...common}
          style={{ ...FILL, opacity: layer.opacity }}
        />
      )

    case 'halftone':
      return (
        <HalftoneDots
          image={image}
          colorBack={layer.colorBack}
          colorFront={layer.colorFront}
          originalColors={layer.originalColors}
          inverted={layer.inverted ?? false}
          type={layer.type}
          grid={layer.grid}
          size={layer.size}
          radius={layer.radius}
          contrast={layer.contrast}
          grainMixer={layer.grainMixer}
          grainOverlay={layer.grainOverlay}
          grainSize={layer.grainSize}
          speed={0}
          {...common}
          style={{ ...FILL, opacity: layer.opacity }}
        />
      )

    case 'cmyk':
      return (
        <HalftoneCmyk
          image={image}
          colorBack={layer.colorBack}
          colorC={layer.colorC}
          colorM={layer.colorM}
          colorY={layer.colorY}
          colorK={layer.colorK}
          size={layer.size}
          gridNoise={layer.gridNoise}
          type={layer.type}
          softness={layer.softness}
          contrast={layer.contrast}
          grainOverlay={layer.grainOverlay}
          grainSize={layer.grainSize}
          speed={0}
          {...common}
          style={{ ...FILL, opacity: layer.opacity }}
        />
      )

    case 'paper':
      return (
        <PaperTexture
          image={image}
          colorBack={layer.colorBack}
          colorFront={layer.colorFront}
          contrast={layer.contrast}
          roughness={layer.roughness}
          fiber={layer.fiber}
          fiberSize={layer.fiberSize}
          crumples={layer.crumples}
          crumpleSize={layer.crumpleSize}
          folds={layer.folds}
          foldCount={layer.foldCount}
          drops={layer.drops}
          fade={layer.fade}
          seed={5.8}
          scale={layer.scale}
          {...common}
          style={{ ...FILL, opacity: layer.opacity }}
        />
      )
  }
}

interface Props {
  shape: DitherShape
  preset?: PaperPreset
  /** `absolute` for preview tiles, `fixed` for the real page background */
  position?: 'fixed' | 'absolute'
  /** lower for small tiles so a grid of them stays cheap */
  quality?: number
}

export default function PaperBackground({
  shape,
  preset = presetById(DEFAULT_PRESET_ID),
  position = 'fixed',
  quality = 1,
}: Props) {
  const still = usePrefersReducedMotion()
  const { source, layers, scanlines, vignette, scrim, saturate, brightness } = preset
  const [vIn, vMid, vOut] = vignette

  // canvas-generated, so it can only be built in the browser
  const image = useMemo(() => (source ? sourceField(source) : ''), [source])

  if (layers.length === 0) return null

  return (
    <div
      aria-hidden
      className={`pointer-events-none ${position} inset-0 z-0 overflow-hidden`}
    >
      <div
        className="absolute inset-0"
        style={{
          filter:
            saturate !== undefined || brightness !== undefined
              ? `saturate(${saturate ?? 1}) brightness(${brightness ?? 1})`
              : undefined,
        }}
      >
        {layers.map((layer, i) => (
        // keyed by source: swapping the colour field must rebuild the texture,
        // updating the uniform in place does not reliably re-upload it
          <Layer
            key={`${i}:${layer.kind}:${source ?? 'none'}`}
            layer={layer}
            shape={shape}
            image={image}
            quality={quality}
            still={still}
          />
        ))}
      </div>

      {/* pure CSS, so the retro read survives even without WebGL */}
      {scanlines > 0 && (
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(to bottom, rgba(0,0,0,${scanlines}) 0px, rgba(0,0,0,${scanlines}) 1px, transparent 1px, transparent 3px)`,
            mixBlendMode: 'multiply',
          }}
        />
      )}

      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(130% 90% at 50% 40%, rgba(12,11,10,${vIn}) 0%, rgba(12,11,10,${vMid}) 55%, rgba(12,11,10,${vOut}) 100%)`,
        }}
      />

      {/* shade behind the reading column — soft on every side, no boundary */}
      {scrim ? (
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(ellipse 38% 62% at 50% 46%, rgba(12,11,10,${scrim}) 0%, rgba(12,11,10,${scrim * 0.82}) 42%, rgba(12,11,10,0) 82%)`,
          }}
        />
      ) : null}
    </div>
  )
}
