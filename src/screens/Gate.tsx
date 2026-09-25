import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DISCLAIMER, JURISDICTIONS, jurisdictionPickerDetail, LOADING_LINES, PHASES, PRODUCT, ROLES, TRAINING_TYPES } from "../content/framework";
import { TRADES, type Trade } from "../content/trades";
import { XP_ROWS } from "../content/framework";
import type { JurisdictionCode, Role } from "../content/model";
import { useProgress } from "../state/progress";
import { CrewSite } from "../components/CrewSite";
import { TeachText } from "../components/Parable";
import { startYardSound, stopYardSound } from "../lib/sound";

export function WorksiteLoad() {
  const [line, setLine] = useState(0);
  useEffect(() => {
    const spin = window.setInterval(() => setLine((value) => (value + 1) % LOADING_LINES.length), 380);
    return () => window.clearInterval(spin);
  }, []);

  return (
    <div className="stack worksite-load">
      <div className="wordmark lg">
        <span className="mark" aria-hidden />
        {PRODUCT.name}
      </div>
      <p>The crew is on the site...</p>
      <CrewSite />
      <p className="muted">{LOADING_LINES[line]}</p>
    </div>
  );
}

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const reduce = document.documentElement.dataset.motion === "reduce";
    const done = window.setTimeout(onDone, reduce ? 900 : 1600);
    return () => window.clearTimeout(done);
  }, [onDone]);

  return (
    <div className="boot">
      <WorksiteLoad />
    </div>
  );
}

function GearMark({ kind }: { kind: "hat" | "vest" | "glasses" | "boots" | "aid" | "extinguisher" }) {
  return (
    <svg className="live-chip" viewBox="0 0 36 36" aria-hidden>
      <rect width="36" height="36" rx="18" fill="var(--bg)" />
      {kind === "hat" && <path d="M8 18h20c-1 7-6 10-10 10S9 25 8 18z" fill="var(--amber)" />}
      {kind === "vest" && <path d="M12 8h12l3 8H9zM10 18h16l-2 12H12z" fill="var(--amber)" />}
      {kind === "glasses" && <path d="M6 16h8v6H6zm16 0h8v6h-8zM14 18h8" fill="none" stroke="var(--steel)" strokeWidth="2" />}
      {kind === "boots" && <path d="M10 10h6v12H8v4h16v-4h-2V10z" fill="var(--earth-deep)" />}
      {kind === "aid" && (
        <>
          <rect x="8" y="8" width="20" height="20" rx="3" fill="var(--ink)" />
          <path d="M16 12h4v12h-4zM12 16h12v4H12z" fill="var(--ok)" />
        </>
      )}
      {kind === "extinguisher" && <rect x="14" y="8" width="8" height="18" rx="3" fill="var(--danger)" />}
    </svg>
  );
}

