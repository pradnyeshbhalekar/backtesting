import { TrendingUp, TrendingDown } from 'lucide-react'
import type { Performer } from '../types'

interface TableProps {
  title: string
  data: Performer[]
  positive: boolean
}

function Table({ title, data, positive }: TableProps) {
  const Icon = positive ? TrendingUp : TrendingDown
  const colorCls = positive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${colorCls}`} />
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="pb-2 text-left text-xs font-medium text-gray-400">Symbol</th>
            <th className="pb-2 text-right text-xs font-medium text-gray-400">Avg Return</th>
          </tr>
        </thead>
        <tbody>
          {data.slice(0, 5).map(p => (
            <tr key={p.symbol} className="border-b border-gray-50 last:border-0 dark:border-gray-900">
              <td className="py-1.5 font-mono font-medium text-gray-900 dark:text-gray-100">{p.symbol}</td>
              <td className={`py-1.5 text-right font-medium ${colorCls}`}>{p.avg_return_pct.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface Props {
  winners: Performer[]
  losers: Performer[]
}

export default function WinnersLosers({ winners, losers }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Table title="Top Winners" data={winners} positive />
      <Table title="Top Losers" data={losers} positive={false} />
    </div>
  )
}
