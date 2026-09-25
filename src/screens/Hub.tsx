import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BADGES, HAZARD_BADGE_TARGET } from "../content/badges";
import { MODULES } from "../content/catalog";
import { BOSSES, WEEK, continueAfter } from "../content/campaign";
import { BOSS_LEVELS } from "../content/bossLevels";
import { SAFETY_CHECKS } from "../content/checks";
import { readinessLabel, siteReadiness } from "../content/mastery";
import { tradeHint, tradeTitle, TRADES, type Trade } from "../content/trades";
import { Avatar } from "../components/Avatar";
import { CrewSite } from "../components/CrewSite";
import { ExitBar } from "../components/ExitBar";
import { TeachText } from "../components/Parable";
import { Feedback } from "../components/activities";
import { SourceList } from "../components/ModulePlayer";
import {
  DIMENSIONS,
  DISCLAIMER,
  levelFor,
  MISSION_MODULE_IDS,
  PRODUCT,
  JURISDICTIONS,
  jurisdictionLabel,
  jurisdictionPickerDetail,
  ROLES,
  TRAINING_TYPES,
  XP_ROWS,
} from "../content/framework";
import { gamesFor, mainGame } from "../content/play";
import { PROJECT, storyLine } from "../content/story";
import { SHIFTS, shiftFor } from "../content/shifts";
import { useContent } from "../state/content";
import type { JurisdictionCode, Role } from "../content/model";
import {
  coursePercent,
  earnedBadgeIds,
  modulePercent,
  nextModuleId,
  tallies,
  useProgress,
} from "../state/progress";
import { SettingsScreen } from "./Gate";

