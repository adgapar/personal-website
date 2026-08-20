'use client'

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import AppWindow from './AppWindow'
import {
  COLS,
  ROWS,
  intervalFor,
  newGame,
  step,
  turn,
  type Direction,
  type Game,
} from '@/lib/snake'

/**
 * The snake, for the `python` egg.
 *
 * Holds no rules. Every one of them is in lib/snake.ts, which is pure and tested
 * headlessly by `pnpm test:snake`; this file is input, a clock, and a screen.
 *
 * The screen is the point. This began as a grid of `·` glyphs, which is the
 * terminal's material and the wrong material — the terminal is a document, and a
 * game is a device you hold. So it is drawn as a handheld LCD: a lit panel with
 * every pixel faintly visible whether it is on or not, square segments with a
 * hairline of unlit screen between them, and a bezel around the field. Nokia
 * rather than Game Boy, because Snake is the Nokia one, and because olive sits
 * with this site's warm greys where acid green would fight them.
 *
 * Every state is drawn *on* the panel — the title, the score, game over. An LCD
 * that hands its own messages to the HTML underneath it stops reading as a
 * screen, and that is the whole illusion being paid for here.
 *
 * SVG rather than a canvas or 336 divs: one unit per cell means the geometry is
 * written in the same coordinates the rules use, it stays crisp at any size the
 * window happens to be, and it draws the snake rather than the whole board.
 *
 * Keys are read on the panel, not on the window. The terminal downstairs uses ↑
 * and ↓ for command history, and a game listening globally would eat them for
 * the session; one that listens only while its own screen has focus takes
 * nothing that was not aimed at it.
 *
 * Every key has a gesture beside it, because a phone has none of them: a tap is
 * the space bar, a swipe is an arrow, and the panel says so instead of saying
 * PRESS A KEY at a screen with no keys attached.
 */

/* An LCD, not a palette entry: four values that only mean anything together, so
   they live here rather than in globals.css. Swap these four for #9bbc0f /
   #8b9a3f / #0f380f and it is a Game Boy instead. */
const LCD = {
  /** the lit panel */
  screen: '#c2cf96',
  /** a pixel that is off — only just visible, which is what sells it as a screen */
  off: '#b4c288',
  /** a pixel that is on */
  on: '#2b3a1c',
  /** the case around the glass */
  bezel: '#8d9a66',
}

/** how far a finger has to travel before it is a swipe and not a tap, in px */
const SWIPE = 24

/**
 * Whether the thing pointing at this is a finger.
 *
 * Asked because the panel has to name the control it actually has — an LCD that
 * reads PRESS A KEY on a phone is an LCD telling you to do the one thing you
 * cannot. Subscribed rather than read once: a tablet with a keyboard folded on
 * and off changes the answer, and the server has no pointer at all, which is what
 * the third argument is for.
 */
const COARSE = '(pointer: coarse)'

function useCoarsePointer() {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(COARSE)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(COARSE).matches,
    () => false,
  )
}

