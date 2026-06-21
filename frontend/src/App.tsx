import { useState, useCallback } from 'react'
import { Play, Loader2 } from 'lucide-react'
import Header from './components/Header'
import ConfigPanel from './components/ConfigPanel'
import Results from './components/Results'
import { useTheme } from './hooks/useTheme'
import { runBacktest } from './api'
import type { BacktestConfig, BacktestResult } from './types'

const DEFAULT_CONFIG: BacktestConfig = {
  start_date: '2020-01-01',
  end_date: '2024-01-01',
  rebalance_frequency: 'quarterly',
  portfolio_size: 20,
  initial_capital: 1000000,
  sizing_method: 'equal',
  ranking: [{ metric: 'roe', ascending: false }],
}

function sanitize(cfg: BacktestConfig): BacktestConfig {
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(cfg)) {
    if (v === undefined || v === null || v === '') continue
    if (k === 'filters' && typeof v === 'object') {
      const f: Record<string, number> = {}
      for (const [fk, fv] of Object.entries(v as Record<string, unknown>)) {
        if (fv !== undefined && fv !== null && fv !== '') f[fk] = fv as number
      }
      if (Object.keys(f).length > 0) out[k] = f
    } else if (k === 'ranking' && Array.isArray(v) && v.length > 0) {
      out[k] = v
    } else if (k !== 'ranking' && k !== 'filters') {
      out[k] = v
    }
  }
  return out as unknown as BacktestConfig
}

export default function App() {
  const { dark, toggle } = useTheme()
  const [config, setConfig] = useState<BacktestConfig>(DEFAULT_CONFIG)
  const [result, setResult] = useState<BacktestResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = useCallback((patch: Partial<BacktestConfig>) => {
    setConfig(c => ({ ...c, ...patch }))
  }, [])

  const handleRun = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await runBacktest(sanitize(config))
      setResult(res)
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setLoading(false)
    }
  }, [config])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-black dark:text-gray-100">
      <Header dark={dark} onToggle={toggle} />
      <main className="mx-auto max-w-screen-xl px-4 py-6 lg:grid lg:grid-cols-[300px_1fr] lg:gap-6 xl:grid-cols-[320px_1fr]">
        {/* Config sidebar */}
        <div className="lg:sticky lg:top-20 lg:self-start space-y-3">
          <ConfigPanel config={config} onChange={handleChange} />
          <button
            onClick={handleRun}
            disabled={loading || !config.start_date || !config.end_date}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-500 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Running...</>
              : <><Play className="h-4 w-4" /> Run Backtest</>}
          </button>
        </div>

        {/* Results area */}
        <div className="mt-6 lg:mt-0">
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}
          {loading ? (
            <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-gray-300 text-gray-400 dark:border-white/10">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-sm">Running backtest...</span>
            </div>
          ) : result ? (
            <Results result={result} dark={dark} />
          ) : (
            <div className="flex h-64 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 text-gray-400 dark:border-white/10">
              <Play className="h-8 w-8 opacity-30" />
              <span className="text-sm">Configure and run a backtest to see results</span>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
