import type { ContentWarning } from "./warnings";
import type { JurisdictionTag, LocalNote } from "./jurisdiction";
import type { EngineQuestion } from "./questions";

export type Role =
  | "new"
  | "apprentice"
  | "experienced"
  | "supervisor"
  | "other";

export type { JurisdictionCode, JurisdictionTag, LocalNote } from "./jurisdiction";

export type Phase = "learn" | "practice" | "play" | "test" | "master";

export type ScoreDimension =
  | "knowledge"
  | "decision"
  | "hazard"
  | "procedure"
  | "communication";

export type XpKind = "lesson" | "practice" | "game" | "challenge" | "check";

export type AnswerTrack = "standard" | "challenge";

export interface SourceRef {
  sourceTitle: string;
  organization: string;
  url: string;
  jurisdiction: string;
  lastReviewed: string;
  contentVersion: string;
  sourceReference?: string;
}

export interface ChoiceOption {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
}

export interface ChoiceItem {
  id: string;
  prompt: string;
  detail?: string;
  dimension: ScoreDimension;
  track?: AnswerTrack;
  options: ChoiceOption[];
}

export interface Spot {
  id: string;
  kind: string;
  x: number;
  y: number;
  label: string;
  feedback: string;
}

export interface HazardSpot extends Spot {
  severity: string;
  severityOptions: ChoiceOption[];
  controlPrompt: string;
  controlOptions: ChoiceOption[];
}

export type Block =
  | LessonBlock
  | ChoiceSetBlock
  | LocateBlock
  | HazardHuntBlock
  | HierarchyBlock
  | PpeLockerBlock
  | InspectBlock
  | LadderBlock
  | SymbolBlock
  | MatchBlock
  | LabelBlock
  | SdsBlock
  | DialogueBlock
  | ReportBlock
  | SequenceBlock
  | ShiftBlock
  | EngineBlock;

interface BlockBase {
  id: string;
  phase: Phase;
  xpKind: XpKind;
  /** Set false when several blocks are one game and only the first should pay XP. */
  countsForXp?: boolean;
  /**
   * Who this part is written for.
   * "CANADA" is general. "ALBERTA" is one province. An array is shared by those provinces.
   * Omitted parts are general Canadian information.
   */
  jurisdiction?: JurisdictionTag;
  /** Shown when the part depends on the site, or when hands-on qualification is required. */
  warnings?: ContentWarning[];
}

export interface LessonBlock extends BlockBase {
  type: "lesson";
  title: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: { title: string; body: string };
}

export interface ChoiceSetBlock extends BlockBase {
  type: "choice-set";
  title: string;
  intro?: string;
  items: ChoiceItem[];
}

export interface LocateBlock extends BlockBase {
  type: "locate";
  title: string;
  intro: string;
  scene: "gate";
  targets: Spot[];
  decoys: Spot[];
}

export interface HazardHuntBlock extends BlockBase {
  type: "hazard-hunt";
  title: string;
  intro: string;
  scene: "yard" | "cage";
  hazards: HazardSpot[];
  decoys: Spot[];
}

export interface HierarchyBlock extends BlockBase {
  type: "hierarchy";
  title: string;
  intro: string;
}

export interface PpeItem {
  id: string;
  label: string;
}

export interface PpeJob {
  id: string;
  title: string;
  situation: string;
  siteRule: string;
  required: string[];
  incorrect: string[];
  why: string;
}

export interface PpeLockerBlock extends BlockBase {
  type: "ppe-locker";
  title: string;
  intro: string;
  items: PpeItem[];
  jobs: PpeJob[];
}

export interface InspectTarget {
  id: string;
  label: string;
  x: number;
  y: number;
  defective: boolean;
  feedback: string;
}

export interface InspectBlock extends BlockBase {
  type: "inspect";
  title: string;
  intro: string;
  targets: InspectTarget[];
  decide: ChoiceItem;
}

export interface LadderStage {
  id: string;
  floor: string;
  prompt: string;
  detail: string;
  dimension: ScoreDimension;
  track?: AnswerTrack;
  options: ChoiceOption[];
}

