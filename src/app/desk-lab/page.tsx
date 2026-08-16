'use client'

import { useState } from 'react'
import {
  DotOrbit,
  PerlinNoise,
  Voronoi,
  Warp,
  Water,
} from '@paper-design/shaders-react'

/**
 * TEMPORARY. A place to watch desk candidates move and to try them on different
 * grounds, because motion cannot be screenshotted and colour cannot be argued.
 * Delete once one is chosen.
 *
 * Speeds are deliberately higher here than they would ship at. The first pass
 * ran at 0.06–0.14 and read as a still image: it was animating the whole time,
 * frame hashes differed every second, but nobody can see a change that slow.
 * Judge the motion here, then it gets taken down to wallpaper speed.
 */

const FILL = {
  position: 'absolute' as const,
  inset: 0,
  width: '100%',
  height: '100%',
}

type Ground = {
  label: string
  bg: string
  /** four tints, light to dark, for whichever shader is on */
  tints: [string, string, string, string]
  light: string
  ink: string
}

const GROUNDS: Record<string, Ground> = {
  mist: {
    label: 'cool light grey',
    bg: '#dcdfe2',
    tints: ['#e9ecee', '#d3d7db', '#c4cad0', '#dfe3e6'],
    light: '#f4f6f7',
    ink: '#3d4247',
  },
  slate: {
    label: 'mid grey — windows start to float',
    bg: '#b7bdc3',
    tints: ['#c8ced3', '#adb4bb', '#9aa2aa', '#c1c7cd'],
    light: '#dde1e4',
    ink: '#2f343a',
  },
  graphite: {
    label: 'deep — the most modern, the least paper',
    bg: '#6d747b',
    tints: ['#7d848b', '#646b73', '#575e66', '#79818a'],
    light: '#98a0a8',
    ink: '#e8ebee',
  },
  sand: {
    label: 'the warm beige you have now',
    bg: '#dedad0',
    tints: ['#e8e2d4', '#dcd2c2', '#d2d6d4', '#c9d1d8'],
    light: '#fffcf4',
    ink: '#3d3a33',
  },
}

function pattern(name: string, g: Ground) {
  switch (name) {
    case 'voronoi':
      return (
        <Voronoi
          colors={g.tints}
          stepsPerColor={2}
          colorGlow={g.light}
          colorGap={g.tints[2]}
          distortion={0.32}
          gap={0.06}
          glow={0.4}
          scale={0.7}
          speed={0.5}
          style={FILL}
        />
      )
    case 'stars':
      return (
        <DotOrbit
          colorBack={g.bg}
          colors={g.tints}
          size={0.42}
          sizeRange={0.7}
          spreading={0.42}
          stepsPerColor={1}
          scale={0.62}
          speed={0.7}
          style={FILL}
        />
      )
    case 'water':
      return (
        <Water
          colorBack={g.bg}
          colorHighlight={g.light}
          highlights={0.32}
          layering={0.4}
          edges={0.22}
          waves={0.3}
          caustic={0.36}
          size={0.5}
          scale={0.85}
          speed={0.55}
          style={FILL}
        />
      )
    case 'warp':
      return (
        <Warp
          colors={g.tints}
          proportion={0.5}
          softness={1}
          distortion={0.14}
          swirl={0.55}
          swirlIterations={6}
          shapeScale={0.12}
          scale={0.8}
          speed={0.45}
          style={FILL}
        />
      )
    default:
      return (
        <PerlinNoise
          colorBack={g.tints[2]}
          colorFront={g.tints[0]}
          proportion={0.42}
          softness={0.9}
          octaveCount={3}
          persistence={0.4}
          lacunarity={1.8}
          scale={0.55}
          speed={0.4}
          style={FILL}
        />
      )
  }
}

const PATTERNS = ['voronoi', 'stars', 'water', 'warp', 'drift']

export default function DeskLab() {
  const [pat, setPat] = useState('stars')
  const [gnd, setGnd] = useState('mist')
  const g = GROUNDS[gnd]

  const chip = (on: boolean) =>
    `rounded-full px-3 py-1.5 font-mono text-[12px] transition-colors ${
      on ? 'bg-[#0a6ba8] text-white' : 'bg-black/[0.10] text-[#33383d] hover:bg-black/[0.18]'
    }`

  return (
    <div className="relative h-[100dvh] overflow-hidden" style={{ background: g.bg }}>
      <div className="pointer-events-none absolute inset-0">{pattern(pat, g)}</div>

      {/* a stand-in for the terminal, so the glass is judged in place */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="term h-[58vh] w-full max-w-3xl rounded-[10px] p-8 font-mono text-[15px]"
          style={{
            background: 'var(--frame-fill)',
            border: '1px solid var(--frame-edge)',
            boxShadow: 'var(--frame-shadow)',
            backdropFilter: 'blur(6px) saturate(1.2)',
            WebkitBackdropFilter: 'blur(6px) saturate(1.2)',
            color: 'var(--fg)',
          }}
        >
          <div style={{ color: 'var(--muted)' }}>→ the window sits here</div>
          <div className="mt-4">
            <span style={{ color: 'var(--accent)' }}>$</span> watch it move behind this
          </div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 p-5">
        <div className="flex flex-wrap justify-center gap-2">
          {PATTERNS.map((p) => (
            <button key={p} type="button" onClick={() => setPat(p)} className={chip(pat === p)}>
              {p}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {Object.entries(GROUNDS).map(([key, v]) => (
            <button
              key={key}
              type="button"
              onClick={() => setGnd(key)}
              title={v.label}
              className={chip(gnd === key)}
            >
              {key}
            </button>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-x-0 top-0 p-5 text-center font-mono text-[11px]"
        style={{ color: g.ink, opacity: 0.7 }}
      >
        desk lab · {pat} on {gnd} — {g.label} · speeds are 4–8× what would ship
      </div>
    </div>
  )
}
