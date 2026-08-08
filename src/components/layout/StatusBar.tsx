'use client'

import { useViewMode } from './ViewModeProvider'

/**
 * The window's status bar. Terminal emulators put session state down here, and
 * it's the natural home for the human/agent switch now that the tabs own the top.
 */
export default function StatusBar({ hint }: { hint?: string }) {
  const { mode, setMode } = useViewMode()

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-[var(--border)] px-3 py-1.5 text-[10px] tracking-widest select-none"
      style={{ background: 'rgba(20,18,16,0.6)' }}
    >
      {hint && <span className="text-[var(--dim)]">{hint}</span>}

      <div className="ml-auto flex items-center gap-1" role="group" aria-label="Reading mode">
        <span className="text-[var(--dim)]">[</span>
        {(['human', 'agent'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMode(option)}
            aria-pressed={mode === option}
            title={
              option === 'human'
                ? 'terminal, wallpaper, the whole thing'
                : 'clean markdown — also at /llms.txt'
            }
            className={`transition-colors duration-200 ${
              mode === option
                ? 'text-[var(--accent)]'
                : 'text-[var(--muted)] hover:text-[var(--fg)]'
            }`}
          >
            {mode === option ? '● ' : '○ '}
            {option}
          </button>
        ))}
        <span className="text-[var(--dim)]">]</span>
      </div>
    </div>
  )
}
