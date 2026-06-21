import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import type { BacktestConfig, RankingRule } from '../types'

const METRICS = [
  'roe', 'roce', 'roa', 'pe_ratio', 'pb_ratio', 'pat', 'revenue',
  'ebitda', 'total_debt', 'free_cash_flow', 'net_profit_margin',
  'operating_margin', 'revenue_growth_yoy', 'pat_growth_yoy', 'market_cap',
]

interface Props {
  config: BacktestConfig
  onChange: (patch: Partial<BacktestConfig>) => void
}

export default function ConfigPanel({ config, onChange }: Props) {
  const [open, setOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const patchFilter = (key: string, val: string) => {
    const num = val === '' ? undefined : parseFloat(val)
    onChange({ filters: { ...config.filters, [key]: num } })
  }

  const addRanking = () => {
    onChange({ ranking: [...(config.ranking ?? []), { metric: 'roe', ascending: false }] })
  }

  const updateRanking = (i: number, patch: Partial<RankingRule>) => {
    const updated = (config.ranking ?? []).map((r, idx) => idx === i ? { ...r, ...patch } : r)
    onChange({ ranking: updated })
  }

  const removeRanking = (i: number) => {
    onChange({ ranking: (config.ranking ?? []).filter((_, idx) => idx !== i) })
  }

  const divider = <div className="border-t border-gray-100 dark:border-white/8" />

  const formBody = (
    <div className="space-y-5 pt-4 lg:pt-0">
      {/* Date Range */}
      <section>
        <p className="section-label">Date Range</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="field-label">Start</label>
            <input type="date" className="input-base" value={config.start_date}
              onChange={e => onChange({ start_date: e.target.value })} />
          </div>
          <div>
            <label className="field-label">End</label>
            <input type="date" className="input-base" value={config.end_date}
              onChange={e => onChange({ end_date: e.target.value })} />
          </div>
        </div>
      </section>

      {divider}

      {/* Strategy */}
      <section>
        <p className="section-label">Strategy</p>
        <div className="space-y-2">
          <div>
            <label className="field-label">Rebalance Frequency</label>
            <select className="input-base" value={config.rebalance_frequency ?? 'quarterly'}
              onChange={e => onChange({ rebalance_frequency: e.target.value as BacktestConfig['rebalance_frequency'] })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half_yearly">Half Yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="field-label">Portfolio Size</label>
              <input type="number" min={1} className="input-base"
                value={config.portfolio_size ?? ''}
                onChange={e => onChange({ portfolio_size: e.target.value ? parseInt(e.target.value) : undefined })} />
            </div>
            <div>
              <label className="field-label">Capital (₹)</label>
              <input type="number" min={0} className="input-base"
                value={config.initial_capital ?? ''}
                onChange={e => onChange({ initial_capital: e.target.value ? parseFloat(e.target.value) : undefined })} />
            </div>
          </div>
        </div>
      </section>

      {divider}

      {/* Sizing */}
      <section>
        <p className="section-label">Position Sizing</p>
        <div className="space-y-2">
          <div>
            <label className="field-label">Method</label>
            <select className="input-base" value={config.sizing_method ?? 'equal'}
              onChange={e => onChange({ sizing_method: e.target.value as BacktestConfig['sizing_method'] })}>
              <option value="equal">Equal Weight</option>
              <option value="market_cap">Market Cap Weight</option>
              <option value="metric">Metric Weight</option>
            </select>
          </div>
          {config.sizing_method === 'metric' && (
            <div>
              <label className="field-label">Sizing Metric</label>
              <select className="input-base" value={config.sizing_metric ?? ''}
                onChange={e => onChange({ sizing_metric: e.target.value })}>
                <option value="">Select metric</option>
                {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
        </div>
      </section>

      {divider}

      {/* Filters */}
      <section>
        <button onClick={() => setFiltersOpen(f => !f)}
          className="flex w-full items-center justify-between group">
          <p className="section-label mb-0 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">Filters</p>
          {filtersOpen
            ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
            : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />}
        </button>
        {filtersOpen && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {[
              ['market_cap_min', 'Mkt Cap Min (Cr)'],
              ['market_cap_max', 'Mkt Cap Max (Cr)'],
              ['roce_min', 'ROCE Min (%)'],
              ['roe_min', 'ROE Min (%)'],
              ['pe_max', 'PE Max'],
              ['pat_min', 'PAT Min (Cr)'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="field-label">{label}</label>
                <input type="number" className="input-base"
                  value={(config.filters as Record<string, number | undefined> | undefined)?.[key] ?? ''}
                  onChange={e => patchFilter(key, e.target.value)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {divider}

      {/* Ranking */}
      <section>
        <p className="section-label">Ranking Rules</p>
        <div className="space-y-2">
          {(config.ranking ?? []).map((rule, i) => (
            <div key={i} className="flex items-center gap-2">
              <select className="input-base flex-1" value={rule.metric}
                onChange={e => updateRanking(i, { metric: e.target.value })}>
                {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <label className="flex shrink-0 cursor-pointer items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 select-none">
                <input type="checkbox" checked={rule.ascending}
                  onChange={e => updateRanking(i, { ascending: e.target.checked })}
                  className="accent-blue-500" />
                Asc
              </label>
              <button onClick={() => removeRanking(i)}
                className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40 transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button onClick={addRanking}
            className="flex items-center gap-1.5 rounded-lg border border-dashed border-blue-300 px-3 py-1.5 text-xs font-medium text-blue-500 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors w-full justify-center">
            <Plus className="h-3.5 w-3.5" /> Add Rule
          </button>
        </div>
      </section>
    </div>
  )

  return (
    <div className="card">
      {/* Mobile toggle */}
      <button
        className="flex w-full items-center justify-between lg:hidden"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuration</span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
      </button>

      <div className={`${open ? 'block' : 'hidden'} lg:block`}>
        <h2 className="hidden text-sm font-semibold text-gray-900 dark:text-gray-100 lg:block">Configuration</h2>
        {formBody}
      </div>
    </div>
  )
}
