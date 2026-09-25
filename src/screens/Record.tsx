import { useState } from "react";
import { jurisdictionLabel } from "../content/framework";
import { COURSE_VERSION, MODULE_VERSIONS } from "../content/campaign";
import { RECORD_DISCLAIMER, RECORD_TITLE, recordId } from "../content/record";
import { tallies, useProgress } from "../state/progress";
import { useContent } from "../state/content";
import { useAuth } from "../state/auth";
import { api } from "../lib/api";

export function RecordPage() {
  const { state } = useProgress();
  const { modules } = useContent();
  const { user } = useAuth();
  const [saved, setSaved] = useState("");
  const done = modules.filter((module) => state.modules[module.id]?.completed);
  const scores = tallies(state);
  const totals = Object.values(scores).reduce(
    (sum, item) => ({ correct: sum.correct + item.correct, total: sum.total + item.total }),
    { correct: 0, total: 0 },
  );
  const score = totals.total ? Math.round((totals.correct / totals.total) * 100) : 0;
  const date = new Date().toISOString().slice(0, 10);
  const learner = user?.name || "Learner on this device";
  const id = recordId(learner, done.map((module) => module.id), date);
  const complete = modules.length > 0 && done.length === modules.length;

  return (
    <div className="stack">
      <p className="kicker">Record</p>
      <h2>{RECORD_TITLE}</h2>
      {!complete && <p>Finish every module on the map to complete this record. Progress already stored on this device stays in the record draft below.</p>}
      <article className="panel stack">
        <p>
          <strong>Learner:</strong> {learner}
        </p>
        <p>
          <strong>Course:</strong> SiteWise
        </p>
        <p>
          <strong>Modules completed:</strong> {done.map((module) => module.title).join(", ") || "None yet"}
        </p>
        <p>
          <strong>Completion date:</strong> {complete ? date : "Not complete"}
        </p>
        <p>
          <strong>Course version:</strong> {COURSE_VERSION}
        </p>
        <p>
          <strong>Jurisdiction:</strong> {jurisdictionLabel(state.jurisdiction)}
        </p>
        <p>
          <strong>Score:</strong> {score}% on first answers
        </p>
        <h3>Module versions</h3>
        {done.map((module) => {
          const save = state.modules[module.id];
          const label = MODULE_VERSIONS[module.id];
          return (
            <p key={module.id}>
              {label?.label ?? module.title} — Version {save?.contentVersion ?? "recorded before version stamps"}
              {save?.completedOn ? ` · ${save.completedOn}` : ""}
            </p>
          );
        })}
        {done.length === 0 && <p>No module completion is stamped yet.</p>}
        <p>
          <strong>Record ID:</strong> {id}
        </p>
      </article>
      <p className="disclaimer">{RECORD_DISCLAIMER}</p>
      {user && complete && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={async () => {
            await api("/api/certificates", {
              method: "POST",
              body: JSON.stringify({
                id,
                learnerName: learner,
                course: "SiteWise",
                modules: done.map((module) => module.title).join(", "),
                completedOn: date,
                score,
                version: COURSE_VERSION,
                jurisdiction: state.jurisdiction ?? "CANADA",
              }),
            });
            setSaved(id);
          }}
        >
          Save this record to your account
        </button>
      )}
      {saved && <p role="status">Saved {saved}.</p>}
    </div>
  );
}
