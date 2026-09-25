import { Link } from "react-router-dom";

export function ExitBar({
  continueHref,
  continueLabel = "Continue",
}: {
  continueHref?: string;
  continueLabel?: string;
}) {
  return (
    <div className="row">
      <Link className="btn btn-ghost" to="/home">
        Back to home
      </Link>
      {continueHref && (
        <Link className="btn btn-primary" to={continueHref}>
          {continueLabel}
        </Link>
      )}
    </div>
  );
}
