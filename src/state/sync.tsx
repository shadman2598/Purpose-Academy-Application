import { useEffect } from "react";
import { api } from "../lib/api";
import { useAuth } from "./auth";
import { useProgress } from "./progress";

export function ProgressSync() {
  const { user } = useAuth();
  const { state } = useProgress();
  useEffect(() => {
    if (!user || user.role === "admin") return;
    const timer = window.setTimeout(() => {
      const modules = Object.fromEntries(
        Object.entries(state.modules).map(([id, save]) => [
          id,
          {
            cursor: save.cursor,
            completed: save.completed,
            seconds: save.seconds ?? 0,
            answered: Object.values(save.answered),
          },
        ]),
      );
      void api("/api/sync", {
        method: "POST",
        body: JSON.stringify({
          jurisdiction: state.jurisdiction,
          crewRole: state.role,
          modules,
        }),
      }).catch(() => undefined);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [user, state]);
  return null;
}
