import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "../components/Avatar";
import { ExitBar } from "../components/ExitBar";
import { Feedback } from "../components/activities";
import { WalkGrid } from "../components/WalkGrid";
import { TeachText } from "../components/Parable";
import { areaSpeech, tradeRadio, tradeToolbox } from "../content/tradeScenes";
import { SAFETY_CHECKS } from "../content/checks";
import { continueAfter } from "../content/campaign";
import { DECISIONS } from "../content/decisions";
import { CONCRETE_CUT, GEAR, concreteReady, gearUnlocked } from "../content/gear";
import { LOCKER } from "../content/lockerItems";
import { RADIO } from "../content/radio";
import { HUNT_DECISION, HUNT_HAZARDS, SITE_AREAS } from "../content/site";
import { TOOLBOX } from "../content/toolbox";
import { WHMIS_ROOM } from "../content/whmisRoom";
import { tradeHint, tradeTitle } from "../content/trades";
import type { ScoreDimension } from "../content/model";
import { useProgress } from "../state/progress";

const AREA_MARK: Record<string, string> = {
  building: "Building",
  ladder: "Ladder",
  electrical: "Electrical",
  tools: "Tools",
  chemical: "Chemicals",
  excavation: "Excavation",
  equipment: "Equipment",
  emergency: "Emergency",
  firstaid: "First aid",
  office: "Site office",
};

function logAnswer(
  recordAnswer: (moduleId: string, event: { id: string; prompt: string; correct: boolean; feedback: string; dimension: ScoreDimension; track: "standard" }) => void,
  moduleId: string,
  id: string,
  prompt: string,
  correct: boolean,
  feedback: string,
  dimension: ScoreDimension,
) {
  recordAnswer(moduleId, { id, prompt, correct, feedback, dimension, track: "standard" });
}

export function SitePage() {
  const { state } = useProgress();
  const [area, setArea] = useState("office");
  const [walked, setWalked] = useState<string[]>(["office"]);
  const spot = SITE_AREAS.find((item) => item.id === area) ?? SITE_AREAS[0];
  return (
    <div className="stack">
      <p className="kicker">Northline yard</p>
      <h2>Walk the yard</h2>
      <TeachText text={`${tradeHint(state.trade)} You start at the site office. Walk to a neighbour. The crew talks only where you are standing.`} />
      <p className="muted">Walked {walked.length} of {SITE_AREAS.length}.</p>
      <WalkGrid
        cells={SITE_AREAS.map((item) => ({ id: item.id, label: AREA_MARK[item.id], col: item.col, row: item.row }))}
        here={area}
        caption="The map shows the yard. Highlighted neighbours are one step away."
        onWalk={(id) => {
          setArea(id);
          setWalked((prev) => (prev.includes(id) ? prev : [...prev, id]));
        }}
      />
      <article className="panel stack">
        <p className="kicker">{spot.npc}</p>
        <h3>{spot.name}</h3>
        <TeachText text={areaSpeech(spot.id, state.trade, spot.line)} />
        <Link className="btn btn-primary" to={spot.href}>
          {spot.action}
        </Link>
      </article>
      <article className="panel stack">
        <p className="kicker">Mission</p>
        <h3>Find 5 hazards before the crew starts work</h3>
        <TeachText text="Damaged cord, blocked exit, missing eye protection, an unlabelled chemical, and a worker under a load." />
        <Link className="btn btn-primary" to="/hunt">
          Start the hunt
        </Link>
      </article>
      <ExitBar continueHref="/locker" continueLabel="Continue: PPE" />
    </div>
  );
}

