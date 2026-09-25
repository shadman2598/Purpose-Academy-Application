import type { TrainingModule } from "../model";
import { SOURCES } from "../sources";

const fields = [
  { id: "what", label: "What happened?", placeholder: "One or two sentences. What did you see?" },
  { id: "where", label: "Where?", placeholder: "Bay, level, or landmark a stranger could find." },
  { id: "who", label: "Who was involved?", placeholder: "Roles are enough. You don’t need a full name to practise." },
  { id: "hazard", label: "What hazard did you see?", placeholder: "Name the thing that could hurt someone." },
  { id: "did", label: "What did you do?", placeholder: "What you changed, or why you left it alone." },
  { id: "told", label: "Who did you tell?", placeholder: "Supervisor, attendant, or the person the site names." },
];

export const report: TrainingModule = {
  id: "report",
  title: "See It. Report It.",
  mapLabel: "Report It",
  description: "Decide whether to fix, report, stop, or escalate. Then write the report like a mission.",
  estimatedMinutes: 12,
  difficulty: "Core",
  completionXp: 500,
  jurisdiction: "CANADA",
  warnings: ["site-specific"],
  notes: [
    {
      jurisdiction: "ALBERTA",
      body: "Reporting hazards and refusing dangerous work are part of Alberta’s OHS system. The form you fill in on a real site is the employer’s form. This one never leaves your browser.",
    },
  ],
  objectives: [
    "Choose fix, report, stop, or escalate for the situation in front of you.",
    "Write what, where, who, the hazard, what you did, and who you told.",
    "Keep a report factual. Leave out the joke and the guess.",
  ],
  sources: [SOURCES.albertaOhs, SOURCES.hazardControl],
  blocks: [
    {
      type: "lesson",
      id: "report-learn",
      phase: "learn",
      xpKind: "lesson",
      title: "A report is a tool",
      paragraphs: [
        "Some hazards you are allowed to fix on the spot: a board you can pick up, a cord you can coil, scrap you can put in the bin. Fix it and still tell someone if the same thing keeps happening.",
        "Some hazards you report and leave: damaged tools, unlabelled chemicals, openings, anything that needs a competent person or a shutdown.",
        "Some hazards mean you stop the activity and get people out. You do not need the perfect sentence before you warn the crew. You do need the sentence afterwards so the site can fix the cause.",
      ],
      callout: {
        title: "Training yard only",
        body: "The report you type here stays on this device. It is not sent to an employer, a regulator, or a safety manager.",
      },
    },
    {
      type: "choice-set",
      id: "report-practice",
      phase: "practice",
      xpKind: "practice",
      title: "Which move?",
      items: [
        {
          id: "board",
          prompt: "A single offcut is in the walkway. You can pick it up without stepping into another hazard.",
          dimension: "decision",
          options: [
            { id: "fix", label: "Pick it up, bin it, and mention it if the walkway keeps filling up.", correct: true, feedback: "Fix what you are allowed to fix. Tell someone if it is a pattern." },
            { id: "form", label: "Leave it and spend twenty minutes writing a report first.", correct: false, feedback: "The board can move now. The pattern can be reported after, in a sentence." },
            { id: "kick", label: "Kick it under the scaffold.", correct: false, feedback: "That stores the hazard for the next person." },
          ],
        },
        {
          id: "opening-report",
          prompt: "A floor cover is missing. You do not have a replacement cover, and people are walking toward it.",
          dimension: "procedure",
          options: [
            { id: "stop", label: "Stop people, stay with the opening, and get a supervisor who can cover or guard it.", correct: true, feedback: "You can’t invent a cover. You can keep people out of the hole until someone brings the right control." },
            { id: "jacket", label: "Drop your jacket over the hole and go back to work.", correct: false, feedback: "A jacket hides the hole. It does not carry a person." },
            { id: "later", label: "Report it at the end of the shift.", correct: false, feedback: "The end of the shift is too late for an open hole on a live walkway." },
          ],
        },
      ],
    },
    {
      type: "report",
      id: "report-game",
      phase: "play",
      xpKind: "game",
      title: "Mission — Door B",
      story:
        "At Door B, a stack of gypsum is parked in front of the fire extinguisher. You can move the stack a metre to the side without blocking the exit. Nobody is arguing with you. File the report after you decide.",
      decision: {
        id: "door-b",
        prompt: "What is the call at Door B?",
        dimension: "decision",
        options: [
          { id: "move", label: "Move the stack clear, then tell your supervisor what you found and what you did.", correct: true, feedback: "You were able to fix it safely. The report still matters so Door B does not become the storage spot." },
          { id: "leave", label: "Leave the stack. Extinguishers are the safety person’s hobby.", correct: false, feedback: "A hidden extinguisher fails when someone needs it. You can move this stack." },
          { id: "hide", label: "Slide the stack so the extinguisher is behind it and looks tidy.", correct: false, feedback: "Tidy and blocked are the same problem." },
        ],
      },
      fields,
      modelReport:
        "What: Gypsum was stacked against the extinguisher at Door B. Where: Door B, ground floor, beside the south stair. Who: No injury. I moved it. Hazard: The extinguisher was blocked. What I did: Shifted the stack clear of the extinguisher and the door swing. Who I told: My supervisor, the same morning.",
    },
    {
      type: "choice-set",
      id: "report-check",
      phase: "test",
      xpKind: "check",
      title: "Knowledge check",
      items: [
        {
          id: "good-report",
          prompt: "Which report is useful?",
          dimension: "communication",
          options: [
            { id: "vague", label: "“Something was wrong near the thing. I handled it.”", correct: false, feedback: "Nobody can find “the thing,” and nobody can learn what you did." },
            { id: "fact", label: "“Unlabelled jug on the cage floor, east shelf. I left it closed and told Sam, the supervisor, at 7:40.”", correct: true, feedback: "What, where, what you did, who you told. Roles and times help. Guesses do not." },
            { id: "blame", label: "“The drywall crew is lazy again.”", correct: false, feedback: "Blame is not a location, and it is not a hazard statement." },
          ],
        },
      ],
    },
    {
      type: "report",
      id: "report-challenge",
      phase: "test",
      xpKind: "challenge",
      title: "Final challenge — the cord",
      story:
        "You find the crushed extension cord from the tool bench, now plugged into a live temporary panel. You are not the person assigned to electrical gear. A worker is about to pick the cord up.",
      decision: {
        id: "live-cord",
        prompt: "What is the call?",
        dimension: "procedure",
        track: "challenge",
        options: [
          { id: "stop", label: "Stop the worker, keep hands off the damaged live cord, and escalate to the supervisor immediately.", correct: true, feedback: "Stop and escalate. Fixing a live damaged cord is not the “pick up a board” category." },
          { id: "unplug", label: "Yank the plug out with wet gloves and throw the cord in the bin.", correct: false, feedback: "Improv electrical work is its own incident. Get the people who are allowed to make it safe." },
          { id: "tape", label: "Tape the plug so the worker can finish the task.", correct: false, feedback: "Tape is the failure from the tool module. It is still the failure here." },
          { id: "note", label: "Leave it plugged in and write a note for tomorrow.", correct: false, feedback: "Tomorrow is another shift of people using the same cord." },
        ],
      },
      fields,
      modelReport:
        "What: A crushed extension cord was plugged into the temporary panel. Where: Tool bench, west of the panel. Who: I stopped another worker from picking it up. No injury. Hazard: Damaged live cord. What I did: Kept people back. I did not unplug it myself. Who I told: Supervisor, immediately.",
    },
  ],
};
