import { MODULES } from "./catalog";
import type { Block, Phase, TrainingModule } from "./model";

export type StepKind = "Read" | "Practice" | "Game" | "Check" | "Challenge";

export interface PlayStep {
  moduleId: string;
  moduleTitle: string;
  blockId: string;
  name: string;
  phase: Phase;
  kind: StepKind;
  how: string;
  href: string;
}

const HOW: Record<string, string> = {
  lesson: "Read this page. Nothing is scored. Press Continue when you are ready.",
  "choice-set":
    "Pick what you would do on site. Your first tap is the one that scores. If you miss, read the reason, then pick the safe choice to move on.",
  locate:
    "The line above the picture names one place. Point at the yard and click that place. A wrong click tells you what you actually hit. Then press Next location.",
  "hazard-hunt":
    "Tap the picture or the list. If nothing is wrong, the site says so and your score stays put. A real hazard asks how serious it is, then what you would do. Find them all to finish.",
  hierarchy:
    "Tap the five controls from the one you consider first to the one you consider last. Then answer the dust questions. Higher controls are preferred when they are actually possible.",
  "ppe-locker":
    "Read the job. Tap every piece of gear that job needs. Press Ready for the job. The page tells you what is missing or wrong. Fix it and check again.",
  inspect:
    "Look at each tool. Mark it sound or a defect. After the bench is sorted, choose what to do with the damaged cord.",
  ladder:
    "Each floor is one decision. A safe choice lets you climb. This climb does not certify you to work at height.",
  symbols: "Open every pictogram. Read the name, the meaning, and what you do on site. The label and SDS still come before you handle a product.",
  match: "Read the product. Select every pictogram that fits. Leave the ones that do not. Then press Check pictograms.",
  label:
    "The question tells you what to find. Tap that part of the training label. A wrong tap stays on the label so you can try again. Press Next element after a hit.",
  sds: "Read the question. Open the SDS section that answers it. You do not need to memorize all sixteen sections.",
  dialogue:
    "Read what they said. Choose your reply. If the conversation continues, answer the next line too. Your first tap on each line is the score.",
  report:
    "Choose the call first. Then fill every line of the report so someone who was not there could find the spot. The report stays on this device.",
  sequence:
    "Take the steps in order. A safe step moves you forward. Time on screen, when you see it, does not change the score.",
  shift:
    "Eight moments on one morning. Log a choice and keep going. The right and wrong answers wait for the debrief at the end.",
};

export function describeBlock(block: Block): { name: string; kind: StepKind; how: string } {
  const challenge = block.xpKind === "challenge";
  if (block.type === "lesson") return { name: block.title, kind: "Read", how: HOW.lesson };
  if (block.type === "choice-set") {
    return {
      name: block.title,
      kind: challenge ? "Challenge" : block.phase === "test" ? "Check" : "Practice",
      how: HOW["choice-set"],
    };
  }
  if (block.type === "locate") return { name: "Find Your Way", kind: "Game", how: HOW.locate };
  if (block.type === "hazard-hunt") return { name: block.title, kind: "Game", how: HOW["hazard-hunt"] };
  if (block.type === "hierarchy") return { name: "Hierarchy of controls", kind: "Game", how: HOW.hierarchy };
  if (block.type === "ppe-locker") return { name: "PPE locker", kind: "Game", how: HOW["ppe-locker"] };
  if (block.type === "inspect") return { name: "Tool Check", kind: "Game", how: HOW.inspect };
  if (block.type === "ladder") return { name: "Don't Miss a Step", kind: "Game", how: HOW.ladder };
  if (block.type === "symbols") return { name: "WHMIS symbols", kind: "Game", how: HOW.symbols };
  if (block.type === "match") return { name: "Match the symbol", kind: "Game", how: HOW.match };
  if (block.type === "label") return { name: "Label detective", kind: "Game", how: HOW.label };
  if (block.type === "sds") return { name: "SDS search", kind: "Game", how: HOW.sds };
  if (block.type === "dialogue") {
    const names: Record<string, string> = {
      "whmis-coworker": "Alex asks where the precautions are",
      "conduct-shortcut": "Refuse the shortcut",
      "conduct-disrespect": "Stop the mockery",
      "conduct-language": "The instruction did not land",
      "conduct-fatigue": "Too tired for the ladder",
      "conduct-horseplay": "Horseplay on the stair",
      "conduct-challenge": "Do not sign the inspection",
    };
    return {
      name: names[block.id] ?? `${block.speaker} conversation`,
      kind: challenge ? "Challenge" : "Game",
      how: HOW.dialogue,
    };
  }
  if (block.type === "report") return { name: block.title, kind: challenge ? "Challenge" : "Game", how: HOW.report };
  if (block.type === "sequence") return { name: block.title, kind: challenge ? "Challenge" : "Game", how: HOW.sequence };
  if (block.type === "engine") {
    return {
      name: block.title,
      kind: block.xpKind === "challenge" ? "Challenge" : "Practice",
      how: "Read the question. Your first check is the one that scores. A miss explains the safer choice, without a timer.",
    };
  }
  return { name: "Your First Shift", kind: "Challenge", how: HOW.shift };
}

export function moduleSteps(module: TrainingModule): PlayStep[] {
  return module.blocks.map((block) => {
    const described = describeBlock(block);
    return {
      moduleId: module.id,
      moduleTitle: module.title,
      blockId: block.id,
      name: described.name,
      phase: block.phase,
      kind: described.kind,
      how: described.how,
      href: `/training/${module.id}?play=${block.id}`,
    };
  });
}

export function gamesFor(module: TrainingModule): PlayStep[] {
  return moduleSteps(module).filter((step) => step.kind === "Game" || step.kind === "Challenge");
}

export function allGames(): PlayStep[] {
  return MODULES.flatMap(gamesFor);
}

export function mainGame(module: TrainingModule): PlayStep | undefined {
  return gamesFor(module).find((step) => step.kind === "Game") ?? gamesFor(module)[0];
}
