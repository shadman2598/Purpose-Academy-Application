export const TRADES = [
  { id: "labourer", title: "General labourer", detail: "More material handling and site-orientation calls." },
  { id: "carpenter", title: "Carpenter", detail: "More tool, cut, and work-at-height calls." },
  { id: "electrician", title: "Electrician", detail: "More electrical-safety calls. This is not an electrical ticket." },
  { id: "plumber", title: "Plumber", detail: "More confined-space and material calls. This is not a plumbing ticket." },
  { id: "operator", title: "Heavy equipment operator", detail: "More equipment and spotter calls. This does not authorize a machine." },
  { id: "welder", title: "Welder", detail: "More hot-work calls. This is not a welding ticket." },
  { id: "hvac", title: "HVAC", detail: "More equipment and chemical-handling calls." },
  { id: "roofing", title: "Roofing", detail: "More fall-protection calls. This does not qualify you to work at height." },
  { id: "concrete", title: "Concrete", detail: "More dust, silica, and cutting calls." },
  { id: "supervisor", title: "Supervisor", detail: "More calls about pressure, authorization, and stopping the work." },
  { id: "apprentice", title: "Apprentice", detail: "More calls about asking before you use a machine." },
  { id: "other", title: "Other", detail: "The general site path. Your trade school or ticket is separate." },
] as const;

export type Trade = (typeof TRADES)[number]["id"];

export function tradeTitle(id: Trade | null): string {
  return TRADES.find((trade) => trade.id === id)?.title ?? "Crew member";
}

export function tradeHint(id: Trade | null): string {
  if (id === "electrician") return "Sarah will add an electrical call on the site walk. It does not certify you for electrical work.";
  if (id === "operator") return "Sam will add a spotter call in the equipment zone. It does not authorize you to run a machine.";
  if (id === "concrete" || id === "carpenter") return "The concrete-cutting locker is the gear check for your first cut.";
  if (id === "roofing") return "The heights mission is on day 3. Finishing it does not qualify you for roof work.";
  if (id === "supervisor") return "Several calls ask you to refuse a signature or a shortcut.";
  return "You are on the general site path. Trade tickets and employer authorization stay outside this game.";
}
