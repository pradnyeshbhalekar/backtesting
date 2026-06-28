import { useState, useRef, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'

interface Props {
  value: string        // 'YYYY-MM-DD'
  onChange: (v: string) => void
  label?: string
  min?: string
  max?: string
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS = ['Su','Mo','Tu','We','Th','Fr','Sa']

function parseDate(s: string): Date | null {
  if (!s) return null
  const d = new Date(s + 'T00:00:00')
  return isNaN(d.getTime()) ? null : d
}

function toYMD(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export default function DatePicker({ value, onChange, min, max }: Props) {
  const selected = parseDate(value)
  const today = new Date()

  const [open, setOpen] = useState(false)
  const [view, setView] = useState<Date>(selected ?? new Date(today.getFullYear(), today.getMonth(), 1))
  const [dropUp, setDropUp] = useState(false)
  const [alignRight, setAlignRight] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    if (!open || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const calendarHeight = 300
    const calendarWidth = 256
    setDropUp(rect.bottom + calendarHeight > window.innerHeight)
    setAlignRight(rect.left + calendarWidth > window.innerWidth)
  }, [open])

  const year = view.getFullYear()
  const month = view.getMonth()

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  while (cells.length % 7 !== 0) cells.push(null)

  const prevMonth = () => setView(new Date(year, month - 1, 1))
  const nextMonth = () => setView(new Date(year, month + 1, 1))

  const pick = (day: number) => {
    const d = new Date(year, month, day)
    const ymd = toYMD(d)
    if (min && ymd < min) return
    if (max && ymd > max) return
    onChange(ymd)
    setOpen(false)
  }

  const isSelected = (day: number) => {
    if (!selected) return false
    return selected.getFullYear() === year && selected.getMonth() === month && selected.getDate() === day
  }

  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day

  const isDisabled = (day: number) => {
    const ymd = toYMD(new Date(year, month, day))
    if (min && ymd < min) return true
    if (max && ymd > max) return true
    return false
  }

  const displayValue = selected
    ? selected.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Pick a date'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-left focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80"
      >
        <span className={selected ? 'text-gray-900 dark:text-gray-100' : 'text-gray-400 dark:text-zinc-500'}>
          {displayValue}
        </span>
        <Calendar className="h-3.5 w-3.5 shrink-0 text-gray-400 dark:text-zinc-500" />
      </button>

      {open && (
        <div className={`absolute z-50 w-64 rounded-xl border border-gray-200 bg-white p-3 shadow-xl dark:border-zinc-700 dark:bg-zinc-800 animate-fade-in
          ${dropUp ? 'bottom-full mb-1' : 'top-full mt-1'}
          ${alignRight ? 'right-0' : 'left-0'}
        `}>
          {/* Month nav */}
          <div className="mb-3 flex items-center justify-between">
            <button
              type="button"
              onClick={prevMonth}
              className="rounded-md p-1 text-gray-400 dark:text-zinc-500 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-xs font-semibold text-gray-800 dark:text-gray-100">
              {MONTHS[month]} {year}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="rounded-md p-1 text-gray-400 dark:text-zinc-500 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day headers */}
          <div className="mb-1 grid grid-cols-7 text-center">
            {DAYS.map(d => (
              <span key={d} className="py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400 dark:text-zinc-600">
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-y-0.5 text-center">
            {cells.map((day, i) => {
              if (!day) return <span key={i} />
              const sel = isSelected(day)
              const dis = isDisabled(day)
              const tod = isToday(day)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(day)}
                  disabled={dis}
                  className={`relative mx-auto flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors
                    ${sel
                      ? 'bg-gray-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
                      : dis
                      ? 'text-gray-200 dark:text-zinc-700 cursor-not-allowed'
                      : 'text-gray-700 dark:text-zinc-300'
                    }`}
                >
                  {day}
                  {tod && !sel && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-gray-400 dark:bg-zinc-500" />
                  )}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
