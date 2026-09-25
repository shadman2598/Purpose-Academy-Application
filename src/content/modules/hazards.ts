import type { HazardSpot, Spot, TrainingModule } from "../model";
import { SOURCES } from "../sources";

function severity(correct: "low" | "moderate" | "high"): HazardSpot["severityOptions"] {
  const labels = [
    { id: "low", label: "Low" },
    { id: "moderate", label: "Moderate" },
    { id: "high", label: "High" },
  ];
  return labels.map((item) => ({
    id: item.id,
    label: item.label,
    correct: item.id === correct,
    feedback:
      item.id === correct
        ? "That matches the harm this scene is set up to show. Severity is a judgement for this yard, not a legal category."
        : "Look at what could happen if nothing changes: injury, a blocked exit, or contact with energy. Rate that, not how normal it looks.",
  }));
}

function controls(
  correctId: string,
  options: { id: string; label: string }[],
  correctFeedback: string,
): HazardSpot["controlOptions"] {
  return options.map((option) => ({
    id: option.id,
    label: option.label,
    correct: option.id === correctId,
    feedback:
      option.id === correctId
        ? correctFeedback
        : "That response leaves the hazard in place or shifts it onto someone else. Pick the control that deals with this scene.",
  }));
}

const controlSet = [
  { id: "guard", label: "Put the proper guard back and stop using it until then" },
  { id: "report", label: "Report it and keep people out until it is fixed" },
  { id: "ignore", label: "Leave it. Someone else will see it" },
  { id: "ppe-only", label: "Tell workers to be careful and keep going" },
];