export interface LadderBlock extends BlockBase {
  type: "ladder";
  title: string;
  intro: string;
  stages: LadderStage[];
}

export interface SymbolCard {
  id: string;
  name: string;
  glyph: string;
  meaning: string;
  siteExample: string;
  action: string;
}

export interface SymbolBlock extends BlockBase {
  type: "symbols";
  title: string;
  intro: string;
  cards: SymbolCard[];
}

export interface MatchBlock extends BlockBase {
  type: "match";
  title: string;
  product: string;
  brief: string;
  options: { id: string; name: string; glyph: string; correct: boolean }[];
  success: string;
  miss: string;
}

export interface LabelZone {
  id: string;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface LabelPrompt {
  id: string;
  ask: string;
  zoneId: string;
  success: string;
}

export interface LabelBlock extends BlockBase {
  type: "label";
  title: string;
  intro: string;
  prompts: LabelPrompt[];
  zones: LabelZone[];
}

export interface SdsSection {
  num: number;
  title: string;
  body: string;
}

export interface SdsQuestion {
  id: string;
  ask: string;
  section: number;
  explain: string;
}

export interface SdsBlock extends BlockBase {
  type: "sds";
  title: string;
  mission: string;
  sections: SdsSection[];
  questions: SdsQuestion[];
}

export interface DialogueFollowUp {
  speaker: string;
  line: string;
  choices: ChoiceOption[];
}

export interface DialogueBlock extends BlockBase {
  type: "dialogue";
  speaker: string;
  line: string;
  dimension: ScoreDimension;
  track?: AnswerTrack;
  choices: ChoiceOption[];
  /** A second line that appears after the safe reply, so the scene can branch. */
  followUp?: DialogueFollowUp;
}

export interface ReportField {
  id: string;
  label: string;
  placeholder: string;
}

export interface ReportBlock extends BlockBase {
  type: "report";
  title: string;
  story: string;
  decision: ChoiceItem;
  fields: ReportField[];
  modelReport: string;
}

export interface SequenceStep {
  id: string;
  prompt: string;
  detail?: string;
  dimension: ScoreDimension;
  track?: AnswerTrack;
  options: ChoiceOption[];
}

export interface SequenceBlock extends BlockBase {
  type: "sequence";
  title: string;
  intro: string;
  steps: SequenceStep[];
  closing: string;
  showTimer?: boolean;
}

export interface ShiftBeat {
  id: string;
  kicker: string;
  prompt: string;
  detail: string;
  dimension: ScoreDimension;
  reviewModuleId: string;
  options: { id: string; label: string; quality: "strong" | "weak" | "unsafe"; review: string }[];
}

export interface ShiftBlock extends BlockBase {
  type: "shift";
  title: string;
  intro: string;
  beats: ShiftBeat[];
}

export interface EngineBlock extends BlockBase {
  type: "engine";
  title: string;
  question: EngineQuestion;
}

export interface TrainingModule {
  id: string;
  title: string;
  mapLabel: string;
  description: string;
  estimatedMinutes: number;
  difficulty: "Starter" | "Core" | "Field";
  /** Completion XP shown on the map. Activity XP is awarded separately. */
  completionXp: number;
  objectives: string[];
  /**
   * Who this module is written for.
   * "CANADA", "ALBERTA", or a list such as ["ALBERTA", "BRITISH_COLUMBIA"].
   */
  jurisdiction: JurisdictionTag;
  badgeId?: string;
  /** Province notes. Each one carries its own jurisdiction and is hidden for other profiles. */
  notes?: LocalNote[];
  warnings?: ContentWarning[];
  /** First-answer percent treated as a pass. Educational only. It is not a certificate. */
  passingScore?: number;
  blocks: Block[];
  sources: SourceRef[];
}

export interface AnswerEvent {
  id: string;
  prompt: string;
  correct: boolean;
  feedback: string;
  dimension: ScoreDimension;
  track: AnswerTrack;
}
