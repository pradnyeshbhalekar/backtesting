import '../lib/chartDefaults'
import { Line } from 'react-chartjs-2'

interface Props {
  data: { date: string; value: number }[]
  dark: boolean
}

export default function EquityChart({ data, dark }: Props) {
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const textColor = dark ? '#9ca3af' : '#6b7280'

  const chartData = {
    datasets: [{
      label: 'Portfolio Value',
      data: data.map(d => ({ x: d.date, y: d.value })),
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59,130,246,0.08)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      borderWidth: 2,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: { parsed: { y: number } }) =>
            new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(ctx.parsed.y),
        },
      },
    },
    scales: {
      x: { type: 'time' as const, time: { unit: 'month' as const }, grid: { color: gridColor }, ticks: { color: textColor, maxTicksLimit: 8 } },
      y: {
        grid: { color: gridColor },
        ticks: {
          color: textColor,
          callback: (v: number | string) => new Intl.NumberFormat('en-IN', { notation: 'compact', currency: 'INR' }).format(Number(v)),
        },
      },
    },
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Equity Curve</h3>
      <div className="h-56">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
