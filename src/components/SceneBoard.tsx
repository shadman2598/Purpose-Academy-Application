export interface SceneSpot {
  id: string;
  kind: string;
  x: number;
  y: number;
  done?: boolean;
  hint: string;
}

const HINTS: Record<string, string> = {
  cross: "Door with a green cross",
  exit: "Door with an exit sign",
  extinguisher: "Red extinguisher on a post",
  muster: "Assembly sign in the open",
  office: "Site office",
  board: "Board with hanging gear",
  restricted: "Red restricted sign",
  washroom: "Washroom door",
  lunch: "Break table",
  panel: "Open electrical cabinet",
  pallets: "Pallets against a door",
  cable: "Loose cable",
  saw: "Saw on a stand",
  stack: "Leaning stack of material",
  jug: "Plastic jug",
  worker: "Person at a grinder",
  ladder: "Ladder set up on the ground",
  edge: "Opening in the floor",
  truck: "Truck near a person",
  rebar: "Row of upright bars",
  scrap: "Offcuts on the ground",
  fuel: "Fuel can by a heater",
  scaffold: "Scaffold bay",
  cone: "Cones in a rack",
  cooler: "Water cooler",
  sign: "Signed walkway",
  drum: "Metal drum",
  spill: "Wet patch on the floor",
  binder: "Locked cabinet",
  cabinet: "Closed labelled cabinet",
  eyewash: "Eyewash station",
  hammer: "Hammer",
  drill: "Drill",
  cord: "Extension cord",
  grinder: "Grinder",
  puddle: "Tool sitting in water",
};

export function hintFor(kind: string): string {
  return HINTS[kind] ?? "Spot on the yard";
}

export function SceneBoard({
  scene,
  spots,
  onSpot,
  selected,
  onHover,
}: {
  scene: "gate" | "yard" | "cage" | "bench";
  spots: SceneSpot[];
  onSpot: (id: string) => void;
  selected?: string | null;
  onHover?: (id: string | null) => void;
}) {
  return (
    <div className="scene" role="group" aria-label="Illustrated yard" onMouseLeave={() => onHover?.(null)}>
      <svg className="backdrop" viewBox="0 0 800 500" aria-hidden>
        <rect width="800" height="500" fill={scene === "cage" ? "var(--bg)" : "var(--panel)"} />
        <rect y="300" width="800" height="200" fill="var(--earth-deep)" />
        <rect x="80" y="120" width="280" height="200" fill="var(--panel-2)" />
        <polygon points="70,120 220,40 370,120" fill="var(--bg)" />
        <rect x="430" y="160" width="250" height="160" fill="var(--panel-2)" />
        <rect className="live-wink" x="470" y="200" width="40" height="50" fill="var(--amber)" />
        <rect className="live-wink d2" x="540" y="200" width="40" height="50" fill="var(--concrete)" />
        <g className="live-hook">
          <path d="M620 80v70" stroke="var(--steel)" strokeWidth="6" />
          <rect x="608" y="148" width="24" height="12" fill="var(--amber)" />
        </g>
        {scene !== "bench" && <rect x="0" y="390" width="800" height="18" fill="var(--earth)" />}
        {scene === "bench" && <rect x="40" y="330" width="720" height="28" fill="var(--earth)" />}
      </svg>
      {spots.map((spot) => (
        <button
          key={spot.id}
          type="button"
          className={["hotspot", spot.done ? "done" : "", spot.id === selected ? "picked" : ""].filter(Boolean).join(" ")}
          style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
          aria-label={spot.hint}
          onMouseEnter={() => onHover?.(spot.id)}
          onFocus={() => onHover?.(spot.id)}
          onBlur={() => onHover?.(null)}
          onClick={() => onSpot(spot.id)}
        >
          <Mini kind={spot.kind} />
          <span className="spot-flag">{spot.hint}</span>
        </button>
      ))}
    </div>
  );
}

function Mini({ kind }: { kind: string }) {
  return (
    <svg className="live-mini" viewBox="0 0 24 24" aria-hidden>
      {kind === "cross" && <path d="M11 4h2v16h-2zM4 11h16v2H4z" fill="var(--ok)" />}
      {kind === "exit" && <path d="M6 4h8v16H6zM14 12h6M17 9l3 3-3 3" fill="none" stroke="var(--ink)" strokeWidth="1.6" />}
      {kind === "extinguisher" && <rect x="9" y="5" width="6" height="14" rx="2" fill="var(--danger)" />}
      {kind === "muster" && <circle cx="12" cy="12" r="6" fill="none" stroke="var(--amber)" strokeWidth="2" />}
      {kind === "restricted" && <path d="M5 17L19 7" stroke="var(--danger)" strokeWidth="2" />}
      {(kind === "jug" || kind === "fuel") && <path d="M9 7h6l-1 12H10z" fill="none" stroke="var(--ink)" strokeWidth="1.6" />}
      {kind === "spill" && <ellipse cx="12" cy="14" rx="7" ry="3" fill="var(--steel)" />}
      {!["cross", "exit", "extinguisher", "muster", "restricted", "jug", "fuel", "spill"].includes(kind) && (
        <circle cx="12" cy="12" r="3" fill="var(--ink)" />
      )}
    </svg>
  );
}
