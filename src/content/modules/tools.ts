import type { TrainingModule } from "../model";
import { SOURCES } from "../sources";

export const tools: TrainingModule = {
  id: "tools",
  title: "Tool Check",
  mapLabel: "Tools & Equipment",
  description: "Inspect before you use. A damaged tool comes out of service.",
  estimatedMinutes: 15,
  difficulty: "Core",
  completionXp: 500,
  jurisdiction: "CANADA",
  warnings: ["site-specific", "hands-on"],
  badgeId: "tool-inspector",
  notes: [
    {
      jurisdiction: "ALBERTA",
      body: "Alberta’s OHS laws expect equipment to be safe to use and hazards to be controlled. The site’s procedure is what tells you how to tag a tool out and who to tell. This bench is practice, not an equipment ticket.",
    },
  ],
  objectives: [
    "Inspect a tool before use and recognize damage that takes it out of service.",
    "Choose “remove and report” over tape, hope, or handing the tool to someone else.",
    "Treat a picture of a tool as practice, not as authorization to operate it.",
  ],
  sources: [SOURCES.albertaOhs, SOURCES.hazardControl],
  blocks: [
    {
      type: "lesson",
      id: "tools-learn",
      phase: "learn",
      xpKind: "lesson",
      title: "Inspect, identify, decide",
      paragraphs: [
        "A tool that ran yesterday can be damaged today. The check is short: cord, guard, handles, housing, and whether it is the right tool for the job.",
        "If you find damage, the decision is not “use it carefully.” Take it out of service and report it the way the workplace tells you to. Tape on a cut cord hides the damage and leaves the shock hazard.",
        "Nothing in this module authorizes you to use a saw, grinder, or any other tool. Authorization is your employer’s.",
      ],
      bullets: [
        "Cord jackets cut, taped, or missing the ground pin.",
        "Guards missing, wedged open, or cracked.",
        "Handles loose, split, or oily enough that your hand will slip.",
        "Ladders with bent rails, cracked rungs, or missing feet. The fall module goes further.",
        "Tools left in water or with the guard removed “just for this cut.”",
      ],
      callout: {
        title: "Not an equipment ticket",
        body: "Finding the broken cord means you can recognize it. It does not mean you are authorized to run the tool once it is repaired.",
      },
    },
    {
      type: "choice-set",
      id: "tools-practice",
      phase: "practice",
      xpKind: "practice",
      title: "Name the defect",
      items: [
        {
          id: "tape-cord",
          prompt: "The outer jacket of an extension cord is cut. Copper is visible. Someone has started wrapping it in electrical tape.",
          dimension: "hazard",
          options: [
            {
              id: "see",
              label: "That cord is damaged. Tape is hiding it, not fixing it.",
              correct: true,
              feedback: "You can see the defect. The next step is to remove it from service, not to finish the tape job.",
            },
            {
              id: "ok",
              label: "Tape means it has already been repaired.",
              correct: false,
              feedback: "Tape over a cut jacket is not a repair you can trust.",
            },
            {
              id: "small",
              label: "A small cut is fine if the cord still works.",
              correct: false,
              feedback: "If it still works, it can still shock someone. Working is not the inspection.",
            },
          ],
        },
      ],
    },
    {
      type: "inspect",
      id: "tools-inspect",
      phase: "play",
      xpKind: "game",
      title: "Pre-use inspection",
      intro:
        "Tap every piece on the bench. Sound tools will say so. Defects need to be found before the decision at the end. First calls count.",
      targets: [
        {
          id: "hammer",
          label: "Hammer",
          x: 18,
          y: 62,
          defective: false,
          feedback: "The hammer head is on tight and the handle is intact. It still gets a look every time you pick it up.",
        },
        {
          id: "saw",
          label: "Circular saw",
          x: 36,
          y: 48,
          defective: true,
          feedback: "The lower guard is missing. This saw is out of service until a proper guard is on it.",
        },
        {
          id: "drill",
          label: "Drill",
          x: 52,
          y: 66,
          defective: false,
          feedback: "The drill housing and chuck look intact, and the cord jacket on this one is whole. Keep checking the bit and the work piece on the real job.",
        },
        {
          id: "cord",
          label: "Extension cord",
          x: 68,
          y: 58,
          defective: true,
          feedback: "The jacket is cut and the conductor is visible. This cord does not go back into use.",
        },
        {
          id: "ladder",
          label: "Ladder",
          x: 82,
          y: 40,
          defective: true,
          feedback: "The side rail is cracked. A damaged ladder comes out of service. Don’t “just use the other side.”",
        },
        {
          id: "grinder",
          label: "Grinder",
          x: 28,
          y: 78,
          defective: true,
          feedback: "The guard has been taken off the grinder. That is a defect, not a setup preference.",
        },
        {
          id: "puddle",
          label: "Tool left in a puddle",
          x: 74,
          y: 78,
          defective: true,
          feedback: "A corded tool is sitting in water. That is improper storage and it stays out of service until someone competent says otherwise.",
        },
      ],
      decide: {
        id: "cord-decide",
        prompt: "You found the damaged power cord. What do you do?",
        dimension: "decision",
        options: [
          {
            id: "careful",
            label: "Use it carefully",
            correct: false,
            feedback: "Careful use still energizes a damaged cord.",
          },
          {
            id: "tape",
            label: "Tape it and continue",
            correct: false,
            feedback: "Tape hides the cut. It is not the repair.",
          },
          {
            id: "remove",
            label: "Remove it from service and report it, following the workplace procedure",
            correct: true,
            feedback: "Out of service, tagged or set aside the way the site requires, and reported. Nobody else should “finish the cut” with it.",
          },
          {
            id: "other",
            label: "Ask another worker to use it",
            correct: false,
            feedback: "Handing the hazard to someone else is not a control.",
          },
        ],
      },
    },
    {
      type: "choice-set",
      id: "tools-check",
      phase: "test",
      xpKind: "check",
      title: "Knowledge check",
      items: [
        {
          id: "guard-back",
          prompt: "A grinder guard was removed because it blocked the cut the worker wanted.",
          dimension: "procedure",
          options: [
            {
              id: "leave",
              label: "Leave it off. The worker knows the tool.",
              correct: false,
              feedback: "Familiarity is not a guard. The tool stays out of service.",
            },
            {
              id: "stop",
              label: "Stop. The guard goes back, or the work changes so a guarded tool can do it.",
              correct: true,
              feedback: "If the guard cannot do the cut, you need a different method. You do not delete the guard.",
            },
            {
              id: "gloves",
              label: "Add gloves and keep the guard off.",
              correct: false,
              feedback: "Gloves do not stop a shattered wheel or a nip point the way a guard does.",
            },
          ],
        },
      ],
    },
    {
      type: "choice-set",
      id: "tools-challenge",
      phase: "test",
      xpKind: "challenge",
      title: "Final challenge — the cord",
      items: [
        {
          id: "tools-challenge-item",
          prompt:
            "The only extension cord on the floor has a crushed plug. The foreman says the inspection can wait because the lift is on the hook in twenty minutes. A new worker is standing there ready to plug it in.",
          dimension: "decision",
          track: "challenge",
          options: [
            {
              id: "new",
              label: "Let the new worker plug it in. They offered.",
              correct: false,
              feedback: "The new worker is the last person who should inherit a damaged cord.",
            },
            {
              id: "wait",
              label: "Take the cord out of reach, tell the foreman it is damaged, and wait for a sound cord.",
              correct: true,
              feedback: "The schedule does not repair the plug. Remove it, report it, and use a cord that passes inspection.",
            },
            {
              id: "tape",
              label: "Tape the plug so it stays in the outlet.",
              correct: false,
              feedback: "Holding a crushed plug in with tape creates a worse connection, not a safe one.",
            },
            {
              id: "careful",
              label: "Use it yourself so nobody else gets hurt, and be careful.",
              correct: false,
              feedback: "Using it yourself still uses the damaged cord. Careful is not the control.",
            },
          ],
        },
      ],
    },
  ],
};
