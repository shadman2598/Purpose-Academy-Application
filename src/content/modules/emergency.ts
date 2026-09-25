import type { TrainingModule } from "../model";
import { SOURCES } from "../sources";

export const emergency: TrainingModule = {
  id: "emergency",
  title: "Emergency Drill",
  mapLabel: "Emergencies",
  description: "Practise the first minutes. The real steps are the ones in the site emergency plan.",
  estimatedMinutes: 15,
  difficulty: "Field",
  completionXp: 500,
  jurisdiction: "CANADA",
  warnings: ["site-specific", "hands-on"],
  badgeId: "emergency-ready",
  notes: [
    {
      jurisdiction: "ALBERTA",
      body: "Alberta’s OHS Code includes Part 7, Emergency Preparedness and Response. What you actually do — alarm, route, muster, first aid, spill — is the plan for that site. Part 7’s existence is not a script you can memorize in place of the plan.",
    },
  ],
  objectives: [
    "On a fire alarm, leave by the route and go to the muster point.",
    "Refuse to become a second victim while trying to help.",
    "Use WHMIS knowledge in a chemical incident without playing spill team.",
    "Follow the site instruction for severe weather instead of inventing one.",
  ],
  sources: [SOURCES.albertaOhs, SOURCES.sds, SOURCES.hazardControl],
  blocks: [
    {
      type: "lesson",
      id: "emergency-learn",
      phase: "learn",
      xpKind: "lesson",
      title: "The plan is the procedure",
      paragraphs: [
        "Actual emergency procedures are determined by the workplace and the site emergency plan. Northline’s drill teaches the shape of a good first minute: protect yourself, warn others, go where the plan says, tell the person the plan names.",
        "You are not expected to fight a fire, diagnose an injury, or clean a chemical release because you finished a module. If you have first-aid or fire training, you still follow the authority and the plan on that site.",
      ],
      callout: {
        title: "Not a drill certification",
        body: "Completing this module does not make you a first aider, a fire warden, or a spill responder.",
      },
    },
    {
      type: "sequence",
      id: "emergency-fire",
      phase: "practice",
      xpKind: "practice",
      title: "Fire",
      intro: "The alarm sounds on the fictional yard. There is no smoke in your bay yet.",
      closing: "Alarm, route, muster, account for yourself. The site plan names anything beyond that.",
      steps: [
        {
          id: "fire-1",
          prompt: "The alarm is sounding. What do you do with the tool in your hand?",
          dimension: "procedure",
          options: [
            { id: "down", label: "Put it down in a safe state if that takes a second, and leave.", correct: true, feedback: "Don’t run with a live saw. Don’t stay to finish the cut." },
            { id: "finish", label: "Finish the cut. Alarms are usually drills.", correct: false, feedback: "You do not get to decide it is a drill while the alarm is sounding." },
            { id: "investigate", label: "Walk toward the smell to see if it’s real.", correct: false, feedback: "Investigation is not your first job unless the plan assigns it to you." },
          ],
        },
        {
          id: "fire-2",
          prompt: "Which way out?",
          dimension: "procedure",
          options: [
            { id: "signed", label: "The signed evacuation route you were shown, not a shortcut through a restricted bay.", correct: true, feedback: "Use the route. Shortcuts can put you into the problem or through a locked yard." },
            { id: "fence", label: "Climb the fence. It’s faster.", correct: false, feedback: "Fences are not exits, and the muster count will miss you." },
            { id: "office", label: "Go to the office to ask if you should leave.", correct: false, feedback: "The alarm already answered that. The office may be on the route, but you don’t stop for a meeting." },
          ],
        },
        {
          id: "fire-3",
          prompt: "You are outside. Where do you stand?",
          dimension: "procedure",
          options: [
            { id: "muster", label: "The muster point, until someone accounts for you.", correct: true, feedback: "Muster, then stay. Leaving for the parking lot can start a search." },
            { id: "truck", label: "Your truck, with the radio on.", correct: false, feedback: "The truck is not the muster point unless the plan says it is. This one doesn’t." },
            { id: "back", label: "Back inside to get your jacket.", correct: false, feedback: "You don’t re-enter for a jacket." },
          ],
        },
      ],
    },
    {
      type: "sequence",
      id: "emergency-injury",
      phase: "play",
      xpKind: "game",
      title: "Injury",
      intro: "A worker is on the ground beside a ladder. They are groaning and the ladder is still unstable above them.",
      closing: "You did not become the second patient, and you got the site’s first-aid process started.",
      steps: [
        {
          id: "inj-1",
          prompt: "What is the first limit?",
          dimension: "hazard",
          options: [
            { id: "self", label: "Do not put yourself in danger while trying to help. The ladder is still a hazard.", correct: true, feedback: "Scene safety first. A helpful person under a falling ladder becomes a second patient." },
            { id: "drag", label: "Drag them clear immediately, no matter what the ladder is doing.", correct: false, feedback: "Moving someone can injure them further, and the ladder can come down on both of you." },
            { id: "film", label: "Film the scene so the report is accurate.", correct: false, feedback: "The report can wait a minute. The hazard and the help cannot." },
          ],
        },
        {
          id: "inj-2",
          prompt: "The area is now safe enough to be beside them. You do not have first-aid attendant duties on this site.",
          dimension: "procedure",
          options: [
            { id: "call", label: "Call for the site’s first aid and the supervisor, and stay with the worker unless you are sent to do something specific.", correct: true, feedback: "Get the people the plan names. Stay calm and factual." },
            { id: "medicine", label: "Give them pain medicine from your pocket.", correct: false, feedback: "Do not dose someone. That is not your role and it can cause harm." },
            { id: "stand", label: "Stand them up to see if the ankle works.", correct: false, feedback: "Don’t haul them upright to test an injury." },
          ],
        },
      ],
    },
    {
      type: "sequence",
      id: "emergency-chemical",
      phase: "play",
      xpKind: "game",
      title: "Chemical incident",
      intro: "This ties back to WHMIS. You are not the designated spill responder.",
      closing: "WHMIS told you what the product was and where to read. The emergency plan told you who responds.",
      steps: [
        {
          id: "chem-1",
          prompt: "A can is leaking and you can read the label from the aisle. What do you use from your WHMIS practice?",
          dimension: "knowledge",
          options: [
            { id: "sds", label: "The product name, then SDS sections 4, 6, and 8 from a safe place, plus the site plan.", correct: true, feedback: "Identify, then the sections that cover first aid, release, and protection. The plan assigns the people." },
            { id: "taste", label: "A quick taste test if the label is smudged.", correct: false, feedback: "Never. If the label fails, the product is unknown and you stay out." },
            { id: "water", label: "Pour water on it. Water fixes chemicals.", correct: false, feedback: "Water is wrong for some products. The SDS says what is compatible." },
          ],
        },
        {
          id: "chem-2",
          prompt: "Someone’s eyes were splashed. Section 4 says flush with water. An eyewash is signed and clear.",
          dimension: "procedure",
          options: [
            { id: "flush", label: "Help them to the eyewash and get the first-aid person. Do not experiment with neutralizing agents.", correct: true, feedback: "Use the eyewash the sheet and the site provide. Get trained help at the same time." },
            { id: "neutral", label: "Find an acid or a base to neutralize the splash.", correct: false, feedback: "Neutralizing experiments belong in a lab procedure, not in someone’s eye." },
            { id: "wait", label: "Wait to see if it stops hurting.", correct: false, feedback: "Waiting is how a splash gets worse. Start the eyewash and call for help." },
          ],
        },
      ],
    },
    {
      type: "sequence",
      id: "emergency-weather",
      phase: "test",
      xpKind: "check",
      title: "Severe weather",
      intro: "Wind is rising. The site radio has not given an instruction yet. Lightning is visible to the west.",
      closing: "Weather calls come from the site. Your job is to follow them and to stop guessing.",
      steps: [
        {
          id: "wx-1",
          prompt: "You are on an exposed deck. Lightning is visible. What do you do before a formal call arrives?",
          dimension: "decision",
          options: [
            { id: "down", label: "Get off the exposed deck and tell the supervisor what you saw.", correct: true, feedback: "Leaving the high exposed place while you call it in is reasonable. Inventing a brand-new weather policy is not." },
            { id: "finish", label: "Finish the panel. Lightning is still far away.", correct: false, feedback: "You are not the person who measures that distance for the crew. Get off the exposure." },
            { id: "photo", label: "Stay up high to film the sky.", correct: false, feedback: "The high point is the wrong place to make a video." },
          ],
        },
        {
          id: "wx-2",
          prompt: "The supervisor calls “stop work, muster in the site trailer.”",
          dimension: "procedure",
          options: [
            { id: "trailer", label: "Stop and go to the trailer.", correct: true, feedback: "That is the site instruction. Follow it." },
            { id: "better", label: "Go to your truck instead. Trailers attract lightning.", correct: false, feedback: "Don’t freelance a better plan over the radio instruction you were just given." },
            { id: "half", label: "Send the apprentices in and keep the experienced crew working.", correct: false, feedback: "The stop applies to the crew, not to the people you think are tough enough." },
          ],
        },
      ],
    },
    {
      type: "choice-set",
      id: "emergency-challenge",
      phase: "test",
      xpKind: "challenge",
      title: "Final challenge — two things at once",
      items: [
        {
          id: "two-things",
          prompt:
            "The alarm sounds. On your way to the signed exit you see a coworker still cutting, and a small flame in a waste bin that you could reach with the extinguisher beside you. You have not been trained to use that extinguisher.",
          dimension: "decision",
          track: "challenge",
          options: [
            { id: "hero", label: "Send the coworker out, grab the extinguisher, and fight the bin fire.", correct: false, feedback: "You have not been trained on that extinguisher. Heroics are how a small fire gets a second victim. Yell, leave, muster." },
            { id: "leave", label: "Tell the coworker to leave now, leave yourself by the signed route, and report the bin fire at the muster point.", correct: true, feedback: "Warn, leave, report. The plan’s fire response belongs to the people assigned and trained for it." },
            { id: "cut", label: "Help them finish the cut, then both leave. The bin is small.", correct: false, feedback: "The alarm already ended the cut. A “small” fire in a waste bin is still a fire." },
            { id: "video", label: "Film the bin so the report has proof, then leave if it grows.", correct: false, feedback: "The report does not need your footage. The muster needs you." },
          ],
        },
      ],
    },
  ],
};
