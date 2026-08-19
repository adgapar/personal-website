/**
 * The snake's rules, checked.
 *
 * Run with `pnpm test:snake`. No test framework and no dependency: node strips
 * the types and the assertions are a counter and a helper, which is the whole
 * apparatus a pure module needs. It exists because the alternative was shipping
 * a game whose only test was someone playing it, and three of the first runs
 * found real things — the head being allowed into the cell its own tail was
 * leaving, and a first keypress in the one refused direction leaving the game
 * looking broken.
 *
 * The last case is a greedy bot rather than a random walk. Random turning dies
 * in a dozen ticks and never reaches a long snake, which is where the bugs are.
 */

import { newGame, step, turn, placeFood, seeded, intervalFor, samePoint, COLS, ROWS, type Direction, type Game, type Rng } from '../src/lib/snake.ts'

let pass = 0, fail = 0
const ok = (name: string, cond: boolean, extra = '') => {
  if (cond) { pass++ } else { fail++; console.log(`  FAIL ${name} ${extra}`) }
}
const rng: Rng = seeded(7)

// idle games do not move
const g0 = newGame(rng)
ok('starts idle', g0.phase === 'idle')
ok('idle does not tick', step(g0, rng) === g0)
ok('starts length 3', g0.snake.length === 3)
ok('food is not on the snake', !g0.snake.some(p => samePoint(p, g0.food)))

// a turn starts it
const g1 = turn(g0, 'up')
ok('a turn starts play', g1.phase === 'playing')
const g2 = step(g1, rng)
ok('moves one cell', g2.snake[0].y === g1.snake[0].y - 1)
ok('keeps its length', g2.snake.length === 3)

// reversal is refused
const r = turn(turn(g0, 'right'), 'left')
ok('cannot reverse into own neck', r.queued === 'right')

// two taps inside one tick: the guard compares against the direction actually
// travelled, so right->up->down is a legal pair of corners, not a fold
const d = turn(turn(turn(g0, 'right'), 'up'), 'down')
ok('two legal turns in one tick both take', d.queued === 'down', `got ${d.queued}`)
// and a refused first press must still start the game
const refused = turn(g0, 'left')
ok('a refused turn still starts play', refused.phase === 'playing')
ok('a refused turn keeps the heading', refused.queued === 'right')

// walls kill, in all four directions
for (const [dir, name] of [['up','up'],['down','down'],['right','right']] as const) {
  let g = turn(newGame(rng), dir)
  for (let i = 0; i < 40 && g.phase === 'playing'; i++) g = step(g, rng)
  ok(`hits the ${name} wall`, g.phase === 'dead', `phase ${g.phase}`)
}
// left is a reversal at the start, so it has to be reached by turning twice
let west = turn(newGame(rng), 'up')
west = step(west, rng)
west = turn(west, 'left')
for (let i = 0; i < 40 && west.phase === 'playing'; i++) west = step(west, rng)
ok('hits the left wall', west.phase === 'dead', `phase ${west.phase}`)

// eating grows and scores
let g: Game = { ...newGame(rng), phase: 'playing' }
g = { ...g, food: { x: g.snake[0].x + 1, y: g.snake[0].y }, queued: 'right', heading: 'right' }
const ate = step(g, rng)
ok('eating grows', ate.snake.length === 4, `len ${ate.snake.length}`)
ok('eating scores', ate.score === 1)
ok('food moved', !samePoint(ate.food, g.food))
ok('new food not under snake', !ate.snake.some(p => samePoint(p, ate.food)))

// following your own tail is legal — the classic off-by-one
// a 4-long snake in a 2x2 loop: head moves into the cell the tail leaves
const loop: Game = {
  snake: [{x:5,y:5},{x:4,y:5},{x:4,y:6},{x:5,y:6}],
  heading: 'down', queued: 'down', food: {x:20,y:1}, score: 0, best: 0, phase: 'playing',
}
const chased = step(loop, rng)
ok('can follow its own tail', chased.phase === 'playing', `phase ${chased.phase}`)

