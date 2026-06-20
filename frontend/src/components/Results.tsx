import type { BacktestResult } from '../types'
import SummaryCards from './SummaryCards'
import EquityChart from './EquityChart'
import DrawdownChart from './DrawdownChart'
import WinnersLosers from './WinnersLosers'
import PortfolioLog from './PortfolioLog'

interface Props {
  result: BacktestResult
  dark: boolean
}

export default function Results({ result, dark }: Props) {
  return (
    <div className="space-y-4">
      <SummaryCards result={result} />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <EquityChart data={result.equity_curve} dark={dark} />
        {result.drawdown_series?.length > 0 && (
          <DrawdownChart data={result.drawdown_series} dark={dark} />
        )}
      </div>
      <WinnersLosers winners={result.top_winners} losers={result.top_losers} />
      <PortfolioLog log={result.portfolio_log} />
    </div>
  )
}
