import type { BacktestResult } from '../types'

function download(content: string, filename: string, mime = 'text/csv') {
  const blob = new Blob([content], { type: mime })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return ''
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(','),
    ...rows.map(row =>
      headers.map(h => {
        const v = row[h]
        const s = v == null ? '' : String(v)
        return s.includes(',') || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s
      }).join(',')
    ),
  ]
  return lines.join('\n')
}

export function exportResults(result: BacktestResult) {
  // Summary sheet
  const summary = toCsv([{
    CAGR_pct: result.cagr,
    Total_Return_pct: result.total_return_pct,
    Sharpe_Ratio: result.sharpe_ratio,
    Max_Drawdown_pct: result.max_drawdown_pct,
    Volatility_pct: result.volatility_pct,
    Initial_Capital: result.initial_capital,
    Final_Capital: result.final_capital,
  }])

  const equity = toCsv(result.equity_curve.map(d => ({ Date: d.date, Portfolio_Value: d.value })))

  const drawdown = toCsv(result.drawdown_series.map(d => ({ Date: d.date, Drawdown_pct: d.drawdown })))

  const holdings = toCsv(
    result.portfolio_log.flatMap(p =>
      p.holdings.map(h => ({
        Rebalance_Date: p.rebalance_date,
        Symbol: h.symbol,
        Weight_pct: (h.weight * 100).toFixed(2),
        Return_pct: h.return_pct,
        Capital_After: p.capital_after,
      }))
    )
  )

  const winners = toCsv(result.top_winners.map(w => ({ Symbol: w.symbol, Avg_Return_pct: w.avg_return_pct })))
  const losers = toCsv(result.top_losers.map(l => ({ Symbol: l.symbol, Avg_Return_pct: l.avg_return_pct })))

  // Combine into one CSV with section headers
  const combined = [
    '=== SUMMARY ===', summary, '',
    '=== EQUITY CURVE ===', equity, '',
    '=== DRAWDOWN SERIES ===', drawdown, '',
    '=== PORTFOLIO HOLDINGS ===', holdings, '',
    '=== TOP WINNERS ===', winners, '',
    '=== TOP LOSERS ===', losers,
  ].join('\n')

  download(combined, `backtest_results_${new Date().toISOString().slice(0, 10)}.csv`)
}
