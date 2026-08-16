import type { CSSProperties } from 'react'

/**
 * One definition of what a window looks like, shared by the terminal, the
 * document reader, and the terminal when it sits beside the reader.
 *
 * It lived in three components and had already drifted — moving a window should
 * never change how it is drawn.
 *
 * Daylight: a white sheet on a grey desk. Depth comes from one soft shadow, not
 * from a bevel and not from letting the desk show through — the body is opaque,
 * so the text always sits on paper.
 */

// The edge and the shadow come from tokens, because a dark sheet on a light
// desk is not drawn like a white one: it needs no hairline and it casts deeper.
// Four stops, not one — the contact shadow does the sitting, the wide one does
// the lifting. See the .term block in globals.css.
export const WINDOW_FRAME: CSSProperties = {
  border: 'var(--frame-border) solid var(--frame-edge)',
  // a token, not a literal: below 640px every one of these resolves to nothing,
  // because the window is the screen there and has no desk to sit on
  borderRadius: 'var(--frame-radius)',
  boxShadow: 'var(--frame-shadow)',
  background: 'var(--frame-fill)',
  overflow: 'hidden',
}

export const WINDOW_FRAME_LIFTED: CSSProperties = {
  ...WINDOW_FRAME,
  boxShadow: 'var(--frame-shadow-lifted)',
}

/** No gradient and no colour: the title bar is the quietest thing on screen. */
export const TITLE_BAR: CSSProperties = {
  background: 'var(--frame-fill)',
}
