'use client'

import { useState } from 'react'
import TypedText from './TypedText'

/**
 * A command echo and its output, in that order.
 *
 * The output is withheld until the command has finished typing — a shell prints
 * a result *after* the command, and showing both at once made the session look
 * like it was replaying a transcript rather than running.
 */
export default function CommandBlock({
  cmd,
  children,
  instant = false,
}: {
  cmd?: string
  children: React.ReactNode
  /** already-run: show the command and its output with no typing */
  instant?: boolean
}) {
  const [typed, setTyped] = useState(false)

  if (!cmd) return <>{children}</>

  const [verb, ...rest] = cmd.split(' ')
  const args = rest.join(' ')
  const MS = 15

  if (instant) {
    return (
      <>
        <div className="flex items-baseline gap-2 mb-3 tracking-wide">
          <span className="text-[var(--accent)] select-none">$</span>
          <span className="text-[var(--fg)]">{verb}</span>
          {args && <span className="text-[var(--warm)]">{args}</span>}
        </div>
        {children}
      </>
    )
  }

  return (
    <>
      <div className="flex items-baseline gap-2 mb-3 tracking-wide">
        <span className="text-[var(--accent)] select-none">$</span>
        <TypedText
          text={verb}
          msPerChar={MS}
          className="text-[var(--fg)]"
          onDone={args ? undefined : () => setTyped(true)}
        />
        {args && (
          <TypedText
            text={args}
            msPerChar={MS}
            startDelay={verb.length * MS + 60}
            className="text-[var(--warm)]"
            onDone={() => setTyped(true)}
          />
        )}
      </div>

      {typed && children}
    </>
  )
}