export function LockerPage() {
  const { state, toggleEquip, recordAnswer } = useProgress();
  const done = (moduleId: string) => Boolean(state.modules[moduleId]?.completed);
  const [itemId, setItemId] = useState(LOCKER[0].id);
  const [cut, setCut] = useState<string[]>([]);
  const [cutNote, setCutNote] = useState("");
  const [cutOk, setCutOk] = useState(false);
  const [itemNote, setItemNote] = useState("");
  const item = LOCKER.find((entry) => entry.id === itemId) ?? LOCKER[0];

  function startCut() {
    const result = concreteReady(cut);
    if (result.missing.includes("respirator")) {
      setCutOk(false);
      setCutNote(CONCRETE_CUT.respiratorNote);
      logAnswer(recordAnswer, "ppe", "campaign-concrete", CONCRETE_CUT.title, false, CONCRETE_CUT.respiratorNote, "decision");
      return;
    }
    if (!result.ok) {
      const text = "This cut still needs the protection the dust, the chips, and the noise call for.";
      setCutOk(false);
      setCutNote(text);
      logAnswer(recordAnswer, "ppe", "campaign-concrete", CONCRETE_CUT.title, false, text, "decision");
      return;
    }
    setCutOk(true);
    setCutNote("Good. Eyes, ears, dust protection, and the rest of the kit are on before the saw starts. This still does not authorize the saw.");
    logAnswer(recordAnswer, "ppe", "campaign-concrete", CONCRETE_CUT.title, true, "Matched the cut.", "decision");
    for (const id of CONCRETE_CUT.need) {
      if (!state.equipped.includes(id) && gearUnlocked(id, done)) toggleEquip(id);
    }
  }

  return (
    <div className="stack">
      <p className="kicker">Equipment locker</p>
      <h2>Your kit</h2>
      <div className="locker-head">
        <Avatar equipped={state.equipped} />
        <div className="stack">
          <p>Gear you have finished a module for can go on the avatar. Wearing it here does not authorize the tool.</p>
          <div className="row">
            {GEAR.map((gear) => {
              const open = gearUnlocked(gear.id, done);
              return (
                <button
                  key={gear.id}
                  type="button"
                  className={state.equipped.includes(gear.id) ? "btn btn-primary" : "btn btn-ghost"}
                  disabled={!open}
                  onClick={() => toggleEquip(gear.id)}
                >
                  {gear.name}
                  {open ? "" : " · locked"}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <article className="panel stack">
        <p className="kicker">Hazard scenario</p>
        <h3>{CONCRETE_CUT.title}</h3>
        <p>Equip what this cut needs, then start. A wrong kit sends you back to the lesson.</p>
        <div className="row">
          {[
            ["hardhat", "Hard hat"],
            ["glasses", "Street sunglasses"],
            ["goggles", "Goggles"],
            ["ear", "Hearing protection"],
            ["vest", "High-vis vest"],
            ["gloves", "Work gloves"],
            ["boots", "Safety boots"],
            ["respirator", "Respirator"],
          ].map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={cut.includes(id) ? "btn btn-primary" : "btn btn-ghost"}
              onClick={() => setCut((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))}
            >
              {label}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-primary" onClick={startCut}>
          Start the cut
        </button>
        {cutNote && <Feedback text={cutNote} good={cutOk} review={cutNote === CONCRETE_CUT.respiratorNote ? "Respiratory protection" : "PPE selection"} />}
      </article>
      <div className="grid-2">
        {(["PPE", "Tools"] as const).map((group) => (
          <div key={group} className="stack">
            <h3>{group}</h3>
            {LOCKER.filter((entry) => entry.group === group).map((entry) => (
              <button key={entry.id} type="button" className={entry.id === item.id ? "select-card on" : "select-card"} onClick={() => { setItemId(entry.id); setItemNote(""); }}>
                {entry.name}
              </button>
            ))}
          </div>
        ))}
      </div>
      <article className="panel stack">
        <h3>{item.name}</h3>
        <p><strong>What is it?</strong></p>
        <TeachText text={item.what} />
        <p><strong>When is it used?</strong></p>
        <TeachText text={item.when} />
        <p><strong>What hazards does it address?</strong></p>
        <TeachText text={item.hazard} />
        <p><strong>What should you inspect?</strong></p>
        <TeachText text={item.inspect} />
        <p><strong>What training or authorization might be required?</strong></p>
        <TeachText text={item.authorization} />
        <p><strong>What are its limitations?</strong></p>
        <TeachText text={item.limit} />
        <h3>Mini-check</h3>
        <TeachText text={item.check.prompt} />
        <div className="row">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setItemNote(item.check.correct);
              logAnswer(recordAnswer, item.group === "PPE" ? "ppe" : "tools", `locker-${item.id}`, item.check.prompt, true, item.check.correct, "decision");
            }}
          >
            {item.check.correct}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setItemNote(item.check.wrong);
              logAnswer(recordAnswer, item.group === "PPE" ? "ppe" : "tools", `locker-${item.id}`, item.check.prompt, false, item.limit, "decision");
            }}
          >
            {item.check.wrong}
          </button>
        </div>
        {itemNote && (
          <Feedback
            text={itemNote === item.check.correct ? item.check.correct : item.limit}
            good={itemNote === item.check.correct}
            review={item.name}
          />
        )}
      </article>
      <ExitBar continueHref={continueAfter("/locker")?.href} continueLabel={continueAfter("/locker")?.label} />
    </div>
  );
}

export function HuntPage() {
  const { findHazard, recordAnswer } = useProgress();
  const [left, setLeft] = useState(90);
  const [found, setFound] = useState<string[]>([]);
  const [open, setOpen] = useState<string | null>(null);
  const [choice, setChoice] = useState("");
  const [place, setPlace] = useState("office");
  const ready = found.length === HUNT_HAZARDS.length || left === 0;
  const hereHazard = HUNT_HAZARDS.find((hazard) => hazard.areaId === place);

  useEffect(() => {
    if (ready) return;
    const timer = window.setInterval(() => setLeft((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [ready]);

  const picked = HUNT_DECISION.options.find((option) => option.id === choice);

  return (
    <div className="stack">
      <p className="kicker">Hazard hunter</p>
      <h2>Find as many hazards as you can</h2>
      <p>You have {left} seconds. Walk the yard. A hazard shows up only when you are standing in that area. The clock frames the shift. It does not add points.</p>
      <WalkGrid
        cells={SITE_AREAS.map((item) => ({ id: item.id, label: AREA_MARK[item.id], col: item.col, row: item.row }))}
        here={place}
        caption="Walk to the building, the ladder, the tool station, the chemical station, and the equipment zone."
        onWalk={setPlace}
      />
      {hereHazard && !found.includes(hereHazard.id) && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setOpen(hereHazard.id);
            setFound((prev) => (prev.includes(hereHazard.id) ? prev : [...prev, hereHazard.id]));
            findHazard(hereHazard.id);
          }}
        >
          Check this spot: {hereHazard.label}
        </button>
      )}
      {hereHazard && found.includes(hereHazard.id) && <p>You already checked this spot.</p>}
      {!hereHazard && <p>Nothing is wrong in the area where you are standing. Walk on.</p>}
      {open && <Feedback text={HUNT_HAZARDS.find((hazard) => hazard.id === open)?.detail ?? ""} good />}
      <p>
        Found {found.length} of {HUNT_HAZARDS.length}.
      </p>
      {ready && (
        <article className="panel stack">
          <h3>{HUNT_DECISION.prompt}</h3>
          {HUNT_DECISION.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setChoice(option.id);
                logAnswer(recordAnswer, "hazards", "campaign-hunt", HUNT_DECISION.prompt, option.correct, option.feedback, "decision");
              }}
            >
              {option.label}
            </button>
          ))}
          {picked && <Feedback text={picked.feedback} good={picked.correct} review="Hazard reporting" />}
        </article>
      )}
      {picked && <ExitBar continueHref={continueAfter("/hunt")?.href} continueLabel={continueAfter("/hunt")?.label} />}
    </div>
  );
}

