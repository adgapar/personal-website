'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './PintxoMotion.module.css'

const ingredients = [
  { width: 53, color: '#f0c740', radius: 12 },
  { width: 67, color: '#3355c6', radius: 4 },
  { width: 53, color: '#e65f3b', radius: 4 },
  { width: 38, color: '#81934f', radius: 4 },
]

// The website supplies sample history instead of capturing microphone audio.
const sampleHistory = [0, .02, .08, .23, .48, .32, .16, .64, .82, .43, .19, .07, .12, .38, .7, .52, .28, .1, .04, .18, .45, .76, .58, .3]
const duration = 4800

// SwiftUI's easeInOut: cubic-bezier(.42, 0, .58, 1).
function ease(progress: number) {
  const x = Math.max(0, Math.min(1, progress))
  if (x === 0 || x === 1) return x
  let low = 0, high = 1
  for (let i = 0; i < 14; i++) {
    const t = (low + high) / 2
    const at = 3 * (1 - t) ** 2 * t * .42 + 3 * (1 - t) * t ** 2 * .58 + t ** 3
    if (at < x) low = t
    else high = t
  }
  const t = (low + high) / 2
  return 3 * (1 - t) * t ** 2 + t ** 3
}

// Port of ActaPintxoDrawing in ActaView.swift: each ingredient splits into two.
function drawing(index: number, mix: number, time: number) {
  const ingredient = ingredients[Math.floor(index / 2)]
  const position = Math.max(0, time - 600) / 100 + 23 - index * 2
  const previous = sampleHistory[Math.floor(position) % sampleHistory.length]
  const next = sampleHistory[(Math.floor(position) + 1) % sampleHistory.length]
  const level = previous + (next - previous) * (position % 1)
  const envelope = .65 + .35 * Math.sin(Math.PI * (index + .5) / 8)
  const height = 24 * (1 - mix) + (6 + Math.sqrt(level) * 76 * envelope) * mix
  const width = ingredient.width * (1 - mix) + 8 * mix
  return {
    x: `${(index - 3.5) * 12 * mix - width / 2}px`,
    y: `${(Math.floor(index / 2) * 29 - 42) * (1 - mix) - height / 2}px`,
    width: `${width}px`, height: `${height}px`,
    rx: `${ingredient.radius * (1 - mix) + 4 * mix}px`,
    opacity: index % 2 === 0 ? 1 : Math.min(1, mix * 2),
    strokeWidth: 1.8 - mix,
  }
}

export default function PintxoMotion({ active = true, interactive = false }: { active?: boolean; interactive?: boolean }) {
  const [replay, setReplay] = useState(0)
  const svg = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const root = svg.current
    if (!root || !active) return
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animations: Animation[] = []
    const play = () => {
      animations.forEach(animation => animation.cancel())
      animations = []
      if (preference.matches) return
      const frames = Array.from({ length: 289 }, (_, i) => {
        const time = i / 288 * duration
        const mix = time < 3000 ? ease((time - 600) / 650) : 1 - ease((time - 3500) / 650)
        return { time, mix }
      })
      const animate = (element: Element, keyframes: Keyframe[]) => {
        animations.push(element.animate(keyframes, { duration, easing: 'linear' }))
      }
      animate(root.querySelector('g')!, frames.map(({ mix }) => ({ transform: `rotate(${-19 * (1 - mix)}deg)` })))
      animate(root.querySelector('path')!, frames.map(({ mix }) => ({ opacity: 1 - mix })))
      root.querySelectorAll<SVGGElement>('[data-ingredient]').forEach((piece, index) => {
        animate(piece.children[1], frames.map(({ time, mix }) => drawing(index, mix, time)))
        animate(piece.children[0], frames.map(({ time, mix }) => {
          const geometry = drawing(index, mix, time)
          return { ...geometry, strokeWidth: 0, opacity: geometry.opacity * (1 - .65 * mix), transform: `translate(${2 - mix}px, ${3 - mix}px)` }
        }))
      })
    }
    play()
    preference.addEventListener('change', play)
    return () => {
      animations.forEach(animation => animation.cancel())
      preference.removeEventListener('change', play)
    }
  }, [active, replay])

  const mark = (
    <svg ref={svg} className={styles.mark} viewBox="-85 -85 170 170" aria-hidden="true">
      <g style={{ transform: 'rotate(-19deg)' }}>
        <path d="M0 -72V72" stroke="#303b2b" strokeWidth="2" strokeLinecap="round" />
        {Array.from({ length: 8 }, (_, index) => (
          <g key={index} data-ingredient={index}>
            <rect fill="#303b2b" style={{ ...drawing(index, 0, 0), transform: 'translate(2px, 3px)', strokeWidth: 0 }} />
            <rect fill={ingredients[Math.floor(index / 2)].color} stroke="#303b2b" style={drawing(index, 0, 0)} />
          </g>
        ))}
      </g>
    </svg>
  )

  return interactive ? (
    <button type="button" className={styles.replay} onClick={() => setReplay(value => value + 1)} aria-label="Replay the pintxo transforming into a voice waveform">
      {mark}<span>Replay the motion ↻</span>
    </button>
  ) : mark
}
