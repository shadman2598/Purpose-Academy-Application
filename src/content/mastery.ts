import { tallies, type SaveState } from "../state/progress";

export type Readiness = "strong" | "practice" | "open";

export interface ReadinessRow {
  id: string;
  label: string;
  moduleId: string;
  dimension: "knowledge" | "hazard" | "decision" | "communication";
  status: Readiness;
}

const ROWS: Omit<ReadinessRow, "status">[] = [
  { id: "ppe", label: "PPE", moduleId: "ppe", dimension: "decision" },
  { id: "whmis", label: "WHMIS", moduleId: "whmis", dimension: "knowledge" },
  { id: "hazard", label: "Hazard recognition", moduleId: "hazards", dimension: "hazard" },
  { id: "emergency", label: "Emergency response", moduleId: "emergency", dimension: "decision" },
  { id: "falls", label: "Fall protection", moduleId: "falls", dimension: "decision" },
  { id: "communication", label: "Workplace communication", moduleId: "conduct", dimension: "communication" },
];

export function readinessLabel(status: Readiness): string {
  if (status === "strong") return "Strong";
  if (status === "practice") return "Needs practice";
  return "Not completed";
}

export function siteReadiness(state: SaveState): ReadinessRow[] {
  return ROWS.map((row) => {
    const save = state.modules[row.moduleId];
    const started = Boolean(save && (save.completed || save.blockDone.length > 0 || Object.keys(save.answered).length > 0));
    if (!started) return { ...row, status: "open" };
    const tally = tallies(state, row.moduleId)[row.dimension];
    const ratio = tally.total ? tally.correct / tally.total : 1;
    if (save?.completed && ratio >= 0.8) return { ...row, status: "strong" };
    return { ...row, status: "practice" };
  });
}
