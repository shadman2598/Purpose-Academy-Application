import { useCallback, useEffect, useState } from "react";
import { Link, Navigate, useParams, useSearchParams } from "react-router-dom";
import { MODULES } from "../content/catalog";
import { WHMIS_LEVEL } from "../content/difficulty";
import { storyLine } from "../content/story";
import { DIMENSIONS, DISCLAIMER, jurisdictionLabel, PHASES, roleLine } from "../content/framework";
import { isGeneralCanadian, jurisdictionApplies, jurisdictionHeading, jurisdictionInfo, visibleNotes } from "../content/jurisdiction";
import { ContentWarnings } from "./ContentWarning";
import { JurisdictionClosed, JurisdictionMark, LocalNotes } from "./JurisdictionMark";
import { warningList } from "../content/warnings";
import type { LessonBlock, SourceRef } from "../content/model";
import { describeBlock, mainGame, moduleSteps } from "../content/play";
import { useContent } from "../state/content";
import {
  isModuleUnlocked,
  mistakesFor,
  modulePercent,
  tallies,
  useProgress,
} from "../state/progress";
import { ExitBar } from "./ExitBar";
import { RealityCheck } from "./RealityCheck";
import { Feedback, BlockView } from "./activities";
import { TeachText } from "./Parable";
import { tradeCall } from "../content/tradeScenes";

export function SourceList({ sources }: { sources: SourceRef[] }) {
  return (
    <div className="stack">
      {sources.map((source) => (
        <article key={source.url} className="panel">
          <strong>{source.sourceTitle}</strong>
          <p>{source.organization}</p>
          <p>
            <a href={source.url} target="_blank" rel="noreferrer">
              {source.url}
            </a>
          </p>
          <p className="faint">
            {source.jurisdiction} · Reviewed {source.lastReviewed} · Content version {source.contentVersion}
            {source.sourceReference ? ` · Reference ${source.sourceReference}` : ""}
          </p>
        </article>
      ))}
    </div>
  );
}

function TradeLessonCall({ moduleId }: { moduleId: string }) {
  const { state, recordAnswer } = useProgress();
  const scene = tradeCall(moduleId, state.trade);
  const [picked, setPicked] = useState("");
  if (!scene) return null;
  const option = scene.options.find((item) => item.id === picked);
  return (
    <article className="panel stack">
      <p className="kicker">{scene.speaker} · this call follows your trade</p>
      <TeachText text={scene.lesson} />
      <TeachText text={scene.line} />
      <p className="muted">A trade here changes the call. It does not certify the trade.</p>
      {scene.options.map((item) => (
        <button
          key={item.id}
          type="button"
          className="btn btn-ghost"
          onClick={() => {
            setPicked(item.id);
            recordAnswer(moduleId, {
              id: `trade-${moduleId}-${state.trade}`,
              prompt: scene.line,
              correct: item.correct,
              feedback: item.feedback,
              dimension: "decision",
              track: "standard",
            });
          }}
        >
          {item.label}
        </button>
      ))}
      {option && <Feedback text={option.feedback} good={option.correct} review={scene.review} />}
    </article>
  );
}

function LessonView({ block, moduleId }: { block: LessonBlock; moduleId: string }) {
  const { state } = useProgress();
  const scene = tradeCall(moduleId, state.trade);
  return (
    <div className="stack">
      <h3>{block.title}</h3>
      <p className="faint">Press a line. The yard shows that step.</p>
      {scene && <TeachText text={scene.lesson} />}
      {block.paragraphs.map((paragraph) => (
        <TeachText key={paragraph} text={paragraph} />
      ))}
      {block.bullets && (
        <ul className="teach-list">
          {block.bullets.map((bullet) => (
            <li key={bullet}>
              <TeachText text={bullet} />
            </li>
          ))}
        </ul>
      )}
      {block.callout && (
        <div className="callout">
          <strong>{block.callout.title}</strong>
          <TeachText text={block.callout.body} />
        </div>
      )}
    </div>
  );
}

