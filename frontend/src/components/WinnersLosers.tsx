import type { Performer } from '../types'

interface Props {
  winners: Performer[]
  losers: Performer[]
}

function Table({ title, data, positive }: { title: string; data: Performer[]; positive: boolean }) {
  const retColor = (r: number) =>
    r >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'

  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-700/60 dark:bg-zinc-800">
      <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 dark:border-zinc-700/60">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-500">
          {title}
        </h3>
        <span className={`text-xs font-medium ${positive ? 'text-emerald-500' : 'text-red-500'}`}>
          Top 5
        </span>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-zinc-700/40">
        {data.slice(0, 5).map((p, i) => (
          <div key={p.symbol} className="flex items-center justify-between px-4 py-2.5">
            <div className="flex items-center gap-3">
              <span className="w-4 text-xs tabular-nums text-gray-300 dark:text-zinc-700">{i + 1}</span>
              <span className="font-mono text-sm font-semibold text-gray-800 dark:text-gray-100">{p.symbol}</span>
            </div>
            <span className={`text-sm font-semibold tabular-nums ${retColor(p.avg_return_pct)}`}>
              {p.avg_return_pct >= 0 ? '+' : ''}{p.avg_return_pct.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function WinnersLosers({ winners, losers }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Table title="Top Winners" data={winners} positive />
      <Table title="Top Losers" data={losers} positive={false} />
    </div>
  )
}
