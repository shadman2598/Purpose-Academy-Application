export interface BadgeDef {
  id: string;
  name: string;
  detail: string;
  how: string;
}

export const BADGES: BadgeDef[] = [
  {
    id: "gear-ready",
    name: "Gear Ready",
    detail: "Complete PPE training.",
    how: "Finish Gear Up.",
  },
  {
    id: "hazard-hunter",
    name: "Hazard Hunter",
    detail: "Identify 20 hazards.",
    how: "Find the hazards in Spot the Hazard and in the WHMIS storage room.",
  },
  {
    id: "chemical-detective",
    name: "Chemical Detective",
    detail: "Complete WHMIS.",
    how: "Finish WHMIS: Chemical Detective.",
  },
  {
    id: "tool-inspector",
    name: "Tool Inspector",
    detail: "Complete tool inspection.",
    how: "Finish Tool Check.",
  },
  {
    id: "emergency-ready",
    name: "Emergency Ready",
    detail: "Complete emergency scenarios.",
    how: "Finish Emergency Drill.",
  },
  {
    id: "crew-player",
    name: "Crew Player",
    detail: "Complete workplace communication scenarios.",
    how: "Finish Be a Good Crew Member.",
  },
  {
    id: "site-ready",
    name: "Site Ready",
    detail: "Complete the full introductory curriculum.",
    how: "Finish every module, including Your First Shift.",
  },
];

export const HAZARD_BADGE_TARGET = 20;