function PassLine({ moduleId, passingScore }: { moduleId: string; passingScore: number }) {
  const { state } = useProgress();
  const scores = tallies(state, moduleId);
  const totals = Object.values(scores).reduce(
    (sum, item) => ({ correct: sum.correct + item.correct, total: sum.total + item.total }),
    { correct: 0, total: 0 },
  );
  const score = totals.total ? Math.round((totals.correct / totals.total) * 100) : 0;
  const passed = score >= passingScore;
  return (
    <p>
      First-answer score {score}%. Passing mark for this module is {passingScore}%. {passed ? "You met that mark." : "Review the misses below and play the weak parts again."} This mark is feedback. It is not a licence.
    </p>
  );
}

function ScoreList({ moduleId }: { moduleId?: string }) {
  const { state } = useProgress();
  const scores = tallies(state, moduleId);
  return (
    <div className="stack">
      {DIMENSIONS.map((dimension) => {
        const tally = scores[dimension.id];
        if (!tally.total) return null;
        const pct = Math.round((tally.correct / tally.total) * 100);
        return (
          <div key={dimension.id} className="score-line">
            <span>{dimension.label}</span>
            <div className="bar" aria-hidden>
              <span style={{ width: `${pct}%` }} />
            </div>
            <span>{pct}%</span>
          </div>
        );
      })}
    </div>
  );
}

