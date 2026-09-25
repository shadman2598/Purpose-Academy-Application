/** A crew at work. Each person has a job that repeats. */
export function CrewSite() {
  return (
    <svg className="crew-site" viewBox="0 0 760 320" role="img" aria-label="A construction crew working: hammering, carrying lumber, lifting a beam, and hoisting a load.">
      <rect width="760" height="320" fill="var(--bg)" />
      <g className="live-sun">
        <circle cx="86" cy="52" r="22" fill="var(--amber)" />
      </g>
      <rect y="228" width="760" height="92" fill="var(--earth-deep)" />
      <rect x="36" y="78" width="8" height="150" fill="var(--steel)" />
      <rect x="118" y="78" width="8" height="150" fill="var(--steel)" />
      <rect x="200" y="78" width="8" height="150" fill="var(--steel)" />
      <rect x="36" y="78" width="172" height="8" fill="var(--steel)" />
      <rect x="36" y="148" width="172" height="6" fill="var(--panel-2)" />
      <rect className="live-wink" x="58" y="96" width="28" height="22" fill="var(--amber)" />
      <rect className="live-wink d2" x="148" y="96" width="28" height="22" fill="var(--concrete)" />

      <g transform="translate(168 96)">
        <rect x="0" y="0" width="6" height="132" fill="var(--steel)" />
        <rect x="22" y="0" width="6" height="132" fill="var(--steel)" />
        <rect y="24" width="28" height="4" fill="var(--amber)" />
        <rect y="52" width="28" height="4" fill="var(--amber)" />
        <rect y="80" width="28" height="4" fill="var(--amber)" />
        <g transform="translate(4 36)">
          <circle cx="14" cy="8" r="7" fill="var(--concrete)" />
          <path d="M6 16h16l2 16H4z" fill="var(--amber)" />
          <g className="crew-reach">
            <rect x="16" y="6" width="18" height="5" rx="1" fill="var(--earth)" />
          </g>
        </g>
      </g>

      <g transform="translate(48 150)">
        <circle cx="22" cy="14" r="10" fill="var(--concrete)" />
        <path d="M8 26h28l4 28H4z" fill="var(--amber)" />
        <g className="crew-leg">
          <rect x="10" y="52" width="7" height="26" rx="2" fill="var(--earth)" />
        </g>
        <g className="crew-leg back">
          <rect x="24" y="52" width="7" height="26" rx="2" fill="var(--earth)" />
        </g>
        <g transform="translate(34 34)">
          <g className="crew-hammer">
            <rect x="-3" y="0" width="6" height="34" rx="2" fill="var(--earth-deep)" />
            <rect x="-12" y="30" width="26" height="8" rx="1" fill="var(--ink-strong)" />
          </g>
        </g>
        <circle className="crew-spark" cx="58" cy="78" r="4" fill="var(--amber)" />
      </g>

      <g transform="translate(250 158)">
        <g className="crew-walk">
          <rect x="4" y="-16" width="46" height="8" rx="2" fill="var(--earth)" />
          <circle cx="24" cy="8" r="9" fill="var(--concrete)" />
          <path d="M12 18h24l3 24H9z" fill="var(--ok)" />
          <g className="crew-leg">
            <rect x="14" y="40" width="6" height="24" rx="2" fill="var(--earth)" />
          </g>
          <g className="crew-leg back">
            <rect x="26" y="40" width="6" height="24" rx="2" fill="var(--earth)" />
          </g>
        </g>
      </g>

      <g transform="translate(430 168)">
        <circle cx="16" cy="10" r="8" fill="var(--concrete)" />
        <path d="M6 20h20l2 22H4z" fill="var(--amber)" />
        <g className="crew-leg">
          <rect x="8" y="40" width="6" height="20" rx="2" fill="var(--earth)" />
        </g>
        <g className="crew-leg back">
          <rect x="18" y="40" width="6" height="20" rx="2" fill="var(--earth)" />
        </g>
        <g transform="translate(78 0)">
          <circle cx="16" cy="10" r="8" fill="var(--concrete)" />
          <path d="M6 20h20l2 22H4z" fill="var(--ok)" />
          <g className="crew-leg">
            <rect x="8" y="40" width="6" height="20" rx="2" fill="var(--earth)" />
          </g>
          <g className="crew-leg back">
            <rect x="18" y="40" width="6" height="20" rx="2" fill="var(--earth)" />
          </g>
        </g>
        <g className="crew-beam">
          <rect x="18" y="4" width="74" height="10" rx="2" fill="var(--steel)" />
          <rect x="20" y="14" width="6" height="16" fill="var(--earth-deep)" />
          <rect x="84" y="14" width="6" height="16" fill="var(--earth-deep)" />
        </g>
      </g>

      <g transform="translate(620 36)">
        <rect width="10" height="192" fill="var(--steel)" />
        <rect y="8" width="92" height="8" fill="var(--steel)" />
        <g className="crew-hoist">
          <rect x="78" y="8" width="3" height="46" fill="var(--amber)" />
          <rect x="64" y="52" width="32" height="16" rx="2" fill="var(--earth)" />
        </g>
      </g>
    </svg>
  );
}
