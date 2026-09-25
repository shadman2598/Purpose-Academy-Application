import { WARNING_COPY, type ContentWarning } from "../content/warnings";

export function ContentWarnings({ warnings }: { warnings: ContentWarning[] }) {
  if (!warnings.length) return null;
  return (
    <div className="stack">
      {warnings.map((warning) => {
        const copy = WARNING_COPY[warning];
        return (
          <aside key={warning} className={`warning warning-${warning}`} role="note">
            <strong>{copy.kicker}</strong>
            <p>{copy.body}</p>
          </aside>
        );
      })}
    </div>
  );
}
