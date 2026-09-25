export const JURISDICTION_CODES = [
  "CANADA",
  "ALBERTA",
  "BRITISH_COLUMBIA",
  "SASKATCHEWAN",
  "MANITOBA",
  "ONTARIO",
  "QUEBEC",
  "OTHER",
] as const;

export type JurisdictionCode = (typeof JURISDICTION_CODES)[number];

/** One code, or several provinces that share the same lesson. */
export type JurisdictionTag = JurisdictionCode | JurisdictionCode[];

export interface JurisdictionInfo {
  code: JurisdictionCode;
  label: string;
  /** Shown on the profile picker. Canada is the baseline, not a province choice. */
  selectable: boolean;
  /** French lessons are not in this version. The English general lessons still apply. */
  englishOnlyNote: boolean;
}

export const JURISDICTIONS: JurisdictionInfo[] = [
  { code: "CANADA", label: "Canada", selectable: false, englishOnlyNote: false },
  { code: "ALBERTA", label: "Alberta", selectable: true, englishOnlyNote: false },
  { code: "BRITISH_COLUMBIA", label: "British Columbia", selectable: true, englishOnlyNote: false },
  { code: "SASKATCHEWAN", label: "Saskatchewan", selectable: true, englishOnlyNote: false },
  { code: "MANITOBA", label: "Manitoba", selectable: true, englishOnlyNote: false },
  { code: "ONTARIO", label: "Ontario", selectable: true, englishOnlyNote: false },
  { code: "QUEBEC", label: "Quebec", selectable: true, englishOnlyNote: true },
  { code: "OTHER", label: "Other", selectable: true, englishOnlyNote: false },
];

const LEGACY_CODES: Record<string, JurisdictionCode> = {
  CA: "CANADA",
  AB: "ALBERTA",
  BC: "BRITISH_COLUMBIA",
  SK: "SASKATCHEWAN",
  MB: "MANITOBA",
  ON: "ONTARIO",
  QC: "QUEBEC",
  OTHER: "OTHER",
};

export function isJurisdictionCode(value: string): value is JurisdictionCode {
  return (JURISDICTION_CODES as readonly string[]).includes(value);
}

/** Reads the current code or an older short code from a saved profile. */
export function readJurisdiction(value: unknown): JurisdictionCode | null {
  if (typeof value !== "string") return null;
  if (isJurisdictionCode(value)) return value;
  return LEGACY_CODES[value] ?? null;
}

export function jurisdictionInfo(code: JurisdictionCode): JurisdictionInfo {
  return JURISDICTIONS.find((item) => item.code === code) ?? JURISDICTIONS[0];
}

export function jurisdictionPickerDetail(code: JurisdictionCode): string {
  switch (code) {
    case "ALBERTA":
      return "Alberta-specific information is included.";
    case "BRITISH_COLUMBIA":
      return "A shared note with Alberta is included. British Columbia’s own rules are not quoted here.";
    case "QUEBEC":
      return "French-language lessons are not in this version. You will see general Canadian information in English.";
    default:
      return "You will see general Canadian information.";
  }
}

export function jurisdictionLabel(code: JurisdictionCode | null): string {
  if (!code) return "your province";
  return jurisdictionInfo(code).label;
}

export function asJurisdictionList(tag: JurisdictionTag | undefined): JurisdictionCode[] {
  if (!tag) return ["CANADA"];
  const list = Array.isArray(tag) ? tag : [tag];
  return list.length ? list : ["CANADA"];
}

export function isGeneralCanadian(tag: JurisdictionTag | undefined): boolean {
  const list = asJurisdictionList(tag);
  return list.length === 1 && list[0] === "CANADA";
}

/** The sentence the lesson shows above its text. */
export function jurisdictionHeading(tag: JurisdictionTag | undefined): string {
  const local = asJurisdictionList(tag).filter((code) => code !== "CANADA");
  if (local.length === 0) return "General Canadian information";
  if (local.length === 1) return `${jurisdictionLabel(local[0])}-specific information`;
  const labels = local.map((code) => jurisdictionLabel(code));
  const last = labels[labels.length - 1];
  return `${labels.slice(0, -1).join(", ")} and ${last}-specific information`;
}

/**
 * Canada-wide lessons are always open.
 * A province lesson opens when the learner's profile is one of its codes.
 * Other and unset profiles see the Canada lessons only.
 */
export function jurisdictionApplies(tag: JurisdictionTag | undefined, learner: JurisdictionCode | null): boolean {
  const list = asJurisdictionList(tag);
  if (list.includes("CANADA")) return true;
  if (!learner || learner === "CANADA" || learner === "OTHER") return false;
  return list.includes(learner);
}

export interface LocalNote {
  jurisdiction: JurisdictionTag;
  body: string;
}

export function visibleNotes(notes: LocalNote[] | undefined, learner: JurisdictionCode | null): LocalNote[] {
  return (notes ?? []).filter((note) => jurisdictionApplies(note.jurisdiction, learner));
}
