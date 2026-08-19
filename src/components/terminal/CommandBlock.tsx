'use client'

import { useState } from 'react'
import Prompt from './Prompt'
import TypedText from './TypedText'

/**
 * A command echo and its output, in that order.
 *
 * The output is withheld until the command has finished typing — a shell prints
 * a result *after* the command, and showing both at once made the session look
 * like it was replaying a transcript rather than running.
 *
 * The echo carries the session's own prompt, the same one the input below it
 * carries. See ./Prompt.
 */

/** how fast the echo types — one number, because the reveal has to predict it */
export const TYPE_MS = 15
/** the gap between the verb and its arguments starting to type */
const ARGS_DELAY = 60

/** how long `cmd` takes to type, so the caller can know when a session settles */
export function typingDuration(cmd?: string) {
  if (!cmd) return 0
  const [verb, ...rest] = cmd.split(' ')
  const args = rest.join(' ')
  return args
    ? verb.length * TYPE_MS + ARGS_DELAY + args.length * TYPE_MS
    : verb.length * TYPE_MS
}

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

  if (instant) {
    return (
      <>
        <div className="mb-3 flex items-baseline gap-3 tracking-wide">
          <Prompt />
          <span className="text-[var(--fg)]">{verb}</span>
          {args && <span className="text-[var(--warm)]">{args}</span>}
        </div>
        {children}
      </>
    )
  }

  return (
    <>
      <div className="mb-3 flex items-baseline gap-3 tracking-wide">
        <Prompt />
        <TypedText
          text={verb}
          msPerChar={TYPE_MS}
          className="text-[var(--fg)]"
          onDone={args ? undefined : () => setTyped(true)}
        />
        {args && (
          <TypedText
            text={args}
            msPerChar={TYPE_MS}
            startDelay={verb.length * TYPE_MS + ARGS_DELAY}
            className="text-[var(--warm)]"
            onDone={() => setTyped(true)}
          />
        )}
      </div>

      {typed && children}
    </>
  )
}
