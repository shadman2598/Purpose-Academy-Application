export function Pictogram({ glyph, label }: { glyph: string; label?: string }) {
  return (
    <span className={`picto picto-${glyph}`} role="img" aria-label={label ?? glyph}>
      <Glyph name={glyph} />
    </span>
  );
}

function Glyph({ name }: { name: string }) {
  const common = { fill: "none", stroke: "var(--ink-strong)", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (name === "flame") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path {...common} d="M24 6c2 8-6 10-6 18a10 10 0 0 0 20 0c0-8-6-8-4-16-6 4-8 6-10-2z" />
      </svg>
    );
  }
  if (name === "flame-circle") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle {...common} cx="24" cy="30" r="8" />
        <path {...common} d="M24 8c1 5-4 6-4 11 4-2 8-1 8 4" />
      </svg>
    );
  }
  if (name === "bomb") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle {...common} cx="22" cy="28" r="10" />
        <path {...common} d="M30 18l8-8M34 8h6v6" />
      </svg>
    );
  }
  if (name === "corrosion") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path {...common} d="M16 8h6l-4 14h8L18 40" />
        <path {...common} d="M30 34c4 4 8 4 10 0" />
      </svg>
    );
  }
  if (name === "cylinder") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <rect {...common} x="16" y="10" width="16" height="26" rx="6" />
        <path {...common} d="M22 10V6h4" />
      </svg>
    );
  }
  if (name === "skull") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <circle {...common} cx="24" cy="20" r="10" />
        <path {...common} d="M18 32h12M20 28v6M28 28v6M20 20h.1M28 20h.1" />
      </svg>
    );
  }
  if (name === "health") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path {...common} d="M24 40s-12-8-12-16a6 6 0 0 1 12-2 6 6 0 0 1 12 2c0 8-12 16-12 16z" />
      </svg>
    );
  }
  if (name === "exclamation") {
    return (
      <svg viewBox="0 0 48 48" aria-hidden>
        <path {...common} d="M24 10v16" />
        <path {...common} d="M24 34h.1" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" aria-hidden>
      <circle {...common} cx="24" cy="24" r="8" />
      <circle {...common} cx="24" cy="24" r="3" />
    </svg>
  );
}
