/**
 * Snake, as rules only.
 *
 * No React and no DOM in here, deliberately: a game is the one thing on this
 * site with real logic in it, and logic that can only be exercised by playing it
 * in a browser is logic nobody checks. Every function is pure — state in, state
 * out — so the whole game can be run headlessly, which is how it was actually
 * tested. The component that draws it holds no rules at all.
 *
 * Randomness is injected rather than reached for. `Math.random` in here would
 * make the same game unreproducible, and a bug you cannot replay is a bug you
 * cannot fix.
 */

export const COLS = 24
export const ROWS = 14

/** ms per tick at the start — it speeds up as you eat */
export const START_INTERVAL = 140
const FASTEST_INTERVAL = 70
/** every apple takes this off the clock */
const SPEEDUP_PER_APPLE = 3

export type Point = { x: number; y: number }
export type Direction = 'up' | 'down' | 'left' | 'right'
export type Phase = 'idle' | 'playing' | 'dead'

export interface Game {
  snake: Point[]
  /** where it is going now — only ever changed by a tick, so a fast double-tap
   *  cannot turn the head twice inside one cell and fold it back on itself */
  heading: Direction
  /** where the player has asked it to go next */
  queued: Direction
  food: Point
  score: number
  best: number
  phase: Phase
}

const STEP: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
}

const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}

export type Rng = () => number

export function samePoint(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y
}

/**
 * A free cell, chosen from the cells that are actually free.
 *
 * The obvious version guesses a cell and re-rolls if the snake is on it, which
 * is fine early and unbounded late — with a long snake most guesses are misses,
 * and at the very end there is no free cell at all and it never returns.
 */
export function placeFood(snake: Point[], rng: Rng): Point | null {
  const taken = new Set(snake.map((p) => `${p.x},${p.y}`))
  const free: Point[] = []
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      if (!taken.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (!free.length) return null
  return free[Math.floor(rng() * free.length)]
}

export function newGame(rng: Rng, best = 0): Game {
  // three cells, mid-board, pointing at the long side
  const y = Math.floor(ROWS / 2)
  const x = Math.floor(COLS / 3)
  const snake = [
    { x, y },
    { x: x - 1, y },
    { x: x - 2, y },
  ]
  return {
    snake,
    heading: 'right',
    queued: 'right',
    food: placeFood(snake, rng) ?? { x: 0, y: 0 },
    score: 0,
    best,
    phase: 'idle',
  }
}

/** the interval for the current score, so it tightens as you grow */
export function intervalFor(score: number): number {
  return Math.max(FASTEST_INTERVAL, START_INTERVAL - score * SPEEDUP_PER_APPLE)
}

/**
 * Ask for a turn. Refused if it is a reversal of the direction actually being
 * travelled — pressing left while going right would drive the head into the
 * neck, which reads as the game killing you for nothing.
 */
export function turn(game: Game, direction: Direction): Game {
  if (game.phase === 'dead') return game

  const started: Phase = game.phase === 'idle' ? 'playing' : game.phase

  // A reversal is refused, but it still starts a waiting game. Otherwise the
  // one key that does nothing at all is left — the snake begins pointing right,
  // so a player whose first press is left gets an app that appears broken.
  if (direction === OPPOSITE[game.heading]) {
    return game.phase === 'idle' ? { ...game, phase: started } : game
  }

  return { ...game, queued: direction, phase: started }
}

/** One tick. Returns the same object when nothing can move, so React can skip. */
export function step(game: Game, rng: Rng): Game {
  if (game.phase !== 'playing') return game

  const heading = game.queued
  const delta = STEP[heading]
  const head = { x: game.snake[0].x + delta.x, y: game.snake[0].y + delta.y }

  // walls
  if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
    return { ...game, heading, phase: 'dead', best: Math.max(game.best, game.score) }
  }

  const eating = samePoint(head, game.food)

  // Itself — but the tail cell is about to be vacated, so moving into it is
  // legal. It is not vacated when eating, because then the tail stays put.
  const body = eating ? game.snake : game.snake.slice(0, -1)
  if (body.some((p) => samePoint(p, head))) {
    return { ...game, heading, phase: 'dead', best: Math.max(game.best, game.score) }
  }

  const snake = [head, ...body]

  if (!eating) return { ...game, snake, heading }

  const score = game.score + 1
  const food = placeFood(snake, rng)
  // no free cell left: the board is full, which is the win, and the only way
  // this game ends well
  if (!food) {
    return { ...game, snake, heading, score, phase: 'dead', best: Math.max(game.best, score) }
  }
  return { ...game, snake, heading, food, score, best: Math.max(game.best, score) }
}

/** A seeded generator, so a game can be replayed exactly. mulberry32. */
export function seeded(seed: number): Rng {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
