import { Sun, Moon, TrendingUp } from 'lucide-react'

interface Props {
  dark: boolean
  onToggle: () => void
}

export default function Header({ dark, onToggle }: Props) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-blue-600" />
        <span className="font-semibold text-gray-900 dark:text-gray-100">Qode Backtest</span>
      </div>
      <button
        onClick={onToggle}
        className="rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-100"
        aria-label="Toggle theme"
      >
        {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
      </button>
    </header>
  )
}