function HeroArt() {
  return (
    <div className="hero-art">
      <svg viewBox="0 0 720 640" width="720" height="640" preserveAspectRatio="xMidYMid meet" role="img" aria-label="A construction yard in training: a building, crane, ladder, a worker in a hard hat and high-visibility vest, barricade, first-aid kit, extinguisher, and a labelled chemical can.">
        <rect width="720" height="640" fill="var(--bg)" />
        <g className="live-sun">
          <circle cx="120" cy="86" r="42" fill="var(--amber)" />
        </g>
        <g className="dust" fill="var(--concrete)">
          <circle cx="200" cy="120" r="2" />
          <circle cx="340" cy="90" r="1.5" />
          <circle cx="480" cy="140" r="2" />
          <circle cx="90" cy="200" r="1.4" />
        </g>
        <rect y="430" width="720" height="210" fill="var(--earth-deep)" />
        <rect x="70" y="168" width="250" height="262" fill="var(--panel-2)" />
        <polygon points="48,168 195,62 342,168" fill="var(--bg-raise)" />
        <g className="live-windows">
          <rect className="live-wink" x="98" y="198" width="40" height="30" fill="var(--amber)" />
          <rect className="live-wink d2" x="156" y="198" width="40" height="30" fill="var(--concrete)" />
          <rect className="live-wink d3" x="214" y="198" width="40" height="30" fill="var(--amber)" />
          <rect className="live-wink d4" x="98" y="250" width="40" height="30" fill="var(--concrete)" />
          <rect className="live-wink d2" x="156" y="250" width="40" height="30" fill="var(--amber)" />
          <rect className="live-wink" x="214" y="250" width="40" height="30" fill="var(--concrete)" />
        </g>
        <rect x="286" y="168" width="8" height="262" fill="var(--steel)" />
        <rect x="308" y="168" width="8" height="262" fill="var(--steel)" />
        <rect x="286" y="210" width="30" height="6" fill="var(--amber)" />
        <rect x="286" y="250" width="30" height="6" fill="var(--amber)" />
        <rect x="286" y="290" width="30" height="6" fill="var(--amber)" />
        <rect x="286" y="330" width="30" height="6" fill="var(--amber)" />
        <rect x="286" y="370" width="30" height="6" fill="var(--amber)" />
        <path d="M430 150h14v280h-14z" fill="var(--steel)" />
        <path d="M437 150h210" stroke="var(--steel)" strokeWidth="10" />
        <g className="live-hook">
          <path d="M630 150v36" stroke="var(--amber)" strokeWidth="4" />
          <rect x="614" y="186" width="32" height="16" fill="var(--amber)" />
        </g>
        <g className="live-stripes">
          <rect x="250" y="470" width="86" height="18" fill="var(--amber)" />
          <rect x="250" y="488" width="86" height="18" fill="var(--ink-strong)" />
          <rect x="250" y="506" width="86" height="18" fill="var(--amber)" />
        </g>
        <g className="live-worker">
          <circle cx="390" cy="392" r="22" fill="var(--concrete)" />
          <path d="M368 386h44c-1 14-10 18-22 18s-21-4-22-18z" fill="var(--amber)" />
          <path d="M376 410h28l6 28h-40z" fill="var(--amber)" />
          <g className="live-leg">
            <rect x="382" y="438" width="8" height="32" fill="var(--earth)" />
          </g>
          <g className="live-leg back">
            <rect x="402" y="438" width="8" height="32" fill="var(--earth)" />
          </g>
        </g>
        <g className="live-float">
          <rect x="500" y="392" width="46" height="34" rx="4" fill="var(--ink)" />
          <path d="M514 400h12v18h-12zM506 406h28v6H506z" fill="var(--ok)" />
        </g>
        <g className="live-float d2">
          <rect x="560" y="376" width="22" height="52" rx="6" fill="var(--danger)" />
          <rect x="566" y="364" width="10" height="14" fill="var(--ink-strong)" />
        </g>
        <g className="live-cone">
          <path d="M78 548h28l14 36H64z" fill="var(--amber)" />
        </g>
        <g className="live-cone d2">
          <path d="M130 548h28l14 36h-56z" fill="var(--amber)" />
        </g>
        <g className="live-float d3">
          <rect x="620" y="500" width="52" height="36" rx="4" fill="var(--earth)" />
          <rect x="632" y="488" width="28" height="14" rx="2" fill="var(--amber)" />
        </g>
        <g className="live-float d4">
          <path d="M150 560h70c-4 28-18 40-35 40s-31-12-35-40z" fill="var(--amber)" />
          <rect x="176" y="546" width="22" height="10" rx="3" fill="var(--earth)" />
        </g>
        <g className="live-diamond">
          <rect x="470" y="530" width="36" height="36" fill="var(--danger)" transform="rotate(45 488 548)" />
          <rect x="482" y="536" width="12" height="24" fill="var(--ink)" />
        </g>
      </svg>
    </div>
  );
}

