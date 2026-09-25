import type { ReactNode } from "react";

/** Picture on the left, the part you are pointing at on the right, controls under that. */
export function SimLab({
  stage,
  title,
  body,
  controls,
}: {
  stage: ReactNode;
  title: string;
  body: string;
  controls?: ReactNode;
}) {
  return (
    <div className="sim-lab">
      <div className="sim-stage">{stage}</div>
      <aside className="sim-side">
        <p className="kicker">Under the pointer</p>
        <h3>{title}</h3>
        <p aria-live="polite">{body}</p>
        {controls ? <div className="sim-controls">{controls}</div> : null}
      </aside>
    </div>
  );
}
