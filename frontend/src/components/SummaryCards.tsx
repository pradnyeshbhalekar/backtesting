import type { BacktestResult } from '../types'

interface Props { result: BacktestResult }

function fmt(n: number, decimals = 2) {
  return n?.toFixed(decimals) ?? '—'
}

function fmtCurrency(n: number) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
}

function Card({ label, value, colorClass }: { label: string; value: string; colorClass?: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-zinc-950">
      <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${colorClass ?? 'text-gray-900 dark:text-gray-100'}`}>{value}</p>
    </div>
  )
}

export default function SummaryCards({ result }: Props) {
  const pos = 'text-green-600 dark:text-green-400'
  const neg = 'text-red-600 dark:text-red-400'

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
      <Card label="CAGR" value={`${fmt(result.cagr)}%`} colorClass={result.cagr >= 0 ? pos : neg} />
      <Card label="Total Return" value={`${fmt(result.total_return_pct)}%`} colorClass={result.total_return_pct >= 0 ? pos : neg} />
      <Card label="Sharpe Ratio" value={fmt(result.sharpe_ratio)} />
      <Card label="Max Drawdown" value={`${fmt(result.max_drawdown_pct)}%`} colorClass={neg} />
      <Card label="Volatility" value={`${fmt(result.volatility_pct)}%`} />
      <div className="col-span-2 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-white/10 dark:bg-zinc-950 md:col-span-3 lg:col-span-5 lg:hidden xl:block xl:col-span-5">
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Initial Capital: </span>
            <span className="font-medium text-gray-900 dark:text-gray-100">{fmtCurrency(result.initial_capital)}</span>
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Final Capital: </span>
            <span className={`font-medium ${result.final_capital >= result.initial_capital ? pos : neg}`}>{fmtCurrency(result.final_capital)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