const hazards: HazardSpot[] = [
  {
    id: "electrical",
    kind: "panel",
    x: 18,
    y: 40,
    label: "Open electrical panel",
    feedback: "Exposed electrical equipment. Keep clear and get a qualified person. Do not poke it to “see if it’s dead.”",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "What do you do about the open panel?",
    controlOptions: controls(
      "report",
      [
        { id: "report", label: "Keep people back and report it to the supervisor for a qualified fix" },
        { id: "tape", label: "Close it with tape and keep working beside it" },
        { id: "ignore", label: "Ignore it if you are not an electrician" },
        { id: "ppe-only", label: "Put on gloves and reach in to reset it" },
      ],
      "Distance and a qualified repair. Tape and improvised resets are not a control for live equipment.",
    ),
  },
  {
    id: "blocked-exit",
    kind: "pallets",
    x: 80,
    y: 28,
    label: "Pallets across the exit",
    feedback: "The exit is blocked. In an alarm this becomes the hazard.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "How do you control a blocked exit?",
    controlOptions: controls(
      "clear",
      [
        { id: "clear", label: "Clear the exit if you can do it safely, and tell the supervisor it was blocked" },
        { id: "ignore", label: "Leave the pallets. There is another door somewhere" },
        { id: "sign", label: "Hang a sign that says “use the other side” and leave the pallets" },
        { id: "ppe-only", label: "Wear a hard hat and climb over" },
      ],
      "The exit has to work. Clear it when that is safe, and report it so it does not fill up again.",
    ),
  },
  {
    id: "trip",
    kind: "cable",
    x: 42,
    y: 74,
    label: "Loose cable in the walkway",
    feedback: "A trip hazard in the path people use.",
    severity: "moderate",
    severityOptions: severity("moderate"),
    controlPrompt: "What is the better control?",
    controlOptions: controls(
      "route",
      [
        { id: "route", label: "Reroute or cover the cable so the walkway is clear, and report the setup" },
        { id: "step", label: "Step over it and tell people to watch their feet" },
        { id: "ignore", label: "Leave it until the end of the day" },
        { id: "ppe-only", label: "Issue shin guards" },
      ],
      "Get the cable out of the path. Warnings alone leave the trip in place.",
    ),
  },
  {
    id: "guard",
    kind: "saw",
    x: 56,
    y: 58,
    label: "Saw with the guard missing",
    feedback: "A missing guard on a saw. The tool is not ready to use.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "The guard is missing.",
    controlOptions: controls(
      "guard",
      controlSet,
      "Out of service until the guard is back. “Be careful” is not a guard.",
    ),
  },
  {
    id: "stack",
    kind: "stack",
    x: 30,
    y: 26,
    label: "Material stacked leaning over the path",
    feedback: "Unstable stored material. It can fall into the path.",
    severity: "moderate",
    severityOptions: severity("moderate"),
    controlPrompt: "How should this storage be handled?",
    controlOptions: controls(
      "restack",
      [
        { id: "restack", label: "Keep people clear and have it restacked in a stable way" },
        { id: "ignore", label: "Walk faster when you pass it" },
        { id: "ppe-only", label: "Wear a hard hat and leave the stack" },
        { id: "push", label: "Give it a shove to see if it falls" },
      ],
      "Stable storage, and keep people out until that happens. Testing it with a shove is how it falls.",
    ),
  },
  {
    id: "chemical",
    kind: "jug",
    x: 64,
    y: 40,
    label: "Unlabelled container",
    feedback: "A chemical container with no label you can use. Don’t guess the contents.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "What do you do with the unlabelled container?",
    controlOptions: controls(
      "hold",
      [
        { id: "hold", label: "Leave it, keep it closed, and report it so it can be identified or disposed of properly" },
        { id: "sniff", label: "Open it and smell it" },
        { id: "use", label: "Use it if it looks like the usual solvent" },
        { id: "dump", label: "Pour it down the drain" },
      ],
      "Unlabelled product stays put and gets reported. Smell, guess, and dump are exposures.",
    ),
  },
  {
    id: "no-ppe",
    kind: "worker",
    x: 48,
    y: 46,
    label: "Worker without eye protection at the grinder",
    feedback: "Someone is grinding without the eye protection that task needs.",
    severity: "moderate",
    severityOptions: severity("moderate"),
    controlPrompt: "What is the useful move?",
    controlOptions: controls(
      "stop",
      [
        { id: "stop", label: "Stop the task and speak up so the right eye protection goes on before it restarts" },
        { id: "ignore", label: "Say nothing. It’s their eyes" },
        { id: "photo", label: "Film them and post it later" },
        { id: "ppe-only", label: "Hand them sunglasses and walk away" },
      ],
      "Stop the exposure and get the specified protection on. Shaming them online is not a control.",
    ),
  },
  {
    id: "ladder",
    kind: "ladder",
    x: 72,
    y: 60,
    label: "Ladder on uneven ground",
    feedback: "The ladder is in use on uneven ground and it is not secured.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "The ladder is already up.",
    controlOptions: controls(
      "down",
      [
        { id: "down", label: "Get the person down and reset or replace the setup before anyone climbs" },
        { id: "hold", label: "Hold it with one hand while they keep working" },
        { id: "ignore", label: "Leave it. They are almost done" },
        { id: "ppe-only", label: "Throw them a harness with nowhere to anchor" },
      ],
      "Stop the climb and fix the setup. A harness with no anchor is not a plan.",
    ),
  },
  {
    id: "edge",
    kind: "edge",
    x: 24,
    y: 68,
    label: "Uncovered floor opening",
    feedback: "An opening in the work surface with no cover and no guard.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "What belongs here before people keep walking?",
    controlOptions: controls(
      "cover",
      [
        { id: "cover", label: "Keep people back and get a proper cover or guard in place" },
        { id: "cone", label: "Set one cone beside it and keep working" },
        { id: "ignore", label: "Remember where it is" },
        { id: "ppe-only", label: "Tell everyone to wear harnesses with no anchors" },
      ],
      "A cover or guard deals with the opening. Memory and a single cone do not.",
    ),
  },
  {
    id: "traffic",
    kind: "truck",
    x: 88,
    y: 68,
    label: "Person in the truck’s path",
    feedback: "A pedestrian and a reversing truck are using the same space.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "What separates people and the truck?",
    controlOptions: controls(
      "split",
      [
        { id: "split", label: "Stop the movement and separate the walkway from the vehicle path" },
        { id: "yell", label: "Yell and hope the driver hears" },
        { id: "ignore", label: "Let them sort it out" },
        { id: "ppe-only", label: "High-vis only, and keep the same path" },
      ],
      "Separate the paths and stop the conflicting movement. A vest without a plan still puts a person in the path.",
    ),
  },
  {
    id: "rebar",
    kind: "rebar",
    x: 12,
    y: 60,
    label: "Exposed rebar ends",
    feedback: "Upturned rebar without caps, beside where people walk.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "What reduces the impalement hazard?",
    controlOptions: controls(
      "cap",
      [
        { id: "cap", label: "Keep the path off the rebar and get proper caps or a cover on before work continues beside it" },
        { id: "ignore", label: "Leave it. Rebar is normal" },
        { id: "tape", label: "Wrap a bit of tape on one bar" },
        { id: "ppe-only", label: "Knee pads for everyone" },
      ],
      "Cover or cap the ends and keep people off them. Tape and knee pads are not an impalement control.",
    ),
  },
  {
    id: "scrap",
    kind: "scrap",
    x: 36,
    y: 82,
    label: "Nails and offcuts in the path",
    feedback: "Housekeeping. Nails and offcuts where boots land.",
    severity: "moderate",
    severityOptions: severity("moderate"),
    controlPrompt: "What do you do with the scrap?",
    controlOptions: controls(
      "bin",
      [
        { id: "bin", label: "Pick it up if that is safe and get it into the scrap bin, then mention the pattern to the supervisor" },
        { id: "kick", label: "Kick it under the scaffold" },
        { id: "ignore", label: "Leave it. Housekeeping is not your trade" },
        { id: "ppe-only", label: "Thicker boots and keep walking" },
      ],
      "Get it out of the path. Hiding it under the scaffold saves it for the next person.",
    ),
  },
  {
    id: "fuel",
    kind: "fuel",
    x: 90,
    y: 42,
    label: "Fuel can beside a heater",
    feedback: "A fuel container stored against a temporary heater.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "Fuel and a heater.",
    controlOptions: controls(
      "move",
      [
        { id: "move", label: "Don’t use the heater. Move people back and tell the supervisor so the fuel is stored as the procedure requires" },
        { id: "use", label: "Leave both. It’s cold" },
        { id: "sniff", label: "Check the can by smelling the spout" },
        { id: "ppe-only", label: "Put on gloves and keep the heater running" },
      ],
      "Ignition and fuel stay apart. The storage rule is the site’s, and this setup needs a supervisor now.",
    ),
  },
  {
    id: "scaffold",
    kind: "scaffold",
    x: 50,
    y: 22,
    label: "Damaged scaffold plank",
    feedback: "A plank on the scaffold is split. People are about to load it.",
    severity: "high",
    severityOptions: severity("high"),
    controlPrompt: "The plank is split.",
    controlOptions: controls(
      "tag",
      [
        { id: "tag", label: "Keep people off that bay and report it so a competent person deals with the scaffold" },
        { id: "jump", label: "Jump on it to test it" },
        { id: "ignore", label: "Use it if it held yesterday" },
        { id: "ppe-only", label: "Clip a harness to the frame and carry on" },
      ],
      "Off the damaged bay, and a competent person assesses the scaffold. Testing it with your weight is the incident.",
    ),
  },
];

