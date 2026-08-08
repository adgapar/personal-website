/**
 * The paper shaders' image filters need something to sample. Rather than ship a
 * stock photo we generate sources on a canvas.
 *
 * Two kinds:
 *  - palettes: soft colour fields, for `originalColors` dithering
 *  - patterns: grayscale terminal-native structures, meant to be recoloured by
 *    the filter's own colorFront/colorBack
 *
 * Client-only: needs a real canvas. Results are cached per id.
 */

export const PALETTE_FIELDS = ['ember', 'dusk', 'steppe', 'signal'] as const
export const PATTERN_FIELDS = [
  'grid',
  'contour',
  'matrix',
  'circuit',
  'waveform',
  'starfield',
] as const

/** real photographs, served straight from /public — no canvas needed */
export const PHOTO_FIELDS = [
  'stockholm',
  'munich',
  'bernabeu',
  'cloister',
  'kitchen',
  'stairs',
] as const

const PHOTO_URLS: Record<PhotoFieldId, string> = {
  stockholm: '/bg-stockholm.jpg',
  munich: '/bg-munich.jpg',
  bernabeu: '/bg-bernabeu.jpg',
  cloister: '/bg-fr-castle.jpg',
  kitchen: '/bg-fr-kitchen.jpg',
  stairs: '/bg-fr-stairs.jpg',
}

export const SOURCE_FIELDS = [
  ...PHOTO_FIELDS,
  ...PALETTE_FIELDS,
  ...PATTERN_FIELDS,
] as const

export type PaletteFieldId = (typeof PALETTE_FIELDS)[number]
export type PatternFieldId = (typeof PATTERN_FIELDS)[number]
export type PhotoFieldId = (typeof PHOTO_FIELDS)[number]
export type SourceFieldId = (typeof SOURCE_FIELDS)[number]

export function isPattern(id: SourceFieldId): id is PatternFieldId {
  return (PATTERN_FIELDS as readonly string[]).includes(id)
}

export function isPhoto(id: SourceFieldId): id is PhotoFieldId {
  return (PHOTO_FIELDS as readonly string[]).includes(id)
}

export const FIELD_NOTES: Record<SourceFieldId, string> = {
  stockholm: 'Rådhuset station — carved rock, full tonal range, strong symmetry',
  munich: 'a stairwell on the Camino — mostly light, one dark silhouette',
  bernabeu: 'Bernabéu — dense crowd texture, a bright pitch, radial geometry',
  cloister: 'Les Jacobins, Toulouse — arcade rhythm, a garden through arches',
  kitchen: 'a French kitchen — a long table, places set, lamps lit',
  stairs: 'an old stairwell — bare plaster, family portraits, one lamp',
  ember: 'amber / orange — warm',
  dusk: 'violet / cyan — cool',
  steppe: 'earth, sand, dry grass',
  signal: 'the site palette: accent + warm',
  grid: 'graph paper — fine rules, heavier every fifth',
  contour: 'topographic lines from a noise field — a map of nowhere',
  matrix: 'falling glyph columns with decaying trails',
  circuit: 'orthogonal PCB traces and vias',
  waveform: 'stacked oscilloscope traces',
  starfield: 'sparse points at varying brightness',
}

const PALETTES: Record<PaletteFieldId, { base: string; blobs: string[] }> = {
  ember: { base: '#140b04', blobs: ['#fbbf24', '#f97316', '#7c2d12', '#fde68a'] },
  dusk: { base: '#070a1c', blobs: ['#5452ff', '#22d3ee', '#a78bfa', '#0ea5e9'] },
  steppe: { base: '#12100a', blobs: ['#b45309', '#d6c39a', '#4d5d3a', '#8a6b3d'] },
  signal: { base: '#050607', blobs: ['#7dd3fc', '#fbbf24', '#6ee7b7', '#1e3a5f'] },
}

