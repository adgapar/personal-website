/**
 * Paint, as the parts that are not a canvas.
 *
 * Same split as snake.ts and for the same reason: a drawing app is almost all
 * side effect, so the few bits with actual arithmetic in them are pulled out
 * here where they can be run without a browser. What is left in the component is
 * `ctx` calls, which no test would have caught anything in anyway.
 *
 * The two things that reliably go wrong in a paint tool are both here: mapping a
 * pointer's position on screen to a pixel on a canvas that is being displayed at
 * some other size, and an undo stack that grows until the tab dies.
 */

/**
 * The paper on a desk, in its own pixels.
 *
 * Fixed here because a window sitting on a desk has no height of its own to fill
 * — it is as tall as what is in it, so the paper is what decides, and 400x280 is
 * the landscape sheet Paint opened with.
 *
 * A phone is the other case and does not use this. There the window *is* the
 * screen, so the paper is measured from the space that is actually left over and
 * comes out portrait; a 4:3 sheet in a 9:19 hole leaves two thirds of the screen
 * as margin, which is not paper anyone asked for. The size is taken once, when
 * the app opens, so nothing has to decide what happens to a picture mid-stroke.
 */
export const CANVAS = { width: 400, height: 280 } as const

/** a sheet of paper, in CSS pixels */
export interface Paper {
  width: number
  height: number
}

/** the paper it starts as, and what the eraser puts back */
export const PAPER = '#f6f1e7'

/**
 * The palette: the sixteen colours a terminal has always had.
 *
 * ANSI's hues in ANSI's order — black, red, green, yellow, blue, magenta, cyan,
 * grey, then the bright row — because that is the set anyone who has ever looked
 * at a terminal already knows, and this is a paint program living inside one. Two
 * rows of eight is also the shape Paint's own palette strip had, so the reference
 * and the layout want the same thing.
 *
 * The values are this site's inks rather than the raw VGA ones. #cd0000 and
 * #00ff00 on cream paper are a different decade's idea of colour and would fight
 * every other thing on the desk; these are the daylight tokens from globals.css,
 * which were already picked to carry on paper, extended with a plum and a teal
 * for the two hues the site had no ink for.
 *
 * Bright white stays a true white. It is nearly invisible on cream, which is
 * exactly what it is in Paint too — and it is the one colour you want for a
 * highlight rather than for a stroke.
 */
export const PALETTE = [
  // the normal row
  { name: 'black', hex: '#1a1a17' },
  { name: 'red', hex: '#a13b2e' },
  { name: 'green', hex: '#1f7a4d' },
  { name: 'yellow', hex: '#8a5b00' },
  { name: 'blue', hex: '#0a6ba8' },
  { name: 'magenta', hex: '#8a3a6b' },
  { name: 'cyan', hex: '#1f6b7a' },
  { name: 'grey', hex: '#6b675f' },
  // the bright row
  { name: 'bright black', hex: '#a8a399' },
  { name: 'bright red', hex: '#d4553f' },
  { name: 'bright green', hex: '#2fa768' },
  { name: 'bright yellow', hex: '#d99a1f' },
  { name: 'bright blue', hex: '#2f96d8' },
  { name: 'bright magenta', hex: '#b85494' },
  { name: 'bright cyan', hex: '#2f96a8' },
  { name: 'white', hex: '#ffffff' },
] as const

/** three nibs, which is as many as a small tool needs */
export const SIZES = [2, 6, 14] as const

export type Tool = 'brush' | 'eraser'

export interface Point {
  x: number
  y: number
}

interface Rect {
  left: number
  top: number
  width: number
  height: number
}

/**
 * Where on the canvas a pointer is.
 *
 * The paper is some number of its own pixels wide and is displayed at whatever
 * width the window gives it, so every pointer position has to be divided back
 * down. Getting this wrong is the bug where the ink appears at an offset from the
 * cursor, and it gets worse the further you are from the top left — which is why
 * it is tested rather than eyeballed near the middle.
 *
 * The paper is a parameter rather than the constant, because the sheet a phone
 * measures for itself is not the sheet a desk gets. Passing the rect *and* the
 * paper is also what lets the display size drift — a phone turned sideways after
 * the app opened shows the same picture at a different scale, and the ink still
 * lands under the finger.
 *
 * Clamped, because a pointer captured mid-stroke keeps reporting after it leaves
 * the element, and a stroke should stop at the edge of the paper.
 */
export function toCanvasPoint(
  clientX: number,
  clientY: number,
  rect: Rect,
  paper: Paper = CANVAS,
): Point {
  // a zero-sized rect means the element is not laid out yet; anything divided by
  // it is an Infinity that would poison the whole stroke
  if (rect.width === 0 || rect.height === 0) return { x: 0, y: 0 }

  const x = ((clientX - rect.left) * paper.width) / rect.width
  const y = ((clientY - rect.top) * paper.height) / rect.height

  return {
    x: Math.min(Math.max(x, 0), paper.width),
    y: Math.min(Math.max(y, 0), paper.height),
  }
}

/**
 * How many device pixels to keep per canvas pixel.
 *
 * A screen may have two or three device pixels for each of the canvas's own, and
 * a store that does not match them draws every stroke soft. But the store is also
 * the undo stack's unit — eight whole bitmaps — so the honest ceiling is an area,
 * not a ratio. A phone's portrait sheet is over twice the area of the desk's
 * landscape one, and at 3x that is a 70MB stack on the device least able to hold
 * it.
 *
 * So: match the screen, up to a total the stack can afford. Above that, back the
 * ratio off until the store fits, which costs a little crispness on exactly the
 * screens where there was surplus crispness to spend.
 *
 * The budget is the old fixed sheet at 3x — 1200x840, which is what this app has
 * been asking of phones since it shipped. A sheet that now fills the screen gets
 * the same allowance rather than a larger one.
 */
export const MAX_STORE_PIXELS = 1_000_000

export function storeRatio(paper: Paper, dpr: number): number {
  const area = paper.width * paper.height
  if (area <= 0) return 1
  const affordable = Math.sqrt(MAX_STORE_PIXELS / area)
  return Math.max(1, Math.min(dpr || 1, 3, affordable))
}

/** how many steps back you can go — each one is a full bitmap, so this is a
 *  memory budget as much as a feature */
export const UNDO_DEPTH = 8

/**
 * Add a state to the undo stack, dropping the oldest once it is full.
 *
 * Pure, and returns a new array, so the component can keep it in a ref without
 * anyone wondering whether the push mutated something React was watching.
 */
export function pushSnapshot<T>(stack: readonly T[], snapshot: T, depth = UNDO_DEPTH): T[] {
  const next = [...stack, snapshot]
  return next.length > depth ? next.slice(next.length - depth) : next
}
