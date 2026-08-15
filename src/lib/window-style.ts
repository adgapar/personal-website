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

export const WINDOW_FRAME: CSSProperties = {
  border: '1px solid var(--hair)',
  borderRadius: '7px',
  boxShadow:
    '0 1px 1px rgba(24,22,18,0.04), 0 10px 26px -8px rgba(24,22,18,0.16)',
  background: 'var(--surface)',
  overflow: 'hidden',
}

export const WINDOW_FRAME_LIFTED: CSSProperties = {
  ...WINDOW_FRAME,
  boxShadow:
    '0 2px 3px rgba(24,22,18,0.05), 0 22px 44px -10px rgba(24,22,18,0.22)',
}

/** No gradient and no colour: the title bar is the quietest thing on screen. */
export const TITLE_BAR: CSSProperties = {
  background: 'var(--surface)',
}
