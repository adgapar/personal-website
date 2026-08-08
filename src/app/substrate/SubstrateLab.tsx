'use client'

import dynamic from 'next/dynamic'
import { useMemo, useState } from 'react'
import { Color, Select, Slider, Toggle } from '@/components/lab/Controls'
import {
  DITHER_SHAPES,
  LAYER_KINDS,
  PAPER_PRESETS,
  defaultLayer,
  type CmykLayer,
  type DitherLayer,
  type DitherShape,
  type HalftoneLayer,
  type ImageDitherLayer,
  type LayerKind,
  type PaperLayer,
  type PaperPreset,
  type SubstrateLayer,
} from '@/lib/dither'
import {
  FIELD_NOTES,
  PALETTE_FIELDS,
  PATTERN_FIELDS,
  PHOTO_FIELDS,
  type SourceFieldId,
} from '@/lib/source-field'

const PaperBackground = dynamic(
  () => import('@/components/visual/PaperBackground'),
  { ssr: false },
)

const DITHER_TYPES = ['random', '2x2', '4x4', '8x8'] as const

/** how the centre column sits over the background */
const COLUMN_STYLES = ['none', 'solid', 'tint', 'blur', 'edge'] as const
type ColumnStyle = (typeof COLUMN_STYLES)[number]

function SampleText() {
  return (
    <div className="space-y-2 font-mono text-[13px] leading-relaxed">
      <div>
        <span className="text-[var(--accent)]">$ </span>
        <span className="text-[var(--fg)]">whois</span>{' '}
        <span className="text-[var(--warm)]">adilet</span>
      </div>
      <div className="flex gap-3">
        <span className="w-20 text-[var(--dim)]">role</span>
        <span className="text-[var(--warm)]">Founding AI Engineer</span>
      </div>
      <div className="flex gap-3">
        <span className="w-20 text-[var(--dim)]">location</span>
        <span className="text-[var(--fg)]">Elche, Spain</span>
      </div>
      <div className="mt-4 border-l border-[var(--border)] pl-4 text-[var(--fg)]">
        Founding AI engineer at Orbio AI, building agents for recruitment,
        onboarding and employee experience. They talk to thousands of candidates
        a day, so reliability and safety aren&apos;t optional.
      </div>
      <div className="pt-2 text-[var(--muted)]">
        2026-07 · newsletter · what kind of poker player is an AI
      </div>
      <div className="text-[var(--muted)]">2026-06 · blog · riding the wave</div>
    </div>
  )
}