// but running into the middle of yourself kills
// a coil where (5,6) is a middle segment, not the tail — the tail is (6,5), so
// this is a real bite and not the legal follow-the-tail case above
const bite: Game = {
  snake: [{x:5,y:5},{x:4,y:5},{x:3,y:5},{x:3,y:6},{x:4,y:6},{x:5,y:6},{x:6,y:6},{x:6,y:5}],
  heading: 'right', queued: 'down', food: {x:20,y:1}, score: 0, best: 0, phase: 'playing',
}
ok('biting a middle segment is death', step(bite, rng).phase === 'dead', `phase ${step(bite,rng).phase}`)
// and the tail cell of that same coil is still enterable
const tailOk: Game = { ...bite, snake: [{x:6,y:4},...bite.snake.slice(0,-1)], heading: 'down', queued: 'down' }
ok('the vacating tail stays legal', step(tailOk, rng).phase === 'playing', `phase ${step(tailOk,rng).phase}`)

// a dead game is frozen and remembers the best
const dead = { ...g0, phase: 'dead' as const }
ok('dead does not tick', step(dead, rng) === dead)
ok('dead refuses turns', turn(dead, 'up') === dead)

// a full board terminates instead of hanging
const everyCell = []
for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) everyCell.push({ x, y })
ok('full board has nowhere for food', placeFood(everyCell, rng) === null)
const almost = everyCell.slice(0, everyCell.length - 1)
ok('one free cell is found', placeFood(almost, rng) !== null)

// speed tightens, then floors
ok('speeds up with score', intervalFor(10) < intervalFor(0))
ok('has a floor', intervalFor(1000) === intervalFor(2000) && intervalFor(1000) >= 70)

// A greedy player, so the stress test actually reaches long snakes: it heads
// for the food and refuses any move that kills it on the next tick. Random
// turning dies in a dozen ticks and never exercises growth, tail-chasing, or a
// crowded board — which is where the interesting bugs are.
function greedy(g: Game): Direction {
  const head = g.snake[0]
  const towards: Direction[] = []
  if (g.food.x > head.x) towards.push('right')
  if (g.food.x < head.x) towards.push('left')
  if (g.food.y > head.y) towards.push('down')
  if (g.food.y < head.y) towards.push('up')
  const rest: Direction[] = ['up', 'down', 'left', 'right']
  for (const d of [...towards, ...rest]) {
    const probe = step({ ...g, queued: d, heading: g.heading }, () => 0.5)
    if (probe.phase === 'playing' && probe !== g) return d
  }
  return g.heading
}

let bot: Game = turn(newGame(seeded(4242)), 'right')
const botRng = seeded(555)
let botTicks = 0
let maxLen = 0
let broke = false
while (bot.phase === 'playing' && botTicks < 20000) {
  bot = turn(bot, greedy(bot))
  bot = step(bot, botRng)
  maxLen = Math.max(maxLen, bot.snake.length)
  for (const p of bot.snake) {
    if (p.x < 0 || p.x >= COLS || p.y < 0 || p.y >= ROWS) {
      fail++; console.log('  FAIL snake left the board'); broke = true; break
    }
  }
  const seen = new Set(bot.snake.map(p => `${p.x},${p.y}`))
  if (bot.phase === 'playing' && seen.size !== bot.snake.length) {
    fail++; console.log('  FAIL snake overlaps itself while alive'); broke = true
  }
  if (bot.phase === 'playing' && bot.snake.some(p => samePoint(p, bot.food))) {
    fail++; console.log('  FAIL food spawned under the snake'); broke = true
  }
  if (broke) break
  botTicks++
}
ok('a greedy game runs long without breaking', !broke && botTicks > 200, `ticks ${botTicks}`)
ok('the snake actually grew', maxLen > 20, `max length ${maxLen}`)
ok('length always matches score', bot.snake.length === bot.score + 3 || bot.phase === 'dead')
console.log(`  (greedy bot: ${botTicks} ticks, score ${bot.score}, longest ${maxLen} of ${COLS * ROWS} cells)`)

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
