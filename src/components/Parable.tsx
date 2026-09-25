import { useEffect, useState } from "react";
import { parableFor, type ParableId } from "../content/parables";

export function TeachText({ text }: { text: string }) {
  const [open, setOpen] = useState(false);
  const parable = parableFor(text);
  return (
    <div className="teach">
      <button type="button" className={open ? "teach-line on" : "teach-line"} aria-expanded={open} onClick={() => setOpen((value) => !value)}>
        <span>{text}</span>
        <span className="kicker">{open ? "Hide" : "See it"}</span>
      </button>
      {open ? <Parable id={parable.id} story={parable.story} /> : null}
    </div>
  );
}

export function Parable({ id, story }: { id: ParableId; story: string }) {
  const [beat, setBeat] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(() => setBeat((value) => (value === 0 ? 1 : 0)), 1600);
    return () => window.clearInterval(timer);
  }, [id]);

  return (
    <figure className="parable">
      <figcaption>
        <span className="kicker">See it</span>
        <p>{story}</p>
      </figcaption>
      <Scene id={id} beat={beat} />
    </figure>
  );
}

function Scene({ id, beat }: { id: ParableId; beat: number }) {
  const after = beat === 1;
  return (
    <svg className="parable-art" viewBox="0 0 420 200" role="img" aria-hidden>
      <rect width="420" height="200" fill="var(--bg)" />
      <rect y="158" width="420" height="42" fill="var(--earth-deep)" />
      <text x="16" y="22" fill="var(--amber)" fontSize="13" fontFamily="Barlow Condensed, sans-serif" letterSpacing="1.5">
        {after ? "THEN" : "FIRST"}
      </text>
      {id === "signin" && (
        <>
          <g transform="translate(36 48)">
            <rect width="110" height="100" rx="6" fill="var(--panel-2)" />
            <text x="12" y="22" fill="var(--amber)" fontSize="13" fontFamily="Barlow Condensed, sans-serif">BOARD</text>
            <rect x="12" y="34" width="70" height="6" fill="var(--muted)" />
            <rect x="12" y="48" width="64" height="6" fill="var(--muted)" />
            <rect x="12" y="62" width="72" height="6" fill={after ? "var(--ok)" : "var(--muted)"} />
            {after && <path d="M78 70l8 8 16-18" fill="none" stroke="var(--ok)" strokeWidth="4" />}
          </g>
          <Worker x={after ? 160 : 280} />
        </>
      )}
      {id === "gate" && (
        <>
          <rect x="30" y="80" width="140" height="8" fill="var(--steel)" />
          <rect x="250" y="80" width="140" height="8" fill="var(--steel)" />
          <rect x="170" y="60" width="8" height="90" fill={after ? "var(--ok)" : "var(--amber)"} />
          <rect x="210" y="60" width="8" height="90" fill={after ? "var(--ok)" : "var(--amber)"} />
          <Worker x={after ? 176 : 300} />
        </>
      )}
      {id === "ask" && (
        <>
          <Worker x={120} />
          <Worker x={230} vest="var(--ok)" />
          <rect className="live-float" x="168" y="48" width="70" height="28" rx="8" fill="var(--ink)" />
        </>
      )}
      {id === "housekeeping" && (
        <>
          <g transform={after ? "translate(308 118)" : "translate(120 132)"}>
            <rect x="0" y="0" width="36" height="10" fill="var(--amber)" />
            <rect x="10" y="12" width="28" height="8" fill="var(--earth)" />
          </g>
          <rect x="300" y="110" width="50" height="40" fill="var(--panel-2)" />
          <Worker x={180} />
        </>
      )}
      {id === "ppe" && (
        <>
          <Worker x={70} hat={after} vest={after ? "var(--amber)" : "var(--panel-2)"} eyes={after} />
          <g transform="translate(250 70)">
            <rect width="90" height="70" rx="6" fill="var(--panel-2)" />
            {!after && <text x="45" y="42" textAnchor="middle" fill="var(--faint)" fontSize="14" fontFamily="Barlow Condensed, sans-serif">SHADES</text>}
            {after && <text x="45" y="42" textAnchor="middle" fill="var(--amber)" fontSize="14" fontFamily="Barlow Condensed, sans-serif">GOGGLES</text>}
          </g>
        </>
      )}
      {id === "hierarchy" && (
        <>
          <rect x="70" y="118" width="80" height="32" fill="var(--ink-strong)" />
          <g transform={after ? "translate(70 112)" : "translate(200 96)"}>
            <rect width="80" height="14" fill="var(--amber)" />
          </g>
          <rect x="280" y="100" width="46" height="40" fill="var(--panel-2)" />
          <path d="M288 108h30v24h-30z" fill="var(--ok)" opacity={after ? 0.35 : 1} />
        </>
      )}
      {id === "cord" && (
        <>
          <path d="M30 140 C 80 90, 130 160, 180 110" fill="none" stroke="var(--danger)" strokeWidth="6" />
          {!after && <rect className="live-float" x="100" y="100" width="36" height="14" rx="2" fill="var(--concrete)" />}
          {after && (
            <g transform="translate(250 48)">
              <path d="M20 0v40" stroke="var(--steel)" strokeWidth="4" />
              <path d="M8 40h24" stroke="var(--amber)" strokeWidth="6" />
              <text x="20" y="70" textAnchor="middle" fill="var(--amber)" fontSize="12" fontFamily="Barlow Condensed, sans-serif">OUT</text>
            </g>
          )}
          <Worker x={320} />
        </>
      )}
      {id === "opening" && (
        <>
          <rect x="80" y="120" width="90" height="30" fill="var(--ink-strong)" />
          <g transform={after ? "translate(80 116)" : "translate(210 100)"}>
            <rect width="90" height="16" fill="var(--amber)" />
          </g>
          <Worker x={260} />
        </>
      )}
      {id === "ladder" && (
        <>
          <g opacity={after ? 0.35 : 1}>
            <rect x="70" y="40" width="8" height="110" fill="var(--steel)" />
            <rect x="110" y="40" width="8" height="110" fill="var(--steel)" />
            <path d="M70 80h48" stroke="var(--danger)" strokeWidth="6" />
          </g>
          {after && <path className="live-wink" d="M220 150h24v-16h24v-16h24v-16h24" fill="none" stroke="var(--ok)" strokeWidth="6" />}
          <Worker x={after ? 250 : 150} />
        </>
      )}
      {id === "report" && (
        <>
          <Worker x={90} />
          <Worker x={210} vest="var(--ok)" />
          <rect className={after ? "live-float" : ""} x="140" y="70" width="40" height="28" rx="4" fill="var(--ink)" />
        </>
      )}
      {id === "stop" && (
        <>
          <circle className={after ? "" : "parable-spin"} cx="120" cy="110" r="28" fill="none" stroke="var(--danger)" strokeWidth="8" />
          {after && <path d="M100 90l40 40M140 90l-40 40" stroke="var(--amber)" strokeWidth="6" />}
          <Worker x={240} />
        </>
      )}
      {id === "alarm" && (
        <>
          <circle className="live-pulse" cx="70" cy="70" r="16" fill="var(--danger)" />
          <circle cx="320" cy="120" r="22" fill="none" stroke="var(--amber)" strokeWidth="4" />
          <Worker x={after ? 280 : 140} />
        </>
      )}
      {id === "label" && (
        <>
          <g transform="translate(36 72)">
            <rect width="48" height="78" rx="10" fill="var(--panel-2)" stroke="var(--steel)" />
            <rect width="48" height="14" rx="7" fill="var(--steel)" />
            {after ? (
              <rect className="live-wink" x="10" y="28" width="28" height="28" rx="2" fill="var(--danger)" />
            ) : (
              <text x="24" y="50" textAnchor="middle" fill="var(--faint)" fontSize="22" fontFamily="Barlow Condensed, sans-serif">?</text>
            )}
          </g>
          <g transform="translate(250 58)" opacity={after ? 1 : 0.35}>
            <rect width="120" height="88" rx="4" fill="var(--ink)" />
            <rect x="12" y="14" width="72" height="8" fill="var(--amber)" />
            <rect x="12" y="30" width="90" height="5" fill="var(--muted)" />
            <rect x="12" y="42" width="80" height="5" fill="var(--muted)" />
            <rect x="12" y="54" width="86" height="5" fill="var(--muted)" />
          </g>
          <Worker x={after ? 168 : 100} />
        </>
      )}
      {id === "spill" && (
        <>
          <rect x="80" y="70" width="28" height="40" rx="4" fill="var(--amber)" transform={after ? "" : "rotate(70 94 90)"} />
          <ellipse cx="150" cy="150" rx={after ? 18 : 40} ry="10" fill="var(--steel)" />
          <Worker x={after ? 280 : 200} />
        </>
      )}
      {id === "talk" && (
        <>
          <Worker x={100} />
          <Worker x={240} vest="var(--ok)" />
          {after ? (
            <rect className="live-float" x="150" y="46" width="90" height="26" rx="8" fill="var(--ink)" />
          ) : (
            <path d="M150 120h80" stroke="var(--danger)" strokeWidth="4" />
          )}
        </>
      )}
      {id === "load" && (
        <>
          <g className="crew-hoist">
            <rect x="150" y="20" width="4" height="40" fill="var(--steel)" />
            <rect x="130" y="58" width="44" height="16" fill="var(--earth)" />
          </g>
          <Worker x={after ? 280 : 140} />
        </>
      )}
      {id === "dust" && (
        <>
          <rect x="60" y="90" width="70" height="24" fill="var(--panel-2)" />
          {!after && <ellipse className="live-pulse" cx="160" cy="80" rx="40" ry="18" fill="var(--concrete)" opacity="0.7" />}
          {after && <path className="live-wink" d="M120 80c20 20 20 40 0 50" fill="none" stroke="var(--info)" strokeWidth="4" />}
          <Worker x={250} eyes={after} />
        </>
      )}
    </svg>
  );
}

function Worker({ x, vest = "var(--amber)", hat = false, eyes = false }: { x: number; vest?: string; hat?: boolean; eyes?: boolean }) {
  return (
    <g transform={`translate(${x} 86)`}>
      <g className="live-worker">
        {hat && <path d="M-2 12h28c-1 8-6 11-14 11S-1 20 -2 12z" fill="var(--amber)" />}
        <circle cx="12" cy="14" r="9" fill="var(--concrete)" />
        {eyes && <rect x="4" y="12" width="16" height="4" rx="2" fill="var(--steel)" />}
        <rect x="4" y="24" width="16" height="22" rx="4" fill={vest} />
        <rect x="5" y="46" width="5" height="18" rx="2" fill="var(--ink-strong)" />
        <rect x="14" y="46" width="5" height="18" rx="2" fill="var(--ink-strong)" />
      </g>
    </g>
  );
}
