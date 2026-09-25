import type { JurisdictionCode } from "./jurisdiction";

export interface RequirementRecord {
  id: string;
  topic: string;
  moduleId: string;
  jurisdiction: JurisdictionCode;
  summary: string;
  sourceTitle: string;
  sourceUrl: string;
  lastReviewed: string;
}

/** Summaries point at the source. Distances and duties are not hardcoded into game components. */
export const REQUIREMENTS: RequirementRecord[] = [
  {
    id: "ab-falls",
    topic: "Fall protection",
    moduleId: "falls",
    jurisdiction: "ALBERTA",
    summary: "Alberta’s fall protection rules are in the current OHS Code. Read that text and the site plan. This game does not store a distance as the rule.",
    sourceTitle: "OHS Code, Part 9, Fall Protection",
    sourceUrl: "https://search-ohs-laws.alberta.ca/legislation/occupational-health-and-safety-code/part-9-fall-protection/",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ca-whmis",
    topic: "WHMIS",
    moduleId: "whmis",
    jurisdiction: "CANADA",
    summary: "Supplier labels, pictograms, and safety data sheets follow the federal Hazardous Products Act and Regulations. Employer training on the products at that workplace is separate.",
    sourceTitle: "WHMIS pictograms",
    sourceUrl: "https://www.ccohs.ca/oshanswers/chemicals/whmis_ghs/pictograms.html",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ab-emergency",
    topic: "Emergency preparedness",
    moduleId: "emergency",
    jurisdiction: "ALBERTA",
    summary: "Alberta’s OHS Code includes emergency preparedness and response. The alarm, route, and muster point are the site plan, not a script in this game.",
    sourceTitle: "OHS Act, Regulation and Code",
    sourceUrl: "https://www.alberta.ca/ohs-act-regulation-code",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ca-controls",
    topic: "Hazard control",
    moduleId: "hazards",
    jurisdiction: "CANADA",
    summary: "CCOHS describes the hierarchy of controls. The control a real task needs can be set by the province and the site.",
    sourceTitle: "Hierarchy of controls",
    sourceUrl: "https://www.ccohs.ca/oshanswers/hsprograms/hazard/hierarchy_controls.html",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ca-ppe",
    topic: "PPE",
    moduleId: "ppe",
    jurisdiction: "CANADA",
    summary: "CCOHS describes PPE as one control, used when the hazard is still there after higher controls. The exact gear is the task, the SDS, and the employer.",
    sourceTitle: "Hazard control",
    sourceUrl: "https://www.ccohs.ca/oshanswers/hsprograms/hazard/hazard_control.html",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ca-tools",
    topic: "Damaged equipment",
    moduleId: "tools",
    jurisdiction: "CANADA",
    summary: "A damaged tool comes out of service. Who may use a tool, and how energy is controlled, is the employer’s procedure.",
    sourceTitle: "Hazard control",
    sourceUrl: "https://www.ccohs.ca/oshanswers/hsprograms/hazard/hazard_control.html",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ab-orientation",
    topic: "Site orientation",
    moduleId: "orientation",
    jurisdiction: "ALBERTA",
    summary: "Alberta’s OHS laws set duties for employers, supervisors, and workers. The sign-in, muster point, and rules you follow are the ones on that site.",
    sourceTitle: "OHS Act, Regulation and Code",
    sourceUrl: "https://www.alberta.ca/ohs-act-regulation-code",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ab-conduct",
    topic: "Workplace conduct",
    moduleId: "conduct",
    jurisdiction: "ALBERTA",
    summary: "Harassment, violence, and the right to refuse dangerous work sit in Alberta’s OHS laws. The reporting path is the one your workplace names. This game is practice.",
    sourceTitle: "OHS Act, Regulation and Code",
    sourceUrl: "https://www.alberta.ca/ohs-act-regulation-code",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ab-report",
    topic: "Reporting",
    moduleId: "report",
    jurisdiction: "ALBERTA",
    summary: "A near miss is still information. Report it the way the site asks. This app does not store that report.",
    sourceTitle: "OHS Act, Regulation and Code",
    sourceUrl: "https://www.alberta.ca/ohs-act-regulation-code",
    lastReviewed: "2026-09-24",
  },
  {
    id: "ca-shift",
    topic: "A full shift",
    moduleId: "shift",
    jurisdiction: "CANADA",
    summary: "The morning in this game stacks orientation, hazards, and communication. The first real shift still starts with that employer’s orientation.",
    sourceTitle: "Hazard control",
    sourceUrl: "https://www.ccohs.ca/oshanswers/hsprograms/hazard/hazard_control.html",
    lastReviewed: "2026-09-24",
  },
];

export function requirementsFor(moduleId: string, learner: JurisdictionCode | null): RequirementRecord[] {
  return REQUIREMENTS.filter((item) => item.moduleId === moduleId && (item.jurisdiction === "CANADA" || item.jurisdiction === learner));
}
