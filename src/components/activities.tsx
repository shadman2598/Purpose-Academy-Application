import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type {
  AnswerEvent,
  Block,
  ChoiceItem,
  ChoiceOption,
  DialogueFollowUp,
  HazardHuntBlock,
  InspectBlock,
  LabelBlock,
  LadderBlock,
  LocateBlock,
  MatchBlock,
  PpeLockerBlock,
  ReportBlock,
  ScoreDimension,
  SequenceBlock,
  ShiftBlock,
  SymbolBlock,
  SdsBlock,
} from "../content/model";
import { DIMENSIONS } from "../content/framework";
import { getModule } from "../content/catalog";
import { Pictogram } from "./Pictogram";
import { QuestionEngine } from "./questions/QuestionEngine";
import { SceneBoard, hintFor } from "./SceneBoard";
import { SimLab } from "./SimLab";
import { LadderSim } from "./LadderSim";
import { Avatar } from "./Avatar";
import { TeachText } from "./Parable";

export function useFirstScore(onAnswer: (event: AnswerEvent) => void) {
  const seen = useRef(new Set<string>());
  return (event: AnswerEvent) => {
    if (seen.current.has(event.id)) return;
    seen.current.add(event.id);
    onAnswer(event);
  };
}

export function Feedback({ text, good, review }: { text: string; good?: boolean; review?: string }) {
  return (
    <div className={good ? "feedback good" : "feedback bad"} role="status">
      <strong>{good ? "Good call." : "Not quite."}</strong>
      <TeachText text={text} />
      {!good && (
        <>
          <p>
            <strong>Safety issue detected.</strong> Your decision created an unnecessary risk.
          </p>
          <p>Review: {review ?? "the lesson for this call"}.</p>
          <p>If this decision were made on a real site, it could expose workers to serious injury. You can try the call again.</p>
        </>
      )}
    </div>
  );
}

function Options({
  item,
  onPick,
  locked,
}: {
  item: ChoiceItem;
  onPick: (option: ChoiceOption) => void;
  locked: boolean;
}) {
  return (
    <div className="stack">
      {item.detail && <p className="muted">{item.detail}</p>}
      {item.options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="choice"
          disabled={locked}
          onClick={() => onPick(option)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function ChoiceSetView({
  title,
  intro,
  items,
  onAnswer,
  onReady,
}: {
  title: string;
  intro?: string;
  items: ChoiceItem[];
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [index, setIndex] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const item = items[index];

  useEffect(() => {
    onReady(false);
  }, [onReady, title]);

  if (!item) return null;

  return (
    <div className="stack">
      <h3>{title}</h3>
      {intro && index === 0 && <TeachText text={intro} />}
      <p className="faint">
        {index + 1} of {items.length}
      </p>
      <TeachText text={item.prompt} />
      <Options
        item={item}
        locked={good}
        onPick={(option) => {
          score({
            id: item.id,
            prompt: item.prompt,
            correct: option.correct,
            feedback: option.feedback,
            dimension: item.dimension,
            track: item.track ?? "standard",
          });
          setNote(option.feedback);
          setGood(option.correct);
          if (option.correct && index === items.length - 1) onReady(true);
        }}
      />
      {note && <Feedback text={note} good={good} />}
      {good && index < items.length - 1 && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setIndex((value) => value + 1);
            setNote(null);
            setGood(false);
          }}
        >
          Next
        </button>
      )}
    </div>
  );
}

export function LocateView({
  block,
  onAnswer,
  onReady,
}: {
  block: LocateBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [step, setStep] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [hold, setHold] = useState(false);
  const [over, setOver] = useState<string | null>(null);
  const target = block.targets[step];
  const spots = [...block.targets, ...block.decoys].map((spot) => ({
    id: spot.id,
    kind: spot.kind,
    x: spot.x,
    y: spot.y,
    hint: hintFor(spot.kind),
    done: block.targets.findIndex((item) => item.id === spot.id) < step,
  }));

  useEffect(() => {
    onReady(step >= block.targets.length);
  }, [step, block.targets.length, onReady]);

  if (!target) {
    return <Feedback text="Yard learned. Every place on the list is marked." good />;
  }

  function tap(id: string) {
    if (hold) return;
    const hit = [...block.targets, ...block.decoys].find((spot) => spot.id === id);
    if (!hit || !target) return;
    const correct = id === target.id;
    if (correct) {
      score({
        id: `locate-${target.id}`,
        prompt: `Find ${target.label}`,
        correct: true,
        feedback: target.feedback,
        dimension: "hazard",
        track: "standard",
      });
      setNote(target.feedback);
      setGood(true);
      setHold(true);
      return;
    }
    score({
      id: `locate-${target.id}`,
      prompt: `Find ${target.label}`,
      correct: false,
      feedback: hit.feedback,
      dimension: "hazard",
      track: "standard",
    });
    setNote(hit.id === target.id ? target.feedback : `${hit.feedback} You are looking for the ${target.label.toLowerCase()}.`);
    setGood(false);
  }

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      <p>
        Find: <strong>{target.label}</strong> ({step + 1} of {block.targets.length}). Point at the yard, then click the place.
      </p>
      <SimLab
        title={spots.find((spot) => spot.id === over)?.hint ?? "Move across the yard"}
        body={
          spots.find((spot) => spot.id === over)
            ? "This is the part under your pointer. Click it if it is the place you were asked to find."
            : `You are looking for ${target.label}. The names stay on the picture, not in a list.`
        }
        stage={<SceneBoard scene={block.scene} spots={spots} onSpot={tap} onHover={setOver} />}
      />
      {note && <Feedback text={note} good={good} />}
      {hold && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setStep((value) => value + 1);
            setNote(null);
            setGood(false);
            setHold(false);
          }}
        >
          Next location
        </button>
      )}
    </div>
  );
}

