import { useState } from 'react'
import { ChevronDown, Plus, Trash2, Calendar, BarChart2, Filter, ArrowUpDown, Layers } from 'lucide-react'
import type { BacktestConfig, RankingRule } from '../types'
import Select from './Select'
import DatePicker from './DatePicker'

const METRICS: { value: string; label: string }[] = [
  { value: 'roe',                label: 'ROE' },
  { value: 'roce',               label: 'ROCE' },
  { value: 'roa',                label: 'ROA' },
  { value: 'pe_ratio',           label: 'P/E Ratio' },
  { value: 'pb_ratio',           label: 'P/B Ratio' },
  { value: 'pat',                label: 'PAT' },
  { value: 'revenue',            label: 'Revenue' },
  { value: 'ebitda',             label: 'EBITDA' },
  { value: 'total_debt',         label: 'Total Debt' },
  { value: 'free_cash_flow',     label: 'Free Cash Flow' },
  { value: 'net_profit_margin',  label: 'Net Profit Margin' },
  { value: 'operating_margin',   label: 'Operating Margin' },
  { value: 'revenue_growth_yoy', label: 'Revenue Growth YoY' },
  { value: 'pat_growth_yoy',     label: 'PAT Growth YoY' },
  { value: 'market_cap',         label: 'Market Cap' },
]

const METRIC_VALUES = METRICS.map(m => m.value)

interface Props {
  config: BacktestConfig
  onChange: (patch: Partial<BacktestConfig>) => void
}