export default function SubstrateLab() {
  const INK = PAPER_PRESETS.find((p) => p.id === 'ink')!
  const [kind, setKind] = useState<LayerKind>('imageDither')
  const [layer, setLayer] = useState<SubstrateLayer>(() => INK.layers[0])
  const [palette, setPalette] = useState<SourceFieldId>(INK.source ?? 'contour')
  const [shape, setShape] = useState<DitherShape>('sphere')
  const [scanlines, setScanlines] = useState(INK.scanlines)
  const [vig, setVig] = useState<[number, number, number]>(INK.vignette)
  const [sat, setSat] = useState(INK.saturate ?? 1)
  const [bright, setBright] = useState(INK.brightness ?? 1)
  const [panelOpen, setPanelOpen] = useState(true)
  const [copied, setCopied] = useState(false)
  // how the terminal column sits over the background
  const [column, setColumn] = useState<ColumnStyle>('none')
  const [columnWidth, setColumnWidth] = useState(576)
  const [columnAlpha, setColumnAlpha] = useState(0.85)
  // 0 = hug the content, otherwise a minimum height in vh
  const [columnHeight, setColumnHeight] = useState(0)
  const [columnTilt, setColumnTilt] = useState(0)

  function switchKind(next: LayerKind) {
    setKind(next)
    setLayer(defaultLayer(next))
  }

  function loadPreset(preset: PaperPreset) {
    const first = preset.layers[0]
    if (!first) return
    setKind(first.kind)
    setLayer(first)
    if (preset.source) setPalette(preset.source)
    setScanlines(preset.scanlines)
    setVig(preset.vignette)
  }

  /** patch the current layer, keeping its discriminant */
  function patch<T extends SubstrateLayer>(changes: Partial<T>) {
    setLayer((prev) => ({ ...prev, ...changes }) as SubstrateLayer)
  }

  const preset: PaperPreset = useMemo(
    () => ({
      id: 'playground',
      name: 'playground',
      note: '',
      source: layer.kind === 'dither' ? undefined : palette,
      layers: [layer],
      scanlines,
      vignette: vig,
      saturate: sat,
      brightness: bright,
    }),
    [layer, palette, scanlines, vig, sat, bright],
  )

  async function copyConfig() {
    const config = {
      source: preset.source,
      layer,
      scanlines,
      vignette: vig,
      saturate: sat,
      brightness: bright,
      column: {
        style: column,
        width: columnWidth,
        alpha: columnAlpha,
        heightVh: columnHeight,
        tiltDeg: columnTilt,
      },
      ...(layer.kind === 'dither' ? { shape } : {}),
    }
    await navigator.clipboard.writeText(JSON.stringify(config, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <PaperBackground shape={shape} preset={preset} />

      {/* the real page content, over the real background */}
      <div
        className="relative z-10 flex min-h-screen justify-center"
        style={{ paddingBlock: columnHeight >= 100 ? 0 : '4rem' }}
      >
        <div
          className={
            column === 'blur'
              ? 'backdrop-blur-md'
              : column === 'edge'
                ? 'border-x border-[var(--border)]'
                : undefined
          }
          style={{
            width: columnWidth,
            maxWidth: '90vw',
            minHeight: columnHeight > 0 ? `${columnHeight}vh` : undefined,
            transform: columnTilt !== 0 ? `rotate(${columnTilt}deg)` : undefined,
            transformOrigin: 'center',
            padding: '2rem 2.5rem',
            background:
              column === 'solid'
                ? 'var(--bg)'
                : column === 'tint' || column === 'blur'
                  ? `rgba(12,11,10,${columnAlpha})`
                  : undefined,
          }}
        >
          <SampleText />
        </div>
      </div>

      <div className="fixed top-0 right-0 z-20 h-full">
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          className="absolute top-4 right-4 z-30 border border-[var(--border)] bg-[var(--bg)] px-3 py-1 text-[10px] tracking-widest text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          {panelOpen ? 'hide ✕' : 'controls'}
        </button>

        {panelOpen && (
          <aside className="h-full w-[340px] overflow-y-auto border-l border-[var(--border)] bg-[color-mix(in_srgb,var(--bg)_88%,#000)] px-4 pt-14 pb-10 font-mono">
            <section className="mb-4 space-y-1">
              <div className="text-[10px] tracking-widest text-[var(--dim)]">
                start from
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                {PAPER_PRESETS.filter((p) => p.layers.length > 0).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => loadPreset(p)}
                    className="text-[var(--muted)] hover:text-[var(--accent)]"
                  >
                    {p.id}
                  </button>
                ))}
              </div>
            </section>

            <div className="my-4 border-t border-[var(--border)]" />

            <Select label="filter" value={kind} options={LAYER_KINDS} onChange={switchKind} />

            {layer.kind !== 'dither' && (
              <>
                <div className="py-1 text-[10px] tracking-widest text-[var(--dim)]">
                  pattern — photograph
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {PHOTO_FIELDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPalette(id)}
                      title={FIELD_NOTES[id]}
                      className={`relative h-20 overflow-hidden border ${
                        palette === id
                          ? 'border-[var(--accent)]'
                          : 'border-[var(--border)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <PaperBackground
                        shape={shape}
                        preset={{ ...preset, source: id, vignette: [0, 0, 0] }}
                        position="absolute"
                        quality={0.14}
                      />
                      <span
                        className={`absolute bottom-0 left-0 w-full bg-[var(--bg)]/75 text-[8px] tracking-widest ${
                          palette === id ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                        }`}
                      >
                        {id}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-3 pb-1 text-[10px] tracking-widest text-[var(--dim)]">
                  pattern — drawn structures
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {PATTERN_FIELDS.map((id) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => setPalette(id)}
                      title={FIELD_NOTES[id]}
                      className={`relative h-14 overflow-hidden border ${
                        palette === id
                          ? 'border-[var(--accent)]'
                          : 'border-[var(--border)] hover:border-[var(--muted)]'
                      }`}
                    >
                      <PaperBackground
                        shape={shape}
                        preset={{ ...preset, source: id, vignette: [0, 0, 0] }}
                        position="absolute"
                        quality={0.06}
                      />
                      <span
                        className={`absolute bottom-0 left-0 w-full bg-[var(--bg)]/75 text-[8px] tracking-widest ${
                          palette === id ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                        }`}
                      >
                        {id}
                      </span>
                    </button>
                  ))}
                </div>

                <div className="pt-3 pb-1 text-[10px] tracking-widest text-[var(--dim)]">
                  pattern — colour fields
                </div>
                <div className="flex flex-wrap gap-x-3 gap-y-1 pl-1 text-[10px]">
                  {PALETTE_FIELDS.map((id) => (
                    <button key={id} type="button" onClick={() => setPalette(id)}
                      title={FIELD_NOTES[id]}
                      className={palette === id ? 'text-[var(--accent)]' : 'text-[var(--muted)] hover:text-[var(--fg)]'}>
                      {id}
                    </button>
                  ))}
                </div>
                <p className="pt-2 pl-1 text-[9px] leading-relaxed text-[var(--dim)]">
                  {FIELD_NOTES[palette]}
                </p>
              </>
            )}

            <div className="my-4 border-t border-[var(--border)]" />

            <div className="pb-1 text-[10px] tracking-widest text-[var(--dim)]">
              terminal column
            </div>
            <Select label="fill" value={column} options={COLUMN_STYLES} onChange={setColumn} />
            <Slider label="width" value={columnWidth} min={360} max={1100} step={8}
              onChange={setColumnWidth} />
            <Slider label="height vh" value={columnHeight} min={0} max={100} step={1}
              onChange={setColumnHeight} />
            <Slider label="tilt deg" value={columnTilt} min={-8} max={8} step={0.25}
              onChange={setColumnTilt} />
            {(column === 'tint' || column === 'blur') && (
              <Slider label="fill alpha" value={columnAlpha} min={0} max={1} step={0.01}
                onChange={setColumnAlpha} />
            )}

            <div className="my-4 border-t border-[var(--border)]" />

            {layer.kind === 'imageDither' && (
              <>
                <Toggle label="originalColors" value={layer.originalColors}
                  onChange={(v) => patch<ImageDitherLayer>({ originalColors: v })} />
                <Toggle label="inverted" value={layer.inverted ?? false}
                  onChange={(v) => patch<ImageDitherLayer>({ inverted: v })} />
                <Select label="matrix" value={layer.type} options={DITHER_TYPES}
                  onChange={(v) => patch<ImageDitherLayer>({ type: v })} />
                <Slider label="pixel size" value={layer.size} min={0.5} max={20} step={0.1}
                  onChange={(v) => patch<ImageDitherLayer>({ size: v })} />
                <Slider label="levels" value={layer.colorSteps} min={1} max={8} step={1}
                  onChange={(v) => patch<ImageDitherLayer>({ colorSteps: v })} />
                <Slider label="zoom" value={layer.scale ?? 1} min={0.5} max={3} step={0.05}
                  onChange={(v) => patch<ImageDitherLayer>({ scale: v })} />
                <Slider label="pan x" value={layer.offsetX ?? 0} min={-1} max={1} step={0.01}
                  onChange={(v) => patch<ImageDitherLayer>({ offsetX: v })} />
                <Slider label="pan y" value={layer.offsetY ?? 0} min={-1} max={1} step={0.01}
                  onChange={(v) => patch<ImageDitherLayer>({ offsetY: v })} />
                <Color label="colorBack" value={layer.colorBack}
                  onChange={(v) => patch<ImageDitherLayer>({ colorBack: v })} />
                <Color label="colorFront" value={layer.colorFront}
                  onChange={(v) => patch<ImageDitherLayer>({ colorFront: v })} />
                <Color label="colorHighlight" value={layer.colorHighlight}
                  onChange={(v) => patch<ImageDitherLayer>({ colorHighlight: v })} />
              </>
            )}

            {layer.kind === 'halftone' && (
              <>
                <Toggle label="originalColors" value={layer.originalColors}
                  onChange={(v) => patch<HalftoneLayer>({ originalColors: v })} />
                <Toggle label="inverted" value={layer.inverted ?? false}
                  onChange={(v) => patch<HalftoneLayer>({ inverted: v })} />
                <Select label="type" value={layer.type}
                  options={['classic', 'gooey', 'holes', 'soft'] as const}
                  onChange={(v) => patch<HalftoneLayer>({ type: v })} />
                <Select label="grid" value={layer.grid} options={['square', 'hex'] as const}
                  onChange={(v) => patch<HalftoneLayer>({ grid: v })} />
                <Slider label="size" value={layer.size} min={0.05} max={2} step={0.05}
                  onChange={(v) => patch<HalftoneLayer>({ size: v })} />
                <Slider label="radius" value={layer.radius} min={0} max={3} step={0.05}
                  onChange={(v) => patch<HalftoneLayer>({ radius: v })} />
                <Slider label="contrast" value={layer.contrast} min={0} max={2} step={0.01}
                  onChange={(v) => patch<HalftoneLayer>({ contrast: v })} />
                <Slider label="grainMixer" value={layer.grainMixer} min={0} max={1} step={0.01}
                  onChange={(v) => patch<HalftoneLayer>({ grainMixer: v })} />
                <Slider label="grainOverlay" value={layer.grainOverlay} min={0} max={1} step={0.01}
                  onChange={(v) => patch<HalftoneLayer>({ grainOverlay: v })} />
                <Slider label="grainSize" value={layer.grainSize} min={0} max={1} step={0.01}
                  onChange={(v) => patch<HalftoneLayer>({ grainSize: v })} />
                <Color label="colorBack" value={layer.colorBack}
                  onChange={(v) => patch<HalftoneLayer>({ colorBack: v })} />
                <Color label="colorFront" value={layer.colorFront}
                  onChange={(v) => patch<HalftoneLayer>({ colorFront: v })} />
              </>
            )}

            {layer.kind === 'cmyk' && (
              <>
                <Select label="type" value={layer.type} options={['dots', 'ink', 'sharp'] as const}
                  onChange={(v) => patch<CmykLayer>({ type: v })} />
                <Slider label="size" value={layer.size} min={0.01} max={1} step={0.01}
                  onChange={(v) => patch<CmykLayer>({ size: v })} />
                <Slider label="gridNoise" value={layer.gridNoise} min={0} max={1} step={0.01}
                  onChange={(v) => patch<CmykLayer>({ gridNoise: v })} />
                <Slider label="softness" value={layer.softness} min={0} max={1} step={0.01}
                  onChange={(v) => patch<CmykLayer>({ softness: v })} />
                <Slider label="contrast" value={layer.contrast} min={0} max={2.5} step={0.05}
                  onChange={(v) => patch<CmykLayer>({ contrast: v })} />
                <Slider label="grainOverlay" value={layer.grainOverlay} min={0} max={1} step={0.01}
                  onChange={(v) => patch<CmykLayer>({ grainOverlay: v })} />
                <Slider label="grainSize" value={layer.grainSize} min={0} max={1} step={0.01}
                  onChange={(v) => patch<CmykLayer>({ grainSize: v })} />
                <Color label="colorBack" value={layer.colorBack}
                  onChange={(v) => patch<CmykLayer>({ colorBack: v })} />
                <Color label="colorC" value={layer.colorC}
                  onChange={(v) => patch<CmykLayer>({ colorC: v })} />
                <Color label="colorM" value={layer.colorM}
                  onChange={(v) => patch<CmykLayer>({ colorM: v })} />
                <Color label="colorY" value={layer.colorY}
                  onChange={(v) => patch<CmykLayer>({ colorY: v })} />
                <Color label="colorK" value={layer.colorK}
                  onChange={(v) => patch<CmykLayer>({ colorK: v })} />
              </>
            )}

            {layer.kind === 'paper' && (
              <>
                <Slider label="contrast" value={layer.contrast} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ contrast: v })} />
                <Slider label="roughness" value={layer.roughness} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ roughness: v })} />
                <Slider label="fiber" value={layer.fiber} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ fiber: v })} />
                <Slider label="fiberSize" value={layer.fiberSize} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ fiberSize: v })} />
                <Slider label="crumples" value={layer.crumples} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ crumples: v })} />
                <Slider label="crumpleSize" value={layer.crumpleSize} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ crumpleSize: v })} />
                <Slider label="folds" value={layer.folds} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ folds: v })} />
                <Slider label="foldCount" value={layer.foldCount} min={1} max={15} step={1}
                  onChange={(v) => patch<PaperLayer>({ foldCount: v })} />
                <Slider label="drops" value={layer.drops} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ drops: v })} />
                <Slider label="fade" value={layer.fade} min={0} max={1} step={0.01}
                  onChange={(v) => patch<PaperLayer>({ fade: v })} />
                <Slider label="scale" value={layer.scale} min={0.1} max={2} step={0.05}
                  onChange={(v) => patch<PaperLayer>({ scale: v })} />
                <Color label="colorBack" value={layer.colorBack}
                  onChange={(v) => patch<PaperLayer>({ colorBack: v })} />
                <Color label="colorFront" value={layer.colorFront}
                  onChange={(v) => patch<PaperLayer>({ colorFront: v })} />
              </>
            )}

            {layer.kind === 'dither' && (
              <>
                <Select label="pattern" value={shape} options={DITHER_SHAPES} onChange={setShape} />
                <Select label="type" value={layer.type} options={DITHER_TYPES}
                  onChange={(v) => patch<DitherLayer>({ type: v })} />
                <Slider label="size" value={layer.size} min={0.5} max={20} step={0.1}
                  onChange={(v) => patch<DitherLayer>({ size: v })} />
                <Slider label="scale" value={layer.scale} min={0.05} max={2} step={0.05}
                  onChange={(v) => patch<DitherLayer>({ scale: v })} />
                <Slider label="speed" value={layer.speed} min={0} max={1} step={0.01}
                  onChange={(v) => patch<DitherLayer>({ speed: v })} />
                <Color label="ink" value={layer.color}
                  onChange={(v) => patch<DitherLayer>({ color: v })} />
              </>
            )}

            <div className="my-4 border-t border-[var(--border)]" />

            <Slider label="amount" value={layer.opacity} min={0} max={1} step={0.01}
              onChange={(v) => patch({ opacity: v })} />
            <Slider label="saturate" value={sat} min={0} max={2.5} step={0.05}
              onChange={setSat} />
            <Slider label="brightness" value={bright} min={0.3} max={2} step={0.02}
              onChange={setBright} />
            <Slider label="scanlines" value={scanlines} min={0} max={0.8} step={0.01}
              onChange={setScanlines} />
            <Slider label="vig centre" value={vig[0]} min={0} max={1} step={0.01}
              onChange={(v) => setVig([v, vig[1], vig[2]])} />
            <Slider label="vig mid" value={vig[1]} min={0} max={1} step={0.01}
              onChange={(v) => setVig([vig[0], v, vig[2]])} />
            <Slider label="vig edge" value={vig[2]} min={0} max={1} step={0.01}
              onChange={(v) => setVig([vig[0], vig[1], v])} />

            <button
              type="button"
              onClick={copyConfig}
              className={`mt-5 w-full border px-3 py-2 text-[10px] tracking-widest ${
                copied
                  ? 'border-[var(--success)] text-[var(--success)]'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {copied ? '✓ config copied' : '⧉ copy config'}
            </button>
            <p className="mt-2 text-[9px] leading-relaxed text-[var(--dim)]">
              Tune it, hit copy, paste the JSON back to me and I&apos;ll make it
              the site default.
            </p>
          </aside>
        )}
      </div>
    </div>
  )
}
