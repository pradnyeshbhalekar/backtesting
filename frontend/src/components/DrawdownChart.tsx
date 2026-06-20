import '../lib/chartDefaults'
import { Line } from 'react-chartjs-2'

interface Props {
  data: { date: string; drawdown: number }[]
  dark: boolean
}

export default function DrawdownChart({ data, dark }: Props) {
  const gridColor = dark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const textColor = dark ? '#9ca3af' : '#6b7280'

  const chartData = {
    datasets: [{
      label: 'Drawdown',
      data: data.map(d => ({ x: d.date, y: d.drawdown })),
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239,68,68,0.12)',
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
          label: (ctx: { parsed: { y: number } }) => `${ctx.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: { type: 'time' as const, time: { unit: 'month' as const }, grid: { color: gridColor }, ticks: { color: textColor, maxTicksLimit: 8 } },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, callback: (v: number | string) => `${Number(v).toFixed(1)}%` },
      },
    },
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-950">
      <h3 className="mb-3 text-sm font-medium text-gray-500 dark:text-gray-400">Drawdown</h3>
      <div className="h-56">
        <Line data={chartData} options={options} />
      </div>
    </div>
  )
}
