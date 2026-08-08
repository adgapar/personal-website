import type { SourceFieldId } from './source-field'

/**
 * Background definitions. Kept free of React and the shader library
 * so commands and routes can import it without pulling WebGL into their bundles.
 *
 * Most of the library's good looks are *image filters* — they need a source.
 * Presets that name a `source` get a procedurally generated colour field
 * (see source-field.ts); the two-colour `dither` layer stands alone.
 */

export const DITHER_SHAPES = [
  'simplex',
  'warp',
  'dots',
  'wave',
  'ripple',
  'swirl',
  'sphere',
] as const

export type DitherShape = (typeof DITHER_SHAPES)[number]

/** Each route gets its own ink pattern. Same family, different reading. */
const SHAPE_BY_ROUTE: Record<string, DitherShape> = {
  '/': 'sphere',
  '/cv': 'sphere',
  '/writing': 'sphere',
  '/contact': 'sphere',
}

export function shapeForRoute(pathname: string): DitherShape {
  return SHAPE_BY_ROUTE[pathname] ?? 'sphere'
}

// ─── Layers ──────────────────────────────────────────────────────────────────

export type DitherType = 'random' | '2x2' | '4x4' | '8x8'

/** two-colour generative dither — the only layer that needs no source image */
export type DitherLayer = {
  kind: 'dither'
  color: string
  colorBack: string
  type: DitherType
  size: number
  scale: number
  speed: number
  opacity: number
}

export type ImageDitherLayer = {
  kind: 'imageDither'
  /** framing: push the subject out from under the text column */
  scale?: number
  offsetX?: number
  offsetY?: number
  colorBack: string
  colorFront: string
  colorHighlight: string
  originalColors: boolean
  inverted?: boolean
  type: DitherType
  size: number
  colorSteps: number
  opacity: number
}

export type HalftoneLayer = {
  kind: 'halftone'
  colorBack: string
  colorFront: string
  originalColors: boolean
  inverted?: boolean
  type: 'classic' | 'gooey' | 'holes' | 'soft'
  grid: 'square' | 'hex'
  size: number
  radius: number
  contrast: number
  grainMixer: number
  grainOverlay: number
  grainSize: number
  opacity: number
}

export type CmykLayer = {
  kind: 'cmyk'
  colorBack: string
  colorC: string
  colorM: string
  colorY: string
  colorK: string
  size: number
  gridNoise: number
  type: 'dots' | 'ink' | 'sharp'
  softness: number
  contrast: number
  grainOverlay: number
  grainSize: number
  opacity: number
}

export type PaperLayer = {
  kind: 'paper'
  colorBack: string
  colorFront: string
  contrast: number
  roughness: number
  fiber: number
  fiberSize: number
  crumples: number
  crumpleSize: number
  folds: number
  foldCount: number
  drops: number
  fade: number
  scale: number
  opacity: number
}

export type BackgroundLayer =
  | DitherLayer
  | ImageDitherLayer
  | HalftoneLayer
  | CmykLayer
  | PaperLayer

export type PaperPreset = {
  id: string
  name: string
  note: string
  /** colour field fed to the image filters; omit for generative-only presets */
  source?: SourceFieldId
  /** rendered back to front */
  layers: BackgroundLayer[]
  /** alpha of the CSS scanline pass; 0 disables it */
  scanlines: number
  /** vignette alpha at centre / mid / edge — keeps the text column readable */
  vignette: [number, number, number]
  /**
   * Soft darkening behind the centre text column, fading to nothing outward.
   * No edges, so it reads as shade rather than a panel. 0 disables it.
   */
  scrim?: number
  /**
   * Post-processing on the whole background. The shaders have no saturation
   * control, so vividness has to come from CSS. 1 = untouched.
   */
  saturate?: number
  brightness?: number
}

// ─── Presets ─────────────────────────────────────────────────────────────────

