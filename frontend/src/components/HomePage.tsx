import { BarChart2, SlidersHorizontal, Download, ChevronRight, Zap, Shield, LineChart } from 'lucide-react'
import Logo from './Logo'

interface Props {
  onStart: () => void
}

const features = [
  {
    icon: SlidersHorizontal,
    title: 'Strategy Builder',
    desc: 'Ranking rules, filters, rebalance frequency, position sizing — no code required.',
  },
  {
    icon: LineChart,
    title: 'Equity & Drawdown Charts',
    desc: 'Visualize portfolio performance vs benchmark over any date range.',
  },
  {
    icon: Zap,
    title: 'Fast Results',
    desc: 'Multi-year backtests across hundreds of Indian stocks in seconds.',
  },
  {
    icon: Shield,
    title: 'Fundamental Data',
    desc: 'ROE, ROCE, P/E, P/B, PAT growth and more — real historical data.',
  },
  {
    icon: BarChart2,
    title: 'Portfolio Analytics',
    desc: 'CAGR, Sharpe ratio, max drawdown and a full trade-by-trade log.',
  },
  {
    icon: Download,
    title: 'CSV Export',
    desc: 'Download results for further analysis in Excel or Python.',
  },
]

const metrics = [
  { label: 'Stocks', value: '500+' },
  { label: 'Years of data', value: '10+' },
  { label: 'Metrics', value: '15+' },
  { label: 'Rebalance modes', value: '4' },
]

export default function HomePage({ onStart }: Props) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="px-5 pt-24 pb-20 text-center">
        <div className="mx-auto max-w-2xl">
          <div className="group mb-6 flex justify-center cursor-default">
            <Logo className="h-14 w-14 text-gray-900 dark:text-gray-100 group-hover:[&_.hdr-c1]:animate-[candle-rise_0.55s_cubic-bezier(0.22,1,0.36,1)_0.05s_both] group-hover:[&_.hdr-c2]:animate-[candle-rise_0.55s_cubic-bezier(0.22,1,0.36,1)_0.2s_both] group-hover:[&_.hdr-c3]:animate-[candle-rise_0.55s_cubic-bezier(0.22,1,0.36,1)_0.35s_both]" />
          </div>

          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-50 sm:text-5xl">
            Backtest before you invest
          </h1>

          <p className="mx-auto mb-10 max-w-lg text-base text-gray-500 dark:text-zinc-400">
            Simulate fundamental factor strategies on Indian equities.
            Pick your metrics, set filters, and see how your portfolio would have performed.
          </p>

          <button
            onClick={onStart}
            className="group inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-900 px-7 py-3.5 text-sm font-semibold text-white hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Start Backtesting
            <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-gray-100 py-8 dark:border-zinc-800">
        <div className="mx-auto grid max-w-lg grid-cols-2 gap-6 px-5 sm:max-w-3xl sm:grid-cols-4">
          {metrics.map(m => (
            <div key={m.label} className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{m.value}</div>
              <div className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">{m.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-4xl px-5 py-20">
        <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-zinc-600">
          What you get
        </p>
        <div className="grid gap-px rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`bg-white p-6 dark:bg-zinc-900 ${
                i < features.length - 1 ? '' : ''
              }`}
            >
              <f.icon className="mb-3 h-4 w-4 text-gray-400 dark:text-zinc-500" />
              <h3 className="mb-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{f.title}</h3>
              <p className="text-xs leading-relaxed text-gray-400 dark:text-zinc-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA strip */}
      <section className="px-5 pb-24">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-6 rounded-2xl border border-gray-100 bg-gray-50 px-8 py-7 dark:border-zinc-800 dark:bg-zinc-900 flex-wrap">
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Ready to run your first backtest?</p>
            <p className="mt-0.5 text-xs text-gray-400 dark:text-zinc-500">No sign-up. Results in seconds.</p>
          </div>
          <button
            onClick={onStart}
            className="group shrink-0 inline-flex items-center gap-2 rounded-xl border border-gray-300 bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700 active:scale-[0.98] transition-all duration-150 dark:border-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            Launch Tool
            <ChevronRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-300 dark:border-zinc-800 dark:text-zinc-700">
        Stratix · For research purposes only · Not investment advice
      </footer>
    </div>
  )
}
