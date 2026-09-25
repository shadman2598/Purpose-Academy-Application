import type { TrainingModule } from "../model";
import { SOURCES } from "../sources";

export const falls: TrainingModule = {
  id: "falls",
  title: "Don’t Miss a Step",
  mapLabel: "Ladders & Fall Protection",
  description: "Spot the fall, choose a control, and respect the limit of both the gear and this module.",
  estimatedMinutes: 15,
  difficulty: "Field",
  completionXp: 500,
  jurisdiction: "CANADA",
  warnings: ["site-specific", "hands-on"],
  notes: [
    {
      jurisdiction: "ALBERTA",
      body: "Alberta’s OHS Code Part 9 is the fall protection part. CCOHS summarizes section 139 as requiring protection where a worker may fall 3 metres or more, where a shorter fall has an unusual possibility of injury, where they could fall onto a hazard or through an opening, and at a permanent work area more than 1.2 metres. The same summary says a guardrail is the first option when it can be used, then travel restraint, then a personal fall-arrest system. Part 8 of the Code covers entrances, walkways, stairways, and ladders. Read the current Code. This screen is not that text, and it is not the instruction section 141 talks about.",
    },
  ],
  objectives: [
    "Recognize an unprotected edge and a damaged ladder.",
    "Prefer a guard or other higher control when it is feasible, instead of jumping to a harness.",
    "State that hands-on instruction and the site procedure may be required before the real work.",
  ],
  sources: [SOURCES.albertaFall, SOURCES.ccohsFall, SOURCES.albertaOhs, SOURCES.hierarchy],
  blocks: [
    {
      type: "lesson",
      id: "falls-learn",
      phase: "learn",
      xpKind: "lesson",
      title: "The opening is the hazard",
      paragraphs: [
        "Falls happen at edges, openings, ladders, scaffolds, and the backs of trucks. The first question is whether the fall can be prevented with a guard, a cover, or by doing the work somewhere else.",
        "A harness is equipment with limits. It needs an anchor, clearance, compatible parts, and a person who has been instructed on that system. Clipping to a pipe you have not rated is not a system.",
        "Ladders need a look before every use: rails, rungs, feet, and the ground you are about to set them on. A cracked rail means the ladder is out of service. Follow the manufacturer and the site procedure. This module does not turn a ladder angle into a law.",
      ],
      callout: {
        title: "Hands-on training may be required",
        body: "Hands-on training and task-specific instruction may be required before you perform this work. Finishing this module does not certify you, authorize a harness, or replace a fall protection plan where one is required.",
      },
      bullets: [
        "Identify the fall before you discuss the equipment.",
        "Use a guardrail or cover when that is feasible.",
        "Inspect the ladder or harness before use. Damaged equipment comes out of service.",
        "Follow the site procedure, including who is allowed to set the system up.",
        "Know the limit: this app can show you the decision. It cannot put you in a harness.",
      ],
    },
    {
      type: "choice-set",
      id: "falls-practice",
      phase: "practice",
      xpKind: "practice",
      title: "What are you looking at?",
      items: [
        {
          id: "edge-name",
          prompt: "A guardrail was taken down so a pallet can land. The opening is about one storey above the level below. What is the hazard you name first?",
          dimension: "hazard",
          options: [
            {
              id: "fall",
              label: "A fall through the unprotected opening.",
              correct: true,
              feedback: "Name the fall. The pallet is the reason someone removed the guard, not a reason to leave the opening open.",
            },
            {
              id: "late",
              label: "The schedule, because the crane is waiting.",
              correct: false,
              feedback: "The schedule is pressure. The hazard is the fall.",
            },
            {
              id: "hat",
              label: "The worker’s hard hat colour.",
              correct: false,
              feedback: "Hat colour is not the hazard in this scene.",
            },
          ],
        },
      ],
    },
    {
      type: "ladder",
      id: "falls-climb",
      phase: "play",
      xpKind: "game",
      title: "Climb the decision, not the opening",
      intro:
        "Each floor is a call. A wrong answer keeps you on that floor until you choose a control that holds. Your first answer is the score.",
      stages: [
        {
          id: "see-edge",
          floor: "Ground",
          prompt: "You are at an interior opening. The cover is beside it, not on it. What do you treat as the hazard?",
          detail: "People are carrying material toward the opening.",
          dimension: "hazard",
          options: [
            {
              id: "opening",
              label: "The uncovered opening.",
              correct: true,
              feedback: "The opening is the fall. The cover sitting beside it is a clue, not a control, until it is on and secured the way the site requires.",
            },
            {
              id: "boots",
              label: "The scuffs on your boots.",
              correct: false,
              feedback: "Boots are not the hazard. The hole is.",
            },
            {
              id: "light",
              label: "The lighting, and nothing else.",
              correct: false,
              feedback: "Poor light can hide an opening. The opening is still the thing that has to be covered or guarded.",
            },
          ],
        },
        {
          id: "pick-control",
          floor: "Second level",
          prompt: "A proper cover is on site and can be secured over this opening. What do you choose?",
          detail: "A harness is also in the gang box. There is no anchor set up.",
          dimension: "decision",
          options: [
            {
              id: "cover",
              label: "Stop foot traffic and get the cover secured before anyone carries material past.",
              correct: true,
              feedback: "The cover is feasible. Use it. A harness with no anchor is not a backup plan you invent on the spot.",
            },
            {
              id: "harness",
              label: "Skip the cover and clip a harness to the nearest pipe.",
              correct: false,
              feedback: "An unrated pipe is not an anchor. The cover was the higher control and it was available.",
            },
            {
              id: "careful",
              label: "Leave the opening and tell people to watch their step.",
              correct: false,
              feedback: "A warning without a cover leaves the fall in the floor.",
            },
          ],
        },
        {
          id: "inspect",
          floor: "Third level",
          prompt: "The only ladder to the next work area has a bent side rail. The job is to change a light, and a guardrailed stair exists around the corner.",
          detail: "The ladder feet are also packed with dry mud.",
          dimension: "procedure",
          options: [
            {
              id: "stair",
              label: "Leave the ladder out of service and use the stair.",
              correct: true,
              feedback: "Damaged ladder, out of service. The stair is the path that does not depend on a bent rail.",
            },
            {
              id: "mud",
              label: "Kick the mud off and climb. The bend is small.",
              correct: false,
              feedback: "A bent rail is enough to take the ladder out. Cleaning the feet does not straighten it.",
            },
            {
              id: "two",
              label: "Have someone hold it while you climb.",
              correct: false,
              feedback: "A holder does not repair the rail.",
            },
          ],
        },
        {
          id: "limits",
          floor: "Roof",
          prompt: "What else may be required before you do fall-protection work on a real site?",
          detail: "You have finished the floors in this module.",
          dimension: "knowledge",
          track: "challenge",
          options: [
            {
              id: "hands",
              label: "Hands-on instruction, the right equipment, and the site’s procedure or fall protection plan where the rules require one.",
              correct: true,
              feedback: "This module can name those limits. It cannot provide the hands-on instruction or the plan.",
            },
            {
              id: "badge",
              label: "The Site Ready badge from SITEWISE.",
              correct: false,
              feedback: "The badge means you finished this curriculum. It is not a provincial certificate and it is not permission to work at height.",
            },
            {
              id: "video",
              label: "Watching someone else do it once, with no instruction.",
              correct: false,
              feedback: "Watching is not instruction, and it is not an inspection of the system you would use.",
            },
          ],
        },
      ],
    },
    {
      type: "choice-set",
      id: "falls-check",
      phase: "test",
      xpKind: "check",
      title: "Knowledge check",
      items: [
        {
          id: "not-cert",
          prompt: "Which sentence is accurate?",
          dimension: "knowledge",
          options: [
            {
              id: "cert",
              label: "Finishing this module certifies you for fall protection in Alberta.",
              correct: false,
              feedback: "It does not. Alberta’s instruction requirements and any site plan are separate from this app.",
            },
            {
              id: "edu",
              label: "This module is education. Hands-on training and the site procedure may still be required.",
              correct: true,
              feedback: "That is the limit of the screen you are on.",
            },
            {
              id: "any",
              label: "Any harness from the gang box is acceptable on any anchor.",
              correct: false,
              feedback: "Equipment has to be compatible, inspected, and anchored as the system requires. This app does not teach you to rig it.",
            },
          ],
        },
      ],
    },
    {
      type: "choice-set",
      id: "falls-challenge",
      phase: "test",
      xpKind: "challenge",
      title: "Final challenge — the short lift",
      items: [
        {
          id: "short-lift",
          prompt:
            "A guardrail is off so a load can land. The operator is a friend. The crane is on the hook. Someone says, “It’s only one storey, stand back a bit.” A replacement rail is on the deck.",
          dimension: "decision",
          track: "challenge",
          options: [
            {
              id: "wave",
              label: "Wave the load in and stand back.",
              correct: false,
              feedback: "Standing back is not a guard. The opening is still there when the load swings.",
            },
            {
              id: "rail",
              label: "Stop the lift until the rail is back or another guard the site accepts is in place.",
              correct: true,
              feedback: "The rail is on the deck, so the guard is feasible. Friendship and the hook do not close the opening.",
            },
            {
              id: "clip",
              label: "Clip your harness to the guardrail post that was just removed.",
              correct: false,
              feedback: "A removed post is not an anchor, and it skips the guard that is sitting beside you.",
            },
            {
              id: "new",
              label: "Send the newest worker to spot the load at the opening.",
              correct: false,
              feedback: "Putting the least experienced person at the edge makes the exposure worse.",
            },
          ],
        },
      ],
    },
  ],
};
