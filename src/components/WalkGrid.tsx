import { useEffect } from "react";

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
      onWalk(found.id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [cells, onWalk, spot]);

  return (
    <div className="stack">
      <p className="muted">{caption} Arrow keys walk too. You can use a place only when you are standing in it.</p>
      <div className="walk-map" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }} role="group" aria-label="Yard you can walk">
        {cells.map((cell) => {
          const standing = cell.id === here;
          const near = next.some((item) => item.id === cell.id);
          return (
            <div key={cell.id} className={standing ? "walk-cell here" : near ? "walk-cell near" : "walk-cell far"} style={{ gridColumn: cell.col + 1, gridRow: cell.row + 1 }}>
              <span className="walk-name">{cell.label}</span>
              {standing && <strong className="walk-you">You</strong>}
            </div>
          );
        })}
      </div>
      <div className="row">
        {next.map((cell) => (
          <button key={cell.id} type="button" className="btn btn-primary" onClick={() => onWalk(cell.id)}>
            Walk to {cell.label}
          </button>
        ))}
      </div>
    </div>
  );
}
