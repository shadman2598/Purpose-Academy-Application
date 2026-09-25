import type { Role, ScoreDimension } from "./model";
export { JURISDICTIONS, jurisdictionLabel, jurisdictionPickerDetail } from "./jurisdiction";

export const PRODUCT = {
  name: "SITEWISE",
  subtitle: "Learn the Site. Know the Hazards. Work Smart.",
  line: "Purpose Academy Training",
} as const;

export const DISCLAIMER =
  "SITEWISE is general educational training. Finishing a module, a badge, or the full path does not give you a legally recognized certification, a site orientation, WHMIS sign-off, equipment authorization, or permission to do a task. Your employer, the site, and the rules for your province can require more.";

export const TRAINING_TYPES: {
  id: string;
  title: string;
  body: string;
  inThisApp: boolean;
}[] = [
  {
    id: "general",
    title: "General educational training",
    body: "Ideas and decisions you can practise here, on a fictional yard called Northline. This is what SITEWISE is.",
    inThisApp: true,
  },
  {
    id: "orientation",
    title: "Employer or site orientation",
    body: "The real site has its own sign-in, muster point, rules, and chain of command. Northline is a practice yard. It does not replace that orientation.",
    inThisApp: false,
  },
  {
    id: "whmis",
    title: "WHMIS education",
    body: "WHMIS education is the general system: labels, pictograms, and safety data sheets. Your employer still has to train you on the hazardous products at that workplace.",
    inThisApp: false,
  },
  {
    id: "task",
    title: "Task-specific training",
    body: "Cutting, lifting, confined spaces, and similar work need instruction for that task. A scenario in this app is not that instruction.",
    inThisApp: false,
  },
  {
    id: "equipment",
    title: "Equipment authorization",
    body: "Saws, grinders, lifts, and powder-actuated tools need the training and permission your employer sets. Selecting a picture of a tool here does not authorize you to use it.",
    inThisApp: false,
  },
  {
    id: "regulated",
    title: "Provincially regulated certification",
    body: "Some work needs a certificate or course named by the province or by the site. SITEWISE does not issue those certificates.",
    inThisApp: false,
  },
  {
    id: "employer",
    title: "Employer-specific procedures",
    body: "How your crew reports a hazard, who to call, and when to stop are written in the site plan. When a scenario says “follow the site procedure,” that plan wins.",
    inThisApp: false,
  },
];

export const ROLES: { id: Role; title: string; detail: string }[] = [
  {
    id: "new",
    title: "New to construction",
    detail: "First sites, new crew, lots of names to learn.",
  },
  {
    id: "apprentice",
    title: "Apprentice",
    detail: "Trade schooling and this yard are different things.",
  },
  {
    id: "experienced",
    title: "Experienced worker",
    detail: "You have done the work. This site still has its own rules.",
  },
  {
    id: "supervisor",
    title: "Supervisor",
    detail: "People copy the pace you set.",
  },
  {
    id: "other",
    title: "Other",
    detail: "Visitor, office, or a role that still walks the site.",
  },
];

export const PHASES: { id: "learn" | "practice" | "play" | "test" | "master"; label: string }[] =
  [
    { id: "learn", label: "Learn" },
    { id: "practice", label: "Practice" },
    { id: "play", label: "Play" },
    { id: "test", label: "Test" },
    { id: "master", label: "Master" },
  ];

export const DIMENSIONS: { id: ScoreDimension; label: string }[] = [
  { id: "knowledge", label: "Knowledge" },
  { id: "decision", label: "Decision Making" },
  { id: "hazard", label: "Hazard Recognition" },
  { id: "procedure", label: "Procedure Awareness" },
  { id: "communication", label: "Safety Communication" },
];

export const XP = {
  lesson: 50,
  practice: 75,
  game: 100,
  check: 50,
  challenge: 250,
  module: 500,
  perfect: 100,
} as const;

export const XP_ROWS: { label: string; value: string; note: string }[] = [
  { label: "Lesson completed", value: "+50 XP", note: "Reading and the symbol cards." },
  { label: "Practice", value: "+75 XP", note: "A short activity before the main game." },
  { label: "Game", value: "+100 XP", note: "The module’s main mechanic." },
  { label: "Knowledge check", value: "+50 XP", note: "Same rate as a lesson. Speed does not add points." },
  { label: "Challenge", value: "+250 XP", note: "The module’s final scenario." },
  { label: "Module completion", value: "+500 XP", note: "Awarded once, when you finish the results screen." },
  { label: "Perfect challenge", value: "+100 XP", note: "Every challenge decision right on the first try." },
];

export const LEVELS: { level: number; title: string; min: number }[] = [
  { level: 1, title: "New Starter", min: 0 },
  { level: 2, title: "Site Starter", min: 500 },
  { level: 3, title: "Crew Hand", min: 1200 },
  { level: 4, title: "Hazard Aware", min: 2000 },
  { level: 5, title: "Site Ready", min: 3200 },
  { level: 6, title: "Shift Lead", min: 4600 },
];

export function levelFor(xp: number) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (xp >= level.min) current = level;
  }
  const index = LEVELS.findIndex((level) => level.level === current.level);
  const next = LEVELS[index + 1];
  const floor = current.min;
  const ceil = next ? next.min : current.min + 500;
  const span = ceil - floor;
  const into = Math.min(span, Math.max(0, xp - floor));
  return { current, next, into, span, pct: Math.round((into / span) * 100) };
}

export function roleLine(role: Role | null): string {
  switch (role) {
    case "apprentice":
      return "Your apprenticeship and this yard are different. Nothing here replaces trade school, a ticket, or your sponsor’s instruction.";
    case "experienced":
      return "Experience helps you see trouble sooner. This site still expects its own orientation, permits, and procedures.";
    case "supervisor":
      return "Crews copy the pace you set. Several calls in this path are moments to slow the work down.";
    case "other":
      return "Whatever brings you onto the yard, these examples stay general. They do not decide which tickets you need.";
    default:
      return "You are new on this crew. Ask early. A careful question is part of the work.";
  }
}

export const LOADING_LINES = [
  "Checking your PPE...",
  "Inspecting the site...",
  "Loading today's toolbox talk...",
  "Reviewing hazards...",
];

export const MISSION_MODULE_IDS = [
  "orientation",
  "ppe",
  "hazards",
  "whmis",
  "emergency",
] as const;

export const DIMENSION_LABEL: Record<ScoreDimension, string> = {
  knowledge: "Knowledge",
  decision: "Decision Making",
  hazard: "Hazard Recognition",
  procedure: "Procedure Awareness",
  communication: "Safety Communication",
};