export const PAPER_PRESETS: PaperPreset[] = [
  {
    // chosen in the lab — the current site default
    id: 'site',
    name: 'site',
    note: 'the live background: sphere dither, accent blue, edge-only vignette',
    layers: [
      {
        kind: 'dither',
        colorBack: '#00000000',
        color: '#1282ba',
        type: 'random',
        size: 4.7,
        scale: 0.3,
        speed: 0.5,
        opacity: 0.34,
      },
    ],
    scanlines: 0,
    vignette: [0, 0, 0.92],
  },
  {
    // the settled style: dithered ink over a generated pattern.
    // pattern = source, pixel size = size, levels = colorSteps, amount = opacity
    id: 'ink',
    name: 'ink',
    note: 'the site background — per-page photo, posterised to a few tones',
    source: 'stockholm',
    layers: [
      {
        kind: 'imageDither',
        colorBack: '#00000000',
        // colorFront/Highlight are ignored while originalColors is on; they are
        // the fallback identity if we ever go back to monochrome ink
        colorFront: '#1282ba',
        colorHighlight: '#7dd3fc',
        originalColors: true,
        inverted: false,
        type: '8x8',
        // coarser grid and more tone levels: the dither reads as a rendering of
        // the photo rather than noise over it, which is where the colour lives
        size: 6,
        colorSteps: 8,
        opacity: 0.6,
      },
    ],
    scanlines: 0,
    // the window handles legibility, so the wallpaper can stay open
    vignette: [0, 0, 0.35],
    // vividness comes from here, not from turning the whole layer up
    saturate: 1.75,
    brightness: 1.18,
  },
  {
    id: 'natural',
    name: 'natural',
    note: 'originalColors dithering over a warm field — real colour, 5 tone steps',
    source: 'ember',
    layers: [
      {
        kind: 'imageDither',
        colorBack: '#000000',
        colorFront: '#ffffff',
        colorHighlight: '#ffffff',
        originalColors: true,
        type: '8x8',
        size: 2,
        colorSteps: 5,
        opacity: 0.42,
      },
    ],
    scanlines: 0,
    vignette: [0.44, 0.7, 0.93],
  },
  {
    id: 'retro',
    name: 'retro',
    note: 'chunky 2x2 at one tone step — hard, posterised, most "old machine"',
    source: 'dusk',
    layers: [
      {
        kind: 'imageDither',
        colorBack: '#0c0b0a',
        colorFront: '#5452ff',
        colorHighlight: '#ededed',
        originalColors: true,
        type: '2x2',
        size: 3,
        colorSteps: 1,
        opacity: 0.38,
      },
    ],
    scanlines: 0.2,
    vignette: [0.46, 0.72, 0.94],
  },
  {
    id: 'signal',
    name: 'signal',
    note: 'two-tone dither in the site palette — blue on near-black, 2 steps',
    source: 'signal',
    layers: [
      {
        kind: 'imageDither',
        colorBack: '#000c38',
        colorFront: '#7dd3fc',
        colorHighlight: '#fbbf24',
        originalColors: false,
        type: '8x8',
        size: 2,
        colorSteps: 2,
        opacity: 0.34,
      },
    ],
    scanlines: 0.18,
    vignette: [0.48, 0.74, 0.94],
  },
  {
    id: 'led',
    name: 'led',
    note: 'LED matrix — soft square dots, phosphor green. departure board.',
    source: 'signal',
    layers: [
      {
        kind: 'halftone',
        colorBack: '#000000',
        colorFront: '#29ff7b',
        originalColors: false,
        type: 'soft',
        grid: 'square',
        size: 0.5,
        radius: 1.5,
        contrast: 0.3,
        grainMixer: 0,
        grainOverlay: 0,
        grainSize: 0.5,
        opacity: 0.3,
      },
    ],
    scanlines: 0.3,
    vignette: [0.44, 0.72, 0.94],
  },
  {
    id: 'mosaic',
    name: 'mosaic',
    note: 'hex mosaic keeping the source colours — soft, almost woven',
    source: 'ember',
    layers: [
      {
        kind: 'halftone',
        colorBack: '#000000',
        colorFront: '#b2aeae',
        originalColors: true,
        type: 'classic',
        grid: 'hex',
        size: 0.6,
        radius: 2,
        contrast: 0.01,
        grainMixer: 0,
        grainOverlay: 0,
        grainSize: 0.5,
        opacity: 0.4,
      },
    ],
    scanlines: 0,
    vignette: [0.42, 0.7, 0.92],
  },
  {
    id: 'newsprint',
    name: 'newsprint',
    note: 'CMYK plates with misregistration — actual print, inverted for dark',
    source: 'steppe',
    layers: [
      {
        kind: 'cmyk',
        colorBack: '#0c0b0a',
        colorC: '#3d4a52',
        colorM: '#5c3a44',
        colorY: '#6b6142',
        colorK: '#d8d2c4',
        size: 0.15,
        gridNoise: 0.5,
        type: 'dots',
        softness: 0.3,
        contrast: 1.4,
        grainOverlay: 0.2,
        grainSize: 0.3,
        opacity: 0.34,
      },
    ],
    scanlines: 0,
    vignette: [0.42, 0.7, 0.92],
  },
  {
    id: 'paper',
    name: 'paper',
    note: 'the field printed onto stock — fiber, folds and crumple over colour',
    source: 'steppe',
    layers: [
      {
        kind: 'paper',
        colorBack: '#0c0b0a',
        colorFront: '#9fadbc',
        contrast: 0.3,
        roughness: 0.4,
        fiber: 0.3,
        fiberSize: 0.2,
        crumples: 0.3,
        crumpleSize: 0.35,
        folds: 0.65,
        foldCount: 5,
        drops: 0.2,
        fade: 0,
        scale: 0.6,
        opacity: 0.5,
      },
    ],
    scanlines: 0,
    vignette: [0.38, 0.66, 0.9],
  },
  {
    id: 'press',
    name: 'press',
    note: 'generative, no source — coarse warm ink, the one that shipped first',
    layers: [
      {
        kind: 'dither',
        colorBack: '#00000000',
        color: '#d8c8a4',
        type: '4x4',
        size: 5,
        scale: 0.45,
        speed: 0.1,
        opacity: 0.34,
      },
    ],
    scanlines: 0,
    vignette: [0.5, 0.74, 0.92],
  },
  {
    id: 'plain',
    name: 'plain',
    note: 'control — no background at all',
    layers: [],
    scanlines: 0,
    vignette: [0, 0, 0],
  },
]

