import type { DialogueBlock, TrainingModule } from "../model";
import { SOURCES } from "../sources";

function talk(
  partial: Omit<DialogueBlock, "type" | "phase" | "xpKind"> & { phase?: DialogueBlock["phase"]; xpKind?: DialogueBlock["xpKind"] },
): DialogueBlock {
  return {
    type: "dialogue",
    phase: partial.phase ?? "play",
    xpKind: partial.xpKind ?? "game",
    ...partial,
  };
}

export const conduct: TrainingModule = {
  id: "conduct",
  title: "Be a Good Crew Member",
  mapLabel: "Site Conduct",
  description: "Ask the question, refuse the shortcut, and talk like someone people can work beside.",
  estimatedMinutes: 15,
  difficulty: "Core",
  completionXp: 500,
  jurisdiction: "CANADA",
  warnings: ["site-specific"],
  badgeId: "crew-player",
  notes: [
    {
      jurisdiction: "ALBERTA",
      body: "Alberta’s OHS Act includes duties for workers and supervisors, the right to refuse dangerous work, and requirements around harassment and violence. The words that matter on a complaint are the Act and your workplace process, not this dialogue.",
    },
  ],
  objectives: [
    "Ask for a repeat when you did not hear the instruction.",
    "Respond to an unsafe shortcut without a speech.",
    "Treat disrespect, fatigue, and phones as site problems, not jokes.",
  ],
  sources: [SOURCES.albertaOhs],
  blocks: [
    {
      type: "lesson",
      id: "conduct-learn",
      phase: "learn",
      xpKind: "lesson",
      title: "The work is also the conversation",
      paragraphs: [
        "Most bad days on a crew start with a sentence. Someone didn’t hear the lift plan. Someone laughed off a shortcut. Someone was too tired and did not say so.",
        "You can be direct without being a poster. “I didn’t catch that. Say it once more.” is a complete sentence. So is “I’m not using the saw with the guard off.”",
        "Disrespect and harassment are not “site culture.” If it happens, use the workplace process. This module lets you practise the first sentence. It is not a complaint system.",
      ],
    },
    {
      type: "choice-set",
      id: "conduct-practice",
      phase: "practice",
      xpKind: "practice",
      title: "Hear it again",
      items: [
        {
          id: "clarify",
          prompt: "A supervisor gives a fast instruction over the noise. You did not understand it.",
          dimension: "communication",
          options: [
            { id: "pretend", label: "Pretend you understood.", correct: false, feedback: "Pretending moves the mistake into the work." },
            { id: "ask", label: "Ask them to clarify before you move.", correct: true, feedback: "Clarify before you proceed. That is the whole skill." },
            { id: "ignore", label: "Ignore it and do what you did on the last site.", correct: false, feedback: "The last site is not this instruction." },
            { id: "later", label: "Ask another worker after you have already started.", correct: false, feedback: "Ask before you start. After is how the wrong hole gets drilled." },
          ],
        },
      ],
    },
    talk({
      id: "conduct-shortcut",
      speaker: "Mike",
      line: "Skip the guard. We’ll put it back before the boss walks through.",
      dimension: "decision",
      choices: [
        { id: "ok", label: "Fine. We’ll be quick.", correct: false, feedback: "Quick still cuts with the guard off." },
        { id: "no", label: "No. The guard stays on, or the tool stays down.", correct: true, feedback: "Short, and it names the condition. You don’t need a speech." },
        { id: "someone", label: "Get the new person to do it. They won’t argue.", correct: false, feedback: "Passing the shortcut down the crew is worse." },
        { id: "laugh", label: "Laugh and change the subject.", correct: false, feedback: "The guard is still off when the joke ends." },
      ],
      followUp: {
        speaker: "Mike",
        line: "Fine. Then how are we supposed to finish this cut?",
        choices: [
          { id: "setup", label: "Guard stays on. If it blocks the cut, we change the setup.", correct: true, feedback: "The second line holds the same line as the first. The schedule gets a different setup, not a missing guard." },
          { id: "once", label: "We’ll skip it just this once and put it back after.", correct: false, feedback: "“Just this once” is the same shortcut. The guard stays off for the whole cut." },
        ],
      },
    }),
    talk({
      id: "conduct-disrespect",
      countsForXp: false,
      speaker: "Jordan",
      line: "They mock another worker’s accent every time that worker asks a question, loud enough for the whole bay to hear.",
      dimension: "communication",
      choices: [
        { id: "join", label: "Laugh along so you fit in.", correct: false, feedback: "Laughing is taking a side. The person asking questions will stop asking." },
        { id: "process", label: "Tell them to stop. If it continues, use the workplace process your orientation named.", correct: true, feedback: "Direct, then the process. Alberta workplaces have duties around harassment and violence. This scene is practice, not the complaint itself." },
        { id: "ignore", label: "Ignore it. Not your business.", correct: false, feedback: "Questions stop when mockery is the answer. That becomes a safety problem as well as a disrespect problem." },
        { id: "post", label: "Record it and post the clip.", correct: false, feedback: "A public clip is not the workplace process, and it can make the target’s day worse." },
      ],
    }),
    talk({
      id: "conduct-language",
      countsForXp: false,
      speaker: "Alex",
      line: "They nod, but you can tell the instruction did not land. English is not their first language. The crane is about to move.",
      dimension: "communication",
      choices: [
        { id: "nod", label: "Accept the nod. The crane is waiting.", correct: false, feedback: "A nod is not a read-back. The crane can wait for one clear sentence." },
        { id: "show", label: "Stop the move. Show the plan again, and ask them to say back what they will do.", correct: true, feedback: "Show it, then a read-back. That is respect and it is the control." },
        { id: "yell", label: "Speak louder and faster.", correct: false, feedback: "Volume is not clarity." },
        { id: "pull", label: "Pull them off the crew for the day without explaining.", correct: false, feedback: "Removing them without helping them understand the plan wastes the person and hides the real fix." },
      ],
    }),
    talk({
      id: "conduct-fatigue",
      countsForXp: false,
      speaker: "You",
      line: "You slept three hours. You are on a ladder task this morning. The lead hand asks if you are good.",
      dimension: "decision",
      choices: [
        { id: "good", label: "Say you’re good. Everyone is tired.", correct: false, feedback: "Everyone being tired is how the same mistakes repeat. The ladder task is a bad place to prove it." },
        { id: "say", label: "Say you are not fit for the ladder task and ask for a ground job or a break.", correct: true, feedback: "Name it early. Fatigue is a condition you report, not a weakness you hide." },
        { id: "energy", label: "Drink two coffees and climb.", correct: false, feedback: "Caffeine does not replace sleep, and it does not put the guardrail back if you miss a step." },
        { id: "phone", label: "Scroll your phone on the ladder until you feel sharper.", correct: false, feedback: "The phone is a second hazard. Get off the ladder." },
      ],
    }),
    talk({
      id: "conduct-horseplay",
      countsForXp: false,
      speaker: "Mike",
      line: "They shove another worker near the stair, “just messing around.”",
      dimension: "decision",
      choices: [
        { id: "shove", label: "Shove them back so it’s fair.", correct: false, feedback: "A second shove is still horseplay on a stair." },
        { id: "stop", label: "Tell them to knock it off, and move the joke away from the stair.", correct: true, feedback: "Stop it where it is. Stairs, edges, and vehicles are not a comedy set." },
        { id: "film", label: "Film it for the group chat.", correct: false, feedback: "The chat does not catch the person who falls." },
        { id: "leave", label: "Walk away smiling so nobody thinks you’re uptight.", correct: false, feedback: "Walking away leaves the stair as the stage." },
      ],
    }),
    {
      type: "dialogue",
      id: "conduct-challenge",
      phase: "test",
      xpKind: "challenge",
      speaker: "Sarah",
      line: "We’re behind. I need you to sign the inspection sheet for the scaffold. You were not the one who inspected it, and you have not been on it.",
      dimension: "communication",
      track: "challenge",
      choices: [
        { id: "sign", label: "Sign it. They would not ask if it was wrong.", correct: false, feedback: "You would be recording an inspection you did not do. The paper would be a lie." },
        { id: "no", label: "Refuse to sign. Offer to go with a competent person who can actually inspect it.", correct: true, feedback: "You can help the schedule by doing a real inspection with the right person. You don’t help it by signing fiction." },
        { id: "blank", label: "Sign a blank sheet so they can fill it in later.", correct: false, feedback: "A blank signature is worse. You don’t know what words will land above it." },
        { id: "new", label: "Have the apprentice sign it instead.", correct: false, feedback: "That moves the false record onto someone with less power to refuse." },
      ],
      followUp: {
        speaker: "Sarah",
        line: "The crane is on the hook. Put your name down and we’ll sort the real inspection after.",
        choices: [
          { id: "still", label: "No. I’ll go get the person who can inspect it, and the lift waits.", correct: true, feedback: "The second ask is the same request. The lift waits for a real inspection." },
          { id: "name", label: "I’ll sign if you say out loud that you inspected it.", correct: false, feedback: "A spoken promise does not turn your signature into an inspection you did not do." },
        ],
      },
    },
  ],
};
