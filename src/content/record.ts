export const RECORD_TITLE = "SiteWise Training Completion Record";

export const RECORD_DISCLAIMER =
  "This completion record confirms completion of the SiteWise educational program. It does not replace employer-specific orientation, practical training, authorization, or certification where required.";

export function recordId(learner: string, modules: string[], date: string): string {
  const raw = `${learner}|${modules.join(",")}|${date}|sitewise-record`;
  let hash = 2166136261;
  for (let index = 0; index < raw.length; index += 1) {
    hash ^= raw.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return `SW-${(hash >>> 0).toString(16).toUpperCase().padStart(8, "0")}`;
}
