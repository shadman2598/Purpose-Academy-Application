import { REALITY, REALITY_BY_MODULE } from "../content/reality";
import { requirementsFor } from "../content/regulations";
import { jurisdictionLabel } from "../content/framework";
import { useProgress } from "../state/progress";

export function RealityCheck({ moduleId }: { moduleId: string }) {
  const { state } = useProgress();
  const copy = REALITY_BY_MODULE[moduleId];
  if (!copy) return null;
  const rows = requirementsFor(moduleId, state.jurisdiction);
  return (
    <section className="stack">
      <h3>Reality check</h3>
      <p>
        <strong>{REALITY.teaches}.</strong> {copy.teaches}
      </p>
      <p>
        <strong>{REALITY.site}.</strong> {copy.site}
      </p>
      <div className="callout">
        <strong>Important.</strong>
        <p>{REALITY.important}</p>
      </div>
      {rows.map((row) => (
        <article key={row.id} className="panel">
          <p className="kicker">Province: {jurisdictionLabel(row.jurisdiction)}</p>
          <p>
            <strong>Course: Construction safety. {row.topic}.</strong> {row.summary}
          </p>
          <p className="faint">
            Source: {row.sourceTitle}. Last reviewed: {row.lastReviewed}. Reference: {row.id}.
          </p>
          <p>
            <a href={row.sourceUrl} target="_blank" rel="noreferrer">
              {row.sourceUrl}
            </a>
          </p>
        </article>
      ))}
    </section>
  );
}

export function SafetyIssue({ review }: { review: string }) {
  return (
    <div className="warning" role="status">
      <strong>Safety issue detected</strong>
      <p>Your decision created an unnecessary risk.</p>
      <p>Review: {review}</p>
      <p>If this decision were made on a real site, it could expose workers to serious injury.</p>
    </div>
  );
}
