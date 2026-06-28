import { Download } from 'lucide-react'
import type { BacktestResult } from '../types'
import SummaryCards from './SummaryCards'
import EquityChart from './EquityChart'
import DrawdownChart from './DrawdownChart'
import WinnersLosers from './WinnersLosers'
import PortfolioLog from './PortfolioLog'
import { exportResults } from '../lib/exportCsv'

interface Props {
  result: BacktestResult
  dark: boolean
}

export default function Results({ result, dark }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">Results</h2>
        <button
          onClick={() => exportResults(result)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Export CSV
        </button>
      </div>
      <SummaryCards result={result} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <EquityChart data={result.equity_curve} benchmark={result.benchmark_curve} dark={dark} />
        {result.drawdown_series?.length > 0 && (
          <DrawdownChart data={result.drawdown_series} dark={dark} />
        )}
      </div>
      <WinnersLosers winners={result.top_winners} losers={result.top_losers} />
      <PortfolioLog log={result.portfolio_log} />
    </div>
  )
}
