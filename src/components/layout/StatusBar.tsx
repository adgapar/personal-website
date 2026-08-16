'use client'

import { useViewMode } from './ViewModeProvider'

/**
 * The window's status bar. Terminal emulators put session state down here, and
 * it's the natural home for the human/agent switch now that the tabs own the top.
 */
export default function StatusBar({ hint }: { hint?: string }) {
  const { mode, setMode } = useViewMode()

  return (
    <div className="term-recess flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border)] px-6 py-2 text-[11px] tracking-wide select-none sm:px-8">
      {hint && <span className="text-[var(--chrome)]">{hint}</span>}

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
            className={`transition-colors duration-200 ${
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
