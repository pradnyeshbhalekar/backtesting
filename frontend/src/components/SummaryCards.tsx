import type { BacktestResult } from '../types'

interface Props { result: BacktestResult }

function fmt(n: number, decimals = 2) {
  return n?.toFixed(decimals) ?? '—'
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

const pos = 'text-emerald-600 dark:text-emerald-400'
const neg = 'text-red-500 dark:text-red-400'
const neu = 'text-gray-900 dark:text-gray-100'

export default function SummaryCards({ result }: Props) {
  const stats = [
    {
      label: 'CAGR',
      value: `${fmt(result.cagr)}%`,
      color: result.cagr >= 0 ? pos : neg,
    },
    {
      label: 'Total Return',
      value: `${fmt(result.total_return_pct)}%`,
      color: result.total_return_pct >= 0 ? pos : neg,
    },
    {
      label: 'Sharpe Ratio',
      value: fmt(result.sharpe_ratio),
      color: neu,
    },
    {
      label: 'Max Drawdown',
      value: `${fmt(result.max_drawdown_pct)}%`,
      color: neg,
    },
    {
      label: 'Volatility',
      value: `${fmt(result.volatility_pct)}%`,
      color: neu,
    },
  ]

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-700/60 dark:bg-zinc-800">
      {/* Main stats row */}
      <div className="grid grid-cols-2 divide-x divide-y divide-gray-100 dark:divide-zinc-700/60 sm:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
        {stats.map(s => (
          <div key={s.label} className="px-5 py-4">
            <p className="text-[11px] font-medium text-gray-400 dark:text-zinc-500">{s.label}</p>
            <p className={`mt-1.5 text-2xl font-semibold tabular-nums tracking-tight ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Capital row */}
      <div className="flex flex-wrap items-center gap-x-8 gap-y-1 border-t border-gray-100 px-5 py-3 dark:border-zinc-700/60">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 dark:text-zinc-500">Initial</span>
          <span className="font-medium text-gray-700 dark:text-zinc-300">{fmtCurrency(result.initial_capital)}</span>
        </div>
        <div className="text-gray-200 dark:text-zinc-700">→</div>
        <div className="flex items-center gap-2 text-xs">
          <span className="text-gray-400 dark:text-zinc-500">Final</span>
          <span className={`font-semibold ${result.final_capital >= result.initial_capital ? pos : neg}`}>
            {fmtCurrency(result.final_capital)}
          </span>
        </div>
      </div>
    </div>
  )
}