export function HazardHuntView({
  block,
  onAnswer,
  onHazard,
  onReady,
}: {
  block: HazardHuntBlock;
  onAnswer: (event: AnswerEvent) => void;
  onHazard: (id: string) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [found, setFound] = useState<string[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [stage, setStage] = useState<"severity" | "control" | "done">("severity");
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [sceneScore, setSceneScore] = useState(0);
  const [over, setOver] = useState<string | null>(null);
  const hazard = block.hazards.find((item) => item.id === active);

  useEffect(() => {
    onReady(found.length === block.hazards.length);
  }, [found.length, block.hazards.length, onReady]);

  const spots = [...block.hazards, ...block.decoys].map((spot) => ({
    id: spot.id,
    kind: spot.kind,
    x: spot.x,
    y: spot.y,
    hint: hintFor(spot.kind),
    done: found.includes(spot.id),
  }));

  function tap(id: string) {
    if (found.includes(id)) return;
    const decoy = block.decoys.find((spot) => spot.id === id);
    if (decoy) {
      setNote(`No hazard here. ${decoy.feedback}`);
      setGood(false);
      setActive(null);
      return;
    }
    const match = block.hazards.find((spot) => spot.id === id);
    if (!match) return;
    onHazard(match.id);
    setSceneScore((value) => value + 100);
    setActive(id);
    setStage("severity");
    setNote(match.feedback);
    setGood(true);
  }

  function pickSeverity(option: ChoiceOption) {
    if (!hazard) return;
    score({
      id: `sev-${hazard.id}`,
      prompt: `${hazard.label}: severity`,
      correct: option.correct,
      feedback: option.feedback,
      dimension: "hazard",
      track: "standard",
    });
    if (option.correct) setSceneScore((value) => value + 50);
    setNote(option.feedback);
    setGood(option.correct);
    if (option.correct) setStage("control");
  }

  function pickControl(option: ChoiceOption) {
    if (!hazard) return;
    score({
      id: `ctl-${hazard.id}`,
      prompt: hazard.controlPrompt,
      correct: option.correct,
      feedback: option.feedback,
      dimension: "procedure",
      track: "standard",
    });
    if (option.correct) {
      setSceneScore((value) => value + 100);
      setFound((current) => [...current, hazard.id]);
      setActive(null);
      setStage("severity");
    }
    setNote(option.feedback);
    setGood(option.correct);
  }

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      <p className="muted">
        Found {found.length} of {block.hazards.length}. Scene score {sceneScore}. A correct hazard is +100, a fair severity is +50, a useful control is +100. Scene points are feedback. They are not a speed bonus.
      </p>
      <SimLab
        title={spots.find((spot) => spot.id === (over ?? active))?.hint ?? "Sweep the yard"}
        body={
          hazard
            ? hazard.feedback
            : spots.find((spot) => spot.id === over)
              ? "Pointing names the spot. Click it if it is a hazard."
              : "Click a hazard on the drawing. A clear spot tells you it is clear."
        }
        stage={<SceneBoard scene={block.scene} spots={spots} onSpot={tap} onHover={setOver} selected={active} />}
        controls={
          hazard && stage === "severity" ? (
            <>
              <p>How severe is this if nobody acts?</p>
              {hazard.severityOptions.map((option) => (
                <button key={option.id} type="button" className="choice" onClick={() => pickSeverity(option)}>
                  {option.label}
                </button>
              ))}
            </>
          ) : hazard && stage === "control" ? (
            <>
              <p>{hazard.controlPrompt}</p>
              {hazard.controlOptions.map((option) => (
                <button key={option.id} type="button" className="choice" onClick={() => pickControl(option)}>
                  {option.label}
                </button>
              ))}
            </>
          ) : null
        }
      />
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

const HIERARCHY = ["Elimination", "Substitution", "Engineering", "Administrative", "PPE"];

export function HierarchyView({
  title,
  intro,
  onAnswer,
  onReady,
}: {
  title: string;
  intro: string;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [order, setOrder] = useState<string[]>([]);
  const [phase, setPhase] = useState<"order" | "shop" | "cut" | "done">("order");
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const remaining = HIERARCHY.filter((level) => !order.includes(level));

  useEffect(() => {
    onReady(phase === "done");
  }, [phase, onReady]);

  function commitOrder() {
    const correct = order.join("|") === HIERARCHY.join("|");
    score({
      id: "hierarchy-order",
      prompt: "Order the hierarchy of controls",
      correct,
      feedback: correct
        ? "That is the order CCOHS teaches: start at elimination and move down. Some standards add awareness systems, such as alarms, between engineering and administrative controls."
        : "Start with elimination, then substitution, engineering, administrative controls, and PPE. You can clear the row and try again.",
      dimension: "knowledge",
      track: "standard",
    });
    setGood(correct);
    setNote(
      correct
        ? "That is the order CCOHS teaches. Higher controls are generally preferred where they are feasible. PPE can still be required."
        : "The preferred order, where each step is feasible, is elimination, substitution, engineering, administrative controls, then PPE.",
    );
    if (correct) setPhase("shop");
  }

  function shop(correct: boolean, feedback: string, id: string, prompt: string) {
    score({ id, prompt, correct, feedback, dimension: "decision", track: "standard" });
    setGood(correct);
    setNote(feedback);
    if (correct) setPhase(id === "hierarchy-shop" ? "cut" : "done");
  }

  return (
    <div className="stack">
      <h3>{title}</h3>
      <p>{intro}</p>
      {phase === "order" && (
        <>
          <p>Tap the levels in the order you consider them, first to last.</p>
          <div className="row">
            {remaining.map((level) => (
              <button key={level} type="button" className="btn btn-ghost" onClick={() => setOrder((current) => [...current, level])}>
                {level}
              </button>
            ))}
          </div>
          <p>{order.length ? order.join(" → ") : "Nothing selected yet."}</p>
          <div className="row">
            <button type="button" className="btn btn-ghost" onClick={() => setOrder([])}>
              Clear
            </button>
            <button type="button" className="btn btn-primary" disabled={order.length !== 5} onClick={commitOrder}>
              Check order
            </button>
          </div>
        </>
      )}
      {phase === "shop" && (
        <>
          <p>
            The cut does not have to happen in this occupied corridor. A shop downstairs can do it wet, inside a controlled setup. What do you consider first?
          </p>
          <button type="button" className="choice" onClick={() => shop(true, "Doing the work where the dust is already controlled removes the dry cut from this corridor. That is elimination at this location.", "hierarchy-shop", "Where should the dusty cut happen?")}>
            Elimination — don’t dry-cut here; use the controlled shop
          </button>
          <button type="button" className="choice" onClick={() => shop(false, "Masks are still a control, and they are not the first choice when the cut can leave this corridor.", "hierarchy-shop", "Where should the dusty cut happen?")}>
            PPE — hand out masks and dry-cut here
          </button>
        </>
      )}
      {phase === "cut" && (
        <>
          <p>The cut has to happen on this slab. A water-fed shroud and vacuum are on the truck. What comes before relying on masks?</p>
          <button type="button" className="choice" onClick={() => shop(true, "The shroud and vacuum are engineering controls, and they are feasible. Respiratory protection can still be in the procedure after that.", "hierarchy-cut", "What comes before masks?")}>
            Engineering — use the shroud and vacuum, then the PPE the procedure still names
          </button>
          <button type="button" className="choice" onClick={() => shop(false, "The shroud is sitting on the truck. Skipping it because masks are faster leaves the better control unused.", "hierarchy-cut", "What comes before masks?")}>
            PPE only — masks are faster
          </button>
        </>
      )}
      {phase === "done" && (
        <Feedback text="Controls higher in the hierarchy are generally preferred where they are feasible. The law and the site plan can still require a specific measure. PPE is not a failure if the assessment still calls for it." good />
      )}
      {note && phase !== "done" && <Feedback text={note} good={good} />}
    </div>
  );
}

export function PpeView({
  block,
  onAnswer,
  onReady,
}: {
  block: PpeLockerBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [jobIndex, setJobIndex] = useState(0);
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const job = block.jobs[jobIndex];

  useEffect(() => {
    onReady(jobIndex >= block.jobs.length);
  }, [jobIndex, block.jobs.length, onReady]);

  if (!job) return <Feedback text="Locker cleared. Gear followed the task, not a single memorized list." good />;

  function toggle(id: string) {
    setPicked((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
    setGood(false);
  }

  function check() {
    const missing = job.required.filter((id) => !picked.includes(id));
    const wrong = picked.filter((id) => job.incorrect.includes(id));
    const correct = missing.length === 0 && wrong.length === 0;
    const names = (ids: string[]) =>
      ids.map((id) => block.items.find((item) => item.id === id)?.label ?? id).join(", ");
    const feedback = correct
      ? job.why
      : `${job.why} Missing: ${missing.length ? names(missing) : "none"}. Not for this task: ${wrong.length ? names(wrong) : "none"}.`;
    score({
      id: `ppe-${job.id}`,
      prompt: job.title,
      correct,
      feedback,
      dimension: "decision",
      track: "standard",
    });
    setNote(feedback);
    setGood(correct);
  }

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      <p className="kicker">
        Job {jobIndex + 1} of {block.jobs.length}
      </p>
      <h3>{job.title}</h3>
      <p>{job.situation}</p>
      <p className="chip">{job.siteRule}</p>
      <SimLab
        title={job.title}
        body={
          picked.length
            ? `On the worker: ${picked.map((id) => block.items.find((item) => item.id === id)?.label ?? id).join(", ")}. Dressing the figure here does not authorize the task.`
            : "Turn gear on. The worker changes as you do. Then check the kit against the job."
        }
        stage={
          <div className="sim-figure">
            <Avatar
              equipped={picked.flatMap((id) => {
                const map: Record<string, string> = {
                  hardhat: "hardhat",
                  boots: "boots",
                  glasses: "glasses",
                  goggles: "goggles",
                  ear: "ear",
                  "gloves-work": "gloves",
                  respirator: "respirator",
                  hivis: "vest",
                };
                return map[id] ? [map[id]] : [];
              })}
            />
          </div>
        }
        controls={
          <div className="ppe-grid">
            {block.items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={picked.includes(item.id) ? "btn btn-ghost on" : "btn btn-ghost"}
                onClick={() => toggle(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        }
      />
      <button type="button" className="btn btn-primary" onClick={check}>
        Ready for the job?
      </button>
      {note && <Feedback text={note} good={good} />}
      {good && (
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setJobIndex((value) => value + 1);
            setPicked([]);
            setNote(null);
            setGood(false);
          }}
        >
          Next job
        </button>
      )}
    </div>
  );
}

export function InspectView({
  block,
  onAnswer,
  onReady,
}: {
  block: InspectBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [calls, setCalls] = useState<Record<string, boolean>>({});
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [decideNote, setDecideNote] = useState<string | null>(null);
  const [decideGood, setDecideGood] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [over, setOver] = useState<string | null>(null);
  const allCalled = block.targets.every((target) => calls[target.id] !== undefined);
  const allRight = block.targets.every((target) => calls[target.id] === target.defective);

  useEffect(() => {
    onReady(allRight && decideGood);
  }, [allRight, decideGood, onReady]);

  function call(id: string, defective: boolean) {
    const target = block.targets.find((item) => item.id === id);
    if (!target) return;
    const correct = defective === target.defective;
    score({
      id: `inspect-${id}`,
      prompt: `Inspect the ${target.label}`,
      correct,
      feedback: target.feedback,
      dimension: "hazard",
      track: "standard",
    });
    setCalls((current) => ({ ...current, [id]: defective }));
    setNote(target.feedback);
    setGood(correct);
  }

  const pointed = block.targets.find((item) => item.id === over);
  const held = block.targets.find((item) => item.id === selected);

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      <SimLab
        title={pointed?.label ?? held?.label ?? "Pick up a tool"}
        body={
          held
            ? calls[held.id] === undefined
              ? "You are holding this tool. Use the controls to call it sound or a defect."
              : held.feedback
            : "Point at the bench. Click a tool, then call it sound or a defect."
        }
        stage={
          <SceneBoard
            scene="bench"
            spots={block.targets.map((target) => ({
              id: target.id,
              kind: target.id,
              x: target.x,
              y: target.y,
              hint: target.label,
              done: calls[target.id] === target.defective,
            }))}
            selected={selected}
            onHover={setOver}
            onSpot={(id) => {
              setSelected(id);
              setNote(null);
            }}
          />
        }
        controls={
          held ? (
            <>
              <button type="button" className="choice" onClick={() => call(held.id, false)}>
                Looks sound
              </button>
              <button type="button" className="choice" onClick={() => call(held.id, true)}>
                Defect
              </button>
            </>
          ) : null
        }
      />
      {note && <Feedback text={note} good={good} />}
      {allCalled && !allRight && <p className="muted">One or more calls don’t match the bench. Check the highlighted feedback and decide again.</p>}
      {allRight && (
        <div className="stack">
          <p>{block.decide.prompt}</p>
          {block.decide.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="choice"
              onClick={() => {
                score({
                  id: block.decide.id,
                  prompt: block.decide.prompt,
                  correct: option.correct,
                  feedback: option.feedback,
                  dimension: block.decide.dimension,
                  track: block.decide.track ?? "standard",
                });
                setDecideNote(option.feedback);
                setDecideGood(option.correct);
              }}
            >
              {option.label}
            </button>
          ))}
          {decideNote && <Feedback text={decideNote} good={decideGood} />}
        </div>
      )}
    </div>
  );
}

export function LadderView({
  block,
  onAnswer,
  onReady,
}: {
  block: LadderBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [floor, setFloor] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [hold, setHold] = useState(false);
  const [action, setAction] = useState<string | null>(null);
  const stage = block.stages[floor];

  useEffect(() => {
    onReady(floor >= block.stages.length);
  }, [floor, block.stages.length, onReady]);

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      <div className="callout">
        Hands-on training and task-specific instruction may be required before you perform this work. This climb does not certify you.
      </div>
      <div className="tower">
        <div className="floors">
          {block.stages.map((item, index) => (
            <div key={item.id} className={index < floor ? "floor cleared" : index === floor ? "floor now" : "floor"}>
              {item.floor}
            </div>
          ))}
        </div>
        {stage ? (
          <>
            <SimLab
              title={stage.floor}
              body={action ? stage.detail : "Try a control. The opening, the cover, and the ladder change with the control."}
              stage={<LadderSim action={action} />}
              controls={
                <>
                  <p>{stage.prompt}</p>
                  {stage.options.map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className="choice"
                      disabled={hold}
                      onClick={() => {
                        setAction(option.id);
                        score({
                          id: stage.id,
                          prompt: stage.prompt,
                          correct: option.correct,
                          feedback: option.feedback,
                          dimension: stage.dimension,
                          track: stage.track ?? "standard",
                        });
                        setNote(option.feedback);
                        setGood(option.correct);
                        if (option.correct) setHold(true);
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </>
              }
            />
            {note && <Feedback text={note} good={good} />}
            {hold && (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  setFloor((value) => value + 1);
                  setAction(null);
                  setNote(null);
                  setGood(false);
                  setHold(false);
                }}
              >
                Climb
              </button>
            )}
          </>
        ) : (
          <Feedback text="You reached the roof of the exercise. The real work still needs instruction, equipment, and the site’s procedure." good />
        )}
      </div>
    </div>
  );
}

export function SymbolView({
  block,
  onReady,
}: {
  block: SymbolBlock;
  onReady: (ready: boolean) => void;
}) {
  const [open, setOpen] = useState<string | null>(block.cards[0]?.id ?? null);
  const [seen, setSeen] = useState<string[]>([]);
  const card = block.cards.find((item) => item.id === open) ?? block.cards[0];

  useEffect(() => {
    onReady(seen.length === block.cards.length);
  }, [seen.length, block.cards.length, onReady]);

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      <SimLab
        title={card?.name ?? "Pictogram"}
        body={card ? `${card.meaning} On a site: ${card.siteExample} What you do: ${card.action}` : "Choose a mark."}
        stage={
          <div className="sim-symbol">
            {card && <Pictogram glyph={card.glyph} label={card.name} />}
            <p className="faint">
              Opened {seen.length} of {block.cards.length}. Click each mark. Pointing shows it large.
            </p>
          </div>
        }
        controls={
          <div className="symbol-grid">
            {block.cards.map((item) => (
              <button
                key={item.id}
                type="button"
                className={item.id === open ? "symbol-card on" : "symbol-card"}
                onClick={() => {
                  setOpen(item.id);
                  setSeen((current) => (current.includes(item.id) ? current : [...current, item.id]));
                }}
                onMouseEnter={() => setOpen(item.id)}
                onFocus={() => setOpen(item.id)}
              >
                <Pictogram glyph={item.glyph} label={item.name} />
                <strong>{item.name}</strong>
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
}

export function MatchView({
  block,
  onAnswer,
  onReady,
}: {
  block: MatchBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);

  function submit() {
    const needed = block.options.filter((option) => option.correct).map((option) => option.id);
    const correct = needed.every((id) => picked.includes(id)) && picked.every((id) => needed.includes(id));
    score({
      id: block.id,
      prompt: block.product,
      correct,
      feedback: correct ? block.success : block.miss,
      dimension: "knowledge",
      track: "standard",
    });
    setNote(correct ? block.success : block.miss);
    setGood(correct);
    if (correct) onReady(true);
  }

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>
        <strong>{block.product}.</strong> {block.brief}
      </p>
      <div className="symbol-grid">
        {block.options.map((option) => (
          <button
            key={option.id}
            type="button"
            className="symbol-card"
            onClick={() =>
              setPicked((current) =>
                current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id],
              )
            }
          >
            <Pictogram glyph={option.glyph} label={option.name} />
            <strong>{option.name}</strong>
            <span className="faint">{picked.includes(option.id) ? "Selected" : "Tap to select"}</span>
          </button>
        ))}
      </div>
      <button type="button" className="btn btn-primary" onClick={submit}>
        Check pictograms
      </button>
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

const LABEL_COPY: Record<string, string> = {
  identifier: "Northline Contact Adhesive NL-14",
  pictogram: "",
  signal: "DANGER",
  hazard: "Highly flammable liquid and vapour. Causes skin irritation.",
  precaution: "Keep away from heat, sparks, and open flames. Wear protective gloves and eye protection. Read the SDS.",
  supplier: "Northline Training Supply (fictional), 100 Yard Street, Edmonton, AB. Phone 000-000-0000.",
};

export function LabelView({
  block,
  onAnswer,
  onReady,
}: {
  block: LabelBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [step, setStep] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [hold, setHold] = useState(false);
  const [over, setOver] = useState<string | null>(null);
  const prompt = block.prompts[step];

  useEffect(() => {
    onReady(!prompt);
  }, [prompt, onReady]);

  if (!prompt) return <Feedback text="Label read. You found each element without memorizing a slogan." good />;

  function tap(zoneId: string) {
    if (hold) return;
    const zone = block.zones.find((item) => item.id === zoneId);
    const correct = zoneId === prompt.zoneId;
    score({
      id: prompt.id,
      prompt: prompt.ask,
      correct,
      feedback: correct ? prompt.success : `That area is ${zone?.label ?? "something else"}. ${prompt.ask}`,
      dimension: "knowledge",
      track: "standard",
    });
    if (correct) {
      setNote(prompt.success);
      setGood(true);
      setHold(true);
    } else {
      setNote(`Not that one. ${prompt.ask}`);
      setGood(false);
    }
  }

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      <p>
        <strong>{prompt.ask}</strong> Point at the label, then click the element.
      </p>
      <SimLab
        title={block.zones.find((zone) => zone.id === over)?.label ?? "The label"}
        body={
          over
            ? "You are on this part of the label. Click it if it answers the question."
            : "Move across the label. Each region lights up under the pointer."
        }
        stage={
          <div className="label-sheet">
            <p className="watermark">Training label — not a real product. Real supplier labels are English and French.</p>
            {block.zones.map((zone) => (
              <button
                key={zone.id}
                type="button"
                className={zone.id === over ? "over" : undefined}
                style={{ left: `${zone.x}%`, top: `${zone.y}%`, width: `${zone.w}%`, height: `${zone.h}%` }}
                onMouseEnter={() => setOver(zone.id)}
                onMouseLeave={() => setOver(null)}
                onFocus={() => setOver(zone.id)}
                onBlur={() => setOver(null)}
                onClick={() => tap(zone.id)}
              >
                {zone.id === "pictogram" ? <Pictogram glyph="flame" label="Flame pictogram" /> : LABEL_COPY[zone.id]}
              </button>
            ))}
          </div>
        }
      />
      {note && <Feedback text={note} good={good} />}
      {hold && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setStep((value) => value + 1);
            setNote(null);
            setGood(false);
            setHold(false);
          }}
        >
          Next element
        </button>
      )}
    </div>
  );
}

export function SdsView({
  block,
  onAnswer,
  onReady,
}: {
  block: SdsBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [hold, setHold] = useState(false);
  const question = block.questions[questionIndex];
  const section = block.sections.find((item) => item.num === open);

  useEffect(() => {
    onReady(!question);
  }, [question, onReady]);

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.mission}</p>
      {question && (
        <p>
          <strong>{question.ask}</strong>
        </p>
      )}
      <div className="sds">
        <div className="stack">
          {block.sections.map((item) => (
            <button
              key={item.num}
              type="button"
              className="choice"
              onClick={() => {
                if (hold) return;
                setOpen(item.num);
                if (!question) return;
                const correct = item.num === question.section;
                score({
                  id: question.id,
                  prompt: question.ask,
                  correct,
                  feedback: correct ? question.explain : `Section ${item.num} is ${item.title}. It is not the best place for this question.`,
                  dimension: "procedure",
                  track: "standard",
                });
                if (correct) {
                  setNote(question.explain);
                  setGood(true);
                  setHold(true);
                } else {
                  setNote(`Section ${item.num} covers ${item.title.toLowerCase()}. Try the section that matches the question.`);
                  setGood(false);
                }
              }}
            >
              {item.num}. {item.title}
            </button>
          ))}
        </div>
        <div className="panel">
          {section ? (
            <>
              <h3>
                {section.num}. {section.title}
              </h3>
              <TeachText text={section.body} />
            </>
          ) : (
            <p className="muted">Open a section. The sheet is fictional and marked for training.</p>
          )}
        </div>
      </div>
      {note && <Feedback text={note} good={good} />}
      {hold && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setQuestionIndex((value) => value + 1);
            setNote(null);
            setGood(false);
            setHold(false);
            setOpen(null);
          }}
        >
          Next question
        </button>
      )}
      {!question && <Feedback text="You can find a section when you need it. That is the skill." good />}
    </div>
  );
}

export function DialogueView({
  speaker,
  line,
  choices,
  followUp,
  dimension,
  track,
  answerId,
  onAnswer,
  onReady,
}: {
  speaker: string;
  line: string;
  choices: ChoiceOption[];
  followUp?: DialogueFollowUp;
  dimension: ScoreDimension;
  track: "standard" | "challenge";
  answerId: string;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [beat, setBeat] = useState(0);
  const [settled, setSettled] = useState(false);
  const active = beat === 1 && followUp ? followUp : { speaker, line, choices };
  const activeId = beat === 1 ? `${answerId}-follow` : answerId;
  useEffect(() => {
    onReady(false);
    setBeat(0);
    setNote(null);
    setGood(false);
    setSettled(false);
  }, [onReady, answerId]);

  return (
    <div className="stack">
      <p className="kicker">{active.speaker}</p>
      <TeachText text={active.line} />
      {active.choices.map((option) => (
        <button
          key={option.id}
          type="button"
          className="choice"
          disabled={settled}
          onClick={() => {
            score({
              id: activeId,
              prompt: active.line,
              correct: option.correct,
              feedback: option.feedback,
              dimension,
              track,
            });
            setNote(option.feedback);
            setGood(option.correct);
            if (!option.correct) return;
            if (followUp && beat === 0) {
              setBeat(1);
              return;
            }
            setSettled(true);
            onReady(true);
          }}
        >
          {option.label}
        </button>
      ))}
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

export function ReportView({
  block,
  onAnswer,
  onReady,
}: {
  block: ReportBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [decided, setDecided] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [formNote, setFormNote] = useState<string | null>(null);

  function submitForm() {
    const missing = block.fields.filter((field) => (values[field.id] ?? "").trim().length < 8);
    const correct = missing.length === 0;
    score({
      id: `${block.id}-form`,
      prompt: block.title,
      correct,
      feedback: correct ? block.modelReport : "Each line needs a real detail: what, where, who, the hazard, what you did, and who you told.",
      dimension: "communication",
      track: block.decision.track ?? "standard",
    });
    if (!correct) {
      setFormNote("Fill every line with enough detail that a supervisor who was not there could find the spot.");
      return;
    }
    setFormNote(block.modelReport);
    onReady(true);
  }

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.story}</p>
      <p>{block.decision.prompt}</p>
      {block.decision.options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="choice"
          onClick={() => {
            score({
              id: block.decision.id,
              prompt: block.decision.prompt,
              correct: option.correct,
              feedback: option.feedback,
              dimension: block.decision.dimension,
              track: block.decision.track ?? "standard",
            });
            setNote(option.feedback);
            setGood(option.correct);
            if (option.correct) setDecided(true);
          }}
        >
          {option.label}
        </button>
      ))}
      {note && <Feedback text={note} good={good} />}
      {decided && (
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault();
            submitForm();
          }}
        >
          <p className="kicker">Training report — stays on this device</p>
          {block.fields.map((field) => (
            <label key={field.id} className="field">
              {field.label}
              <textarea
                value={values[field.id] ?? ""}
                placeholder={field.placeholder}
                onChange={(event) => setValues((current) => ({ ...current, [field.id]: event.target.value }))}
              />
            </label>
          ))}
          <button type="submit" className="btn btn-primary">
            File report
          </button>
          {formNote && <Feedback text={formNote} good />}
        </form>
      )}
    </div>
  );
}

export function SequenceView({
  block,
  onAnswer,
  onReady,
}: {
  block: SequenceBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [stepIndex, setStepIndex] = useState(0);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const [hold, setHold] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const step = block.steps[stepIndex];

  useEffect(() => {
    if (!block.showTimer) return;
    const id = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(id);
  }, [block.showTimer]);

  useEffect(() => {
    onReady(stepIndex >= block.steps.length);
  }, [stepIndex, block.steps.length, onReady]);

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p>{block.intro}</p>
      {block.showTimer && (
        <p className="faint">
          Time on scene {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}. Pace yourself. Time does not change your score.
        </p>
      )}
      {step ? (
        <>
          <p>
            Step {stepIndex + 1} of {block.steps.length}
          </p>
          <p>{step.prompt}</p>
          {step.detail && <p className="muted">{step.detail}</p>}
          {step.options.map((option) => (
            <button
              key={option.id}
              type="button"
              className="choice"
              disabled={hold}
              onClick={() => {
                score({
                  id: step.id,
                  prompt: step.prompt,
                  correct: option.correct,
                  feedback: option.feedback,
                  dimension: step.dimension,
                  track: step.track ?? (block.xpKind === "challenge" ? "challenge" : "standard"),
                });
                setNote(option.feedback);
                setGood(option.correct);
                if (option.correct) setHold(true);
              }}
            >
              {option.label}
            </button>
          ))}
          {note && <Feedback text={note} good={good} />}
          {hold && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setStepIndex((value) => value + 1);
                setNote(null);
                setGood(false);
                setHold(false);
              }}
            >
              Next step
            </button>
          )}
        </>
      ) : (
        <Feedback text={block.closing} good />
      )}
    </div>
  );
}

