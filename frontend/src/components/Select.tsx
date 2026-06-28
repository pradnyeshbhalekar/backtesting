import { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

interface Option {
  value: string
  label: string
}

interface Props {
  value: string
  onChange: (value: string) => void
  options: Option[]
  placeholder?: string
}

export default function Select({ value, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find(o => o.value === value)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800/80 dark:text-gray-100"
      >
        <span className={selected ? '' : 'text-gray-400 dark:text-zinc-500'}>
          {selected?.label ?? placeholder ?? 'Select…'}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 text-gray-400 dark:text-zinc-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-zinc-700 dark:bg-zinc-800 animate-fade-in">
          {options.map(o => (
            <button
              key={o.value}
              type="button"
              onClick={() => { onChange(o.value); setOpen(false) }}
              className={`flex w-full items-center px-3 py-2 text-left text-sm transition-colors ${
                o.value === value
                  ? 'font-medium text-gray-900 dark:text-gray-100'
                  : 'text-gray-500 dark:text-zinc-400'
              }`}
            >
              {o.value === value && (
                <span className="mr-2 h-1.5 w-1.5 rounded-full bg-gray-900 dark:bg-gray-100 shrink-0 inline-block" />
              )}
              <span className={o.value === value ? '' : 'ml-3.5'}>{o.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
