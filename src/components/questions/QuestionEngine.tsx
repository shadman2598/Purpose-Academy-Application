import { useEffect, useMemo, useState } from "react";
import type { AnswerEvent, ScoreDimension } from "../../content/model";
import type { ChoiceBit, EngineQuestion } from "../../content/questions";
import { SDS_TITLES } from "../../content/questions";
import { Feedback, useFirstScore } from "../activities";

function scoreChoice(
  score: (event: AnswerEvent) => void,
  question: EngineQuestion,
  correct: boolean,
  feedback: string,
) {
  score({
    id: question.id,
    prompt: question.prompt,
    correct,
    feedback,
    dimension: "knowledge" satisfies ScoreDimension,
    track: "standard",
  });
}

function SingleChoice({
  question,
  onAnswer,
  onReady,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  const options = question.options ?? [];
  useEffect(() => {
    onReady(false);
  }, [onReady, question.id]);

  return (
    <div className="stack">
      {question.speaker && <p className="kicker">{question.speaker}</p>}
      {question.detail && <p className="speech">{question.detail}</p>}
      <p>{question.prompt}</p>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className="choice"
          disabled={good}
          onClick={() => {
            scoreChoice(score, question, option.correct, option.feedback);
            setNote(option.feedback);
            setGood(option.correct);
            if (option.correct) onReady(true);
          }}
        >
          {option.imageUrl && <img src={option.imageUrl} alt="" />}
          {option.label}
        </button>
      ))}
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

function MultiSelect({
  question,
  onAnswer,
  onReady,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const options = question.options ?? [];
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  useEffect(() => {
    onReady(false);
  }, [onReady, question.id]);

  function check() {
    const correct =
      options.every((option) => option.correct === picked.includes(option.id));
    const feedback = question.feedback ?? (correct ? "That set matches." : "Check the ones that belong, and leave the others out.");
    scoreChoice(score, question, correct, feedback);
    setNote(feedback);
    setGood(correct);
    if (correct) onReady(true);
  }

  return (
    <div className="stack">
      <p>{question.prompt}</p>
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          className={picked.includes(option.id) ? "choice on" : "choice"}
          aria-pressed={picked.includes(option.id)}
          onClick={() =>
            setPicked((current) =>
              current.includes(option.id) ? current.filter((id) => id !== option.id) : [...current, option.id],
            )
          }
        >
          {option.label}
        </button>
      ))}
      <button type="button" className="btn btn-primary" onClick={check}>
        Check selection
      </button>
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

