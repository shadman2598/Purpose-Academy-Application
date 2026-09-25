import { NavLink, Outlet } from "react-router-dom";
import { PRODUCT } from "../content/framework";

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
        <Outlet />
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
