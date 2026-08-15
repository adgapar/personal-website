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
  borderRadius: '10px',
  // Four stops, not one. A single soft shadow under a hairline is what made the
  // sheet look printed on the desk rather than resting on it: the contact
  // shadow does the sitting, the wide one does the lifting.
  boxShadow: [
    '0 1px 1px rgba(38,32,20,0.05)',
    '0 2px 4px rgba(38,32,20,0.05)',
    '0 8px 16px -6px rgba(38,32,20,0.10)',
    '0 28px 48px -16px rgba(38,32,20,0.16)',
  ].join(', '),
  background: 'var(--surface)',
  overflow: 'hidden',
}

export const WINDOW_FRAME_LIFTED: CSSProperties = {
  ...WINDOW_FRAME,
  boxShadow: [
    '0 2px 2px rgba(38,32,20,0.06)',
    '0 6px 10px rgba(38,32,20,0.06)',
    '0 18px 32px -8px rgba(38,32,20,0.14)',
    '0 48px 72px -20px rgba(38,32,20,0.22)',
  ].join(', '),
}

/** No gradient and no colour: the title bar is the quietest thing on screen. */
export const TITLE_BAR: CSSProperties = {
  background: 'var(--surface)',
}
