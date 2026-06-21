import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'
import type { RebalancePeriod } from '../types'

interface Props { log: RebalancePeriod[] }

export default function PortfolioLog({ log }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-950">
      <div className="border-b border-gray-100 p-4 dark:border-white/10">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Portfolio Log</h3>
      </div>
      <div className="divide-y divide-gray-100 dark:divide-white/8">
        {log.map((period, i) => {
          const isOpen = openIdx === i
          const ret = period.portfolio_return_pct
          const retCls = ret >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

          return (
            <div key={i}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : i)}
                className="flex w-full items-center justify-between px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5"
              >
                <div className="flex items-center gap-2">
                  {isOpen ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" /> : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
                  <span className="font-mono text-gray-900 dark:text-gray-100">{period.rebalance_date}</span>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <span className={`font-medium ${retCls}`}>{ret >= 0 ? '+' : ''}{ret.toFixed(2)}%</span>
                  <span className="text-gray-500 dark:text-gray-400">
                    {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(period.capital_after)}
                  </span>
                </div>
              </button>
              {isOpen && (
                <div className="overflow-x-auto border-t border-gray-100 bg-gray-50 dark:border-white/8 dark:bg-white/5">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-800">
                        <th className="px-4 py-2 text-left font-medium text-gray-400">Symbol</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-400">Weight</th>
                        <th className="px-4 py-2 text-right font-medium text-gray-400">Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {period.holdings.map(h => (
                        <tr key={h.symbol} className="border-b border-gray-100 last:border-0 dark:border-gray-800">
                          <td className="px-4 py-1.5 font-mono font-medium text-gray-900 dark:text-gray-100">{h.symbol}</td>
                          <td className="px-4 py-1.5 text-right text-gray-500 dark:text-gray-400">{(h.weight * 100).toFixed(1)}%</td>
                          <td className={`px-4 py-1.5 text-right font-medium ${h.return_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {h.return_pct >= 0 ? '+' : ''}{h.return_pct.toFixed(2)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
