/** The fall scene reacts to the control you try. The drawing is the feedback. */
export function LadderSim({ action }: { action: string | null }) {
  const coverOn = action === "cover";
  const bent = action === "mud" || action === "two";
  const held = action === "two";
  const stair = action === "stair";
  const clip = action === "harness";
  const warn = action === "careful";
  const dim = action === "light";

  return (
    <svg className="sim-art" viewBox="0 0 640 420" role="img" aria-label="An opening in the floor, a cover, and a ladder">
      <rect width="640" height="420" fill="var(--panel)" />
      <rect y="250" width="640" height="170" fill="var(--earth-deep)" />
      {dim && <rect width="640" height="420" fill="var(--ink-strong)" opacity="0.45" />}
      <rect x="70" y="188" width="150" height="62" fill="var(--bg)" />
      <rect className={action === "opening" ? "live-wink" : undefined} x="78" y="196" width="134" height="46" fill="var(--ink-strong)" />
      <g transform={coverOn ? "translate(78 188)" : "translate(250 210)"}>
        <rect width="134" height="16" rx="2" fill="var(--amber)" />
        <path d="M8 4h118" stroke="var(--ink-strong)" strokeWidth="2" />
      </g>
      {warn && (
        <g className="live-float">
          <rect x="250" y="150" width="70" height="36" rx="4" fill="var(--amber)" />
          <path d="M268 158h34M268 168h28" stroke="var(--ink-strong)" strokeWidth="2" />
        </g>
      )}
      {clip && (
        <g>
          <path d="M520 80v90" stroke="var(--steel)" strokeWidth="6" />
          <path d="M400 210 Q460 120 520 100" fill="none" stroke="var(--amber)" strokeWidth="3" />
        </g>
      )}
      <g className={stair ? "sim-dim" : undefined}>
        <rect x="430" y="120" width="10" height="150" fill="var(--steel)" />
        <rect x="470" y="120" width="10" height="150" fill="var(--steel)" />
        {bent ? (
          <path d="M430 170h50" stroke="var(--danger)" strokeWidth="6" />
        ) : (
          <>
            <rect x="430" y="150" width="50" height="5" fill="var(--amber)" />
            <rect x="430" y="180" width="50" height="5" fill="var(--amber)" />
            <rect x="430" y="210" width="50" height="5" fill="var(--amber)" />
          </>
        )}
      </g>
      {stair && (
        <g className="live-wink">
          <path d="M250 250h28v-18h28v-18h28v-18h28" fill="none" stroke="var(--ok)" strokeWidth="6" />
        </g>
      )}
      {stair && <path d="M420 130l70 130M490 130l-70 130" stroke="var(--danger)" strokeWidth="6" />}
      <g className="live-worker">
        <circle cx="390" cy="200" r="14" fill="var(--concrete)" />
        <path d="M376 214h28l4 28h-36z" fill="var(--amber)" />
      </g>
      {held && (
        <g className="live-worker">
          <circle cx="520" cy="210" r="12" fill="var(--concrete)" />
          <path d="M508 222h24l3 24h-30z" fill="var(--ok)" />
        </g>
      )}
      {action === "boots" && <ellipse cx="120" cy="300" rx="28" ry="10" fill="var(--earth)" />}
      {action === "hands" && (
        <g>
          <rect x="250" y="300" width="90" height="28" rx="6" fill="var(--panel-2)" />
          <rect x="350" y="300" width="90" height="28" rx="6" fill="var(--panel-2)" />
          <rect x="450" y="300" width="90" height="28" rx="6" fill="var(--panel-2)" />
        </g>
      )}
      {action === "badge" && <circle className="live-diamond" cx="320" cy="120" r="28" fill="var(--amber)" />}
      {action === "video" && <rect x="260" y="90" width="120" height="72" rx="6" fill="var(--bg-raise)" />}
    </svg>
  );
}
