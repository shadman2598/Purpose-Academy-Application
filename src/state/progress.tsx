import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { BADGES, HAZARD_BADGE_TARGET } from "../content/badges";
import { MODULE_VERSIONS } from "../content/campaign";
import { XP } from "../content/framework";
import { MODULES } from "../content/catalog";
import { readJurisdiction, type JurisdictionCode } from "../content/jurisdiction";
import type { AnswerEvent, Role, ScoreDimension, XpKind } from "../content/model";
import { TRADES, type Trade } from "../content/trades";
import { DAY_MS } from "../content/checks";

const KEY = "sitewise.v1";

export interface AnswerRecord {
  correct: boolean;
  dimension: ScoreDimension;
  track: "standard" | "challenge";
  prompt: string;
  feedback: string;
}

export interface ModuleSave {
  cursor: number;
  completed: boolean;
  blockDone: string[];
  answered: Record<string, AnswerRecord>;
  seconds: number;
  updatedAt: number;
  contentVersion?: string;
  completedOn?: string;
}

export interface ReviewSave {
  due: number;
  correct: boolean;
  misses: number;
}

export interface Settings {
  textScale: "default" | "large";
  reducedMotion: boolean;
  /** Quiet original site score. Missing on older saves means on. */
  sound?: boolean;
}

export interface SaveState {
  version: 1;
  onboarded: boolean;
  role: Role | null;
  /** Learner's province. Older saves used short codes such as "AB". */
  jurisdiction: JurisdictionCode | null;
  xp: number;
  awarded: string[];
  modules: Record<string, ModuleSave>;
  hazards: string[];
  settings: Settings;
  trade: Trade | null;
  equipped: string[];
  reviews: Record<string, ReviewSave>;
}

const defaultSettings: Settings = { textScale: "default", reducedMotion: false, sound: true };

export const emptySave = (): SaveState => ({
  version: 1,
  onboarded: false,
  role: null,
  jurisdiction: null,
  xp: 0,
  awarded: [],
  modules: {},
  hazards: [],
  settings: defaultSettings,
  trade: null,
  equipped: [],
  reviews: {},
});

function readTrade(value: unknown): Trade | null {
  return typeof value === "string" && TRADES.some((trade) => trade.id === value) ? (value as Trade) : null;
}

function emptyModule(): ModuleSave {
  return { cursor: 0, completed: false, blockDone: [], answered: {}, seconds: 0, updatedAt: 0 };
}

function load(): SaveState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return emptySave();
    const parsed = JSON.parse(raw) as Partial<SaveState> & { province?: unknown };
    if (parsed.version !== 1) return emptySave();
    const { province: legacyProvince, ...rest } = parsed;
    return {
      ...emptySave(),
      ...rest,
      jurisdiction: readJurisdiction(parsed.jurisdiction ?? legacyProvince),
      settings: { ...defaultSettings, ...parsed.settings },
      modules: Object.fromEntries(
        Object.entries(parsed.modules ?? {}).map(([id, save]) => [
          id,
          { ...emptyModule(), ...save, seconds: save.seconds ?? 0, updatedAt: save.updatedAt ?? 0 },
        ]),
      ),
      hazards: parsed.hazards ?? [],
      awarded: parsed.awarded ?? [],
      trade: readTrade(parsed.trade),
      equipped: Array.isArray(parsed.equipped) ? parsed.equipped.filter((id) => typeof id === "string") : [],
      reviews: parsed.reviews && typeof parsed.reviews === "object" ? parsed.reviews : {},
    };
  } catch {
    return emptySave();
  }
}

export function xpFor(kind: XpKind): number {
  return XP[kind];
}

export function modulePercent(moduleId: string, save: ModuleSave | undefined): number {
  const module = MODULES.find((item) => item.id === moduleId);
  if (!module) return 0;
  if (save?.completed) return 100;
  if (!save || module.blocks.length === 0) return 0;
  return Math.round((save.blockDone.length / module.blocks.length) * 100);
}

export function isModuleUnlocked(_moduleId: string, _state: SaveState): boolean {
  return true;
}

export function nextModuleId(state: SaveState, modules = MODULES): string {
  const next = modules.find((item) => !state.modules[item.id]?.completed);
  return next?.id ?? modules[modules.length - 1]?.id ?? MODULES[0].id;
}

