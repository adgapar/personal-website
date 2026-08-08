'use client'

/** Small control kit for the substrate playground. Terminal-flavoured, dense. */

export function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 py-1 text-[10px] tracking-widest">
      <span className="w-24 shrink-0 text-[var(--dim)]">{label}</span>
      <span className="flex flex-1 items-center gap-2">{children}</span>
    </label>
  )
}

export function Slider({
  label,
  value,
  onChange,
  min = 0,
  max = 1,
  step = 0.01,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  min?: number
  max?: number
  step?: number
}) {
  return (
    <Row label={label}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1 flex-1 accent-[var(--accent)]"
      />
      <span className="w-10 shrink-0 text-right text-[var(--muted)]">
        {Number.isInteger(step) ? value : value.toFixed(2)}
      </span>
    </Row>
  )
}

export function Select<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (v: T) => void
}) {
  return (
    <Row label={label}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="flex-1 border border-[var(--border)] bg-[var(--bg)] px-2 py-1 text-[10px] text-[var(--fg)]"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </Row>
  )
}

export function Color({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <Row label={label}>
      <input
        type="color"
        value={value.slice(0, 7)}
        onChange={(e) => onChange(e.target.value)}
        className="h-6 w-10 shrink-0 cursor-pointer border border-[var(--border)] bg-transparent"
      />
      <span className="text-[var(--muted)]">{value}</span>
    </Row>
  )
}

export function Toggle({
  label,
  value,
  onChange,
}: {
  label: string
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <Row label={label}>
      <button
        type="button"
        onClick={() => onChange(!value)}
        className={`border px-2 py-0.5 ${
          value
            ? 'border-[var(--accent)] text-[var(--accent)]'
            : 'border-[var(--border)] text-[var(--muted)]'
        }`}
      >
        {value ? 'on' : 'off'}
      </button>
    </Row>
  )
}