const decoys: Spot[] = [
  {
    id: "cone-rack",
    kind: "cone",
    x: 8,
    y: 30,
    label: "Cones stored in a rack",
    feedback: "No hazard here. Those cones are stored in the rack, not left in a walkway.",
  },
  {
    id: "cooler",
    kind: "cooler",
    x: 58,
    y: 30,
    label: "Labelled water cooler",
    feedback: "No hazard here. The cooler is labelled and it is not blocking anything.",
  },
  {
    id: "signed-path",
    kind: "sign",
    x: 76,
    y: 48,
    label: "Signed walkway with a barrier",
    feedback: "No hazard here. That walkway is signed and the barrier is up. The conflict is over by the truck.",
  },
];

export const hazardsModule: TrainingModule = {
  id: "hazards",
  title: "Spot the Hazard",
  mapLabel: "Hazard Hunter",
  description: "Find what can hurt someone, rate it, and choose a control that actually changes the scene.",
  estimatedMinutes: 20,
  difficulty: "Core",
  completionXp: 500,
  jurisdiction: "CANADA",
  warnings: ["site-specific"],
  badgeId: "hazard-hunter",
  notes: [
    {
      jurisdiction: "ALBERTA",
      body: "Alberta employers must assess hazards and control them. The hierarchy is a way to think about controls. The OHS Code can require a specific method for a specific hazard. This scene is not a hazard assessment for a real site.",
    },
  ],
  objectives: [
    "Spot common construction hazards in a busy scene.",
    "Separate a real hazard from something that is stored properly.",
    "Choose a control that removes or reduces the hazard, not a slogan.",
    "Use the hierarchy of controls without pretending PPE is always enough.",
  ],
  sources: [SOURCES.hierarchy, SOURCES.hazardControl, SOURCES.albertaOhs],
  blocks: [
    {
      type: "lesson",
      id: "hazard-learn",
      phase: "learn",
      xpKind: "lesson",
      title: "See it, then control it",
      paragraphs: [
        "A hazard is something that can cause harm. Risk is about how likely that is and how bad it could be. You do not need a formula to take a loose cable seriously.",
        "Controls are usually stronger at the source than at the worker. Elimination and substitution come before engineering, administrative controls, and PPE. CCOHS describes that order, and notes that some standards add a layer for systems that raise awareness, such as alarms, between engineering and administrative controls.",
        "Higher in the hierarchy is generally preferred where it is feasible. PPE can still be required. “Be careful” is not a control.",
      ],
      bullets: [
        "Look at paths: exits, walkways, and vehicle routes.",
        "Look at energy: electricity, falls, moving equipment, pressure.",
        "Look at materials: unstable stacks, unlabelled containers, fuel near ignition.",
        "Look at tools: missing guards and damaged parts.",
      ],
      callout: {
        title: "Scene score is feedback",
        body: "You will see points for a correct hazard, a fair severity call, and a useful control. Those points explain the scene. They are not a speed bonus, and they do not replace the XP rates.",
      },
    },
    {
      type: "hierarchy",
      id: "hazard-hierarchy",
      phase: "practice",
      xpKind: "practice",
      title: "Hierarchy of controls",
      intro:
        "Concrete cutting is producing airborne dust. You will set the general order, then apply it to two versions of the same job. Higher controls are generally preferred where they are feasible. The law and the site plan can still name a specific measure.",
    },
    {
      type: "hazard-hunt",
      id: "hazard-hunt",
      phase: "play",
      xpKind: "game",
      title: "Hazard hunter",
      intro:
        "Tap the yard. A clear area will say so, and that tap does not cut your score. Each real hazard asks for a severity and a control. First answers count.",
      scene: "yard",
      hazards,
      decoys,
    },
    {
      type: "choice-set",
      id: "hazard-check",
      phase: "test",
      xpKind: "check",
      title: "Knowledge check",
      items: [
        {
          id: "careful",
          prompt: "A lead hand’s control for a missing guard is “just be careful.”",
          dimension: "knowledge",
          options: [
            {
              id: "ok",
              label: "That’s an administrative control, so it’s enough.",
              correct: false,
              feedback: "A slogan is not a procedure, and it leaves the guard missing.",
            },
            {
              id: "no",
              label: "The guard has to go back. Caution is not a replacement for it.",
              correct: true,
              feedback: "Restore the guard or keep the tool out of service. Carefulness does not cover a blade.",
            },
            {
              id: "ppe",
              label: "Add gloves and the guard can stay off.",
              correct: false,
              feedback: "Gloves do not replace a guard.",
            },
          ],
        },
      ],
    },
    {
      type: "choice-set",
      id: "hazard-challenge",
      phase: "test",
      xpKind: "challenge",
      title: "Final challenge — dust on the slab",
      items: [
        {
          id: "dust-challenge",
          prompt:
            "The crew is dry-cutting concrete in a occupied corridor. A vacuum shroud is on the truck. The lead hand says masks are enough because the cut will only take ten minutes.",
          dimension: "decision",
          track: "challenge",
          options: [
            {
              id: "masks",
              label: "Hand out masks and start. Ten minutes is short.",
              correct: false,
              feedback: "Time is not a control. The shroud is available, so relying on masks alone skips a higher control that is feasible.",
            },
            {
              id: "shroud",
              label: "Pause the cut. Use the vacuum shroud, then the respiratory protection the procedure still requires.",
              correct: true,
              feedback: "Engineering first, where it is sitting on the truck. PPE can remain in the procedure. It should not be the only control when the shroud is feasible.",
            },
            {
              id: "fans",
              label: "Point a fan down the corridor and keep dry-cutting.",
              correct: false,
              feedback: "A fan can push dust into other people. It is not the same as capturing it at the blade.",
            },
            {
              id: "skip",
              label: "Cancel the cut forever.",
              correct: false,
              feedback: "The work may still need to happen. The call is to control the dust, not to invent a ban the scene doesn’t support.",
            },
          ],
        },
      ],
    },
  ],
};
