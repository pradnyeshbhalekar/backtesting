import { Sun, Moon, FlaskConical, Home } from 'lucide-react'
import Logo from './Logo'

interface Props {
  dark: boolean
  onToggle: () => void
  view: 'home' | 'backtest'
  onNav: (v: 'home' | 'backtest') => void
  onLogoClick: () => void
}

export default function Header({ dark, onToggle, view, onNav, onLogoClick }: Props) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-gray-200 bg-white/90 px-5 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/90">
      <button
        onClick={onLogoClick}
        className="group flex items-center gap-2.5 rounded-lg px-1 py-1 hover:opacity-90 transition-opacity"
        aria-label="Stratix home"
      >
        <Logo className="h-6 w-6 text-gray-900 dark:text-gray-100 group-hover:[&_.hdr-c1]:animate-[candle-rise_0.55s_cubic-bezier(0.22,1,0.36,1)_0.05s_both] group-hover:[&_.hdr-c2]:animate-[candle-rise_0.55s_cubic-bezier(0.22,1,0.36,1)_0.2s_both] group-hover:[&_.hdr-c3]:animate-[candle-rise_0.55s_cubic-bezier(0.22,1,0.36,1)_0.35s_both]" />
        <span className="text-sm font-semibold tracking-tight text-gray-900 dark:text-gray-100">Stratix</span>
      </button>

      <nav className="flex items-center gap-0.5">
        <button
          onClick={() => onNav('home')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            view === 'home'
              ? 'border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100'
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300'
          }`}
        >
          <Home className="h-3.5 w-3.5" />
          Home
        </button>
        <button
          onClick={() => onNav('backtest')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border-b-2 transition-colors ${
            view === 'backtest'
              ? 'border-gray-900 text-gray-900 dark:border-gray-100 dark:text-gray-100'
              : 'border-transparent text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-300'
          }`}
        >
          <FlaskConical className="h-3.5 w-3.5" />
          Backtest
        </button>
      </nav>

      <button
        onClick={onToggle}
        className="relative h-8 w-8 text-gray-400 hover:text-gray-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
        aria-label="Toggle theme"
      >
        <Sun
          className={`absolute inset-2 h-4 w-4 transition-all duration-300 ${
            dark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
          }`}
        />
        <Moon
          className={`absolute inset-2 h-4 w-4 transition-all duration-300 ${
            dark ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
      </button>
    </header>
  )
}
