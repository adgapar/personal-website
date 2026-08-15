'use client'

import { useEffect, useState } from 'react'

/**
 * Types text out on mount. Used for the boot lines and the command echoes, so
 * output looks produced rather than pasted.
 *
 * Renders instantly under prefers-reduced-motion — the whole effect is motion.
 */
export default function TypedText({
  text,
  msPerChar = 24,
  startDelay = 0,
  onDone,
  className,
}: {
  text: string
  msPerChar?: number
  startDelay?: number
  onDone?: () => void
  className?: string
}) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setCount(text.length)
      onDone?.()
      return
    }

    let i = 0
    let interval: ReturnType<typeof setInterval>
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setCount(i)
        if (i >= text.length) {
          clearInterval(interval)
          onDone?.()
        }
      }, msPerChar)
    }, startDelay)

    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
    // text is stable per mounted line
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  // The full string is laid out from the first frame and only the typed part is
  // painted. Rendering the substring alone made a line that wraps take fewer
  // lines while it was still being typed, so the session shrank by a line and
  // then grew back — a wobble in the pane on every page that has one.
  return (
    <span className={`relative inline-block ${className ?? ''}`}>
      <span className="invisible" aria-hidden>
        {text}
      </span>
      <span className="absolute inset-0">{text.slice(0, count)}</span>
    </span>
  )
}
