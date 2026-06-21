import '../lib/chartDefaults'
import { Line } from 'react-chartjs-2'

interface Props {
  data: { date: string; drawdown: number }[]
  dark: boolean
}

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function DrawdownChart({ data, dark }: Props) {
  const gridColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = dark ? '#6b7280' : '#9ca3af'
  const tooltipBg = dark ? '#18181b' : '#ffffff'
  const tooltipBorder = dark ? '#3f3f46' : '#e5e7eb'

  const chartData = {
    datasets: [{
      label: 'Drawdown',
      data: data.map(d => ({ x: d.date, y: d.drawdown })),
      borderColor: '#ef4444',
      backgroundColor: dark ? 'rgba(239,68,68,0.14)' : 'rgba(239,68,68,0.10)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#ef4444',
      pointHoverBorderColor: dark ? '#18181b' : '#fff',
      pointHoverBorderWidth: 2,
      borderWidth: 2,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: dark ? '#e4e4e7' : '#111827',
        bodyColor: dark ? '#a1a1aa' : '#6b7280',
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (items: { parsed: { x: number } }[]) => fmtDate(items[0].parsed.x),
          label: (ctx: { parsed: { y: number } }) => `Drawdown: ${ctx.parsed.y.toFixed(2)}%`,
        },
      },
    },
    scales: {
      x: {
        type: 'time' as const,
        time: {
          unit: 'quarter' as const,
          displayFormats: { quarter: 'MMM yy' },
        },
        grid: { color: gridColor, drawTicks: false },
        border: { display: false },
        ticks: {
          color: textColor,
          maxTicksLimit: 8,
          maxRotation: 0,
          padding: 8,
        },
      },
      y: {
        grid: { color: gridColor, drawTicks: false },
        border: { display: false },
        ticks: {
          color: textColor,
          maxTicksLimit: 6,
          padding: 8,
          callback: (v: number | string) => `${Number(v).toFixed(1)}%`,
        },
      },
    },
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
      <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Drawdown</h3>
      <div className="h-56">
        <Line data={chartData} options={options as never} />
      </div>
    </div>
  )
}
