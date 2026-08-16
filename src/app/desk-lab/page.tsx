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
 * TEMPORARY. A place to watch desk candidates move, because motion is the one
 * thing a screenshot cannot show. Delete once one is chosen.
 */

const FILL = {
  position: 'absolute' as const,
  inset: 0,
  width: '100%',
  height: '100%',
}

const DESK = '#dedad0'

const CANDIDATES: Record<string, { note: string; node: React.ReactNode }> = {
  voronoi: {
    note: 'cells drifting — organic, architectural',
    node: (
      <Voronoi
        colors={['#e9e4d6', '#d6d1c2', '#cfd4d6', '#e2ded1']}
        stepsPerColor={2}
        colorGlow="#f2eee2"
        colorGap="#c8c3b5"
        distortion={0.32}
        gap={0.06}
        glow={0.4}
        scale={0.7}
        speed={0.09}
        style={FILL}
      />
    ),
  },
  stars: {
    note: 'a slow drift of points — the closest to stars',
    node: (
      <DotOrbit
        colorBack={DESK}
        colors={['#b9b2a2', '#c9c3b4', '#a8b0b4', '#d2ccbd']}
        size={0.42}
        sizeRange={0.7}
        spreading={0.42}
        stepsPerColor={1}
        scale={0.62}
        speed={0.14}
        style={FILL}
      />
    ),
  },
  water: {
    note: 'caustics — the calmest of the five',
    node: (
      <Water
        colorBack={DESK}
        colorHighlight="#fffdf6"
        highlights={0.32}
        layering={0.4}
        edges={0.22}
        waves={0.3}
        caustic={0.36}
        size={0.5}
        scale={0.85}
        speed={0.1}
        style={FILL}
      />
    ),
  },
  warp: {
    note: 'slow folding bands — the most abstract',
    node: (
      <Warp
        colors={['#e6e1d3', '#d4cfc0', '#ccd2d4', '#ddd8ca']}
        proportion={0.5}
        softness={1}
        distortion={0.14}
        swirl={0.55}
        swirlIterations={6}
        shapeScale={0.12}
        scale={0.8}
        speed={0.08}
        style={FILL}
      />
    ),
  },
  drift: {
    note: 'perlin cloud — soft, weatherlike',
    node: (
      <PerlinNoise
        colorBack="#d8d3c6"
        colorFront="#efeade"
        proportion={0.42}
        softness={0.9}
        octaveCount={3}
        persistence={0.4}
        lacunarity={1.8}
        scale={0.55}
        speed={0.06}
        style={FILL}
      />
    ),
  },
}

export default function DeskLab() {
  const [pick, setPick] = useState<keyof typeof CANDIDATES>('voronoi')

  return (
    <div className="relative h-[100dvh] overflow-hidden" style={{ background: DESK }}>
      <div className="pointer-events-none absolute inset-0">{CANDIDATES[pick].node}</div>

      {/* a stand-in for the terminal, so the glass is judged in place */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="term h-[62vh] w-full max-w-3xl rounded-[10px] p-8 font-mono text-[15px]"
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

      <div className="absolute inset-x-0 bottom-0 flex flex-wrap justify-center gap-2 p-5 font-mono text-[12px]">
        {Object.entries(CANDIDATES).map(([key, { note }]) => (
          <button
            key={key}
            type="button"
            onClick={() => setPick(key as keyof typeof CANDIDATES)}
            title={note}
            className={`rounded-full px-3 py-1.5 transition-colors ${
              pick === key
                ? 'bg-[#0a6ba8] text-white'
                : 'bg-black/[0.07] text-[#4a463e] hover:bg-black/[0.14]'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="absolute inset-x-0 top-0 p-5 text-center font-mono text-[11px] text-[#6b675f]">
        desk lab · {CANDIDATES[pick].note}
      </div>
    </div>
  )
}