/** deterministic, so a source looks the same on every load */
function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function seedFor(id: string) {
  let h = 2166136261
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

const W = 640
const H = 400

// ─── palettes ────────────────────────────────────────────────────────────────

function drawPalette(ctx: CanvasRenderingContext2D, id: PaletteFieldId) {
  const { base, blobs } = PALETTES[id]
  const rand = mulberry32(seedFor(id))

  ctx.fillStyle = base
  ctx.fillRect(0, 0, W, H)

  ctx.globalCompositeOperation = 'lighter'
  for (let i = 0; i < 9; i++) {
    const x = rand() * W
    const y = rand() * H
    const r = (0.22 + rand() * 0.45) * W
    const color = blobs[i % blobs.length]
    const g = ctx.createRadialGradient(x, y, 0, x, y, r)
    g.addColorStop(0, color)
    g.addColorStop(0.45, `${color}66`)
    g.addColorStop(1, 'transparent')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(x, y, r, 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalCompositeOperation = 'source-over'
}

// ─── patterns ────────────────────────────────────────────────────────────────

/** smooth value noise, for the contour map */
function valueNoise(seed: number) {
  const rand = mulberry32(seed)
  const G = 12
  const grid = Array.from({ length: G + 1 }, () =>
    Array.from({ length: G + 1 }, () => rand()),
  )
  const fade = (t: number) => t * t * (3 - 2 * t)
  return (x: number, y: number) => {
    const gx = x * G
    const gy = y * G
    const x0 = Math.floor(gx)
    const y0 = Math.floor(gy)
    const tx = fade(gx - x0)
    const ty = fade(gy - y0)
    const a = grid[y0][x0]
    const b = grid[y0][x0 + 1]
    const c = grid[y0 + 1][x0]
    const d = grid[y0 + 1][x0 + 1]
    return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty
  }
}

function drawPattern(ctx: CanvasRenderingContext2D, id: PatternFieldId) {
  const rand = mulberry32(seedFor(id))
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, W, H)
  ctx.lineCap = 'butt'

  switch (id) {
    case 'grid': {
      const cell = 16
      for (let x = 0, i = 0; x <= W; x += cell, i++) {
        ctx.strokeStyle = i % 5 === 0 ? '#ffffff' : '#5a5a5a'
        ctx.lineWidth = i % 5 === 0 ? 1.4 : 0.7
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
      }
      for (let y = 0, i = 0; y <= H; y += cell, i++) {
        ctx.strokeStyle = i % 5 === 0 ? '#ffffff' : '#5a5a5a'
        ctx.lineWidth = i % 5 === 0 ? 1.4 : 0.7
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }
      break
    }

    case 'contour': {
      const noise = valueNoise(seedFor(id))
      const levels = 14
      const step = 2
      for (let l = 1; l < levels; l++) {
        const target = l / levels
        const shade = Math.round(90 + (l / levels) * 165)
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`
        for (let y = 0; y < H; y += step) {
          for (let x = 0; x < W; x += step) {
            const v = noise(x / W, y / H)
            if (Math.abs(v - target) < 0.006) ctx.fillRect(x, y, step, step)
          }
        }
      }
      break
    }

    case 'matrix': {
      const colW = 10
      for (let x = 0; x < W; x += colW) {
        const head = rand() * H * 1.4
        const trail = 60 + rand() * 160
        for (let y = head; y > head - trail; y -= 12) {
          if (y < 0 || y > H) continue
          const t = 1 - (head - y) / trail
          const shade = Math.round(255 * t * t)
          ctx.fillStyle = `rgb(${shade},${shade},${shade})`
          // a glyph-ish mark rather than a solid block
          const w = 2 + rand() * 4
          ctx.fillRect(x + 2, y, w, 6)
          if (rand() > 0.6) ctx.fillRect(x + 2, y + 2, w + 2, 1.5)
        }
      }
      break
    }

    case 'circuit': {
      ctx.lineWidth = 1.6
      for (let i = 0; i < 46; i++) {
        let x = Math.round((rand() * W) / 8) * 8
        let y = Math.round((rand() * H) / 8) * 8
        const shade = Math.round(120 + rand() * 135)
        ctx.strokeStyle = `rgb(${shade},${shade},${shade})`
        ctx.fillStyle = ctx.strokeStyle
        ctx.beginPath()
        ctx.moveTo(x, y)
        const segments = 3 + Math.floor(rand() * 5)
        for (let s = 0; s < segments; s++) {
          const len = (2 + Math.floor(rand() * 9)) * 8
          if (rand() > 0.5) x += rand() > 0.5 ? len : -len
          else y += rand() > 0.5 ? len : -len
          ctx.lineTo(x, y)
        }
        ctx.stroke()
        ctx.beginPath()
        ctx.arc(x, y, 2.6, 0, Math.PI * 2)
        ctx.fill()
      }
      break
    }

    case 'waveform': {
      const traces = 7
      for (let t = 0; t < traces; t++) {
        const baseY = ((t + 0.5) / traces) * H
        const amp = 8 + rand() * 26
        const freq = 0.006 + rand() * 0.022
        const phase = rand() * Math.PI * 2
        const shade = Math.round(110 + rand() * 145)
        ctx.strokeStyle = `rgb(${shade},${shade},${shade})`
        ctx.lineWidth = 1.3
        ctx.beginPath()
        for (let x = 0; x <= W; x += 2) {
          const jitter = (rand() - 0.5) * 3
          const y =
            baseY +
            Math.sin(x * freq + phase) * amp +
            Math.sin(x * freq * 3.1 + phase) * amp * 0.3 +
            jitter
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
      break
    }

    case 'starfield': {
      for (let i = 0; i < 900; i++) {
        const x = rand() * W
        const y = rand() * H
        const b = rand()
        const shade = Math.round(60 + b * b * 195)
        ctx.fillStyle = `rgb(${shade},${shade},${shade})`
        const r = b > 0.94 ? 1.8 : 0.9
        ctx.fillRect(x, y, r, r)
      }
      break
    }
  }
}

// ─── entry point ─────────────────────────────────────────────────────────────

const cache = new Map<SourceFieldId, string>()

export function sourceField(id: SourceFieldId): string {
  const cached = cache.get(id)
  if (cached) return cached

  // photographs need no generation, just the URL
  if (isPhoto(id)) {
    const url = PHOTO_URLS[id]
    cache.set(id, url)
    return url
  }

  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return ''

  if (isPattern(id)) drawPattern(ctx, id)
  else drawPalette(ctx, id as PaletteFieldId)

  const url = canvas.toDataURL('image/jpeg', 0.92)
  cache.set(id, url)
  return url
}