export function GamesPage() {
  const { modules } = useContent();
  const games = modules.flatMap((module) => gamesFor(module));
  return (
    <div className="stack">
      <p className="kicker">Play</p>
      <h2>Games</h2>
      <div className="yard-banner">
        <CrewSite />
      </div>
      <TeachText text="Each card is one activity. Press Play and you are in it. You do not have to finish the lesson first, and finishing a game here does not certify you for the job." />
      {modules.map((module) => {
        const items = games.filter((game) => game.moduleId === module.id);
        if (!items.length) return null;
        return (
          <section key={module.id} className="stack">
            <h3>{module.title}</h3>
            <div className="grid-2">
              {items.map((game) => (
                <article key={game.blockId} className="panel stack">
                  <p className="kicker">{game.kind}</p>
                  <h3>{game.name}</h3>
                  <TeachText text={game.how} />
                  <Link className="btn btn-primary" to={game.href}>
                    Play
                  </Link>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export function BossPage() {
  const { bossId } = useParams();
  const boss = BOSS_LEVELS.find((item) => item.id === bossId);
  const { recordAnswer } = useProgress();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState("");
  if (!boss) return <Navigate to="/home" replace />;
  const step = boss.steps[index];
  const option = step.options.find((item) => item.id === picked);
  const week = WEEK.find((item) => item.moduleId === boss.moduleId);
  const next = week ? continueAfter(week.href) : undefined;
  return (
    <div className="stack">
      <p className="kicker">Boss level · {index + 1} of {boss.steps.length}</p>
      <h2>{boss.title}</h2>
      <TeachText text={boss.detail} />
      <article className="panel stack">
        <p className="kicker">{step.speaker}</p>
        <TeachText text={step.prompt} />
        {step.options.map((item) => (
          <button
            key={item.id}
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setPicked(item.id);
              recordAnswer(boss.moduleId, {
                id: `boss-${boss.id}-${step.id}`,
                prompt: step.prompt,
                correct: item.correct,
                feedback: item.feedback,
                dimension: "decision",
                track: "challenge",
              });
            }}
          >
            {item.label}
          </button>
        ))}
        {option && <Feedback text={option.feedback} good={option.correct} review={step.review} />}
      </article>
      <div className="row">
        {index > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => { setIndex((value) => value - 1); setPicked(""); }}>
            Previous
          </button>
        )}
        {option && index < boss.steps.length - 1 && (
          <button type="button" className="btn btn-primary" onClick={() => { setIndex((value) => value + 1); setPicked(""); }}>
            Next call
          </button>
        )}
      </div>
      {option && index === boss.steps.length - 1 && (
        <ExitBar continueHref={next?.href ?? "/home"} continueLabel={next?.label ?? "Back to the week"} />
      )}
    </div>
  );
}

export function Dashboard() {
  const { modules } = useContent();
  const { state } = useProgress();
  const level = levelFor(state.xp);
  const nextId = nextModuleId(state, modules);
  const next = modules.find((module) => module.id === nextId);
  const finished = modules.length > 0 && modules.every((module) => state.modules[module.id]?.completed);
  const homeLine = storyLine();
  const day = WEEK.find((stop) => !state.modules[stop.moduleId]?.completed)?.day ?? 5;
  const readiness = siteReadiness(state);
  const due = SAFETY_CHECKS.some((check) => {
    if (!state.modules[check.moduleId]?.completed) return false;
    const review = state.reviews[check.id];
    return !review || review.due <= Date.now();
  });
  return (
    <div className="stack">
      <p className="kicker">Construction Academy</p>
      <h2>Day {day}</h2>
      <p>Your first shift starts at 08:00.</p>
      <div className="yard-banner">
        <CrewSite />
      </div>
      <div className="academy-head">
        <Avatar equipped={state.equipped} />
        <div className="stack">
          <p>
            <strong>XP: {state.xp.toLocaleString("en-CA")}</strong>
          </p>
          <p>
            Level {level.current.level} — {level.current.title}
          </p>
          <p className="muted">
            {tradeTitle(state.trade)} · {ROLES.find((role) => role.id === state.role)?.title ?? "Crew member"} · {jurisdictionLabel(state.jurisdiction)}
          </p>
        </div>
      </div>
      <blockquote className="speech">
        <p className="kicker">{homeLine.speaker} · {PROJECT.name}</p>
        <TeachText text={homeLine.text} />
      </blockquote>
      {due && (
        <article className="panel stack">
          <h3>30-second safety check</h3>
          <p>A finished subject is back for one question. Five seconds of thinking is enough. The clock does not add points.</p>
          <Link className="btn btn-primary" to="/check">
            Answer the check
          </Link>
        </article>
      )}
      <h3>Your first week on the job</h3>
      {[1, 2, 3, 4, 5].map((number) => (
        <section key={number} className="stack">
          <p className="kicker">Day {number}</p>
          {WEEK.filter((stop) => stop.day === number).map((stop) => {
            const complete = Boolean(state.modules[stop.moduleId]?.completed);
            return (
              <Link key={stop.title} className="mission-row" to={stop.href}>
                <span>{complete ? "Done" : "Open"}</span>
                <span>
                  {stop.time} — {stop.title}
                </span>
              </Link>
            );
          })}
        </section>
      ))}
      <h3>Site readiness</h3>
      <div className="stack">
        {readiness.map((row) => (
          <p key={row.id} className={`ready ready-${row.status}`}>
            {readinessLabel(row.status)} — {row.label}
          </p>
        ))}
      </div>
      <h3>Boss levels</h3>
      <div className="grid-2">
        {BOSSES.map((boss) => (
          <article key={boss.id} className="panel stack">
            <h3>{boss.title}</h3>
            <TeachText text={boss.detail} />
            <Link className="btn btn-primary" to={`/boss/${boss.id}`}>
              Start
            </Link>
          </article>
        ))}
      </div>
      {finished && (
        <article className="panel ticket stack">
          <p className="kicker">Completion</p>
          <h2>Path complete</h2>
          <p>You finished the SiteWise modules on this device. Open the completion record. It is a training record, not a government certification.</p>
          <Link className="btn btn-primary" to="/record">
            Open completion record
          </Link>
        </article>
      )}
      <p>
        <Link to="/games">All games</Link>
        {next ? ` · Suggested lesson: ${next.title}.` : ""}
      </p>
      <p className="disclaimer">{DISCLAIMER}</p>
    </div>
  );
}

export function TrainingMap() {
  const { modules } = useContent();
  const { state } = useProgress();
  const current = nextModuleId(state, modules);
  return (
    <div className="stack">
      <h2>Training map</h2>
      <TeachText text="Top to bottom is the suggested order: learn the yard, then the gear, then the hazards. Every stop is open. Play the game, or start with the lesson." />
      <div className="path">
        {SHIFTS.map((shift) => (
          <div key={shift.number} className="panel">
            <p className="kicker">Shift {shift.number}</p>
            <h3>{shift.title}</h3>
            <TeachText text={shift.summary} />
          </div>
        ))}
        {modules.map((module, index) => {
          const done = Boolean(state.modules[module.id]?.completed);
          const status = done ? "done" : module.id === current ? "current" : "";
          const game = mainGame(module);
          return (
            <div key={module.id} className={`path-node ${status}`}>
              <div className="path-rail">
                <div className="path-dot" />
                {index < modules.length - 1 && <div className="path-line" />}
              </div>
              <div className="panel path-card stack">
                <p className="kicker">{shiftFor(module.id) ? `Shift ${shiftFor(module.id)?.number}` : "Added module"}</p>
                <h3>{module.title}</h3>
                <TeachText text={module.description} />
                <p className="muted">
                  {module.estimatedMinutes} minutes · {module.difficulty} · +{module.completionXp} XP · {modulePercent(module.id, state.modules[module.id])}%
                  {game ? ` · Game: ${game.name}` : ""}
                </p>
                <div className="row">
                  {game && (
                    <Link className="btn btn-primary" to={game.href}>
                      Play {game.name}
                    </Link>
                  )}
                  <Link className="btn btn-ghost" to={`/training/${module.id}`}>
                    Open lesson
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Missions() {
  const { modules } = useContent();
  const { state } = useProgress();
  const next = modules.find((module) => module.id === nextModuleId(state, modules));
  return (
    <div className="stack">
      <h2>Missions</h2>
      <article className="panel ticket stack">
        <p className="kicker">Mission</p>
        <h3>First day on site</h3>
        <p>Orientation, PPE, hazards, WHMIS, and emergency basics. Open any of them from Games. The map shows a suggested order, not a lock.</p>
        <ul>
          {MISSION_MODULE_IDS.map((id) => {
            const module = MODULES.find((item) => item.id === id)!;
            return (
              <li key={id}>
                {state.modules[id]?.completed ? "Done" : "Open"} — {module.title}
              </li>
            );
          })}
        </ul>
        {next && (
          <Link className="btn btn-primary" to={`/training/${next.id}`}>
            Continue mission
          </Link>
        )}
      </article>
      <article className="panel stack">
        <h3>Your first shift</h3>
        <p>Eight decisions on one morning at Northline. The answers stay hidden until the debrief. It makes more sense after the other games, and it is open now.</p>
        <Link className="btn btn-primary" to="/training/shift?play=shift-sim">
          Play Your First Shift
        </Link>
      </article>
    </div>
  );
}

export function BadgesPage() {
  const { state } = useProgress();
  const earned = new Set(earnedBadgeIds(state));
  return (
    <div className="stack">
      <h2>Badges</h2>
      <p>
        Hazard identifications: {state.hazards.length} / {HAZARD_BADGE_TARGET}. Badges record what you finished in SITEWISE. They are not licences.
      </p>
      <div className="badge-grid">
        {BADGES.map((badge) => (
          <article key={badge.id} className={earned.has(badge.id) ? "panel badge-card" : "panel badge-card locked"}>
            <h3>{badge.name}</h3>
            <TeachText text={badge.detail} />
            <p className="muted">{earned.has(badge.id) ? "Earned on this device." : badge.how}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export function ProgressPage() {
  const { modules } = useContent();
  const { state } = useProgress();
  const level = levelFor(state.xp);
  const scores = tallies(state);
  return (
    <div className="stack">
      <h2>Progress</h2>
      <p>
        Level {level.current.level} — {level.current.title}. Total XP {state.xp}. Path {coursePercent(state, modules)}%. Time on modules: {Object.values(state.modules).reduce((sum, save) => sum + (save.seconds ?? 0), 0)} seconds.
      </p>
      <h3>Site readiness</h3>
      {siteReadiness(state).map((row) => (
        <p key={row.id} className={`ready ready-${row.status}`}>
          {readinessLabel(row.status)} — {row.label}
        </p>
      ))}
      <h3>Scores</h3>
      <p className="muted">First answers only. These are feedback, not a qualification.</p>
      {DIMENSIONS.map((dimension) => {
        const tally = scores[dimension.id];
        const pct = tally.total ? Math.round((tally.correct / tally.total) * 100) : 0;
        return (
          <div key={dimension.id} className="score-line">
            <span>{dimension.label}</span>
            <div className="bar" aria-hidden>
              <span style={{ width: `${pct}%` }} />
            </div>
            <span>{tally.total ? `${pct}%` : "—"}</span>
          </div>
        );
      })}
      <h3>XP</h3>
      <p>Faster is not safer. Nothing in this table pays you for speed, and an unsafe shortcut is never worth points because it was quick.</p>
      {XP_ROWS.map((row) => (
        <p key={row.label}>
          <strong>{row.label}:</strong> {row.value}. {row.note}
        </p>
      ))}
      <h3>Weak areas</h3>
      <p className="muted">A weak area is a score under 70% after at least two first answers.</p>
      {DIMENSIONS.filter((dimension) => {
        const tally = scores[dimension.id];
        return tally.total >= 2 && tally.correct / tally.total < 0.7;
      }).map((dimension) => (
        <p key={dimension.id}>{dimension.label} needs another look.</p>
      ))}
      {DIMENSIONS.every((dimension) => {
        const tally = scores[dimension.id];
        return tally.total < 2 || tally.correct / tally.total >= 0.7;
      }) && <p>No weak area yet. Keep playing and the first answers will fill this in.</p>}
      <h3>Modules</h3>
      {modules.map((module) => (
        <p key={module.id}>
          {module.title} — {state.modules[module.id]?.completed ? "Complete" : `${modulePercent(module.id, state.modules[module.id])}%`}
        </p>
      ))}
    </div>
  );
}

export function Resources() {
  const sources = MODULES.flatMap((module) => module.sources).filter(
    (source, index, list) => list.findIndex((item) => item.url === source.url) === index,
  );
  return (
    <div className="stack">
      <h2>Resources</h2>
      <p>{PRODUCT.subtitle} Use these pages when you want the authority behind a module, not a retelling.</p>
      <h3>Seven kinds of training</h3>
      {TRAINING_TYPES.map((item) => (
        <article key={item.id} className="panel">
          <strong>
            {item.title}
            {item.inThisApp ? " · SITEWISE" : " · outside this app"}
          </strong>
          <TeachText text={item.body} />
        </article>
      ))}
      <h3>Jurisdictions</h3>
      <p>Lessons tagged Canada are general Canadian information. A lesson can also be tagged for one province, or for several.</p>
      {JURISDICTIONS.filter((item) => item.selectable).map((item) => (
        <p key={item.code}>
          {item.label}: {jurisdictionPickerDetail(item.code)}
        </p>
      ))}
      <div className="disclaimer">{DISCLAIMER}</div>
      <h3>Sources & references</h3>
      <SourceList sources={sources} />
    </div>
  );
}

export function Profile() {
  const { state, setJurisdiction, setRole, setTrade } = useProgress();
  return (
    <div className="stack">
      <h2>Profile</h2>
      <p>Role and province choose which labelled lessons you see. They do not assign legal requirements.</p>
      <label className="field">
        What describes you?
        <select value={state.role ?? "new"} onChange={(event) => setRole(event.target.value as Role)}>
          {ROLES.map((role) => (
            <option key={role.id} value={role.id}>
              {role.title}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Province
        <select
          value={state.jurisdiction ?? "ALBERTA"}
          onChange={(event) => setJurisdiction(event.target.value as JurisdictionCode)}
        >
          {JURISDICTIONS.filter((item) => item.selectable).map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Trade
        <select value={state.trade ?? ""} onChange={(event) => setTrade(event.target.value as Trade)}>
          <option value="" disabled>
            Not chosen yet
          </option>
          {TRADES.map((trade) => (
            <option key={trade.id} value={trade.id}>
              {trade.title}
            </option>
          ))}
        </select>
      </label>
      <p className="muted">{tradeHint(state.trade)}</p>
      <Link to="/badges">Badges</Link>
      <Link to="/resources">Resources</Link>
      <Link to="/record">Completion record</Link>
      <Link to="/admin">Admin</Link>
      <Link to="/signin">Sign in</Link>
      <SettingsScreen embedded />
    </div>
  );
}