export function coursePercent(state: SaveState, modules = MODULES): number {
  if (!modules.length) return 0;
  const done = modules.filter((item) => state.modules[item.id]?.completed).length;
  return Math.round((done / modules.length) * 100);
}

export function tallies(state: SaveState, moduleId?: string) {
  const base = (): Record<ScoreDimension, { correct: number; total: number }> => ({
    knowledge: { correct: 0, total: 0 },
    decision: { correct: 0, total: 0 },
    hazard: { correct: 0, total: 0 },
    procedure: { correct: 0, total: 0 },
    communication: { correct: 0, total: 0 },
  });
  const scores = base();
  const ids = moduleId ? [moduleId] : MODULES.map((item) => item.id);
  for (const id of ids) {
    const answered = state.modules[id]?.answered ?? {};
    for (const record of Object.values(answered)) {
      scores[record.dimension].total += 1;
      if (record.correct) scores[record.dimension].correct += 1;
    }
  }
  return scores;
}

export function mistakesFor(save: ModuleSave | undefined) {
  if (!save) return [];
  return Object.entries(save.answered)
    .filter(([, record]) => !record.correct)
    .map(([id, record]) => ({ id, ...record }));
}

export function challengeWasPerfect(save: ModuleSave | undefined): boolean {
  if (!save) return false;
  const challenge = Object.values(save.answered).filter((record) => record.track === "challenge");
  return challenge.length > 0 && challenge.every((record) => record.correct);
}

export function earnedBadgeIds(state: SaveState): string[] {
  const done = (id: string) => Boolean(state.modules[id]?.completed);
  const ids: string[] = [];
  if (done("ppe")) ids.push("gear-ready");
  if (state.hazards.length >= HAZARD_BADGE_TARGET) ids.push("hazard-hunter");
  if (done("whmis")) ids.push("chemical-detective");
  if (done("tools")) ids.push("tool-inspector");
  if (done("emergency")) ids.push("emergency-ready");
  if (done("conduct")) ids.push("crew-player");
  if (MODULES.every((item) => done(item.id))) ids.push("site-ready");
  return BADGES.map((badge) => badge.id).filter((id) => ids.includes(id));
}

