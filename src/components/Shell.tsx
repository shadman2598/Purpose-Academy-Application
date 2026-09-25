import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { PRODUCT } from "../content/framework";
import { WorksiteLoad } from "../screens/Gate";

const DESKTOP = [
  ["Home", "/home"],
  ["Site", "/site"],
  ["Locker", "/locker"],
  ["Games", "/games"],
  ["Training", "/training"],
  ["Missions", "/missions"],
  ["Badges", "/badges"],
  ["Progress", "/progress"],
  ["Resources", "/resources"],
  ["Record", "/record"],
  ["Admin", "/admin"],
  ["Profile", "/profile"],
] as const;

const MOBILE = [
  ["Home", "/home"],
  ["Site", "/site"],
  ["Locker", "/locker"],
  ["Progress", "/progress"],
  ["Profile", "/profile"],
] as const;

export function Shell() {
  const location = useLocation();
  const [shownPath, setShownPath] = useState(location.pathname);
  const [loading, setLoading] = useState(true);

  if (location.pathname !== shownPath) {
    setShownPath(location.pathname);
    setLoading(true);
  }

  useEffect(() => {
    const reduce = document.documentElement.dataset.motion === "reduce";
    const timer = window.setTimeout(() => setLoading(false), reduce ? 500 : 1400);
    return () => window.clearTimeout(timer);
  }, [shownPath]);

  return (
    <div className="shell">
      <a className="skip" href="#main">
        Skip to content
      </a>
      <aside className="sidebar">
        <div className="wordmark">
          <span className="mark" aria-hidden />
          {PRODUCT.name}
        </div>
        <nav>
          {DESKTOP.map(([label, to]) => (
            <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot faint">Educational training. Not a certification.</div>
      </aside>
      <main id="main" className="content">
        {loading ? (
          <div className="worksite-hold">
            <WorksiteLoad />
          </div>
        ) : (
          <div key={shownPath} className="page-in">
            <Outlet />
          </div>
        )}
      </main>
      <nav className="bottom-nav" aria-label="Primary">
        {MOBILE.map(([label, to]) => (
          <NavLink key={to} to={to} className={({ isActive }) => (isActive ? "active" : undefined)}>
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
