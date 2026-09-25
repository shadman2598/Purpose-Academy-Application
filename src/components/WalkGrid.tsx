import { useEffect, useLayoutEffect, useRef, useState } from "react";

export interface WalkCell {
  id: string;
  label: string;
  col: number;
  row: number;
}

export function neighborsOf<T extends WalkCell>(cells: T[], id: string): T[] {
  const here = cells.find((cell) => cell.id === id);
  if (!here) return [];
  return cells.filter((cell) => Math.abs(cell.col - here.col) + Math.abs(cell.row - here.row) === 1);
}

type Link = { id: string; x1: number; y1: number; x2: number; y2: number };

export function WalkGrid({
  cells,
  here,
  onWalk,
  caption,
}: {
  cells: WalkCell[];
  here: string;
  onWalk: (id: string) => void;
  caption: string;
}) {
  const cols = Math.max(...cells.map((cell) => cell.col)) + 1;
  const next = neighborsOf(cells, here);
  const spot = cells.find((cell) => cell.id === here);
  const stageRef = useRef<HTMLDivElement>(null);
  const figureRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<Record<string, HTMLElement | null>>({});
  const lock = useRef(false);
  const [links, setLinks] = useState<Link[]>([]);
  const [tripId, setTripId] = useState<string | null>(null);
  const [faceLeft, setFaceLeft] = useState(false);

  function boxOf() {
    return stageRef.current?.getBoundingClientRect() ?? null;
  }

  function standOf(id: string) {
    const stage = boxOf();
    const cell = cellRefs.current[id]?.getBoundingClientRect();
    if (!stage || !cell) return null;
    return {
      x: cell.left + cell.width / 2 - stage.left,
      y: cell.bottom - 10 - stage.top,
    };
  }

  function readLinks(): Link[] {
    const stage = boxOf();
    const origin = cellRefs.current[here]?.getBoundingClientRect();
    if (!stage || !origin) return [];
    return neighborsOf(cells, here).flatMap((cell) => {
      const dest = cellRefs.current[cell.id]?.getBoundingClientRect();
      if (!dest) return [];
      const gap = gapBetween(origin, dest, stage);
      return [{ id: cell.id, ...gap }];
    });
  }

  function measure() {
    setLinks(readLinks());
    if (lock.current || !figureRef.current) return;
    const spotCenter = standOf(here);
    if (!spotCenter) return;
    figureRef.current.style.left = `${spotCenter.x}px`;
    figureRef.current.style.top = `${spotCenter.y}px`;
  }

  useLayoutEffect(() => {
    measure();
  }, [here, cells, tripId]);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const watcher = new ResizeObserver(() => measure());
    watcher.observe(stage);
    return () => watcher.disconnect();
  }, [here, cells]);

  function walk(id: string) {
    if (lock.current || id === here) return;
    const from = standOf(here);
    const to = standOf(id);
    const reduce = document.documentElement.dataset.motion === "reduce";
    if (!from || !to || reduce) {
      onWalk(id);
      return;
    }
    const figure = figureRef.current;
    if (!figure) {
      onWalk(id);
      return;
    }
    lock.current = true;
    setTripId(id);
    setFaceLeft(to.x < from.x);
    figure.getAnimations().forEach((item) => item.cancel());
    const motion = figure.animate(
      [
        { left: `${from.x}px`, top: `${from.y}px` },
        { left: `${to.x}px`, top: `${to.y}px` },
      ],
      { duration: 880, easing: "ease-in-out", fill: "forwards" },
    );
    const finish = () => {
      if (!lock.current) return;
      lock.current = false;
      motion.onfinish = null;
      figure.getAnimations().forEach((item) => item.cancel());
      setTripId(null);
      onWalk(id);
    };
    motion.onfinish = finish;
    window.setTimeout(finish, 1100);
  }

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA")) return;
      const key: Record<string, [number, number]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
      };
      const delta = key[event.key];
      if (!delta || !spot) return;
      const found = cells.find((cell) => cell.col === spot.col + delta[0] && cell.row === spot.row + delta[1]);
      if (!found) return;
      event.preventDefault();
      walk(found.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cells, here, spot]);

  const heading = tripId ? next.find((cell) => cell.id === tripId)?.label : null;

  return (
    <div className="stack">
      <p className="muted">{caption} The line is the path. Press Walk and the figure follows it. A place works only while you are standing in it.</p>
      <div className="walk-stage" ref={stageRef}>
        <div className="walk-map" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="group" aria-label="Places you can walk">
          {cells.map((cell) => {
            const standing = cell.id === here && !tripId;
            const near = next.some((item) => item.id === cell.id);
            const arriving = cell.id === tripId;
            const className = standing || arriving ? "walk-cell here" : near ? "walk-cell near" : "walk-cell far";
            const body = (
              <>
                <PlaceMark id={cell.id} />
                <span className="walk-name">{cell.label}</span>
              </>
            );
            if (near) {
              return (
                <button
                  key={cell.id}
                  type="button"
                  ref={(node) => {
                    cellRefs.current[cell.id] = node;
                  }}
                  className={className}
                  style={{ gridColumn: cell.col + 1, gridRow: cell.row + 1 }}
                  disabled={Boolean(tripId)}
                  onClick={() => walk(cell.id)}
                >
                  {body}
                </button>
              );
            }
            return (
              <div
                key={cell.id}
                ref={(node) => {
                  cellRefs.current[cell.id] = node;
                }}
                className={className}
                style={{ gridColumn: cell.col + 1, gridRow: cell.row + 1 }}
              >
                {body}
              </div>
            );
          })}
        </div>
        <svg className="walk-overlay" aria-hidden>
          {links.map((link) => (
            <line
              key={link.id}
              x1={link.x1}
              y1={link.y1}
              x2={link.x2}
              y2={link.y2}
              className={link.id === tripId ? "walk-link on" : "walk-link"}
            />
          ))}
        </svg>
        <div ref={figureRef} className={tripId ? "walk-figure going" : "walk-figure"} aria-hidden>
          <Walker faceLeft={faceLeft} />
        </div>
      </div>
      <p className="muted" aria-live="polite">
        {heading ? `Walking to ${heading}.` : "Standing here. A neighbour is one step along the line."}
      </p>
      <div className="row">
        {next.map((cell) => (
          <button key={cell.id} type="button" className="btn btn-primary" disabled={Boolean(tripId)} onClick={() => walk(cell.id)}>
            Walk to {cell.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function gapBetween(from: DOMRect, to: DOMRect, stage: DOMRect) {
  const dx = to.left + to.width / 2 - (from.left + from.width / 2);
  const dy = to.top + to.height / 2 - (from.top + from.height / 2);
  if (Math.abs(dx) >= Math.abs(dy)) {
    const y1 = from.top + from.height / 2 - stage.top;
    const y2 = to.top + to.height / 2 - stage.top;
    if (dx > 0) return { x1: from.right - stage.left, y1, x2: to.left - stage.left, y2 };
    return { x1: from.left - stage.left, y1, x2: to.right - stage.left, y2 };
  }
  const x1 = from.left + from.width / 2 - stage.left;
  const x2 = to.left + to.width / 2 - stage.left;
  if (dy > 0) return { x1, y1: from.bottom - stage.top, x2, y2: to.top - stage.top };
  return { x1, y1: from.top - stage.top, x2, y2: to.bottom - stage.top };
}

function Walker({ faceLeft }: { faceLeft: boolean }) {
  return (
    <svg className={faceLeft ? "walk-person left" : "walk-person"} viewBox="0 0 36 52">
      <ellipse className="live-shadow" cx="18" cy="49" rx="10" ry="3" fill="var(--ink-strong)" />
      <circle cx="18" cy="12" r="8" fill="var(--concrete)" />
      <rect x="10" y="21" width="16" height="16" rx="4" fill="var(--amber)" />
      <g className="walk-legs">
        <rect className="a" x="11" y="36" width="5" height="12" rx="2" fill="var(--ink-strong)" />
        <rect className="b" x="20" y="36" width="5" height="12" rx="2" fill="var(--ink-strong)" />
      </g>
    </svg>
  );
}

function PlaceMark({ id }: { id: string }) {
  return (
    <svg className="place-mark" viewBox="0 0 64 36" aria-hidden>
      {id === "office" && (
        <>
          <rect x="8" y="6" width="48" height="26" rx="3" fill="var(--panel-2)" />
          <text x="32" y="16" textAnchor="middle" fill="var(--amber)" fontSize="8" fontFamily="Barlow Condensed, sans-serif">BOARD</text>
          <rect x="14" y="20" width="22" height="3" fill="var(--muted)" />
          <rect className="live-wink" x="14" y="26" width="16" height="3" fill="var(--ok)" />
        </>
      )}
      {id === "building" && (
        <>
          <rect x="14" y="8" width="36" height="24" fill="var(--panel-2)" />
          <polygon points="10,10 32,2 54,10" fill="var(--earth)" />
          <rect className="live-wink" x="22" y="16" width="8" height="8" fill="var(--amber)" />
          <rect x="34" y="16" width="8" height="8" fill="var(--concrete)" />
        </>
      )}
      {id === "ladder" && (
        <>
          <rect x="22" y="2" width="4" height="32" fill="var(--steel)" />
          <rect x="38" y="2" width="4" height="32" fill="var(--steel)" />
          <rect className="live-float" x="22" y="10" width="20" height="3" fill="var(--amber)" />
          <rect x="22" y="20" width="20" height="3" fill="var(--amber)" />
          <rect x="22" y="30" width="20" height="3" fill="var(--amber)" />
        </>
      )}
      {id === "electrical" && (
        <path className="live-wink" d="M34 2 L22 20h10L28 34l16-20H32z" fill="var(--amber)" />
      )}
      {id === "tools" && (
        <>
          <path d="M8 28 C 20 8, 36 8, 44 20" fill="none" stroke="var(--danger)" strokeWidth="4" />
          <rect className="live-float" x="40" y="8" width="16" height="8" rx="2" fill="var(--steel)" />
        </>
      )}
      {id === "chemical" && (
        <>
          <rect x="22" y="6" width="20" height="26" rx="4" fill="var(--panel-2)" stroke="var(--steel)" />
          <rect x="22" y="6" width="20" height="6" rx="3" fill="var(--steel)" />
          <rect className="live-wink" x="26" y="16" width="12" height="10" fill="var(--danger)" />
        </>
      )}
      {id === "excavation" && (
        <>
          <path d="M6 14h52l-8 18H14z" fill="var(--earth-deep)" />
          <path className="live-wink" d="M18 14l6 18M32 14l4 18M46 14l-4 18" stroke="var(--amber)" strokeWidth="2" />
        </>
      )}
      {id === "equipment" && (
        <>
          <rect x="8" y="16" width="36" height="14" rx="3" fill="var(--steel)" />
          <circle cx="18" cy="30" r="4" fill="var(--ink-strong)" />
          <circle cx="36" cy="30" r="4" fill="var(--ink-strong)" />
          <rect className="live-float" x="40" y="6" width="6" height="14" fill="var(--amber)" />
        </>
      )}
      {id === "emergency" && (
        <>
          <circle className="live-pulse" cx="32" cy="18" r="12" fill="var(--danger)" />
          <rect x="29" y="10" width="6" height="16" fill="var(--ink)" />
        </>
      )}
      {id === "firstaid" && (
        <>
          <rect x="14" y="6" width="36" height="26" rx="4" fill="var(--ink)" />
          <rect x="28" y="10" width="8" height="18" fill="var(--danger)" />
          <rect x="22" y="16" width="20" height="6" fill="var(--danger)" />
        </>
      )}
      {id === "door" && (
        <>
          <rect x="18" y="2" width="28" height="32" rx="2" fill="var(--panel-2)" />
          <circle className="live-wink" cx="40" cy="18" r="2" fill="var(--amber)" />
        </>
      )}
      {id === "label" && (
        <>
          <rect x="12" y="4" width="40" height="28" rx="2" fill="var(--ink)" />
          <rect x="18" y="10" width="20" height="4" fill="var(--amber)" />
          <rect className="live-wink" x="18" y="18" width="28" height="3" fill="var(--muted)" />
          <rect x="18" y="24" width="22" height="3" fill="var(--muted)" />
        </>
      )}
      {id === "marks" && <path className="live-pulse" d="M32 2l14 14-14 18L18 16z" fill="var(--danger)" />}
      {id === "binder" && (
        <>
          <rect x="16" y="4" width="32" height="28" rx="2" fill="var(--panel-2)" />
          <rect x="14" y="4" width="6" height="28" fill="var(--amber)" />
          <rect className="live-wink" x="26" y="12" width="16" height="3" fill="var(--muted)" />
        </>
      )}
      {id === "shelf" && (
        <>
          <rect x="10" y="8" width="44" height="4" fill="var(--earth)" />
          <rect x="10" y="20" width="44" height="4" fill="var(--earth)" />
          <rect className="live-float" x="18" y="10" width="10" height="10" rx="2" fill="var(--amber)" />
          <rect x="34" y="22" width="10" height="8" rx="2" fill="var(--steel)" />
        </>
      )}
      {id === "bench" && (
        <>
          <rect x="8" y="16" width="48" height="6" fill="var(--earth)" />
          <rect x="14" y="22" width="4" height="10" fill="var(--earth-deep)" />
          <rect x="46" y="22" width="4" height="10" fill="var(--earth-deep)" />
          <rect className="live-wink" x="24" y="6" width="14" height="10" rx="2" fill="var(--panel-2)" />
        </>
      )}
      {id === "spill" && (
        <>
          <rect x="16" y="4" width="14" height="20" rx="3" fill="var(--amber)" transform="rotate(18 23 14)" />
          <ellipse className="live-pulse" cx="40" cy="28" rx="14" ry="5" fill="var(--steel)" />
        </>
      )}
      {!KNOWN.has(id) && <circle className="live-pulse" cx="32" cy="18" r="8" fill="var(--amber)" />}
    </svg>
  );
}

const KNOWN = new Set([
  "office",
  "building",
  "ladder",
  "electrical",
  "tools",
  "chemical",
  "excavation",
  "equipment",
  "emergency",
  "firstaid",
  "door",
  "label",
  "marks",
  "binder",
  "shelf",
  "bench",
  "spill",
]);