interface ProgressApi {
  state: SaveState;
  setProfile: (role: Role, jurisdiction: JurisdictionCode) => void;
  setJurisdiction: (jurisdiction: JurisdictionCode) => void;
  setRole: (role: Role) => void;
  setTrade: (trade: Trade) => void;
  toggleEquip: (id: string) => void;
  answerCheck: (id: string, moduleId: string, prompt: string, correct: boolean, feedback: string, dimension: ScoreDimension) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  resetProgress: () => void;
  setCursor: (moduleId: string, cursor: number) => void;
  recordAnswer: (moduleId: string, event: AnswerEvent) => void;
  findHazard: (id: string) => void;
  completeBlock: (moduleId: string, blockId: string, kind: XpKind, award?: boolean) => void;
  completeModule: (moduleId: string) => void;
  addSeconds: (moduleId: string, seconds: number) => void;
}

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SaveState>(() => {
    const loaded = load();
    document.documentElement.dataset.text = loaded.settings.textScale;
    document.documentElement.dataset.motion = loaded.settings.reducedMotion ? "reduce" : "full";
    return loaded;
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(state));
    document.documentElement.dataset.text = state.settings.textScale;
    document.documentElement.dataset.motion = state.settings.reducedMotion ? "reduce" : "full";
  }, [state]);

  const api = useMemo<ProgressApi>(
    () => ({
      state,
      setProfile: (role, jurisdiction) =>
        setState((prev) => ({ ...prev, role, jurisdiction, onboarded: true })),
      setJurisdiction: (jurisdiction) => setState((prev) => ({ ...prev, jurisdiction })),
      setRole: (role) => setState((prev) => ({ ...prev, role })),
      setTrade: (trade) => setState((prev) => ({ ...prev, trade })),
      toggleEquip: (id) =>
        setState((prev) => ({
          ...prev,
          equipped: prev.equipped.includes(id) ? prev.equipped.filter((item) => item !== id) : [...prev.equipped, id],
        })),
      answerCheck: (id, moduleId, prompt, correct, feedback, dimension) =>
        setState((prev) => {
          const awardId = `check:${id}`;
          const current = prev.modules[moduleId] ?? emptyModule();
          const prior = prev.reviews[id];
          const answered = current.answered[id]
            ? current.answered
            : {
                ...current.answered,
                [id]: { correct, dimension, track: "standard" as const, prompt, feedback },
              };
          const awarded = prev.awarded.includes(awardId) ? prev.awarded : [...prev.awarded, awardId];
          const xp = prev.awarded.includes(awardId) ? prev.xp : prev.xp + XP.check;
          return {
            ...prev,
            xp,
            awarded,
            reviews: {
              ...prev.reviews,
              [id]: {
                due: correct ? Date.now() + DAY_MS : Date.now(),
                correct: prior?.correct || correct,
                misses: (prior?.misses ?? 0) + (correct ? 0 : 1),
              },
            },
            modules: {
              ...prev.modules,
              [moduleId]: { ...current, answered },
            },
          };
        }),
      updateSettings: (patch) =>
        setState((prev) => ({ ...prev, settings: { ...prev.settings, ...patch } })),
      resetProgress: () =>
        setState((prev) => ({
          ...emptySave(),
          settings: prev.settings,
        })),
      setCursor: (moduleId, cursor) =>
        setState((prev) => ({
          ...prev,
          modules: {
            ...prev.modules,
            [moduleId]: { ...(prev.modules[moduleId] ?? emptyModule()), cursor },
          },
        })),
      recordAnswer: (moduleId, event) =>
        setState((prev) => {
          const current = prev.modules[moduleId] ?? emptyModule();
          if (current.answered[event.id]) return prev;
          return {
            ...prev,
            modules: {
              ...prev.modules,
              [moduleId]: {
                ...current,
                answered: {
                  ...current.answered,
                  [event.id]: {
                    correct: event.correct,
                    dimension: event.dimension,
                    track: event.track,
                    prompt: event.prompt,
                    feedback: event.feedback,
                  },
                },
              },
            },
          };
        }),
      findHazard: (id) =>
        setState((prev) =>
          prev.hazards.includes(id) ? prev : { ...prev, hazards: [...prev.hazards, id] },
        ),
      completeBlock: (moduleId, blockId, kind, award = true) =>
        setState((prev) => {
          const awardId = `${moduleId}:${blockId}`;
          const current = prev.modules[moduleId] ?? emptyModule();
          const blockDone = current.blockDone.includes(blockId)
            ? current.blockDone
            : [...current.blockDone, blockId];
          if (prev.awarded.includes(awardId) || !award) {
            return {
              ...prev,
              modules: { ...prev.modules, [moduleId]: { ...current, blockDone } },
            };
          }
          return {
            ...prev,
            xp: prev.xp + xpFor(kind),
            awarded: [...prev.awarded, awardId],
            modules: { ...prev.modules, [moduleId]: { ...current, blockDone } },
          };
        }),
      completeModule: (moduleId) =>
        setState((prev) => {
          const current = prev.modules[moduleId] ?? emptyModule();
          const awardId = `${moduleId}:complete`;
          const perfectId = `${moduleId}:perfect`;
          const needComplete = !prev.awarded.includes(awardId);
          const needPerfect = challengeWasPerfect(current) && !prev.awarded.includes(perfectId);
          if (current.completed && !needComplete && !needPerfect) return prev;
          let xp = prev.xp;
          const awarded = [...prev.awarded];
          if (needComplete) {
            xp += XP.module;
            awarded.push(awardId);
          }
          if (needPerfect) {
            xp += XP.perfect;
            awarded.push(perfectId);
          }
          return {
            ...prev,
            xp,
            awarded,
            modules: {
              ...prev.modules,
              [moduleId]: {
                ...current,
                completed: true,
                updatedAt: Date.now(),
                contentVersion: current.contentVersion ?? (current.completed ? current.contentVersion : MODULE_VERSIONS[moduleId]?.version ?? "1.0"),
                completedOn: current.completedOn ?? (current.completed ? current.completedOn : new Date().toISOString().slice(0, 10)),
              },
            },
          };
        }),
      addSeconds: (moduleId, seconds) =>
        setState((prev) => {
          const current = prev.modules[moduleId] ?? emptyModule();
          return {
            ...prev,
            modules: {
              ...prev.modules,
              [moduleId]: { ...current, seconds: current.seconds + seconds, updatedAt: Date.now() },
            },
          };
        }),
    }),
    [state],
  );

  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgress(): ProgressApi {
  const ctx = useContext(ProgressContext);
  if (!ctx) throw new Error("useProgress must be used inside ProgressProvider");
  return ctx;
}