export default function SnakeApp({ onClose }: { onClose: () => void }) {
  // Math.random belongs here and nowhere else: this is the one place a game is
  // played rather than replayed, and the rules take randomness as an argument
  // precisely so the tests can hand them something repeatable.
  const rng = useCallback(() => Math.random(), [])
  const [game, setGame] = useState<Game>(() => newGame(rng))
  const panel = useRef<HTMLDivElement>(null)

  // The clock, keyed off the score so eating tightens the interval. A fixed
  // setInterval would have to be torn down every tick to do the same thing.
  useEffect(() => {
    if (game.phase !== 'playing') return
    const id = setInterval(() => setGame((g) => step(g, rng)), intervalFor(game.score))
    return () => clearInterval(id)
  }, [game.phase, game.score, rng])

  // focus on open, so the first arrow key is already the game's
  useEffect(() => {
    panel.current?.focus()
  }, [])

  const coarse = useCoarsePointer()

  const push = useCallback((d: Direction) => setGame((g) => turn(g, d)), [])
  const restart = useCallback(() => setGame((g) => newGame(rng, g.best)), [rng])

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const key = e.key.toLowerCase()
      const heading: Record<string, Direction> = {
        arrowup: 'up', w: 'up',
        arrowdown: 'down', s: 'down',
        arrowleft: 'left', a: 'left',
        arrowright: 'right', d: 'right',
      }
      if (heading[key]) {
        // the arrows scroll a page and space pages it — neither is wanted while
        // the thing with focus is a game
        e.preventDefault()
        push(heading[key])
        return
      }
      if (key === 'q') { onClose(); return }
      if (key === ' ' || key === 'enter') {
        e.preventDefault()
        // the same two jobs the tap has: start a waiting game, restart a finished
        // one. PRESS A KEY was only true of the arrows before this.
        if (game.phase === 'dead') restart()
        else if (game.phase === 'idle') push(game.heading)
      }
    },
    [push, onClose, restart, game.phase, game.heading],
  )

  /**
   * Tap and swipe, for the phone, where the panel is the whole screen and a
   * gesture has somewhere to happen. A d-pad would cost a fifth of the field to
   * say what a swipe says for free.
   *
   * Pointer events rather than touch events. They are one code path for glass and
   * for a mouse, they are what paint next door already draws with on the same
   * devices, and setPointerCapture guarantees the up lands on this element — a
   * touchend can be stolen by whatever the finger has wandered over, and a swipe
   * whose end never arrives is a control that silently does nothing.
   */
  const drag = useRef<{ x: number; y: number } | null>(null)

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    drag.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
    // a finger on the panel is also how the panel takes focus, so a phone with a
    // keyboard attached and a desk with a mouse end up in the same state
    panel.current?.focus()
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      const start = drag.current
      if (!start) return
      drag.current = null
      const dx = e.clientX - start.x
      const dy = e.clientY - start.y
      // a floor, so a tap is not read as a flick in whichever direction the
      // finger happened to roll
      if (Math.abs(dx) < SWIPE && Math.abs(dy) < SWIPE) {
        // A tap is the space bar: it starts a waiting game and restarts a
        // finished one. Starting it with the heading it already has means the tap
        // says "go" and nothing about which way, which is the honest reading of a
        // gesture with no direction in it.
        if (game.phase === 'dead') restart()
        else if (game.phase === 'idle') push(game.heading)
        return
      }
      // longer axis wins
      push(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up')
    },
    [push, game.phase, game.heading, restart],
  )

  const endDrag = useCallback(() => {
    drag.current = null
  }, [])

  const won = game.snake.length >= COLS * ROWS
  /** the readout strip above the field, in cell units */
  const HUD = 2
  const height = ROWS + HUD

  return (
    <AppWindow
      title="snake"
      onClose={onClose}
      status={
        game.phase === 'idle' ? (coarse ? 'swipe to steer' : 'esc to put it away') : undefined
      }
    >
      <div
        ref={panel}
        tabIndex={0}
        role="application"
        aria-label={
          coarse
            ? `snake. score ${game.score}. tap to start, swipe to steer`
            : `snake. score ${game.score}. arrow keys or wasd to steer, q to quit`
        }
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={endDrag}
        // touch-none: a swipe here is a direction, never a page scroll
        className="flex flex-1 touch-none items-center justify-center p-3 outline-none focus-visible:outline-none sm:p-5"
      >
        <svg
          viewBox={`0 0 ${COLS} ${height}`}
          // The panel takes the window, whichever dimension runs out first: the
          // aspect ratio is fixed, so one CSS rule handles a phone in portrait
          // and a dragged window on a desk without laying anything out twice.
          className="h-auto max-h-full w-full max-w-full"
          style={{ fontFamily: 'var(--font-mono), ui-monospace, monospace' }}
          shapeRendering="crispEdges"
          aria-hidden
        >
          <defs>
            {/* every pixel on the screen, lit or not — the ghost grid is what
                makes a dark square read as a pixel that is on rather than as a
                shape drawn on paper */}
            <pattern id="lcd-pixels" width="1" height="1" patternUnits="userSpaceOnUse">
              <rect x="0.12" y="0.12" width="0.76" height="0.76" fill={LCD.off} />
            </pattern>
          </defs>

          {/* the case, and the glass inset into it */}
          <rect x="0" y="0" width={COLS} height={height} fill={LCD.bezel} />
          <rect x="0.35" y="0.35" width={COLS - 0.7} height={height - 0.7} fill={LCD.screen} />

          {/* the readout: score left, best right, the way a handheld does it */}
          <text
            x="0.9"
            y={HUD - 0.55}
            fill={LCD.on}
            style={{ fontSize: '0.95px', letterSpacing: '0.12px' }}
          >
            {String(game.score).padStart(3, '0')}
          </text>
          {game.best > 0 && (
            <text
              x={COLS - 0.9}
              y={HUD - 0.55}
              textAnchor="end"
              fill={LCD.on}
              opacity="0.55"
              style={{ fontSize: '0.95px', letterSpacing: '0.12px' }}
            >
              HI {String(game.best).padStart(3, '0')}
            </text>
          )}

          {/* the field: unlit pixels first, then the bezel line that fences them */}
          <rect x="0.6" y={HUD} width={COLS - 1.2} height={ROWS - 0.6} fill="url(#lcd-pixels)" />
          <rect
            x="0.6"
            y={HUD}
            width={COLS - 1.2}
            height={ROWS - 0.6}
            fill="none"
            stroke={LCD.on}
            strokeWidth="0.12"
            opacity="0.5"
          />

          <g transform={`translate(0.6, ${HUD})`}>
            {/* the apple: a lit pixel with its middle off, so it reads as a thing
                to eat rather than as another piece of snake */}
            <rect x={game.food.x + 0.1} y={game.food.y + 0.1} width="0.8" height="0.8" fill={LCD.on} />
            <rect x={game.food.x + 0.35} y={game.food.y + 0.35} width="0.3" height="0.3" fill={LCD.screen} />

            {/* Segments, each inset so a hairline of unlit screen shows between
                them — a solid rope of pixels loses the count of how long it is,
                which is the one number the player is actually watching. */}
            {game.snake.map((p, i) => (
              <rect
                key={`${p.x},${p.y},${i}`}
                x={p.x + 0.08}
                y={p.y + 0.08}
                width="0.84"
                height="0.84"
                fill={LCD.on}
              />
            ))}
            {/* the head keeps a lit core with a ring of screen around it, so you
                can tell which end is which at a glance */}
            <rect
              x={game.snake[0].x + 0.24}
              y={game.snake[0].y + 0.24}
              width="0.52"
              height="0.52"
              fill={LCD.screen}
            />
          </g>

          {/* Messages are drawn on the panel, over a plate of screen — an LCD
              that passes its own text down to the HTML stops being an LCD. */}
          {game.phase !== 'playing' && (
            <g>
              <rect
                x={COLS / 2 - 7}
                y={HUD + ROWS / 2 - 3}
                width="14"
                height="5"
                fill={LCD.screen}
                stroke={LCD.on}
                strokeWidth="0.14"
              />
              <text
                x={COLS / 2}
                y={HUD + ROWS / 2 - 1.1}
                textAnchor="middle"
                fill={LCD.on}
                style={{ fontSize: '1.5px', letterSpacing: '0.2px' }}
              >
                {game.phase === 'idle' ? 'SNAKE' : won ? 'PERFECT' : 'GAME OVER'}
              </text>
              <text
                x={COLS / 2}
                y={HUD + ROWS / 2 + 0.75}
                textAnchor="middle"
                fill={LCD.on}
                opacity="0.7"
                style={{ fontSize: '0.85px', letterSpacing: '0.08px' }}
              >
                {game.phase === 'idle'
                  ? coarse
                    ? 'TAP TO PLAY'
                    : 'PRESS A KEY'
                  : `SCORE ${game.score}${coarse ? ' · TAP' : ''}`}
              </text>
            </g>
          )}
        </svg>
      </div>
    </AppWindow>
  )
}
