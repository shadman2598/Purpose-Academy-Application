export type QuestionType =
  | "multiple-choice"
  | "multiple-select"
  | "true-false"
  | "image-selection"
  | "hotspot"
  | "ordering"
  | "matching"
  | "scenario"
  | "sds"
  | "hazard"
  | "ppe"
  | "inspect";

export interface ChoiceBit {
  id: string;
  label: string;
  correct: boolean;
  feedback: string;
  imageUrl?: string;
}

export interface EngineQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  detail?: string;
  speaker?: string;
  options?: ChoiceBit[];
  steps?: string[];
  pairs?: { left: string; right: string }[];
  imageUrl?: string;
  spots?: { id: string; x: number; y: number; label: string; correct: boolean; feedback: string }[];
  sections?: { title: string; body: string }[];
  answerTitle?: string;
  items?: { id: string; label: string; required?: boolean; sound?: boolean; hazard?: boolean }[];
  feedback?: string;
  difficulty?: 1 | 2 | 3 | 4 | 5;
}

export const QUESTION_TYPES: { id: QuestionType; label: string }[] = [
  { id: "multiple-choice", label: "Multiple choice" },
  { id: "multiple-select", label: "Multiple select" },
  { id: "true-false", label: "True / false" },
  { id: "image-selection", label: "Image selection" },
  { id: "hotspot", label: "Hotspot" },
  { id: "ordering", label: "Ordering" },
  { id: "matching", label: "Matching" },
  { id: "scenario", label: "Scenario decision" },
  { id: "sds", label: "SDS navigation" },
  { id: "hazard", label: "Hazard spotting" },
  { id: "ppe", label: "PPE selection" },
  { id: "inspect", label: "Equipment inspection" },
];

export const SDS_TITLES = [
  "Identification",
  "Hazard identification",
  "Composition",
  "First-aid measures",
  "Fire-fighting measures",
  "Accidental release measures",
  "Handling and storage",
  "Exposure controls / personal protection",
  "Physical and chemical properties",
  "Stability and reactivity",
  "Toxicological information",
  "Ecological information",
  "Disposal considerations",
  "Transport information",
  "Regulatory information",
  "Other information",
];