export function DecisionsPage() {
  const { state, recordAnswer } = useProgress();
  const ordered = [...DECISIONS].sort((a, b) => {
    const rank = (trades?: string[]) => (state.trade && trades?.includes(state.trade) ? 0 : 1);
    return rank(a.trades) - rank(b.trades);
  });
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState("");
  const scene = ordered[index];
  const option = scene.options.find((item) => item.id === picked);
  const nextStop = continueAfter("/decisions");

  return (
    <div className="stack">
      <p className="kicker">What would you do?</p>
      <h2>{scene.topic}</h2>
      <p className="muted">
        Call {index + 1} of {ordered.length}
        {state.trade ? ` · ${tradeTitle(state.trade)} calls come first` : ""}. A trade here is a hint. It is not a ticket.
      </p>
      <blockquote className="speech">
        <p className="kicker">{scene.speaker}</p>
        <TeachText text={scene.line} />
      </blockquote>
      {scene.options.map((item) => (
        <button
          key={item.id}
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setPicked(item.id);
            logAnswer(recordAnswer, "conduct", `campaign-${scene.id}`, scene.line, item.correct, item.feedback, "communication");
          }}
        >
          {item.label}
        </button>
      ))}
      {option && <Feedback text={option.feedback} good={option.correct} review={scene.review} />}
      <div className="row">
        {index > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => { setIndex((value) => value - 1); setPicked(""); }}>
            Previous call
          </button>
        )}
        {index < ordered.length - 1 && (
          <button type="button" className="btn btn-primary" onClick={() => { setIndex((value) => value + 1); setPicked(""); }}>
            Next call
          </button>
        )}
      </div>
      {index === ordered.length - 1 && option && (
        <ExitBar continueHref={nextStop?.href} continueLabel={nextStop?.label} />
      )}
    </div>
  );
}