function Section({ icon: Icon, title, children, collapsible = false }: {
  icon: React.ElementType
  title: string
  children: React.ReactNode
  collapsible?: boolean
}) {
  const [open, setOpen] = useState(!collapsible)

  return (
    <div className="border-b border-gray-100 dark:border-zinc-700/60 last:border-0">
      <button
        type="button"
        onClick={() => collapsible && setOpen(o => !o)}
        className={`flex w-full items-center gap-2.5 px-5 py-3.5 ${collapsible ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-zinc-500" />
        <span className="flex-1 text-left text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          {title}
        </span>
        {collapsible && (
          <ChevronDown className={`h-3.5 w-3.5 text-gray-300 dark:text-zinc-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>
      {open && <div className="px-5 pb-4">{children}</div>}
    </div>
  )
}

export default function ConfigPanel({ config, onChange }: Props) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const patchFilter = (key: string, val: string) => {
    const num = val === '' ? undefined : parseFloat(val)
    onChange({ filters: { ...config.filters, [key]: num } })
  }

  const addRanking = () => {
    const used = new Set((config.ranking ?? []).map(r => r.metric))
    const next = METRIC_VALUES.find(m => !used.has(m)) ?? METRIC_VALUES[0]
    onChange({ ranking: [...(config.ranking ?? []), { metric: next, ascending: false }] })
  }

  const updateRanking = (i: number, patch: Partial<RankingRule>) => {
    const updated = (config.ranking ?? []).map((r, idx) => idx === i ? { ...r, ...patch } : r)
    onChange({ ranking: updated })
  }

  const removeRanking = (i: number) => {
    onChange({ ranking: (config.ranking ?? []).filter((_, idx) => idx !== i) })
  }

  const formBody = (
    <>
      {/* Date Range */}
      <Section icon={Calendar} title="Date Range">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <p className="mb-1.5 text-[11px] text-gray-400 dark:text-zinc-500">Start</p>
            <DatePicker value={config.start_date} onChange={v => onChange({ start_date: v })} max={config.end_date} />
          </div>
          <div>
            <p className="mb-1.5 text-[11px] text-gray-400 dark:text-zinc-500">End</p>
            <DatePicker value={config.end_date} onChange={v => onChange({ end_date: v })} min={config.start_date} />
          </div>
        </div>
      </Section>

      {/* Strategy */}
      <Section icon={BarChart2} title="Strategy">
        <div className="space-y-3">
          <div>
            <p className="mb-1.5 text-[11px] text-gray-400 dark:text-zinc-500">Rebalance Frequency</p>
            <Select
              value={config.rebalance_frequency ?? 'quarterly'}
              onChange={v => onChange({ rebalance_frequency: v as BacktestConfig['rebalance_frequency'] })}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'quarterly', label: 'Quarterly' },
                { value: 'half_yearly', label: 'Half Yearly' },
                { value: 'yearly', label: 'Yearly' },
              ]}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="mb-1.5 text-[11px] text-gray-400 dark:text-zinc-500">Portfolio Size</p>
              <input
                type="number" min={1} className="input-base"
                value={config.portfolio_size ?? ''}
                onChange={e => onChange({ portfolio_size: e.target.value ? parseInt(e.target.value) : undefined })}
              />
            </div>
            <div>
              <p className="mb-1.5 text-[11px] text-gray-400 dark:text-zinc-500">Capital (₹)</p>
              <input
                type="number" min={0} className="input-base"
                value={config.initial_capital ?? ''}
                onChange={e => onChange({ initial_capital: e.target.value ? parseFloat(e.target.value) : undefined })}
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Position Sizing */}
      <Section icon={Layers} title="Position Sizing">
        <div className="space-y-3">
          <Select
            value={config.sizing_method ?? 'equal'}
            onChange={v => onChange({ sizing_method: v as BacktestConfig['sizing_method'] })}
            options={[
              { value: 'equal', label: 'Equal Weight' },
              { value: 'market_cap', label: 'Market Cap Weight' },
              { value: 'metric', label: 'Metric Weight' },
            ]}
          />
          {config.sizing_method === 'metric' && (
            <Select
              value={config.sizing_metric ?? ''}
              onChange={v => onChange({ sizing_metric: v })}
              placeholder="Select metric"
              options={METRICS}
            />
          )}
        </div>
      </Section>

      {/* Filters */}
      <Section icon={Filter} title="Filters" collapsible>
        <div className="grid grid-cols-2 gap-2">
          {[
            ['market_cap_min', 'Mkt Cap Min (Cr)'],
            ['market_cap_max', 'Mkt Cap Max (Cr)'],
            ['roce_min', 'ROCE Min (%)'],
            ['roe_min', 'ROE Min (%)'],
            ['pe_max', 'PE Max'],
            ['pat_min', 'PAT Min (Cr)'],
          ].map(([key, label]) => (
            <div key={key}>
              <p className="mb-1.5 text-[11px] text-gray-400 dark:text-zinc-500">{label}</p>
              <input
                type="number" className="input-base"
                value={(config.filters as Record<string, number | undefined> | undefined)?.[key] ?? ''}
                onChange={e => patchFilter(key, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* Ranking Rules */}
      <Section icon={ArrowUpDown} title="Ranking Rules">
        <div className="space-y-2">
          {(config.ranking ?? []).length === 0 && (
            <p className="text-xs text-gray-300 dark:text-zinc-700 pb-1">No rules added yet.</p>
          )}
          {(config.ranking ?? []).map((rule, i) => {
            const usedByOthers = new Set((config.ranking ?? []).filter((_, idx) => idx !== i).map(r => r.metric))
            const available = METRICS.filter(m => !usedByOthers.has(m.value))
            return (
              <div key={i} className="rounded-lg border border-gray-200 bg-gray-50/60 p-2.5 dark:border-zinc-700/60 dark:bg-zinc-800/40">
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <Select value={rule.metric} onChange={v => updateRanking(i, { metric: v })} options={available} />
                  </div>
                  <button
                    onClick={() => removeRanking(i)}
                    className="shrink-0 p-1 text-gray-300 hover:text-red-400 dark:text-zinc-600 dark:hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
                <div className="mt-2 flex gap-1">
                  {(['High → Low', 'Low → High'] as const).map((label, dir) => {
                    const isAsc = dir === 1
                    const active = rule.ascending === isAsc
                    return (
                      <button
                        key={label}
                        onClick={() => updateRanking(i, { ascending: isAsc })}
                        className={`flex-1 rounded-md py-1 text-xs font-medium transition-colors ${
                          active
                            ? 'bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                            : 'text-gray-400 dark:text-zinc-500'
                        }`}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
          <button
            onClick={addRanking}
            disabled={(config.ranking ?? []).length >= METRICS.length}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 dark:text-zinc-600 dark:hover:text-zinc-300 transition-colors disabled:opacity-30 disabled:cursor-not-allowed pt-1"
          >
            <Plus className="h-3.5 w-3.5" /> Add rule
          </button>
        </div>
      </Section>
    </>
  )

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-700/60 dark:bg-zinc-800">
      {/* Mobile toggle */}
      <button
        type="button"
        className="flex w-full items-center justify-between px-5 py-4 lg:hidden"
        onClick={() => setMobileOpen(o => !o)}
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuration</span>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`${mobileOpen ? 'block' : 'hidden'} lg:block`}>
        <div className="hidden border-b border-gray-100 px-5 py-4 dark:border-zinc-700/60 lg:block">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuration</h2>
        </div>
        {formBody}
      </div>
    </div>
  )
}
