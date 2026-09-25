export interface ShiftDef {
  number: number;
  title: string;
  moduleIds: string[];
  summary: string;
}

export const SHIFTS: ShiftDef[] = [
  { number: 1, title: "Orientation", moduleIds: ["orientation"], summary: "Sign in, learn the yard, and meet the crew." },
  { number: 2, title: "PPE", moduleIds: ["ppe"], summary: "Match the gear to the job." },
  { number: 3, title: "Hazards", moduleIds: ["hazards", "falls"], summary: "Spot hazards, then look at falls and ladders." },
  { number: 4, title: "Tools", moduleIds: ["tools"], summary: "Inspect the tool before it goes to work." },
  { number: 5, title: "WHMIS", moduleIds: ["whmis"], summary: "Pictogram, label, SDS, then a chemical decision." },
  { number: 6, title: "Communication", moduleIds: ["conduct", "report"], summary: "Talk it through, then write the report." },
  { number: 7, title: "Emergency", moduleIds: ["emergency"], summary: "Fire, injury, chemical, weather." },
  { number: 8, title: "Final challenge", moduleIds: ["shift"], summary: "One morning on Project Northstar. Answers wait for the debrief." },
];

export function shiftFor(moduleId: string): ShiftDef | undefined {
  return SHIFTS.find((shift) => shift.moduleIds.includes(moduleId));
}
