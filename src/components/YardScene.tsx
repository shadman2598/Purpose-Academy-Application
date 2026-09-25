export function YardScene({
  spots,
}: {
  spots: { id: string; label: string; x: number; y: number; on?: boolean; onClick: () => void }[];
}) {
  return (
    <div className="yard-scene">
      <svg viewBox="0 0 800 460" aria-hidden>
        <rect width="800" height="460" fill="var(--bg)" />
        <rect y="280" width="800" height="180" fill="var(--earth-deep)" />
        <rect x="80" y="90" width="220" height="190" fill="var(--panel-2)" />
        <polygon points="60,90 190,20 320,90" fill="var(--bg-raise)" />
        <rect className="live-wink" x="110" y="120" width="28" height="22" fill="var(--amber)" />
        <rect className="live-wink d2" x="160" y="120" width="28" height="22" fill="var(--concrete)" />
        <rect className="live-wink d3" x="210" y="120" width="28" height="22" fill="var(--amber)" />
        <path d="M400 70h10v210h-10z" fill="var(--steel)" />
        <path d="M405 70h160" stroke="var(--steel)" strokeWidth="8" />
        <g className="live-hook">
          <path d="M560 70v30" stroke="var(--amber)" strokeWidth="3" />
          <rect x="548" y="100" width="22" height="12" fill="var(--amber)" />
        </g>
        <rect x="500" y="250" width="70" height="30" fill="var(--panel)" />
        <rect x="40" y="300" width="160" height="12" fill="var(--amber)" />
        <rect x="40" y="312" width="160" height="12" fill="var(--ink-strong)" />
      </svg>
      {spots.map((spot) => (
        <button
          key={spot.id}
          type="button"
          className={spot.on ? "yard-hot on" : "yard-hot"}
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          onClick={spot.onClick}
        >
          {spot.label}
        </button>
      ))}
    </div>
  );
}