export const LAYER_KINDS = [
  'imageDither',
  'halftone',
  'cmyk',
  'paper',
  'dither',
] as const
export type LayerKind = (typeof LAYER_KINDS)[number]

/** starting point when you switch filter family in the playground */
export function defaultLayer(kind: LayerKind): BackgroundLayer {
  switch (kind) {
    case 'imageDither':
      return {
        kind: 'imageDither',
        colorBack: '#000000',
        colorFront: '#ffffff',
        colorHighlight: '#ffffff',
        originalColors: true,
        inverted: false,
        type: '8x8',
        size: 2,
        colorSteps: 5,
        opacity: 0.42,
      }
    case 'halftone':
      return {
        kind: 'halftone',
        colorBack: '#000000',
        colorFront: '#29ff7b',
        originalColors: false,
        inverted: false,
        type: 'soft',
        grid: 'square',
        size: 0.5,
        radius: 1.5,
        contrast: 0.3,
        grainMixer: 0,
        grainOverlay: 0,
        grainSize: 0.5,
        opacity: 0.32,
      }
    case 'cmyk':
      return {
        kind: 'cmyk',
        colorBack: '#0c0b0a',
        colorC: '#00b3ff',
        colorM: '#fc4f9d',
        colorY: '#ffd900',
        colorK: '#231f20',
        size: 0.2,
        gridNoise: 0.2,
        type: 'ink',
        softness: 1,
        contrast: 1,
        grainOverlay: 0,
        grainSize: 0.5,
        opacity: 0.35,
      }
    case 'paper':
      return {
        kind: 'paper',
        colorBack: '#0c0b0a',
        colorFront: '#9fadbc',
        contrast: 0.3,
        roughness: 0.4,
        fiber: 0.3,
        fiberSize: 0.2,
        crumples: 0.3,
        crumpleSize: 0.35,
        folds: 0.65,
        foldCount: 5,
        drops: 0.2,
        fade: 0,
        scale: 0.6,
        opacity: 0.5,
      }
    case 'dither':
      return {
        kind: 'dither',
        colorBack: '#00000000',
        color: '#d8c8a4',
        type: '4x4',
        size: 5,
        scale: 0.45,
        speed: 0.1,
        opacity: 0.34,
      }
  }
}

// ─── Per-route background ─────────────────────────────────────────────────────
// One treatment across the whole site — same ink, pixel size, levels and amount.
// Only the *subject* changes, and each one is meant to be about its page.

export const SOURCE_BY_ROUTE: Record<string, SourceFieldId> = {
  // a metro station is a terminal — terminus, terminal, same word
  '/': 'stockholm',
  // an arena you are watched and measured in — and the most Spanish thing here
  '/cv': 'bernabeu',
  // a cloister is where text was copied by hand, before printing existed
  '/writing': 'cloister',
  // a long table with the places already set
  '/contact': 'kitchen',
}

/**
 * No framing offsets. Panning a `fit: cover` image exposes the area past its own
 * edge, which renders as colorBack (transparent) and shows the page background
 * as a hard black band. The window sits on top of the wallpaper anyway, so the
 * subject can stay centred where it was composed.
 */
export function presetForRoute(pathname: string): PaperPreset {
  const base = presetById('ink')
  const source = SOURCE_BY_ROUTE[pathname]
  if (!source) return base

  // one treatment, unified across every page — only the subject changes
  return { ...base, source }
}

export const DEFAULT_PRESET_ID = 'ink'

export function presetById(id: string): PaperPreset {
  return PAPER_PRESETS.find((p) => p.id === id) ?? PAPER_PRESETS[0]
}
