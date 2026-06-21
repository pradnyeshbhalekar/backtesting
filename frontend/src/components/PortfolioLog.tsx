import { useState } from 'react'
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react'
import type { RebalancePeriod } from '../types'

interface Props { log: RebalancePeriod[] }

const PAGE_SIZE = 6

const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

export default function PortfolioLog({ log }: Props) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(log.length / PAGE_SIZE)
  const pageSlice = log.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const goTo = (p: number) => {
    setPage(p)
    setOpenIdx(null)
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-white/10 dark:bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-white/10">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Portfolio Log</h3>
          <p className="mt-0.5 text-xs text-gray-400">{log.length} rebalance periods · click a row to see holdings</p>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <button
              onClick={() => goTo(page - 1)}
              disabled={page === 0}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-white/8"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <span className="w-20 text-center">{page + 1} / {totalPages}</span>
            <button
              onClick={() => goTo(page + 1)}
              disabled={page === totalPages - 1}
              className="rounded p-1 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-white/8"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Column labels */}
      <div className="grid grid-cols-[1fr_auto_auto] gap-2 border-b border-gray-100 px-4 py-2 text-[10px] font-semibold uppercase tracking-wider text-gray-400 dark:border-white/8 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4">
        <span>Period start</span>
        <span className="text-right">Return</span>
        <span className="hidden text-right sm:block">Capital after</span>
        <span className="w-4" />
      </div>

      {/* Rows */}
      <div className="divide-y divide-gray-100 dark:divide-white/8">
        {pageSlice.map((period, i) => {
          const globalIdx = page * PAGE_SIZE + i
          const isOpen = openIdx === globalIdx
          const ret = period.portfolio_return_pct
          const retCls = ret >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

          return (
            <div key={globalIdx}>
              <button
                onClick={() => setOpenIdx(isOpen ? null : globalIdx)}
                className="grid w-full grid-cols-[1fr_auto_auto] items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-white/5 sm:grid-cols-[1fr_auto_auto_auto] sm:gap-4"
              >
                <div className="min-w-0 text-left">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-medium text-gray-800 dark:text-gray-100">{fmtDate(period.rebalance_date)}</span>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-400 dark:bg-white/8">
                      {period.holdings.length} stocks
                    </span>
                  </div>
                  <span className="mt-0.5 block text-xs text-gray-400 sm:hidden">{fmtINR(period.capital_after)}</span>
                </div>
                <span className={`text-right font-semibold tabular-nums ${retCls}`}>
                  {ret >= 0 ? '+' : ''}{ret.toFixed(2)}%
                </span>
                <span className="hidden text-right tabular-nums text-gray-500 dark:text-gray-400 sm:block">
                  {fmtINR(period.capital_after)}
                </span>
                {isOpen
                  ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
                  : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />}
              </button>

              {isOpen && (
                <div className="overflow-x-auto border-t border-gray-100 bg-gray-50 dark:border-white/8 dark:bg-white/[0.03]">
                  <table className="w-full min-w-[280px] text-xs">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-white/8">
                        <th className="px-3 py-2 text-left font-medium text-gray-400">#</th>
                        <th className="px-3 py-2 text-left font-medium text-gray-400">Symbol</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-400">Weight</th>
                        <th className="px-3 py-2 text-right font-medium text-gray-400">Return</th>
                      </tr>
                    </thead>
                    <tbody>
                      {period.holdings
                        .slice()
                        .sort((a, b) => b.return_pct - a.return_pct)
                        .map((h, hi) => (
                          <tr key={h.symbol} className="border-b border-gray-100 last:border-0 dark:border-white/5">
                            <td className="px-3 py-1.5 text-gray-300 dark:text-gray-600">{hi + 1}</td>
                            <td className="px-3 py-1.5 font-mono font-semibold text-gray-800 dark:text-gray-100">{h.symbol}</td>
                            <td className="px-3 py-1.5 text-right text-gray-500 dark:text-gray-400">{(h.weight * 100).toFixed(1)}%</td>
                            <td className={`px-3 py-1.5 text-right font-medium ${h.return_pct >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
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

      {/* Footer pagination (for quick jumping) */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 border-t border-gray-100 px-4 py-3 dark:border-white/10">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-6 w-6 rounded text-xs transition-colors ${
                i === page
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-white/8'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
