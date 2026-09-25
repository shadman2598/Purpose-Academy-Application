export interface WeekStop {
  day: number;
  time: string;
  title: string;
  moduleId: string;
  href: string;
  boss?: boolean;
}

export const WEEK: WeekStop[] = [
  { day: 1, time: "07:00", title: "Site Orientation", moduleId: "orientation", href: "/site" },
  { day: 1, time: "08:00", title: "PPE", moduleId: "ppe", href: "/locker" },
  { day: 1, time: "10:00", title: "WHMIS", moduleId: "whmis", href: "/whmis-lab" },
  { day: 2, time: "07:00", title: "Hazard Recognition", moduleId: "hazards", href: "/hunt" },
  { day: 2, time: "09:30", title: "Tools", moduleId: "tools", href: "/locker" },
  { day: 3, time: "07:00", title: "Working at Heights", moduleId: "falls", href: "/training/falls?play=falls-climb" },
  { day: 3, time: "11:00", title: "Emergency Response", moduleId: "emergency", href: "/training/emergency" },
  { day: 4, time: "07:00", title: "Communication and conduct", moduleId: "conduct", href: "/decisions" },
  { day: 5, time: "07:00", title: "Final site challenge", moduleId: "shift", href: "/training/shift?play=shift-sim", boss: true },
];

export const BOSSES = [
  { id: "orientation", title: "Site orientation boss", detail: "Get a new worker ready for the first morning.", href: "/training/orientation?play=orientation-challenge" },
  { id: "whmis", title: "WHMIS boss", detail: "Prepare the chemical area before the crew uses the adhesive.", href: "/whmis-lab" },
  { id: "ppe", title: "PPE boss", detail: "Equip yourself for the concrete cut.", href: "/locker" },
  { id: "hazards", title: "Hazard boss", detail: "Find the hazards before the crew starts.", href: "/hunt" },
  { id: "emergency", title: "Emergency boss", detail: "Respond when two things go wrong at once.", href: "/training/emergency?play=emergency-challenge" },
  { id: "shift", title: "Final site boss", detail: "One simulated morning. The debrief comes at the end.", href: "/training/shift?play=shift-sim" },
] as const;

export function continueAfter(href: string): { href: string; label: string } | undefined {
  const index = WEEK.findIndex((stop) => stop.href === href);
  const next = index >= 0 ? WEEK[index + 1] : undefined;
  if (!next) return undefined;
  return { href: next.href, label: `Continue: ${next.title}` };
}

export const COURSE_VERSION = "1.0.0";

export const MODULE_VERSIONS: Record<string, { label: string; version: string }> = {
  whmis: { label: "WHMIS 2026", version: "1.0" },
  orientation: { label: "Site orientation", version: "1.0" },
  ppe: { label: "PPE", version: "1.0" },
  hazards: { label: "Hazard recognition", version: "1.0" },
  tools: { label: "Tools", version: "1.0" },
  falls: { label: "Working at heights", version: "1.0" },
  conduct: { label: "Communication and conduct", version: "1.0" },
  report: { label: "Hazard reporting", version: "1.0" },
  emergency: { label: "Emergency response", version: "1.0" },
  shift: { label: "Final site challenge", version: "1.0" },
};
