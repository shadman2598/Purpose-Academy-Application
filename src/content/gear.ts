export interface GearItem {
  id: string;
  name: string;
  slot: "head" | "eyes" | "ears" | "body" | "hands" | "feet" | "belt" | "radio" | "mask";
  unlock: string;
  lesson: string;
}

export const GEAR: GearItem[] = [
  { id: "hardhat", name: "Hard hat", slot: "head", unlock: "orientation", lesson: "Keeps a falling object off your skull. It does not replace a guardrail." },
  { id: "glasses", name: "Safety glasses", slot: "eyes", unlock: "ppe", lesson: "For flying chips. A concrete cut wants goggles or a face shield, not street sunglasses." },
  { id: "goggles", name: "Goggles", slot: "eyes", unlock: "ppe", lesson: "Seal around the eyes when dust or splash is the hazard." },
  { id: "ear", name: "Hearing protection", slot: "ears", unlock: "ppe", lesson: "For the noise of the saw. It does not let you ignore a backup alarm you can no longer hear. Look." },
  { id: "vest", name: "High-visibility vest", slot: "body", unlock: "orientation", lesson: "So operators can see you. It is not fall protection." },
  { id: "gloves", name: "Work gloves", slot: "hands", unlock: "tools", lesson: "Match the glove to the task. A chemical transfer wants a chemical glove, not a cotton one." },
  { id: "boots", name: "Safety boots", slot: "feet", unlock: "ppe", lesson: "For the puncture and crush hazards on the ground." },
  { id: "belt", name: "Tool belt", slot: "belt", unlock: "tools", lesson: "Keeps a tool off the ladder tread. It is not a harness." },
  { id: "radio", name: "Site radio", slot: "radio", unlock: "conduct", lesson: "For a clear call. Repeat back what you heard before you move." },
  { id: "clothes", name: "Work clothing", slot: "body", unlock: "shift", lesson: "Fitted clothing that will not catch a drill. It is not PPE by itself." },
  { id: "respirator", name: "Respirator", slot: "mask", unlock: "ppe", lesson: "For dust or vapour the task creates. Concrete cutting can put hazardous dust in the air." },
];

export function gearUnlocked(id: string, completed: (moduleId: string) => boolean): boolean {
  const item = GEAR.find((gear) => gear.id === id);
  if (!item) return false;
  if (item.id === "clothes") return completed("shift") || completed("orientation");
  return completed(item.unlock);
}

export const CONCRETE_CUT = {
  title: "Cutting concrete",
  need: ["hardhat", "goggles", "ear", "vest", "gloves", "boots", "respirator"],
  respiratorNote:
    "Concrete cutting can generate hazardous airborne dust. Review the respiratory-protection lesson.",
};

export function concreteReady(equipped: string[]): { ok: boolean; missing: string[] } {
  const missing = CONCRETE_CUT.need.filter((id) => !equipped.includes(id));
  return { ok: missing.length === 0, missing };
}
