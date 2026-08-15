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

  return <span className={className}>{text.slice(0, count)}</span>
}