export function ShiftView({
  block,
  onAnswer,
  onReady,
}: {
  block: ShiftBlock;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [index, setIndex] = useState(0);
  const [logged, setLogged] = useState<{ id: string; quality: "strong" | "weak" | "unsafe"; review: string; prompt: string; moduleId: string; dimension: ScoreDimension }[]>([]);
  const beat = block.beats[index];

  useEffect(() => {
    onReady(index >= block.beats.length);
  }, [index, block.beats.length, onReady]);

  if (!beat) {
    const tallies = Object.fromEntries(DIMENSIONS.map((dimension) => [dimension.id, { correct: 0, total: 0 }])) as Record<
      ScoreDimension,
      { correct: number; total: number }
    >;
    for (const item of logged) {
      tallies[item.dimension].total += 1;
      if (item.quality === "strong") tallies[item.dimension].correct += 1;
    }
    const review = logged.filter((item) => item.quality !== "strong");
    return (
      <div className="stack">
        <h3>Shift debrief</h3>
        <p>The morning is over. These bars are feedback, not a qualification.</p>
        {DIMENSIONS.map((dimension) => {
          const tally = tallies[dimension.id];
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
        <h3>Areas to review</h3>
        {review.length === 0 && <p>Every call was the strong one. Replay is there if you want the story again. Your first-attempt record stays.</p>}
        {review.map((item) => {
          const module = getModule(item.moduleId);
          return (
            <div key={item.id} className="panel stack">
              <TeachText text={item.prompt} />
              <TeachText text={item.review} />
              {module && <Link to={`/training/${module.id}`}>Review {module.title}</Link>}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="stack">
      <h3>{block.title}</h3>
      {index === 0 && <TeachText text={block.intro} />}
      <p className="kicker">{beat.kicker}</p>
      <TeachText text={beat.prompt} />
      <TeachText text={beat.detail} />
      {beat.options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="choice"
          onClick={() => {
            score({
              id: beat.id,
              prompt: beat.prompt,
              correct: option.quality === "strong",
              feedback: option.review,
              dimension: beat.dimension,
              track: "challenge",
            });
            setLogged((current) => [
              ...current,
              {
                id: beat.id,
                quality: option.quality,
                review: option.review,
                prompt: beat.prompt,
                moduleId: beat.reviewModuleId,
                dimension: beat.dimension,
              },
            ]);
            setIndex((value) => value + 1);
          }}
        >
          {option.label}
        </button>
      ))}
      <p className="faint">Logged decisions wait for the debrief. A faster shift does not score higher.</p>
    </div>
  );
}

export function BlockView({
  block,
  onAnswer,
  onHazard,
  onReady,
}: {
  block: Block;
  onAnswer: (event: AnswerEvent) => void;
  onHazard: (id: string) => void;
  onReady: (ready: boolean) => void;
}) {
  if (block.type === "choice-set") {
    return <ChoiceSetView title={block.title} intro={block.intro} items={block.items} onAnswer={onAnswer} onReady={onReady} />;
  }
  if (block.type === "locate") return <LocateView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "hazard-hunt") {
    return <HazardHuntView block={block} onAnswer={onAnswer} onHazard={onHazard} onReady={onReady} />;
  }
  if (block.type === "hierarchy") {
    return <HierarchyView title={block.title} intro={block.intro} onAnswer={onAnswer} onReady={onReady} />;
  }
  if (block.type === "ppe-locker") return <PpeView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "inspect") return <InspectView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "ladder") return <LadderView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "symbols") return <SymbolView block={block} onReady={onReady} />;
  if (block.type === "match") return <MatchView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "label") return <LabelView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "sds") return <SdsView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "dialogue") {
    return (
      <DialogueView
        speaker={block.speaker}
        line={block.line}
        choices={block.choices}
        followUp={block.followUp}
        dimension={block.dimension}
        track={block.track ?? "standard"}
        answerId={block.id}
        onAnswer={onAnswer}
        onReady={onReady}
      />
    );
  }
  if (block.type === "report") return <ReportView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "sequence") return <SequenceView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "shift") return <ShiftView block={block} onAnswer={onAnswer} onReady={onReady} />;
  if (block.type === "engine") {
    return (
      <div className="stack">
        <h3>{block.title}</h3>
        <QuestionEngine question={block.question} onAnswer={onAnswer} onReady={onReady} />
      </div>
    );
  }
  return null;
}
