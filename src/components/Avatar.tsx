import { GEAR } from "../content/gear";

export function Avatar({ equipped }: { equipped: string[] }) {
  const has = (id: string) => equipped.includes(id);
  const eyes = has("goggles") || has("glasses");
  return (
    <svg className="avatar" viewBox="0 0 120 180" role="img" aria-label="Your worker">
      <ellipse className="live-shadow" cx="60" cy="168" rx="28" ry="6" fill="var(--ink-strong)" opacity="0.35" />
      <g className="live-worker">
      <rect x="46" y="78" width="28" height="52" rx="8" fill={has("clothes") ? "var(--ok-deep)" : "var(--panel-2)"} />
      {has("vest") && <path d="M48 80h24l6 18H42z" fill="var(--amber)" />}
      <circle cx="60" cy="48" r="16" fill="var(--earth)" />
      {has("hardhat") && <path d="M40 44h40c-2 12-10 16-20 16S42 56 40 44z" fill="var(--amber)" />}
      {eyes && <rect x="50" y="46" width="20" height="6" rx="2" fill="var(--steel)" />}
      {has("respirator") && <rect x="52" y="54" width="16" height="10" rx="3" fill="var(--concrete)" />}
      {has("ear") && (
        <>
          <rect x="40" y="46" width="6" height="10" rx="2" fill="var(--ok)" />
          <rect x="74" y="46" width="6" height="10" rx="2" fill="var(--ok)" />
        </>
      )}
      {has("gloves") && (
        <>
          <rect x="36" y="96" width="8" height="12" rx="2" fill="var(--earth)" />
          <rect x="76" y="96" width="8" height="12" rx="2" fill="var(--earth)" />
        </>
      )}
      <g className="live-leg">
        <rect x="48" y="128" width="10" height="28" rx="3" fill="var(--earth-deep)" />
        {has("boots") && <rect x="46" y="148" width="14" height="10" rx="2" fill="var(--ink-strong)" />}
      </g>
      <g className="live-leg back">
        <rect x="62" y="128" width="10" height="28" rx="3" fill="var(--earth-deep)" />
        {has("boots") && <rect x="60" y="148" width="14" height="10" rx="2" fill="var(--ink-strong)" />}
      </g>
      {has("belt") && <rect x="46" y="118" width="28" height="6" fill="var(--earth)" />}
      {has("radio") && <rect x="78" y="108" width="10" height="16" rx="2" fill="var(--ink-strong)" />}
      </g>
      <title>{GEAR.filter((item) => has(item.id)).map((item) => item.name).join(", ") || "No gear yet"}</title>
    </svg>
  );
}
