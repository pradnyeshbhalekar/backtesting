import '../lib/chartDefaults'
import { Line } from 'react-chartjs-2'

interface Props {
  data: { date: string; value: number }[]
  benchmark?: { date: string; value: number }[]
  dark: boolean
}

const fmtINR = (v: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v)

const fmtCompact = (v: number) =>
  new Intl.NumberFormat('en-IN', { notation: 'compact', maximumFractionDigits: 1 }).format(v)

const fmtDate = (ts: number) =>
  new Date(ts).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

export default function EquityChart({ data, benchmark, dark }: Props) {
  const gridColor = dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'
  const textColor = dark ? '#6b7280' : '#9ca3af'
  const tooltipBg = dark ? '#18181b' : '#ffffff'
  const tooltipBorder = dark ? '#3f3f46' : '#e5e7eb'

  const datasets: object[] = [
    {
      label: 'Strategy',
      data: data.map(d => ({ x: d.date, y: d.value })),
      borderColor: '#3b82f6',
      backgroundColor: dark ? 'rgba(59,130,246,0.10)' : 'rgba(59,130,246,0.08)',
      fill: true,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#3b82f6',
      pointHoverBorderColor: dark ? '#18181b' : '#fff',
      pointHoverBorderWidth: 2,
      borderWidth: 2,
    },
  ]

  if (benchmark?.length) {
    datasets.push({
      label: 'Nifty 50',
      data: benchmark.map(d => ({ x: d.date, y: d.value })),
      borderColor: '#f59e0b',
      backgroundColor: 'transparent',
      fill: false,
      tension: 0.3,
      pointRadius: 0,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: '#f59e0b',
      pointHoverBorderColor: dark ? '#18181b' : '#fff',
      pointHoverBorderWidth: 2,
      borderWidth: 1.5,
      borderDash: [4, 3],
    })
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: !!benchmark?.length,
        position: 'top' as const,
        align: 'end' as const,
        labels: {
          color: textColor,
          boxWidth: 24,
          boxHeight: 2,
          padding: 12,
          font: { size: 11 },
        },
      },
      tooltip: {
        backgroundColor: tooltipBg,
        borderColor: tooltipBorder,
        borderWidth: 1,
        titleColor: dark ? '#e4e4e7' : '#111827',
        bodyColor: dark ? '#a1a1aa' : '#6b7280',
        padding: 10,
        displayColors: true,
        boxWidth: 8,
        boxHeight: 8,
        callbacks: {
          title: (items: { parsed: { x: number } }[]) => fmtDate(items[0].parsed.x),
          label: (ctx: { dataset: { label: string }; parsed: { y: number } }) =>
            `${ctx.dataset.label}: ${fmtINR(ctx.parsed.y)}`,
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
          callback: (v: number | string) => fmtCompact(Number(v)),
        },
      },
    },
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-950">
      <h3 className="mb-4 text-sm font-medium text-gray-500 dark:text-gray-400">Equity Curve</h3>
      <div className="h-56">
        <Line data={{ datasets }} options={options as never} />
      </div>
    </div>
  )
}
