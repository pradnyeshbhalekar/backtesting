interface Props {
  className?: string
}

export default function Logo({ className = '' }: Props) {
  return (
    <svg
      viewBox="0 0 36 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Stratix"
    >
      {/* Candle 1 — short */}
      <line x1="7" y1="7" x2="7" y2="11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />
      <rect x="4" y="11" width="6" height="12" rx="1.5" fill="currentColor" opacity="0.35"
        className="hdr-c1" style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <line x1="7" y1="23" x2="7" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.35" />

      {/* Candle 2 — medium */}
      <line x1="18" y1="4" x2="18" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />
      <rect x="15" y="9" width="6" height="14" rx="1.5" fill="currentColor" opacity="0.65"
        className="hdr-c2" style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <line x1="18" y1="23" x2="18" y2="27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.65" />

      {/* Candle 3 — tall */}
      <line x1="29" y1="2" x2="29" y2="6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="26" y="6" width="6" height="18" rx="1.5" fill="currentColor"
        className="hdr-c3" style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }} />
      <line x1="29" y1="24" x2="29" y2="28" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}