export function TitleScreen({ onEnter }: { onEnter: () => void }) {
  const { state } = useProgress();
  const navigate = useNavigate();
  const hasProgress = state.onboarded;
  function enter(path: string) {
    if (state.settings.sound !== false) startYardSound();
    onEnter();
    navigate(path);
  }
  return (
    <div className="title-screen">
      <div className="title-grid">
        <div className="title-copy">
          <p className="kicker">{PRODUCT.line}</p>
          <div className="wordmark lg">
            <span className="mark" aria-hidden />
            {PRODUCT.name}
          </div>
          <h2 style={{ fontSize: "clamp(1.4rem, 3vw, 2rem)" }}>{PRODUCT.subtitle}</h2>
          <p className="muted">
            General Canadian information, with Alberta-specific information labelled when it applies. A lesson opens for your province only when it is written for that province.
          </p>
          <ul className="title-tools">
            {(
              [
                ["hat", "Hard hat"],
                ["vest", "High-vis"],
                ["glasses", "Eye protection"],
                ["boots", "Boots"],
                ["aid", "First aid"],
                ["extinguisher", "Emergency"],
              ] as const
            ).map(([kind, label]) => (
              <li key={kind}>
                <GearMark kind={kind} />
                <span>{label}</span>
              </li>
            ))}
          </ul>
          <div className="row">
            <button type="button" className="btn btn-primary" onClick={() => enter(hasProgress ? "/home" : "/onboarding")}>
              {hasProgress ? "Enter the site" : "Start training"}
            </button>
            {hasProgress && (
              <button type="button" className="btn btn-ghost" onClick={() => enter("/games")}>
                Play the games
              </button>
            )}
          </div>
          <div className="row">
            <Link className="btn btn-text" to="/signin">
              Sign in
            </Link>
            <Link className="btn btn-text" to="/how">
              How it works
            </Link>
            <Link className="btn btn-text" to="/settings">
              Settings
            </Link>
          </div>
          <p className="disclaimer">{DISCLAIMER}</p>
        </div>
        <HeroArt />
      </div>
    </div>
  );
}

