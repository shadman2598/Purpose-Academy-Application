export interface SafetyCheck {
  id: string;
  moduleId: string;
  prompt: string;
  options: { id: string; label: string; correct: boolean }[];
  explain: string;
}

export const SAFETY_CHECKS: SafetyCheck[] = [
  {
    id: "whmis-skull",
    moduleId: "whmis",
    prompt: "Which WHMIS pictogram indicates an acute toxicity hazard?",
    options: [
      { id: "flame", label: "Flame", correct: false },
      { id: "skull", label: "Skull and crossbones", correct: true },
      { id: "exclaim", label: "Exclamation mark", correct: false },
    ],
    explain: "The skull and crossbones is the acute toxicity pictogram. The label and SDS still tell you the precautions.",
  },
  {
    id: "ppe-dust",
    moduleId: "ppe",
    prompt: "Concrete cutting can put hazardous dust in the air. What do you check before the cut?",
    options: [
      { id: "hat", label: "Only the hard hat", correct: false },
      { id: "resp", label: "Respiratory protection, eyes, and hearing, plus the site rule", correct: true },
      { id: "vest", label: "Only the high-vis vest", correct: false },
    ],
    explain: "Dust, chips, and noise show up together. The hat and vest do not cover them.",
  },
  {
    id: "hazard-load",
    moduleId: "hazards",
    prompt: "A load is hanging and a worker is underneath. What is the first move?",
    options: [
      { id: "wait", label: "Wait. The operator can see.", correct: false },
      { id: "out", label: "Get the person out of the load path and tell the operator.", correct: true },
      { id: "photo", label: "Take a photo for later.", correct: false },
    ],
    explain: "The load path stays empty. A photo does not move the person.",
  },
  {
    id: "falls-anchor",
    moduleId: "falls",
    prompt: "There is no rated anchor for a harness. What do you do?",
    options: [
      { id: "pipe", label: "Clip to the nearest pipe", correct: false },
      { id: "stop", label: "Stop and use the site’s fall plan", correct: true },
      { id: "climb", label: "Climb without any fall plan", correct: false },
    ],
    explain: "A harness needs an anchor the site has planned. This check does not qualify you to work at height.",
  },
  {
    id: "tools-guard",
    moduleId: "tools",
    prompt: "The grinder guard will not sit on the housing. What happens to the tool?",
    options: [
      { id: "off", label: "Run it without the guard for one cut", correct: false },
      { id: "down", label: "Take it out of service", correct: true },
      { id: "tape", label: "Tape the guard in place", correct: false },
    ],
    explain: "A guard that does not sit means the tool stays down. Tape is not a guard.",
  },
  {
    id: "emergency-alarm",
    moduleId: "emergency",
    prompt: "The alarm sounds. A coworker wants to go back for a phone. What do you do?",
    options: [
      { id: "wait", label: "Wait while they get the phone", correct: false },
      { id: "leave", label: "Leave by the route you were shown and go to the muster point", correct: true },
      { id: "look", label: "Go find the smoke first", correct: false },
    ],
    explain: "Out, then the muster count. The phone waits. The real route is the one on that site.",
  },
  {
    id: "conduct-machine",
    moduleId: "conduct",
    prompt: "Alex has never used the machine. Mike said it is easy. What do you say?",
    options: [
      { id: "easy", label: "If Mike said it’s easy, go ahead", correct: false },
      { id: "no", label: "Don’t run it. An authorized operator does", correct: true },
      { id: "watch", label: "Run it while I watch from across the yard", correct: false },
    ],
    explain: "Easy is not authorization. Keep the new person on work they are cleared for.",
  },
  {
    id: "orientation-sign",
    moduleId: "orientation",
    prompt: "The crew already knows your name. Do you still sign in?",
    options: [
      { id: "skip", label: "Skip the board", correct: false },
      { id: "sign", label: "Sign in anyway", correct: true },
      { id: "later", label: "Sign out at the end and skip the morning", correct: false },
    ],
    explain: "The list is for the headcount. Knowing your name does not replace it.",
  },
  {
    id: "report-miss",
    moduleId: "report",
    prompt: "A tool fell and missed someone. Nobody was hurt. What do you do?",
    options: [
      { id: "luck", label: "Call it luck and keep working", correct: false },
      { id: "report", label: "Stop the work underneath and report the near miss", correct: true },
      { id: "hide", label: "Hide the tool so nobody gets in trouble", correct: false },
    ],
    explain: "No injury does not mean no report. Use the way that site asks you to report it.",
  },
  {
    id: "orientation-muster",
    moduleId: "orientation",
    prompt: "The alarm sounds during your first morning. Where do you go?",
    options: [
      { id: "truck", label: "Back to your truck", correct: false },
      { id: "muster", label: "The muster point you were shown", correct: true },
      { id: "smoke", label: "Toward the smoke", correct: false },
    ],
    explain: "The route and the muster point are the ones from orientation.",
  },
  {
    id: "orientation-exit",
    moduleId: "orientation",
    prompt: "A pallet is across the exit you were shown. What do you do before work starts?",
    options: [
      { id: "step", label: "Step over it", correct: false },
      { id: "clear", label: "Get the exit clear", correct: true },
      { id: "later", label: "Leave it until Friday", correct: false },
    ],
    explain: "A route you have to climb is blocked.",
  },
  {
    id: "ppe-eyes",
    moduleId: "ppe",
    prompt: "Alex offers street sunglasses for a cut that throws chips. What do you use?",
    options: [
      { id: "sun", label: "The sunglasses", correct: false },
      { id: "task", label: "The eye protection the task needs", correct: true },
      { id: "none", label: "Nothing. You will look away", correct: false },
    ],
    explain: "Dark lenses are not impact protection.",
  },
  {
    id: "ppe-ears",
    moduleId: "ppe",
    prompt: "The cut is loud and nobody has hearing protection. When does it go on?",
    options: [
      { id: "after", label: "After your ears ring", correct: false },
      { id: "before", label: "Before the tool starts", correct: true },
      { id: "radio", label: "Turn the radio up instead", correct: false },
    ],
    explain: "The ring means the exposure already happened.",
  },
  {
    id: "ppe-vest",
    moduleId: "ppe",
    prompt: "You step out beside a machine in a hoodie. What is missing?",
    options: [
      { id: "closer", label: "Nothing. Stand closer so the operator knows you", correct: false },
      { id: "vest", label: "High-visibility clothing before you stand near the machine", correct: true },
      { id: "hood", label: "A brighter hoodie", correct: false },
    ],
    explain: "The operator has to be able to pick you out.",
  },
  {
    id: "hazard-cord",
    moduleId: "hazards",
    prompt: "The saw still runs, and the cord jacket is cut. What happens to the cord?",
    options: [
      { id: "tape", label: "Tape it and keep cutting", correct: false },
      { id: "out", label: "Take it out of service", correct: true },
      { id: "shorter", label: "Pull the copper so it looks shorter", correct: false },
    ],
    explain: "Running is not the same as sound. Tape hides the damage.",
  },
  {
    id: "hazard-exit",
    moduleId: "hazards",
    prompt: "Offcuts cover the only walk to the exit. What is the first move?",
    options: [
      { id: "friday", label: "Leave them for Friday", correct: false },
      { id: "path", label: "Clear a path people can use", correct: true },
      { id: "kick", label: "Kick them aside without looking", correct: false },
    ],
    explain: "The exit is today’s problem.",
  },
  {
    id: "hazard-label",
    moduleId: "hazards",
    prompt: "A can has no product name and no pictogram. What do you do?",
    options: [
      { id: "smell", label: "Smell it so you can label it", correct: false },
      { id: "closed", label: "Leave it closed and tell the supervisor", correct: true },
      { id: "pour", label: "Pour it into a labelled can", correct: false },
    ],
    explain: "No name means no guess.",
  },
  {
    id: "tools-chisel",
    moduleId: "tools",
    prompt: "The chisel head is mushroomed. Mike wants one more hole.",
    options: [
      { id: "one", label: "One more hole", correct: false },
      { id: "down", label: "Take it out of service", correct: true },
      { id: "grind", label: "Grind the head on the concrete and keep going", correct: false },
    ],
    explain: "One more hole is how the splinter leaves the head.",
  },
  {
    id: "tools-saw",
    moduleId: "tools",
    prompt: "The saw binds and kicks. What do you do?",
    options: [
      { id: "push", label: "Push harder", correct: false },
      { id: "stop", label: "Stop and take it out of service", correct: true },
      { id: "wedge", label: "Wedge the guard open", correct: false },
    ],
    explain: "Force is not a sharp blade, and the guard stays.",
  },
  {
    id: "tools-alarm",
    moduleId: "tools",
    prompt: "The backup alarm is silent. People say they will look.",
    options: [
      { id: "slow", label: "Back up slowly", correct: false },
      { id: "park", label: "Keep the machine parked until the alarm works", correct: true },
      { id: "behind", label: "Have someone stand behind and shout", correct: false },
    ],
    explain: "A person behind a reversing machine is the hazard. This check does not authorize the machine.",
  },
  {
    id: "falls-top",
    moduleId: "falls",
    prompt: "Someone asks you to stand on the top cap of a step ladder.",
    options: [
      { id: "top", label: "Stand on the top. It is only one sheet", correct: false },
      { id: "down", label: "Stay off the top and use another way to pass the load", correct: true },
      { id: "alex", label: "Send a lighter person up", correct: false },
    ],
    explain: "The top is not a step. This check does not qualify you to work at height.",
  },
  {
    id: "falls-lean",
    moduleId: "falls",
    prompt: "The work is just past the right rail.",
    options: [
      { id: "lean", label: "Lean a little", correct: false },
      { id: "move", label: "Climb down and move the ladder", correct: true },
      { id: "push", label: "Have someone push the base while you lean", correct: false },
    ],
    explain: "The rails are the limit.",
  },
  {
    id: "falls-cover",
    moduleId: "falls",
    prompt: "A floor opening has no cover and no guard.",
    options: [
      { id: "step", label: "Step around it", correct: false },
      { id: "plan", label: "Stop and use the site’s fall plan", correct: true },
      { id: "board", label: "Lay a loose board over it", correct: false },
    ],
    explain: "Seeing the edge is not a cover.",
  },
  {
    id: "whmis-flame",
    moduleId: "whmis",
    prompt: "Northline Contact Adhesive NL-14 shows a flame pictogram. What is that mark saying?",
    options: [
      { id: "wash", label: "It washes off with water", correct: false },
      { id: "fire", label: "It can catch fire. Read the precautions before use", correct: true },
      { id: "skull", label: "It means the same as the skull and crossbones", correct: false },
    ],
    explain: "The flame is the flammable mark. The label and SDS still name the precautions.",
  },
  {
    id: "whmis-smell",
    moduleId: "whmis",
    prompt: "Alex wants to smell Northline Contact Adhesive NL-14 to learn it.",
    options: [
      { id: "once", label: "Let them smell it once", correct: false },
      { id: "label", label: "Use the label and the sheet. Do not sniff it", correct: true },
      { id: "same", label: "Tell them every adhesive smells the same", correct: false },
    ],
    explain: "Smelling it is an exposure. The label already names the product.",
  },
  {
    id: "whmis-store",
    moduleId: "whmis",
    prompt: "Where does the closed can of Northline Contact Adhesive NL-14 go?",
    options: [
      { id: "sun", label: "On the sunny sill beside the grinder", correct: false },
      { id: "cabinet", label: "Upright and closed, in the labelled storage, away from ignition", correct: true },
      { id: "walk", label: "On its side in the walkway", correct: false },
    ],
    explain: "Heat and sparks are ignition. The walkway is not storage.",
  },
  {
    id: "whmis-spill",
    moduleId: "whmis",
    prompt: "NL-14 is on its side and you can read the label from the doorway. What is the first move?",
    options: [
      { id: "wipe", label: "Wipe it up", correct: false },
      { id: "out", label: "Step out, keep people back, and match the name to the sheet", correct: true },
      { id: "sniff", label: "Step closer and sniff", correct: false },
    ],
    explain: "Out of the vapour first. Cleanup stays with the people the site plan names.",
  },
  {
    id: "conduct-exit",
    moduleId: "conduct",
    prompt: "Someone stacks material in front of the exit and laughs.",
    options: [
      { id: "laugh", label: "Laugh and leave it", correct: false },
      { id: "clear", label: "Clear the door and say the exit stays open", correct: true },
      { id: "add", label: "Add your load to the stack", correct: false },
    ],
    explain: "The laugh does not move the material.",
  },
  {
    id: "conduct-nod",
    moduleId: "conduct",
    prompt: "The instruction did not land, and a crane is about to move. The person nodded.",
    options: [
      { id: "nod", label: "Accept the nod", correct: false },
      { id: "stop", label: "Stop the move and ask for a read-back", correct: true },
      { id: "yell", label: "Shout the same words faster", correct: false },
    ],
    explain: "A nod is not a read-back. Volume is not clarity.",
  },
  {
    id: "conduct-dare",
    moduleId: "conduct",
    prompt: "Someone dares you to open a panel you are not cleared for.",
    options: [
      { id: "open", label: "Open it so the joke stops", correct: false },
      { id: "shut", label: "Leave it closed", correct: true },
      { id: "alex", label: "Let a newer person open it", correct: false },
    ],
    explain: "A dare is not authorization.",
  },
  {
    id: "report-kick",
    moduleId: "report",
    prompt: "The saw kicked and missed your hand. What do you do?",
    options: [
      { id: "finish", label: "Finish the cut. It missed", correct: false },
      { id: "report", label: "Stop and report the near miss", correct: true },
      { id: "wood", label: "Blame the wood and move on", correct: false },
    ],
    explain: "A miss is still a report.",
  },
  {
    id: "report-shock",
    moduleId: "report",
    prompt: "Someone says a panel tingled and they are fine. You are not cleared to open it.",
    options: [
      { id: "shake", label: "Tell them to shake it off", correct: false },
      { id: "report", label: "Stop work on that panel and report it", correct: true },
      { id: "try", label: "Touch the same spot to check", correct: false },
    ],
    explain: "Fine is not an assessment. You still do not open the panel.",
  },
  {
    id: "report-friday",
    moduleId: "report",
    prompt: "Two near misses happened before lunch. Someone says the report can wait until Friday.",
    options: [
      { id: "friday", label: "Wait for Friday", correct: false },
      { id: "today", label: "Report them today the way the site asks", correct: true },
      { id: "pocket", label: "Keep the note in your pocket", correct: false },
    ],
    explain: "A pocket is not the process.",
  },
  {
    id: "emergency-phone",
    moduleId: "emergency",
    prompt: "The alarm is sounding and someone wants to go back for a phone.",
    options: [
      { id: "wait", label: "Wait for the phone", correct: false },
      { id: "out", label: "Leave. The phone stays", correct: true },
      { id: "you", label: "Go back for it yourself", correct: false },
    ],
    explain: "The count does not wait on a phone.",
  },
  {
    id: "emergency-panel",
    moduleId: "emergency",
    prompt: "Smoke is coming from a panel room you are not authorized to enter.",
    options: [
      { id: "open", label: "Open the panel and look", correct: false },
      { id: "alarm", label: "Raise the alarm and stay out", correct: true },
      { id: "spray", label: "Spray an extinguisher into the panel", correct: false },
    ],
    explain: "Looking is the exposure. The wrong extinguisher is the next injury.",
  },
  {
    id: "emergency-trench",
    moduleId: "emergency",
    prompt: "The trench wall moved. Someone is at the edge.",
    options: [
      { id: "jump", label: "Jump in and dig", correct: false },
      { id: "back", label: "Keep everyone back and raise the alarm", correct: true },
      { id: "scoop", label: "Drive a machine onto the edge to scoop", correct: false },
    ],
    explain: "A rescue without a plan becomes two people in the trench.",
  },
  {
    id: "shift-board",
    moduleId: "shift",
    prompt: "The crew knows your name and the board is still blank. What do you do?",
    options: [
      { id: "skip", label: "Skip the board", correct: false },
      { id: "sign", label: "Sign in anyway", correct: true },
      { id: "out", label: "Sign out so you can leave early", correct: false },
    ],
    explain: "The list is the headcount.",
  },
  {
    id: "shift-debrief",
    moduleId: "shift",
    prompt: "The morning had a cut cord and an open can of NL-14. What belongs in the debrief?",
    options: [
      { id: "fine", label: "Say the morning was fine", correct: false },
      { id: "name", label: "Name what you stopped, who you told, and what is still not authorized", correct: true },
      { id: "ticket", label: "Sign a card that says you are now ticketed", correct: false },
    ],
    explain: "A debrief is a record of the practice. It is not a certificate.",
  },
  {
    id: "shift-saw",
    moduleId: "shift",
    prompt: "Alex has never used the saw and the schedule says the cut has to happen.",
    options: [
      { id: "try", label: "Let Alex try it while you watch from across the yard", correct: false },
      { id: "cleared", label: "Keep Alex on work they are cleared for", correct: true },
      { id: "easy", label: "Tell them it is easy", correct: false },
    ],
    explain: "A schedule is not authorization.",
  },
];

export const DAY_MS = 24 * 60 * 60 * 1000;