export function RadioPage() {
  const { state, recordAnswer } = useProgress();
  const calls = [tradeRadio(state.trade), ...RADIO].filter((item): item is NonNullable<typeof item> => item !== null);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState("");
  const call = calls[index];
  const option = call.options.find((item) => item.id === picked);
  return (
    <div className="stack">
      <p className="kicker">Site radio</p>
      <h2>{call.from} is calling</h2>
      <blockquote className="speech">
        <TeachText text={call.call} />
      </blockquote>
      {call.options.map((item) => (
        <button
          key={item.id}
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setPicked(item.id);
            logAnswer(recordAnswer, "conduct", `radio-${call.id}`, call.call, item.correct, item.feedback, "communication");
          }}
        >
          {item.label}
        </button>
      ))}
      {option && <Feedback text={option.feedback} good={option.correct} review="Jobsite communication" />}
      {index < calls.length - 1 && (
        <button type="button" className="btn btn-primary" onClick={() => { setIndex((value) => value + 1); setPicked(""); }}>
          Next call
        </button>
      )}
      {index === calls.length - 1 && option && <ExitBar continueHref="/decisions" continueLabel="Continue: What would you do?" />}
    </div>
  );
}

export function ToolboxPage() {
  const { state } = useProgress();
  const talks = [tradeToolbox(state.trade), ...TOOLBOX].filter((item): item is NonNullable<typeof item> => item !== null);
  const [sceneId, setSceneId] = useState(talks[0]?.id ?? TOOLBOX[0].id);
  const [picked, setPicked] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const scene = talks.find((item) => item.id === sceneId) ?? talks[0];
  const needed = [...scene.hazards, ...scene.ppe, ...scene.controls, ...scene.equipment, ...scene.emergency];
  const chips = [...needed, ...scene.decoys].sort((a, b) => a.localeCompare(b));
  const extras = picked.filter((item) => scene.decoys.includes(item));
  const missed = needed.filter((item) => !picked.includes(item));

  return (
    <div className="stack">
      <p className="kicker">Toolbox talk — 5 minutes</p>
      <h2>Today’s work: {scene.work}</h2>
      <p>Tap only what belongs in the talk. Some chips are the wrong call.</p>
      <div className="row">
        {talks.map((item) => (
          <button key={item.id} type="button" className="btn btn-ghost" onClick={() => { setSceneId(item.id); setPicked([]); setShow(false); }}>
            {item.work}
          </button>
        ))}
      </div>
      <div className="row">
        {chips.map((item) => (
          <button
            key={item}
            type="button"
            className={picked.includes(item) ? "btn btn-primary" : "btn btn-ghost"}
            onClick={() => setPicked((prev) => (prev.includes(item) ? prev.filter((value) => value !== item) : [...prev, item]))}
          >
            {item}
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={() => setShow(true)}>
        Give the briefing
      </button>
      {show && extras.length > 0 && (
        <Feedback text={`Leave these out: ${extras.join(", ")}.`} review={scene.work} />
      )}
      {show && missed.length > 0 && extras.length === 0 && (
        <Feedback text={`The talk still needs: ${missed.join(", ")}.`} review={scene.work} />
      )}
      {show && extras.length === 0 && missed.length === 0 && (
        <article className="panel stack">
          <h3>Briefing</h3>
          <TeachText text={scene.briefing} />
          <p className="muted">This talk is practice. The real briefing is the one your supervisor gives on that site.</p>
          <ExitBar continueHref="/decisions" continueLabel="Continue: What would you do?" />
        </article>
      )}
    </div>
  );
}

export function WhmisLabPage() {
  const { recordAnswer } = useProgress();
  const [place, setPlace] = useState(WHMIS_ROOM[0].id);
  const [cleared, setCleared] = useState<string[]>([]);
  const [picked, setPicked] = useState("");
  const stop = WHMIS_ROOM.find((item) => item.id === place) ?? WHMIS_ROOM[0];
  const option = stop.options.find((item) => item.id === picked);
  const nextStop = continueAfter("/whmis-lab");
  const finished = WHMIS_ROOM.every((item) => cleared.includes(item.id));
  return (
    <div className="stack">
      <p className="kicker">WHMIS lab</p>
      <h2>Chemical room</h2>
      <p>
        Walk the room. The only product here is Northline Contact Adhesive NL-14. Each station is a call you answer where you are standing. This room is not an employer WHMIS sign-off. The pictogram, label, and SDS games stay on the Games page if you want more practice.
      </p>
      <p className="muted">Stations cleared {cleared.length} of {WHMIS_ROOM.length}.</p>
      <WalkGrid
        cells={WHMIS_ROOM.map((item) => ({ id: item.id, label: item.label, col: item.col, row: item.row }))}
        here={place}
        caption="Start at the receiving door. Walk to a neighbouring station."
        onWalk={(id) => {
          setPlace(id);
          setPicked("");
        }}
      />
      <article className="panel stack">
        <p className="kicker">{stop.speaker} · {stop.label}</p>
        <TeachText text={stop.line} />
        {stop.options.map((item) => (
          <button
            key={item.id}
            type="button"
            className="btn btn-ghost"
            onClick={() => {
              setPicked(item.id);
              setCleared((prev) => (prev.includes(stop.id) ? prev : [...prev, stop.id]));
              logAnswer(recordAnswer, "whmis", `room-${stop.id}`, stop.line, item.correct, item.feedback, "knowledge");
            }}
          >
            {item.label}
          </button>
        ))}
        {option && <Feedback text={option.feedback} good={option.correct} review={stop.review} />}
      </article>
      {finished && <ExitBar continueHref={nextStop?.href} continueLabel={nextStop?.label ?? "Continue"} />}
    </div>
  );
}

export function CheckPage() {
  const { state, answerCheck } = useProgress();
  const [index, setIndex] = useState(0);
  const [left, setLeft] = useState(30);
  const [note, setNote] = useState("");
  const [good, setGood] = useState(false);
  const due = SAFETY_CHECKS.filter((check) => {
    if (!state.modules[check.moduleId]?.completed) return false;
    const review = state.reviews[check.id];
    return !review || review.due <= Date.now();
  });
  const check = due[index] ?? due[0];

  useEffect(() => {
    if (!check || note) return;
    const timer = window.setInterval(() => setLeft((value) => (value > 0 ? value - 1 : 0)), 1000);
    return () => window.clearInterval(timer);
  }, [check?.id, note]);

  if (!check) {
    return (
      <div className="stack">
        <p className="kicker">30-second safety check</p>
        <h2>Nothing is due</h2>
        <p>Finish a module and a short check will come back the next day. A miss stays on the board until you answer it.</p>
        <Link className="btn btn-primary" to="/home">
          Back to the week
        </Link>
      </div>
    );
  }

  return (
    <div className="stack">
      <p className="kicker">30-second safety check</p>
      <h2>{left}s</h2>
      <p className="muted">The timer does not change the score.</p>
      <TeachText text={check.prompt} />
      {check.options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setNote(check.explain);
            setGood(option.correct);
            answerCheck(check.id, check.moduleId, check.prompt, option.correct, check.explain, "knowledge");
          }}
        >
          {option.label}
        </button>
      ))}
      {note && <Feedback text={note} good={good} review="the module this check came from" />}
      {note && index < due.length - 1 && (
        <button type="button" className="btn btn-primary" onClick={() => { setIndex((value) => value + 1); setNote(""); setGood(false); setLeft(30); }}>
          Next check
        </button>
      )}
      {note && index >= due.length - 1 && <ExitBar continueHref="/home" continueLabel="Continue the week" />}
    </div>
  );
}
