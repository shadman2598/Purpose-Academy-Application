import type { Trade } from "./trades";

export interface DecisionScene {
  id: string;
  topic: string;
  speaker: string;
  line: string;
  trades?: Trade[];
  options: { id: string; label: string; correct: boolean; feedback: string }[];
  review: string;
}

export const DECISIONS: DecisionScene[] = [
  {
    id: "trade-labour",
    topic: "Material handling",
    speaker: "Mike",
    trades: ["labourer", "other"],
    line: "A load of gypsum is in the walkway. Mike asks you to carry it through the door by yourself.",
    review: "Material handling",
    options: [
      { id: "alone", label: "Carry it alone so the walkway clears faster.", correct: false, feedback: "A load you cannot see over, or cannot hold, needs another person or a cart." },
      { id: "help", label: "Get a second person or a cart, and keep the exit clear while you move it.", correct: true, feedback: "The exit stays usable, and the load matches the people moving it." },
      { id: "leave", label: "Leave it. Someone else will trip over it later.", correct: false, feedback: "Leaving it keeps the route blocked." },
    ],
  },
  {
    id: "trade-electric",
    topic: "Electrical work",
    speaker: "Sarah",
    trades: ["electrician"],
    line: "The panel is open. Sarah asks you to land a breaker. You are not authorized on this panel.",
    review: "Electrical authorization",
    options: [
      { id: "land", label: "Land it. You have watched it done.", correct: false, feedback: "Watching is not authorization. The panel stays for the person cleared to work on it." },
      { id: "stop", label: "Leave the panel alone and tell Sarah you are not authorized for it.", correct: true, feedback: "Interest in the trade does not clear you for the panel. This scene is not an electrical ticket." },
      { id: "alex", label: "Have Alex land it. They are keen.", correct: false, feedback: "That hands the same unauthorized job to someone newer." },
    ],
  },
  {
    id: "trade-operator",
    topic: "Equipment and spotting",
    speaker: "Sam",
    trades: ["operator"],
    line: "Sam is in the cab. You are the spotter, and a worker steps into the swing.",
    review: "Spotting",
    options: [
      { id: "wave", label: "Wave them through. Sam will see them.", correct: false, feedback: "If they are in the swing, the machine stops. A wave does not move them." },
      { id: "stop", label: "Signal stop. Keep the swing empty until the person is clear and you and Sam confirm it.", correct: true, feedback: "Stop, clear the path, then a read-back. This does not authorize you to run the machine." },
      { id: "honk", label: "Honk and keep the swing moving slowly.", correct: false, feedback: "Slow still meets the person." },
    ],
  },
  {
    id: "trade-height",
    topic: "Edges",
    speaker: "Sarah",
    trades: ["roofing", "carpenter"],
    line: "The opening on this floor has no cover and no guard. The task is on the other side of it.",
    review: "Fall protection",
    options: [
      { id: "step", label: "Step around it. You can see the edge.", correct: false, feedback: "Seeing the edge is not a control." },
      { id: "stop", label: "Stop. Use the site’s fall plan before anyone works beside the opening.", correct: true, feedback: "The opening gets a real control. This scene does not qualify you for roof work or work at height." },
      { id: "board", label: "Lay a loose board over it and keep going.", correct: false, feedback: "A loose board is not a cover." },
    ],
  },
  {
    id: "trade-hot",
    topic: "Hot work",
    speaker: "Jordan",
    trades: ["welder"],
    line: "The cut is a spark-producing job beside stored adhesive. There is no hot-work check on the board.",
    review: "Hot work",
    options: [
      { id: "spark", label: "Start. The adhesive can is closed.", correct: false, feedback: "A closed can beside sparks is still a fuel source until the area is checked." },
      { id: "permit", label: "Stop and follow the site’s hot-work steps before any spark.", correct: true, feedback: "The check comes first. This scene is not a welding ticket." },
      { id: "fan", label: "Point a fan at the can and weld.", correct: false, feedback: "A fan is not the hot-work plan." },
    ],
  },
  {
    id: "trade-concrete",
    topic: "Concrete dust",
    speaker: "Mike",
    trades: ["concrete", "carpenter"],
    line: "The saw is out for a dry concrete cut. Nobody has a respirator on.",
    review: "Respiratory protection",
    options: [
      { id: "go", label: "Cut. The wind will take the dust.", correct: false, feedback: "Wind is not the control for hazardous dust." },
      { id: "stop", label: "Stop the cut until eyes, ears, and the respirator the task needs are on.", correct: true, feedback: "Dust, chips, and noise show up together. This does not authorize the saw." },
      { id: "mask", label: "Hold a shirt over your mouth and cut.", correct: false, feedback: "A shirt is not a respirator." },
    ],
  },
  {
    id: "trade-lead",
    topic: "Pressure from the schedule",
    speaker: "Alex",
    trades: ["supervisor", "apprentice"],
    line: "Alex says, “I’ve never used this machine, but the schedule says we need it running.”",
    review: "Equipment authorization",
    options: [
      { id: "easy", label: "Tell them it’s easy and to figure it out.", correct: false, feedback: "Easy is how an unauthorized person gets on a machine." },
      { id: "ground", label: "Keep Alex on the ground work. An authorized operator runs the machine.", correct: true, feedback: "You can help the schedule without handing over a machine. A supervisor title in this game is not a certificate." },
      { id: "watch", label: "Let Alex run it while you watch from across the yard.", correct: false, feedback: "Watching from across the yard is not supervision of a machine they are not cleared for." },
    ],
  },
  {
    id: "ladder",
    topic: "Unsafe work",
    speaker: "Mike",
    line: "You’re working beside another crew member. Their ladder is too shallow, and the feet are on a cable.",
    review: "Ladders and fall protection",
    options: [
      { id: "quiet", label: "Say nothing. It’s their ladder.", correct: false, feedback: "Silence leaves both of you under the same fall." },
      { id: "stop", label: "Stop the climb. Ask them to reset the ladder on clear ground, at a safer angle.", correct: true, feedback: "You name the condition and the fix. You don’t give a speech." },
      { id: "hold", label: "Hold the ladder while they climb it as it is.", correct: false, feedback: "Holding a badly set ladder does not make the set correct." },
    ],
  },
  {
    id: "harass",
    topic: "Harassment",
    speaker: "Alex",
    line: "A coworker mocks Alex’s questions loud enough for the bay to hear.",
    review: "Workplace conduct",
    options: [
      { id: "laugh", label: "Laugh so you fit in.", correct: false, feedback: "Laughing takes a side. Questions stop." },
      { id: "stop", label: "Tell them to stop. If it continues, use the workplace process.", correct: true, feedback: "Direct, then the process. This scene is practice, not the complaint itself." },
      { id: "post", label: "Record it and post the clip.", correct: false, feedback: "A public clip is not the workplace process." },
    ],
  },
  {
    id: "ppe",
    topic: "PPE",
    speaker: "Sarah",
    line: "The cut is starting. Alex has a hard hat and no eye protection, no hearing protection, and no respirator.",
    review: "PPE selection",
    options: [
      { id: "go", label: "Let them start. The hat is the important part.", correct: false, feedback: "The hat does not stop dust or a chip." },
      { id: "gear", label: "Pause the cut until the eyes, ears, and respirator match the task.", correct: true, feedback: "Gear follows the hazard, not a single favourite item." },
      { id: "sunglasses", label: "Hand them street sunglasses.", correct: false, feedback: "Sunglasses are not the eye protection for this cut." },
    ],
  },
  {
    id: "tool",
    topic: "Damaged equipment",
    speaker: "Mike",
    line: "The grinder guard is cracked. Mike says it will finish this one cut.",
    review: "Equipment inspection",
    options: [
      { id: "cut", label: "Finish the cut. One more won’t matter.", correct: false, feedback: "The crack is already the reason to stop." },
      { id: "down", label: "Take it out of service and tell the person who swaps tools.", correct: true, feedback: "Damaged equipment stays down. Tag-out follows the site procedure." },
      { id: "tape", label: "Tape the guard and keep going.", correct: false, feedback: "Tape is not a guard." },
    ],
  },
  {
    id: "spill",
    topic: "Chemical spill",
    speaker: "Jordan",
    line: "A can of adhesive is on its side. You can smell it from the doorway.",
    review: "WHMIS and emergency response",
    options: [
      { id: "wipe", label: "Wipe it up before anyone sees it.", correct: false, feedback: "That puts you in an unidentified product." },
      { id: "back", label: "Step out, keep people back, and use the label and SDS from a safe distance.", correct: true, feedback: "Avoid the exposure first. Then the sheet and the site plan." },
      { id: "sniff", label: "Get closer and sniff so you can name it.", correct: false, feedback: "Sniffing is an exposure. The label names it." },
    ],
  },
  {
    id: "exit",
    topic: "Blocked exit",
    speaker: "Sarah",
    line: "A stack of gypsum is across the only door on this side of the floor.",
    review: "Emergency routes",
    options: [
      { id: "later", label: "Move it at coffee.", correct: false, feedback: "Coffee is too late if the alarm goes now." },
      { id: "clear", label: "Stop and clear the door, or get the crew that can, before work continues.", correct: true, feedback: "The route has to work before you need it." },
      { id: "other", label: "Tell people to use a window if something happens.", correct: false, feedback: "A window is not the plan." },
    ],
  },
  {
    id: "fatigue",
    topic: "Fatigue",
    speaker: "Alex",
    line: "Alex slept three hours and is about to climb. They say they’re fine.",
    review: "Fitness for work",
    options: [
      { id: "climb", label: "Let them climb. Everyone is tired.", correct: false, feedback: "Tired is how the same miss repeats on a ladder." },
      { id: "ground", label: "Keep them on the ground and tell Sarah before the climb.", correct: true, feedback: "Name it early. Fatigue is a condition you report." },
      { id: "coffee", label: "Get them two coffees and send them up.", correct: false, feedback: "Caffeine does not replace sleep." },
    ],
  },
  {
    id: "radio-call",
    topic: "Communication",
    speaker: "Sam",
    line: "Over the radio, through the noise: “Move the lift.” You did not hear where.",
    review: "Jobsite communication",
    options: [
      { id: "guess", label: "Move it toward the building. That’s usually it.", correct: false, feedback: "A guess with a machine is how someone gets pinned." },
      { id: "repeat", label: "Ask them to repeat the direction and repeat it back before anything moves.", correct: true, feedback: "A read-back is the control." },
      { id: "nod", label: "Nod so you don’t hold up the crew.", correct: false, feedback: "A nod is not a read-back." },
    ],
  },
  {
    id: "near",
    topic: "Near miss",
    speaker: "Jordan",
    line: "A tool fell from the scaffold and missed Alex by a step. Nobody was hurt.",
    review: "Reporting",
    options: [
      { id: "luck", label: "Call it luck and get back to work.", correct: false, feedback: "A miss is information. The next drop might not miss." },
      { id: "report", label: "Stop the work under the scaffold and report the near miss the way the site asks.", correct: true, feedback: "No injury does not mean no report." },
      { id: "hide", label: "Hide the tool so nobody gets in trouble.", correct: false, feedback: "Hiding the tool hides the cause." },
    ],
  },
  {
    id: "alarm",
    topic: "Emergency",
    speaker: "Sarah",
    line: "The alarm sounds. Alex wants to go back for a phone.",
    review: "Emergency response",
    options: [
      { id: "phone", label: "Wait while they get the phone.", correct: false, feedback: "The phone is not worth the route." },
      { id: "leave", label: "Leave by the route you were shown and go to the muster point.", correct: true, feedback: "Out, then count. Phones wait." },
      { id: "look", label: "Go see where the smoke is first.", correct: false, feedback: "Investigating is not your first job on an alarm." },
    ],
  },
  {
    id: "auth",
    topic: "Not authorized",
    speaker: "Sarah",
    line: "Sarah is behind schedule. She asks you to run the scissor lift. You have never been authorized on it.",
    review: "Equipment authorization",
    options: [
      { id: "run", label: "Run it. She wouldn’t ask if it was a problem.", correct: false, feedback: "A request is not authorization." },
      { id: "no", label: "Refuse. Offer to do the ground work, and let an authorized operator take the lift.", correct: true, feedback: "You can help the schedule without operating equipment you are not cleared for." },
      { id: "alex", label: "Have Alex run it. They look keen.", correct: false, feedback: "That moves the same unauthorized job onto someone newer." },
    ],
  },
];
