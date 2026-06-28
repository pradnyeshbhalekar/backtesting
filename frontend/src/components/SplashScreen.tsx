import { useEffect, useState } from 'react'

interface Props {
  onDone: () => void
}

export default function SplashScreen({ onDone }: Props) {
  const [out, setOut] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setOut(true), 1600)
    const t2 = setTimeout(() => onDone(), 2000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [onDone])

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-zinc-900 transition-opacity duration-500 ${
        out ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        {/* Candlestick logo — each candle rises from bottom */}
        <svg
          viewBox="0 0 36 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-20 w-20 text-gray-900 dark:text-gray-100 overflow-visible"
        >
          {/* Candle 1 */}
          <line x1="7" y1="7" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" className="splash-wick-1" />
          <rect x="4" y="11" width="6" height="12" rx="1.5" fill="currentColor" opacity="0.35" className="splash-candle-1" />
          <line x1="7" y1="23" x2="7" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" className="splash-wick-1" />

          {/* Candle 2 */}
          <line x1="18" y1="4" x2="18" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" className="splash-wick-2" />
          <rect x="15" y="9" width="6" height="14" rx="1.5" fill="currentColor" opacity="0.65" className="splash-candle-2" />
          <line x1="18" y1="23" x2="18" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" className="splash-wick-2" />

          {/* Candle 3 */}
          <line x1="29" y1="2" x2="29" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="splash-wick-3" />
          <rect x="26" y="6" width="6" height="18" rx="1.5" fill="currentColor" className="splash-candle-3" />
          <line x1="29" y1="24" x2="29" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="splash-wick-3" />
        </svg>

        {/* Wordmark */}
        <div className="splash-wordmark text-center">
          <p className="text-4xl font-bold tracking-tight text-gray-900 dark:text-gray-100">Stratix</p>
        </div>

        {/* Tagline */}
        <p className="text-sm font-medium text-gray-400 dark:text-zinc-500 splash-tagline tracking-wide">
          Strategy, tested.
        </p>
      </div>
    </div>
  )
}