function Ordering({
  question,
  onAnswer,
  onReady,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const answer = question.steps ?? [];
  const shuffled = useMemo(() => [...answer].reverse(), [question.id]);
  const [order, setOrder] = useState(shuffled);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  useEffect(() => {
    onReady(false);
  }, [onReady, question.id]);

  function move(index: number, direction: -1 | 1) {
    const next = index + direction;
    if (next < 0 || next >= order.length) return;
    const copy = [...order];
    const [item] = copy.splice(index, 1);
    copy.splice(next, 0, item);
    setOrder(copy);
  }

  function check() {
    const correct = order.every((step, index) => step === answer[index]);
    const feedback = question.feedback ?? (correct ? "That order holds." : "Read the list again and move the first action to the top.");
    scoreChoice(score, question, correct, feedback);
    setNote(feedback);
    setGood(correct);
    if (correct) onReady(true);
  }

  return (
    <div className="stack">
      <p>{question.prompt}</p>
      <p className="muted">Use Move up and Move down. You do not have to drag.</p>
      <ol className="stack">
        {order.map((step, index) => (
          <li key={step} className="panel row">
            <span>{step}</span>
            <button type="button" className="btn btn-ghost" onClick={() => move(index, -1)} disabled={index === 0}>
              Move up
            </button>
            <button type="button" className="btn btn-ghost" onClick={() => move(index, 1)} disabled={index === order.length - 1}>
              Move down
            </button>
          </li>
        ))}
      </ol>
      <button type="button" className="btn btn-primary" onClick={check}>
        Check order
      </button>
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

function Matching({
  question,
  onAnswer,
  onReady,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const pairs = question.pairs ?? [];
  const rights = useMemo(() => [...pairs.map((pair) => pair.right)].reverse(), [question.id]);
  const [left, setLeft] = useState<string | null>(null);
  const [matched, setMatched] = useState<Record<string, string>>({});
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  useEffect(() => {
    onReady(false);
  }, [onReady, question.id]);

  function pickRight(right: string) {
    if (!left) return;
    setMatched((current) => ({ ...current, [left]: right }));
    setLeft(null);
  }

  function check() {
    const correct = pairs.every((pair) => matched[pair.left] === pair.right);
    const feedback = question.feedback ?? (correct ? "Those pairs belong together." : "One pair is off. Select the left item, then the match on the right.");
    scoreChoice(score, question, correct, feedback);
    setNote(feedback);
    setGood(correct);
    if (correct) onReady(true);
  }

  return (
    <div className="stack">
      <p>{question.prompt}</p>
      <p className="muted">Select one item on the left, then its match on the right.</p>
      <div className="grid-2">
        <div className="stack">
          {pairs.map((pair) => (
            <button key={pair.left} type="button" className={left === pair.left ? "choice on" : "choice"} onClick={() => setLeft(pair.left)}>
              {pair.left}
              {matched[pair.left] ? ` → ${matched[pair.left]}` : ""}
            </button>
          ))}
        </div>
        <div className="stack">
          {rights.map((right) => (
            <button key={right} type="button" className="choice" onClick={() => pickRight(right)}>
              {right}
            </button>
          ))}
        </div>
      </div>
      <button type="button" className="btn btn-primary" onClick={check}>
        Check matches
      </button>
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

function Hotspot({
  question,
  onAnswer,
  onReady,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const spots = question.spots ?? [];
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  useEffect(() => {
    onReady(false);
  }, [onReady, question.id]);

  function pick(spot: NonNullable<EngineQuestion["spots"]>[number]) {
    scoreChoice(score, { ...question, id: `${question.id}:${spot.id}` }, spot.correct, spot.feedback);
    setNote(spot.feedback);
    setGood(spot.correct);
    if (spot.correct) onReady(true);
  }

  return (
    <div className="stack">
      <p>{question.prompt}</p>
      <div className="scene">
        {question.imageUrl && <img src={question.imageUrl} alt="" />}
        {spots.map((spot) => (
          <button
            key={spot.id}
            type="button"
            className="hotspot"
            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
            onClick={() => pick(spot)}
          >
            <span className="sr-only">{spot.label}</span>
          </button>
        ))}
      </div>
      <div className="stack">
        {spots.map((spot) => (
          <button key={`${spot.id}-list`} type="button" className="choice" onClick={() => pick(spot)}>
            {spot.label}
          </button>
        ))}
      </div>
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

function SdsPick({
  question,
  onAnswer,
  onReady,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  const score = useFirstScore(onAnswer);
  const sections = question.sections?.length
    ? question.sections
    : SDS_TITLES.map((title) => ({ title, body: "Open this heading to see what it covers. The number is a location, not the thing to memorize." }));
  const [open, setOpen] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  useEffect(() => {
    onReady(false);
  }, [onReady, question.id]);

  return (
    <div className="stack">
      <p>{question.prompt}</p>
      {sections.map((section) => (
        <button
          key={section.title}
          type="button"
          className="choice"
          onClick={() => {
            setOpen(section.title);
            const correct = section.title === question.answerTitle;
            if (!correct) {
              setNote("That heading answers a different question. Keep looking.");
              setGood(false);
              return;
            }
            const feedback = question.feedback ?? `The heading you needed is ${section.title}.`;
            scoreChoice(score, question, true, feedback);
            setNote(feedback);
            setGood(true);
            onReady(true);
          }}
        >
          {section.title}
        </button>
      ))}
      {open && <p className="panel">{sections.find((section) => section.title === open)?.body}</p>}
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

function ItemCheck({
  question,
  onAnswer,
  onReady,
  mode,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
  mode: "hazard" | "ppe" | "inspect";
}) {
  const score = useFirstScore(onAnswer);
  const items = question.items ?? [];
  const [picked, setPicked] = useState<string[]>([]);
  const [note, setNote] = useState<string | null>(null);
  const [good, setGood] = useState(false);
  useEffect(() => {
    onReady(false);
  }, [onReady, question.id]);

  const verb = mode === "hazard" ? "Mark the hazards" : mode === "ppe" ? "Select the gear this job needs" : "Mark each item sound or leave a defect unmarked";

  function wanted(item: NonNullable<EngineQuestion["items"]>[number]) {
    if (mode === "hazard") return Boolean(item.hazard);
    if (mode === "ppe") return Boolean(item.required);
    return Boolean(item.sound);
  }

  function check() {
    const correct = items.every((item) => wanted(item) === picked.includes(item.id));
    const feedback = question.feedback ?? (correct ? "That matches the job in front of you." : "Look again at what the task actually needs.");
    scoreChoice(score, question, correct, feedback);
    setNote(feedback);
    setGood(correct);
    if (correct) onReady(true);
  }

  return (
    <div className="stack">
      <p>{question.prompt}</p>
      <p className="muted">{verb}. Then press Check.</p>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={picked.includes(item.id) ? "choice on" : "choice"}
          aria-pressed={picked.includes(item.id)}
          onClick={() =>
            setPicked((current) => (current.includes(item.id) ? current.filter((id) => id !== item.id) : [...current, item.id]))
          }
        >
          {item.label}
        </button>
      ))}
      <button type="button" className="btn btn-primary" onClick={check}>
        Check
      </button>
      {note && <Feedback text={note} good={good} />}
    </div>
  );
}

export function QuestionEngine({
  question,
  onAnswer,
  onReady,
}: {
  question: EngineQuestion;
  onAnswer: (event: AnswerEvent) => void;
  onReady: (ready: boolean) => void;
}) {
  if (question.type === "multiple-select") return <MultiSelect question={question} onAnswer={onAnswer} onReady={onReady} />;
  if (question.type === "ordering") return <Ordering question={question} onAnswer={onAnswer} onReady={onReady} />;
  if (question.type === "matching") return <Matching question={question} onAnswer={onAnswer} onReady={onReady} />;
  if (question.type === "hotspot") return <Hotspot question={question} onAnswer={onAnswer} onReady={onReady} />;
  if (question.type === "sds") return <SdsPick question={question} onAnswer={onAnswer} onReady={onReady} />;
  if (question.type === "hazard" || question.type === "ppe" || question.type === "inspect") {
    return <ItemCheck question={question} onAnswer={onAnswer} onReady={onReady} mode={question.type} />;
  }
  return <SingleChoice question={question} onAnswer={onAnswer} onReady={onReady} />;
}

export function blankQuestion(type: EngineQuestion["type"]): EngineQuestion {
  const id = `q-${type}`;
  const base = { id, type, prompt: "", feedback: "" };
  if (type === "true-false") {
    return {
      ...base,
      options: [
        { id: "true", label: "True", correct: true, feedback: "That’s the safer reading." },
        { id: "false", label: "False", correct: false, feedback: "Read it again before you move." },
      ],
    };
  }
  if (type === "ordering") return { ...base, steps: ["First action", "Second action", "Third action"] };
  if (type === "matching") return { ...base, pairs: [{ left: "Flame pictogram", right: "Keep ignition sources away" }] };
  if (type === "sds") return { ...base, prompt: "You need the protective equipment. Which heading do you open?", answerTitle: "Exposure controls / personal protection" };
  if (type === "hazard") return { ...base, items: [{ id: "cord", label: "A cord across the walkway", hazard: true }] };
  if (type === "ppe") return { ...base, items: [{ id: "hat", label: "Hard hat", required: true }] };
  if (type === "inspect") return { ...base, items: [{ id: "cord", label: "Cord with a cut jacket", sound: false }] };
  if (type === "hotspot") return { ...base, spots: [{ id: "spot", x: 40, y: 40, label: "The hazard", correct: true, feedback: "You spotted the hazard." }] };
  if (type === "scenario") {
    return {
      ...base,
      speaker: "Sarah",
      detail: "Skip the guard. We’ll put it back later.",
      options: [
        { id: "no", label: "No. The guard stays on.", correct: true, feedback: "That’s the safer choice." },
        { id: "yes", label: "Fine, if we’re quick.", correct: false, feedback: "Quick still cuts with the guard off." },
      ],
    };
  }
  const options: ChoiceBit[] = [
    { id: "a", label: "The safer choice", correct: true, feedback: "That’s the safer choice." },
    { id: "b", label: "The shortcut", correct: false, feedback: "The shortcut adds a hazard." },
  ];
  return { ...base, options };
}
