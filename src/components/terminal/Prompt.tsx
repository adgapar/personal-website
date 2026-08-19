'use client'

import { createContext, useContext } from 'react'

/**
 * The prompt at the head of a line — one shape, everywhere a command appears.
 *
 * It used to be two. The session's own blocks printed a bare `$` while the
 * lines you typed printed `adilet@writing:~$`, which said that the pre-written
 * half of the session had happened somewhere else, on some other machine. It is
 * the same shell. It says the same thing.
 *
 * Carried by context rather than by prop because the deepest place that needs it
 * — a command the machine ran inside another command's output — is four levels
 * down and has no business knowing which page it is on.
 */

export const PromptContext = createContext('$')

/**
 * `adilet@cv:~$` becomes `cv:~$` on a narrow window.
 *
 * Fourteen characters of prompt is a third of a phone's line, spent every line
 * on a name that does not change and a host that was never in question. What is
 * left is the part that does change — which session you are in — which is the
 * only reason a real prompt carries any of this. Same convention as a shell
 * that has been told its own $PS1 is too long.
 */
export function shortenPrompt(prompt: string) {
  const at = prompt.indexOf('@')
  return at === -1 ? prompt : prompt.slice(at + 1)
}

export default function Prompt({ prompt }: { prompt?: string }) {
  const inherited = useContext(PromptContext)
  const text = prompt ?? inherited

  return (
    <span className="shrink-0 font-medium text-[var(--accent)] select-none">
      <span className="sm:hidden">{shortenPrompt(text)}</span>
      <span className="hidden sm:inline">{text}</span>
    </span>
  )
}
