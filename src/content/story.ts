export interface CrewMember {
  id: "sarah" | "mike" | "alex" | "jordan" | "sam";
  name: string;
  role: string;
}

export const PROJECT = {
  name: "Project Northstar",
  detail: "A commercial development. The practice yard in the scenes is Northline, on the Northstar site.",
} as const;

export const CREW: CrewMember[] = [
  { id: "sarah", name: "Sarah", role: "Site supervisor" },
  { id: "mike", name: "Mike", role: "Journeyperson" },
  { id: "alex", name: "Alex", role: "New apprentice" },
  { id: "jordan", name: "Jordan", role: "Safety coordinator" },
  { id: "sam", name: "Sam", role: "Equipment operator" },
];

const LINES: Record<string, { speaker: string; text: string }> = {
  home: {
    speaker: "Sarah",
    text: "Morning. Your first week on the job starts in the yard. Ask if a step is unclear.",
  },
  orientation: {
    speaker: "Sarah",
    text: "Morning. Before you start, let’s do a quick site walk. Sign in, then find me.",
  },
  ppe: {
    speaker: "Mike",
    text: "Gear follows the task. I’ll show you the locker. The site still tells you what this area requires.",
  },
  hazards: {
    speaker: "Jordan",
    text: "Look once before you walk. If something feels off, stop and say so.",
  },
  tools: {
    speaker: "Mike",
    text: "This cord looked fine yesterday. Check it anyway. A damaged tool stays out of service.",
  },
  falls: {
    speaker: "Sarah",
    text: "That opening needs a decision before anyone climbs. This screen does not qualify you for the work.",
  },
  whmis: {
    speaker: "Alex",
    text: "I’ve never used this adhesive, but Mike said it’s easy. Can you show me where to look?",
  },
  conduct: {
    speaker: "Alex",
    text: "I’ve never used this machine before, but Mike said it’s easy.",
  },
  report: {
    speaker: "Jordan",
    text: "If you see it, say it. A short report beats a long apology.",
  },
  emergency: {
    speaker: "Sarah",
    text: "If the alarm goes, we leave. The muster point is the plan, not a guess.",
  },
  shift: {
    speaker: "Sarah",
    text: "This is your first full morning on Northstar. I’ll debrief you at the end, not after every call.",
  },
};

export function storyLine(moduleId?: string) {
  if (!moduleId) return LINES.home;
  return LINES[moduleId] ?? LINES.home;
}
