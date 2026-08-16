'use client'

import { useViewMode } from './ViewModeProvider'

/**
 * The window's status bar. Terminal emulators put session state down here, and
 * it's the natural home for the human/agent switch now that the tabs own the top.
 */
export default function StatusBar({ hint }: { hint?: string }) {
  const { mode, setMode } = useViewMode()

  return (
    // The bar is the last thing above the home indicator on a phone, so it pays
    // the bottom safe-area inset back as padding — the viewport reaches under
    // there now, and "human / agent" was landing on the gesture bar.
    <div
      className="term-recess flex shrink-0 flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border)] px-4 py-1.5 text-[11px] tracking-wide select-none sm:px-8 sm:py-2"
      style={{ paddingBottom: 'max(0.5rem, env(safe-area-inset-bottom))' }}
    >
      {/* the hint is the first thing to go when there is no room for both it and
          the switch — it repeats what the prompt's own placeholder already says */}
      {hint && <span className="hidden text-[var(--chrome)] sm:inline">{hint}</span>}

      <div className="ml-auto flex items-center gap-3" role="group" aria-label="Reading mode">
        {/* no brackets and no bullets — two words, and the live one is darker */}
        {(['human', 'agent'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            aria-pressed={mode === option}
            title={
              option === 'human'
                ? 'the terminal, the desk, the whole thing'
                : 'clean markdown — also at /llms.txt'
            }
            // -my-1 py-1: a bigger hit area than the 11px of text, without the
            // bar getting any taller for it
            className={`-my-1 py-1 transition-colors duration-200 ${
              mode === option
                ? 'text-[var(--fg)]'
                : 'text-[var(--chrome)] hover:text-[var(--fg)]'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  )
}
