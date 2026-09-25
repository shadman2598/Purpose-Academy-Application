export const CONTENT_WARNINGS = ["site-specific", "hands-on"] as const;

export type ContentWarning = (typeof CONTENT_WARNINGS)[number];

export const WARNING_COPY: Record<ContentWarning, { kicker: string; body: string }> = {
  "site-specific": {
    kicker: "Site-specific",
    body: "This information may vary by employer, project, equipment, task, or site. Follow your employer's procedures and instructions.",
  },
  "hands-on": {
    kicker: "Hands-on training required",
    body: "This module is educational and does not replace required practical training, supervision, authorization, or certification.",
  },
};

export function warningList(...groups: Array<ContentWarning[] | undefined>): ContentWarning[] {
  const seen = new Set<ContentWarning>();
  const ordered: ContentWarning[] = [];
  for (const group of groups) {
    for (const warning of group ?? []) {
      if (seen.has(warning)) continue;
      seen.add(warning);
      ordered.push(warning);
    }
  }
  return ordered;
}
