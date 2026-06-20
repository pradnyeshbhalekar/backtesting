import { useState } from 'react'
import { ChevronDown, ChevronUp, Plus, Trash2 } from 'lucide-react'
import type { BacktestConfig, RankingRule } from '../types'

const METRICS = [
  'roe', 'roce', 'roa', 'pe_ratio', 'pb_ratio', 'pat', 'revenue',
  'ebitda', 'total_debt', 'free_cash_flow', 'net_profit_margin',
  'operating_margin', 'revenue_growth_yoy', 'pat_growth_yoy', 'market_cap',
]

const inputCls =
  'w-full rounded border border-gray-300 bg-transparent px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100'

const labelCls = 'block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'

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

  const formBody = (
    <div className="space-y-5 pt-4 lg:pt-0">
      {/* Date Range */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Date Range</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelCls}>Start Date</label>
            <input type="date" className={inputCls} value={config.start_date}
              onChange={e => onChange({ start_date: e.target.value })} />
          </div>
          <div>
            <label className={labelCls}>End Date</label>
            <input type="date" className={inputCls} value={config.end_date}
              onChange={e => onChange({ end_date: e.target.value })} />
          </div>
        </div>
      </section>

      {/* Strategy */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Strategy</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Rebalance Frequency</label>
            <select className={inputCls} value={config.rebalance_frequency ?? 'quarterly'}
              onChange={e => onChange({ rebalance_frequency: e.target.value as BacktestConfig['rebalance_frequency'] })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="half_yearly">Half Yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Portfolio Size</label>
              <input type="number" min={1} className={inputCls}
                value={config.portfolio_size ?? ''}
                onChange={e => onChange({ portfolio_size: e.target.value ? parseInt(e.target.value) : undefined })} />
            </div>
            <div>
              <label className={labelCls}>Initial Capital (₹)</label>
              <input type="number" min={0} className={inputCls}
                value={config.initial_capital ?? ''}
                onChange={e => onChange({ initial_capital: e.target.value ? parseFloat(e.target.value) : undefined })} />
            </div>
          </div>
        </div>
      </section>

      {/* Sizing */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Position Sizing</h3>
        <div className="space-y-3">
          <div>
            <label className={labelCls}>Method</label>
            <select className={inputCls} value={config.sizing_method ?? 'equal'}
              onChange={e => onChange({ sizing_method: e.target.value as BacktestConfig['sizing_method'] })}>
              <option value="equal">Equal Weight</option>
              <option value="market_cap">Market Cap Weight</option>
              <option value="metric">Metric Weight</option>
            </select>
          </div>
          {config.sizing_method === 'metric' && (
            <div>
              <label className={labelCls}>Sizing Metric</label>
              <select className={inputCls} value={config.sizing_metric ?? ''}
                onChange={e => onChange({ sizing_metric: e.target.value })}>
                <option value="">Select metric</option>
                {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
          )}
        </div>
      </section>

      {/* Filters */}
      <section>
        <button onClick={() => setFiltersOpen(f => !f)}
          className="flex w-full items-center justify-between text-xs font-semibold uppercase tracking-wider text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
          <span>Filters</span>
          {filtersOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>
        {filtersOpen && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            {[
              ['market_cap_min', 'Market Cap Min (Cr)'],
              ['market_cap_max', 'Market Cap Max (Cr)'],
              ['roce_min', 'ROCE Min (%)'],
              ['roe_min', 'ROE Min (%)'],
              ['pe_max', 'PE Max'],
              ['pat_min', 'PAT Min (Cr)'],
            ].map(([key, label]) => (
              <div key={key}>
                <label className={labelCls}>{label}</label>
                <input type="number" className={inputCls}
                  value={(config.filters as Record<string, number | undefined> | undefined)?.[key] ?? ''}
                  onChange={e => patchFilter(key, e.target.value)} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Ranking */}
      <section>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Ranking Rules</h3>
        <div className="space-y-2">
          {(config.ranking ?? []).map((rule, i) => (
            <div key={i} className="flex items-center gap-2">
              <select className={`${inputCls} flex-1`} value={rule.metric}
                onChange={e => updateRanking(i, { metric: e.target.value })}>
                {METRICS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <label className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 whitespace-nowrap">
                <input type="checkbox" checked={rule.ascending}
                  onChange={e => updateRanking(i, { ascending: e.target.checked })} />
                Asc
              </label>
              <button onClick={() => removeRanking(i)}
                className="text-gray-400 hover:text-red-500">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          <button onClick={addRanking}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400">
            <Plus className="h-3.5 w-3.5" /> Add Rule
          </button>
        </div>
      </section>
    </div>
  )

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      {/* Mobile toggle */}
      <button
        className="flex w-full items-center justify-between lg:hidden"
        onClick={() => setOpen(o => !o)}
      >
        <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">Configuration</span>
        {open ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
      </button>

      {/* Always visible on lg+ */}
      <div className={`${open ? 'block' : 'hidden'} lg:block`}>
        <h2 className="hidden text-sm font-semibold text-gray-900 dark:text-gray-100 lg:block">Configuration</h2>
        {formBody}
      </div>
    </div>
  )
}