export function ModulePlayer() {
  const { moduleId } = useParams();
  const { modules } = useContent();
  const [params, setParams] = useSearchParams();
  const playId = params.get("play");
  const module = modules.find((item) => item.id === moduleId);
  const progress = useProgress();
  const { state } = progress;
  const save = module ? state.modules[module.id] : undefined;
  const [cursor, setCursor] = useState(() => {
    if (!module) return save?.cursor ?? 0;
    if (playId) {
      const index = module.blocks.findIndex((item) => item.id === playId);
      if (index >= 0) return index + 1;
    }
    return save?.cursor ?? 0;
  });
  const [readyKey, setReadyKey] = useState("");

  const blockIds = module?.blocks.map((item) => item.id).join("|") ?? "";
  useEffect(() => {
    if (!module) return;
    if (playId) {
      const index = module.blocks.findIndex((item) => item.id === playId);
      if (index >= 0) {
        setCursor(index + 1);
        setReadyKey("");
        return;
      }
    }
    setCursor(save?.cursor ?? 0);
  }, [module?.id, playId, blockIds]);

  const key = !module ? "none" : cursor === 0 ? `${module.id}:intro` : cursor > module.blocks.length ? `${module.id}:results` : `${module.id}:${module.blocks[cursor - 1]?.id}`;
  const block = module && cursor > 0 && cursor <= module.blocks.length ? module.blocks[cursor - 1] : undefined;
  const applies = !block || jurisdictionApplies(block.jurisdiction, state.jurisdiction);
  const autoReady = cursor === 0 || !block || block.type === "lesson" || !applies;
  const ready = autoReady || readyKey === key;
  const onReady = useCallback((value: boolean) => {
    setReadyKey(value ? key : "");
  }, [key]);

  useEffect(() => {
    if (!module) return;
    if (cursor > module.blocks.length) progress.completeModule(module.id);
  }, [cursor, module?.id]);

  useEffect(() => {
    if (!module) return;
    const started = Date.now();
    const moduleId = module.id;
    return () => {
      const seconds = Math.round((Date.now() - started) / 1000);
      if (seconds > 0) progress.addSeconds(moduleId, seconds);
    };
  }, [module?.id, cursor]);

  if (!module) return <Navigate to="/training" replace />;
  if (!isModuleUnlocked(module.id, state)) {
    return (
      <div className="stack">
        <h2>Locked</h2>
        <p>Finish the previous module to open {module.title}.</p>
        <Link to="/training">Back to the map</Link>
      </div>
    );
  }

  const phase = cursor === 0 ? "learn" : cursor > module.blocks.length ? "master" : block?.phase ?? "learn";
  const mistakes = mistakesFor(save);
  const next = MODULES[MODULES.findIndex((item) => item.id === module.id) + 1];

  function go(nextCursor: number) {
    if (!module) return;
    if (block && nextCursor === cursor + 1 && cursor > 0 && cursor <= module.blocks.length) {
      progress.completeBlock(module.id, block.id, block.xpKind, block.countsForXp !== false);
    }
    progress.setCursor(module.id, nextCursor);
    setCursor(nextCursor);
    setReadyKey("");
    if (playId) setParams({}, { replace: true });
  }

  function jump(nextCursor: number) {
    if (!module) return;
    progress.setCursor(module.id, nextCursor);
    setCursor(nextCursor);
    setReadyKey("");
    if (playId) setParams({}, { replace: true });
  }

  const steps = moduleSteps(module);
  const featured = mainGame(module);
  const how = block ? describeBlock(block) : undefined;
  const warnings = warningList(module.warnings, applies ? block?.warnings : undefined);
  const beat = storyLine(module.id);
  const levelLine = block ? WHMIS_LEVEL[block.id] : undefined;

  return (
    <div className="stack">
      <p className="kicker">{module.mapLabel}</p>
      <h2>{module.title}</h2>
      <div className="phase-pips">
        {PHASES.map((item) => (
          <span key={item.id} className={item.id === phase ? "on" : undefined}>
            {item.label}
          </span>
        ))}
      </div>
      {state.jurisdiction && jurisdictionInfo(state.jurisdiction).englishOnlyNote && (
        <div className="banner">
          French-language lessons are not in this version. You are seeing general Canadian information in English.
        </div>
      )}
      <nav className="jump" aria-label="Parts of this module">
        <button type="button" className={cursor === 0 ? "on" : undefined} onClick={() => jump(0)}>
          Intro
        </button>
        {steps.map((step, index) => {
          const tag = module.blocks[index]?.jurisdiction;
          const scope = isGeneralCanadian(tag) ? "" : ` · ${jurisdictionHeading(tag)}`;
          return (
            <button key={step.blockId} type="button" className={cursor === index + 1 ? "on" : undefined} onClick={() => jump(index + 1)}>
              {step.kind === "Game" || step.kind === "Challenge" ? step.name : step.kind}
              {scope}
            </button>
          );
        })}
        <button type="button" className={cursor > module.blocks.length ? "on" : undefined} onClick={() => jump(module.blocks.length + 1)}>
          Results
        </button>
      </nav>
      <p className="faint">
        Jumping skips ahead without awarding the parts you did not do.{" "}
        <Link to="/games">All games</Link>
      </p>
      <details className="sources">
        <summary>Training sources</summary>
        <SourceList sources={module.sources} />
      </details>

      {warnings.length > 0 && <ContentWarnings warnings={warnings} />}

      {cursor === 0 && (
        <div className="stack">
          <p>{roleLine(state.role)}</p>
          <TeachText text={module.description} />
          <p className="muted">
            {module.estimatedMinutes} minutes · {module.difficulty} · +{module.completionXp} XP on completion
          </p>
          <h3>Learning objectives</h3>
          <ul className="teach-list">
            {module.objectives.map((objective) => (
              <li key={objective}>
                <TeachText text={objective} />
              </li>
            ))}
          </ul>
          <blockquote className="speech">
            <p className="kicker">{beat.speaker}</p>
            <TeachText text={beat.text} />
          </blockquote>
          <p className="muted">This part is built as a short segment, about 3–7 minutes, then practice and a game.</p>
          <JurisdictionMark tag={module.jurisdiction} />
          <RealityCheck moduleId={module.id} />
          <TradeLessonCall moduleId={module.id} />
          <details className="learn-more">
            <summary>Learn more</summary>
            <LocalNotes notes={visibleNotes(module.notes, state.jurisdiction)} />
          </details>
          <h3>What’s in here</h3>
          <ul className="outline">
            {steps.map((step) => (
              <li key={step.blockId}>
                <button type="button" className="btn btn-text" onClick={() => jump(steps.findIndex((item) => item.blockId === step.blockId) + 1)}>
                  {step.kind}: {step.name}
                </button>
              </li>
            ))}
          </ul>
          {featured && (
            <button type="button" className="btn btn-primary" onClick={() => jump(steps.findIndex((item) => item.blockId === featured.blockId) + 1)}>
              Play {featured.name}
            </button>
          )}
          <div className="disclaimer">{DISCLAIMER}</div>
        </div>
      )}

      {how && block && applies && (
        <div className="howto">
          <strong>{how.kind === "Read" ? "How this page works" : "How to play"}</strong>
          {levelLine && <p>{levelLine}</p>}
          <p>{how.how} About 5 minutes.</p>
        </div>
      )}

      {block && !applies && <JurisdictionClosed tag={block.jurisdiction} learner={state.jurisdiction} />}
      {block?.type === "lesson" && applies && (
        <>
          <JurisdictionMark tag={block.jurisdiction} />
          <LessonView block={block} moduleId={module.id} />
        </>
      )}
      {block && block.type !== "lesson" && applies && (
        <>
          <JurisdictionMark tag={block.jurisdiction} />
          <BlockView block={block} onAnswer={(event) => progress.recordAnswer(module.id, event)} onHazard={progress.findHazard} onReady={onReady} />
        </>
      )}

      {cursor > module.blocks.length && (
        <div className="stack">
          <h3>Results</h3>
          <p>
            {module.title} is complete on this device. That is a training record, not a certificate.
            {state.awarded.includes(`${module.id}:perfect`)
              ? " The challenge was clean on the first try, so it added 100 XP. The score below still counts earlier practice."
              : " The perfect-challenge bonus stays available only on a clean first try of the challenge. Replays do not rewrite it."}
          </p>
          <p>Module completion +500 XP. Activity XP was added as you went. None of it rewards speed.</p>
          <PassLine moduleId={module.id} passingScore={module.passingScore ?? 70} />
          <ScoreList moduleId={module.id} />
          <h3>Review mistakes</h3>
          {mistakes.length === 0 && <p>No first-try misses are stored for this module.</p>}
          {mistakes.map((mistake) => (
            <div key={mistake.id} className="panel">
              <p>{mistake.prompt}</p>
              <p className="muted">{mistake.feedback}</p>
            </div>
          ))}
          {module.badgeId && <p>Badge progress is on the Badges page. Badges mark modules you finished here. They are not licences.</p>}
          <h3>Sources & references</h3>
          <SourceList sources={module.sources} />
          <div className="disclaimer">{DISCLAIMER}</div>
          <button type="button" className="btn btn-text" onClick={() => go(0)}>
            Replay this module
          </button>
        </div>
      )}

      <div className="row">
        {cursor > 0 && (
          <button type="button" className="btn btn-ghost" onClick={() => go(cursor - 1)}>
            Back
          </button>
        )}
        {ready && cursor > 0 && block && block.type !== "lesson" && (
          <Link className="btn btn-ghost" to="/home">
            Back to home
          </Link>
        )}
        {cursor <= module.blocks.length && (
          <button type="button" className="btn btn-primary" disabled={!ready} onClick={() => go(cursor + 1)}>
            {cursor === 0 ? "Start" : cursor === module.blocks.length ? "See results" : "Continue"}
          </button>
        )}
        {cursor > module.blocks.length && (
          <ExitBar continueHref={next ? `/training/${next.id}` : "/record"} continueLabel={next ? `Continue: ${next.mapLabel}` : "Continue to your record"} />
        )}
      </div>
      <p className="faint">Progress on this module: {modulePercent(module.id, state.modules[module.id])}%. Province on file: {jurisdictionLabel(state.jurisdiction)}.</p>
    </div>
  );
}
