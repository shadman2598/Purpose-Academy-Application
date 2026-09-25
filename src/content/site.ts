export interface SiteArea {
  id: string;
  name: string;
  npc: string;
  line: string;
  href: string;
  action: string;
  col: number;
  row: number;
}

export const SITE_AREAS: SiteArea[] = [
  { id: "office", name: "Site office", npc: "Sarah", line: "Sign in. Then walk the yard with me. Do not cut across.", href: "/training/orientation", action: "Start orientation", col: 0, row: 0 },
  { id: "building", name: "Building area", npc: "Mike", line: "Watch the load. Nobody stands under it.", href: "/hunt", action: "Hunt hazards", col: 1, row: 0 },
  { id: "ladder", name: "Ladder area", npc: "Sarah", line: "That ladder is the job for today only if it is set right.", href: "/training/falls?play=falls-climb", action: "Climb the decision", col: 2, row: 0 },
  { id: "electrical", name: "Electrical area", npc: "Sarah", line: "If you are not authorized for this panel, you do not open it.", href: "/decisions", action: "Take the call", col: 0, row: 1 },
  { id: "tools", name: "Tool station", npc: "Mike", line: "Check it before you carry it.", href: "/locker", action: "Open the locker", col: 1, row: 1 },
  { id: "chemical", name: "Chemical station", npc: "Jordan", line: "Read the label before you move the can.", href: "/whmis-lab", action: "Enter the lab", col: 2, row: 1 },
  { id: "excavation", name: "Excavation area", npc: "Sam", line: "The edge is unmarked. Stay back until the control is in place.", href: "/hunt", action: "Look for the edge", col: 0, row: 2 },
  { id: "equipment", name: "Equipment zone", npc: "Sam", line: "If you cannot see the operator, the operator cannot see you.", href: "/radio", action: "Answer the radio", col: 1, row: 2 },
  { id: "emergency", name: "Emergency station", npc: "Jordan", line: "Alarm, route, muster. The plan beats a guess.", href: "/training/emergency", action: "Run the drill", col: 2, row: 2 },
  { id: "firstaid", name: "First-aid station", npc: "Jordan", line: "Know who the attendant is before someone is hurt.", href: "/training/orientation?play=orientation-map", action: "Find the station", col: 1, row: 3 },
];

export const HUNT_HAZARDS = [
  { id: "exit", areaId: "building", label: "Blocked exit", detail: "A pallet is across the door people would use. Move the block, or get someone who can, before work starts." },
  { id: "ppe", areaId: "ladder", label: "Missing eye protection at the cut station", detail: "The task needs eye protection. A hard hat alone does not cover the chips." },
  { id: "cord", areaId: "tools", label: "Damaged extension cord", detail: "The jacket is cut. The cord comes out of service. You do not tape it and keep cutting." },
  { id: "label", areaId: "chemical", label: "Chemical container without a proper label", detail: "No product name, no pictogram. Do not guess the contents. Tell the supervisor and leave it closed." },
  { id: "load", areaId: "equipment", label: "Worker standing beneath a suspended load", detail: "The load path is empty of people. Call them out before the pick moves." },
];

export const HUNT_DECISION = {
  prompt: "You found a hazard. What should happen next?",
  options: [
    { id: "ignore", label: "Ignore it", correct: false, feedback: "Leaving it there keeps the exposure in the work." },
    { id: "fix", label: "Fix it yourself regardless of authorization", correct: false, feedback: "Some fixes need a person authorized for that equipment or that energy source." },
    { id: "report", label: "Report it through the appropriate site process", correct: true, feedback: "Name it, keep people out of it, and use the site’s way of reporting. You can make a safe immediate correction only when you are allowed to and it does not create a new hazard." },
    { id: "later", label: "Wait until the end of the shift", correct: false, feedback: "The crew is about to start. End of shift is how someone meets the hazard first." },
  ],
};
