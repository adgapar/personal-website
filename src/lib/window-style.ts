import type { CSSProperties } from 'react'

/**
 * One definition of what a window looks like, shared by the terminal, the
 * document reader, and the terminal when it sits beside the reader.
 *
 * It lived in three components and had already drifted — moving a window should
 * never change how it is drawn.
 */

export const WINDOW_FRAME: CSSProperties = {
  // bevel: light above, dark below, like a raised surface
  border: '1px solid var(--border)',
  borderTopColor: '#3a3733',
  borderLeftColor: '#332f2b',
  borderBottomColor: '#141210',
  borderRightColor: '#141210',
  boxShadow: '0 24px 70px -12px rgba(0,0,0,0.85), 0 2px 8px rgba(0,0,0,0.5)',
  background: 'rgba(12,11,10,0.93)',
}

export const WINDOW_FRAME_LIFTED: CSSProperties = {
  ...WINDOW_FRAME,
  boxShadow: '0 40px 90px -10px rgba(0,0,0,0.9), 0 4px 12px rgba(0,0,0,0.6)',
}

export const TITLE_BAR: CSSProperties = {
  background:
    'linear-gradient(to bottom, rgba(45,41,37,0.95), rgba(26,24,21,0.95))',
}