export function OnboardingScreen() {
  const progress = useProgress();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role | null>(progress.state.role);
  const [trade, setTrade] = useState<Trade | null>(progress.state.trade);
  const [province, setProvince] = useState<JurisdictionCode | null>(progress.state.jurisdiction);

  return (
    <div className="standalone">
      <div className="title-copy stack" style={{ maxWidth: 860 }}>
        <p className="kicker">Step {step + 1} of 4</p>
        {step === 0 && (
          <>
            <h2>Welcome to the Site.</h2>
            <p>You’ve just joined a construction crew.</p>
            <p>
              You’ll learn how to navigate the site, identify hazards, use PPE, understand WHMIS, communicate with your crew, and respond when something goes wrong.
            </p>
            <p className="muted">
              Northline Yard is fictional. The lessons are general education, not your employer’s orientation. Your first week is on the home screen. Games stays open if you want to jump ahead.
            </p>
          </>
        )}
        {step === 1 && (
          <>
            <h2>What describes you?</h2>
            <p>This tailors examples. It does not decide which certificates the law requires.</p>
            <div className="grid-2">
              {ROLES.map((item) => (
                <button key={item.id} type="button" className={role === item.id ? "select-card on" : "select-card"} onClick={() => setRole(item.id)}>
                  {item.title}
                  <small>{item.detail}</small>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h2>What type of construction work are you interested in?</h2>
            <p>This changes which calls you see more of. It does not certify the trade, and it does not replace a ticket.</p>
            <div className="grid-2">
              {TRADES.map((item) => (
                <button key={item.id} type="button" className={trade === item.id ? "select-card on" : "select-card"} onClick={() => setTrade(item.id)}>
                  {item.title}
                  <small>{item.detail}</small>
                </button>
              ))}
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h2>What province are you working in?</h2>
            <p>This chooses which labelled lessons you see. It does not change the law, and it does not certify you.</p>
            <div className="grid-2">
              {JURISDICTIONS.filter((item) => item.selectable).map((item) => (
                <button
                  key={item.code}
                  type="button"
                  className={province === item.code ? "select-card on" : "select-card"}
                  onClick={() => setProvince(item.code)}
                >
                  {item.label}
                  <small>{jurisdictionPickerDetail(item.code)}</small>
                </button>
              ))}
            </div>
            <div className="disclaimer">{DISCLAIMER}</div>
          </>
        )}
        <div className="row">
          {step > 0 && (
            <button type="button" className="btn btn-ghost" onClick={() => setStep((value) => value - 1)}>
              Back
            </button>
          )}
          {step < 3 && (
            <button type="button" className="btn btn-primary" disabled={(step === 1 && !role) || (step === 2 && !trade)} onClick={() => setStep((value) => value + 1)}>
              Continue
            </button>
          )}
          {step === 3 && (
            <button
              type="button"
              className="btn btn-primary"
              disabled={!role || !trade || !province}
              onClick={() => {
                if (!role || !trade || !province) return;
                progress.setProfile(role, province);
                progress.setTrade(trade);
                navigate("/home");
              }}
            >
              Enter the site
            </button>
          )}
          <Link className="btn btn-text" to="/">
            Title screen
          </Link>
        </div>
      </div>
    </div>
  );
}

export function HowItWorks() {
  return (
    <div className="standalone">
      <div className="title-copy stack" style={{ maxWidth: 860 }}>
        <p className="kicker">{PRODUCT.name}</p>
        <h2>How it works</h2>
        <p>{PRODUCT.subtitle}</p>
        <p>
          Every subject follows the same path. The mechanic changes. A quiz is not the whole module. Once you are in, Games lists every activity by name, and Play opens that activity directly.
        </p>
        <div className="grid-2">
          {PHASES.map((phase) => (
            <div key={phase.id} className="panel">
              <h3>{phase.label}</h3>
              <TeachText
                text={
                  phase.id === "learn"
                    ? "Short teaching: symbols, rules of thumb, and the limit of the screen."
                    : phase.id === "practice"
                      ? "A small rep before the game, so the first click is not the final exam."
                      : phase.id === "play"
                        ? "The module’s own game: a yard, a locker, a label, a conversation."
                        : phase.id === "test"
                          ? "A knowledge check and a final challenge. First answers are the ones that count."
                          : "Results, mistakes, sources, and a badge when the path earns one."
                }
              />
            </div>
          ))}
        </div>
        <h3>What this is, and what it is not</h3>
        {TRAINING_TYPES.map((item) => (
          <div key={item.id} className="panel">
            <strong>
              {item.title}
              {item.inThisApp ? " · this app" : " · not issued here"}
            </strong>
            <TeachText text={item.body} />
          </div>
        ))}
        <h3>Points</h3>
        {XP_ROWS.map((row) => (
          <p key={row.label}>
            <strong>{row.label}:</strong> {row.value}. {row.note}
          </p>
        ))}
        <p>Faster is not safer. SITEWISE does not add points for speed.</p>
        <Link className="btn btn-primary" to="/">
          Back
        </Link>
      </div>
    </div>
  );
}

export function SettingsScreen({ embedded = false }: { embedded?: boolean }) {
  const { state, updateSettings, resetProgress } = useProgress();
  const navigate = useNavigate();
  const body = (
    <div className="stack">
      <h2>Settings</h2>
      <label className="row">
        <input
          type="checkbox"
          checked={state.settings.textScale === "large"}
          onChange={(event) => updateSettings({ textScale: event.target.checked ? "large" : "default" })}
        />
        Larger text
      </label>
      <label className="row">
        <input
          type="checkbox"
          checked={state.settings.reducedMotion}
          onChange={(event) => updateSettings({ reducedMotion: event.target.checked })}
        />
        Reduce motion
      </label>
      <label className="row">
        <input
          type="checkbox"
          checked={state.settings.sound !== false}
          onChange={(event) => {
            updateSettings({ sound: event.target.checked });
            if (event.target.checked) startYardSound();
            else stopYardSound();
          }}
        />
        Site sound
      </label>
      <button
        type="button"
        className="btn btn-ghost"
        onClick={() => {
          resetProgress();
          navigate("/");
        }}
      >
        Reset training progress
      </button>
      <p className="disclaimer">{DISCLAIMER}</p>
      {!embedded && (
        <Link className="btn btn-text" to="/">
          Title screen
        </Link>
      )}
    </div>
  );
  if (embedded) return body;
  return (
    <div className="standalone">
      <div className="title-copy">{body}</div>
    </div>
  );
}
