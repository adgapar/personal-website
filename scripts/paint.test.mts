/**
 * Paint's arithmetic, checked. Run with `pnpm test`.
 *
 * Only the two things worth testing: mapping a pointer onto a canvas displayed
 * at a different size, and an undo stack that has to forget. Everything else in
 * the app is a canvas call.
 */

import {
  CANVAS,
  PALETTE,
  SIZES,
  UNDO_DEPTH,
  pushSnapshot,
  toCanvasPoint,
} from '../src/lib/paint.ts'

let pass = 0, fail = 0
const ok = (name: string, cond: boolean, extra = '') => {
  if (cond) { pass++ } else { fail++; console.log(`  FAIL ${name} ${extra}`) }
}

// displayed at exactly its own size, offset on the page
const same = { left: 100, top: 50, width: CANVAS.width, height: CANVAS.height }
let p = toCanvasPoint(100, 50, same)
ok('top left maps to the origin', p.x === 0 && p.y === 0, JSON.stringify(p))
p = toCanvasPoint(150, 90, same)
ok('1:1 keeps the offset', p.x === 50 && p.y === 40, JSON.stringify(p))

// displayed at double size — the case that offsets ink from the cursor
const twice = { left: 0, top: 0, width: CANVAS.width * 2, height: CANVAS.height * 2 }
p = toCanvasPoint(400, 280, twice)
ok('2x halves the distance', p.x === 200 && p.y === 140, JSON.stringify(p))
p = toCanvasPoint(CANVAS.width * 2, CANVAS.height * 2, twice)
ok('2x bottom right is the far corner', p.x === CANVAS.width && p.y === CANVAS.height, JSON.stringify(p))

// displayed smaller than itself, which is a phone in portrait
const half = { left: 0, top: 0, width: CANVAS.width / 2, height: CANVAS.height / 2 }
p = toCanvasPoint(100, 70, half)
ok('half size doubles the distance', p.x === 200 && p.y === 140, JSON.stringify(p))

// a captured pointer keeps reporting past the edge
p = toCanvasPoint(-500, -500, same)
ok('clamps past the top left', p.x === 0 && p.y === 0, JSON.stringify(p))
p = toCanvasPoint(9999, 9999, same)
ok('clamps past the bottom right', p.x === CANVAS.width && p.y === CANVAS.height, JSON.stringify(p))

// a rect that has not been laid out yet
p = toCanvasPoint(10, 10, { left: 0, top: 0, width: 0, height: 0 })
ok('an unlaid-out rect is not Infinity', Number.isFinite(p.x) && Number.isFinite(p.y), JSON.stringify(p))

// the undo stack forgets from the front
let stack: number[] = []
for (let i = 0; i < UNDO_DEPTH; i++) stack = pushSnapshot(stack, i)
ok('fills to depth', stack.length === UNDO_DEPTH, `len ${stack.length}`)
ok('holds the oldest until full', stack[0] === 0)
stack = pushSnapshot(stack, 99)
ok('never exceeds depth', stack.length === UNDO_DEPTH, `len ${stack.length}`)
ok('drops the oldest, not the newest', stack[0] === 1 && stack[stack.length - 1] === 99, JSON.stringify(stack))
const before = [1, 2, 3]
pushSnapshot(before, 4)
ok('does not mutate what it was given', before.length === 3)
ok('a depth of one keeps only the last', pushSnapshot([1, 2], 3, 1).join() === '3')

// the palette and nibs are well formed — a bad hex is invisible until you paint
ok('every colour is a hex triple', PALETTE.every((c) => /^#[0-9a-f]{6}$/i.test(c.hex)),
   PALETTE.filter((c) => !/^#[0-9a-f]{6}$/i.test(c.hex)).map((c) => c.hex).join())
ok('every colour is named once', new Set(PALETTE.map((c) => c.name)).size === PALETTE.length)
ok('nibs go small to large', SIZES.every((s, i) => i === 0 || s > SIZES[i - 1]))

console.log(`\n${pass} passed, ${fail} failed`)
process.exit(fail ? 1 : 0)
