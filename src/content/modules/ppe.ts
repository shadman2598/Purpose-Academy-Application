import type { TrainingModule } from "../model";
import { SOURCES } from "../sources";

const items = [
  { id: "hardhat", label: "Hard hat" },
  { id: "boots", label: "Safety footwear" },
  { id: "glasses", label: "Safety glasses" },
  { id: "goggles", label: "Goggles" },
  { id: "faceshield", label: "Face shield" },
  { id: "ear", label: "Hearing protection" },
  { id: "gloves-work", label: "Work gloves" },
  { id: "gloves-chemical", label: "Chemical-resistant gloves" },
  { id: "respirator", label: "Respirator" },
  { id: "hivis", label: "High-visibility vest" },
  { id: "harness", label: "Fall-arrest harness" },
  { id: "sunglasses", label: "Street sunglasses" },
];

export const ppe: TrainingModule = {
  id: "ppe",
  title: "Gear Up",
  mapLabel: "PPE",
  description: "Pick PPE for the task in front of you, not from one list you memorized.",
  estimatedMinutes: 15,
  difficulty: "Starter",
  completionXp: 500,
  jurisdiction: "CANADA",
  warnings: ["site-specific"],
  badgeId: "gear-ready",
  notes: [
    {
      jurisdiction: "ALBERTA",
      body: "Alberta’s OHS laws require hazards to be controlled and set rules for PPE when it is the method in use. The Code, the hazard assessment, and the site say what is required. This locker is practice.",
    },
  ],
  objectives: [
    "Choose PPE from the hazard assessment, the task, the equipment, and the site rules.",
    "Reject gear that looks close enough but does not match the hazard.",
    "Explain why a harness, a respirator, or high-vis can be required on one job and wrong on another.",
  ],
  sources: [SOURCES.albertaOhs, SOURCES.hierarchy, SOURCES.hazardControl],
  blocks: [
    {
      type: "lesson",
      id: "ppe-learn",
      phase: "learn",
      xpKind: "lesson",
      title: "There is no universal PPE list",
      paragraphs: [
        "Hard hats, safety footwear, and high-visibility clothing are common on construction yards. Common is not the same as “this is the full list for every task.”",
        "Choose PPE based on the hazard assessment, the task, the equipment, the workplace requirements, and the applicable rules. A respirator that the safety data sheet does not call for is not extra safety. A pair of street sunglasses is not safety glasses.",
        "PPE sits low on the hierarchy of controls. It does not replace a guard, water suppression, or a change in how the work is done. When the assessment still requires PPE, you wear it.",
      ],
      bullets: [
        "Head: hard hat where the site or the overhead hazard requires it.",
        "Feet: safety footwear rated for the hazards you were told about, not running shoes.",
        "Eyes and face: match the impact, dust, or splash. Sunglasses from the truck are not a substitute.",
        "Hearing: when the tool or the area is loud enough that the site requires it.",
        "Hands: the glove has to match the hazard. Chemical-resistant gloves are not the same as leather work gloves.",
        "Respiratory: use the type the SDS or the procedure names, and only if you are fit-tested and trained for it where that is required.",
        "High-vis: when vehicles, equipment, or the site rule says you must be seen.",
        "Fall protection: a harness is for a fall hazard that the site has planned for. It is not a costume for ground-level dust.",
      ],
      callout: {
        title: "Gear is not authorization",
        body: "Putting a harness on in this locker does not train you to use fall protection, and it does not authorize the work.",
      },
    },
    {
      type: "choice-set",
      id: "ppe-practice",
      phase: "practice",
      xpKind: "practice",
      title: "Match the hazard",
      intro: "One hazard, one choice. The full locker comes next.",
      items: [
        {
          id: "silica-breath",
          prompt: "Dry cutting concrete is throwing a visible cloud of dust. What question do you ask before you pick a mask off the shelf?",
          dimension: "procedure",
          options: [
            {
              id: "any",
              label: "Any mask is fine if it covers your mouth.",
              correct: false,
              feedback: "Dust masks are not interchangeable. Silica and other dusts need the protection named in the procedure, and often a control that captures the dust.",
            },
            {
              id: "sds",
              label: "What does the hazard assessment or procedure specify, and is the dust being controlled at the tool?",
              correct: true,
              feedback: "Ask what is specified, and whether water, a shroud, or vacuum is in use. The mask is not the whole control.",
            },
            {
              id: "skip",
              label: "Skip breathing protection if the cut is short.",
              correct: false,
              feedback: "A short cut still makes dust. Duration is not a control plan.",
            },
          ],
        },
        {
          id: "glove-type",
          prompt: "You are about to handle a solvent-based adhesive. Leather work gloves are on the bench.",
          dimension: "knowledge",
          options: [
            {
              id: "leather",
              label: "Leather is close enough.",
              correct: false,
              feedback: "Solvents can soak through the wrong glove. The SDS names the glove material.",
            },
            {
              id: "sds",
              label: "Check the label and SDS for the glove type, then use that.",
              correct: true,
              feedback: "Product-specific information beats a guess. Chemical-resistant means a stated material, not “a glove.”",
            },
            {
              id: "bare",
              label: "Bare hands, and wash after.",
              correct: false,
              feedback: "Washing after exposure is not a substitute for keeping the product off your skin.",
            },
          ],
        },
      ],
    },
    {
      type: "ppe-locker",
      id: "ppe-locker",
      phase: "play",
      xpKind: "game",
      title: "PPE locker",
      intro:
        "Three jobs. Equip the worker, then ask “Ready for the job?” Your first check is the one that scores. You can adjust and check again until the set matches.",
      items,
      jobs: [
        {
          id: "concrete",
          title: "You are cutting concrete",
          situation:
            "Dry-cutting a slab indoors is not the plan. This cut uses a water-fed saw, and the procedure still calls for a respirator, hearing protection, and eye protection because of what is left in the air and the noise.",
          siteRule: "This yard requires a hard hat, safety footwear, and a high-visibility vest in the work area.",
          required: ["hardhat", "boots", "hivis", "goggles", "ear", "respirator", "gloves-work"],
          incorrect: ["sunglasses", "gloves-chemical", "harness"],
          why: "The site rule covers the hat, boots, and vest. The cut adds goggles, hearing protection, the respirator named in the procedure, and work gloves. A harness does not control dust. Street sunglasses and chemical gloves are the wrong type for this task.",
        },
        {
          id: "flag",
          title: "You are directing vehicles at the gate",
          situation:
            "You are on the ground, in a vehicle path, with no cutting and no chemical product. Dust from the road is light. The task is being seen.",
          siteRule: "Hard hat and safety footwear stay on. High-vis is mandatory while you are in the vehicle path.",
          required: ["hardhat", "boots", "hivis", "glasses"],
          incorrect: ["sunglasses", "harness", "respirator", "gloves-chemical"],
          why: "Being seen is the task hazard, so the vest stays on, with the yard’s hat and boots and safety glasses for dust and debris. A respirator and a harness are not controls for flagging. Sunglasses are not safety glasses.",
        },
        {
          id: "adhesive",
          title: "You are transferring a solvent adhesive",
          situation:
            "The fictional SDS for Northline Contact Adhesive calls for eye protection and chemical-resistant gloves. It does not call for a respirator for this short outdoor transfer with the lid controlled. You are on the ground.",
          siteRule: "Hard hat, safety footwear, and high-vis are required anywhere inside the fence.",
          required: ["hardhat", "boots", "hivis", "glasses", "gloves-chemical"],
          incorrect: ["sunglasses", "gloves-work", "harness"],
          why: "Site gear plus the SDS: safety glasses and chemical-resistant gloves. Work gloves are the wrong material. The SDS for this transfer does not add a respirator, so don’t treat “more equipment” as the assessment.",
        },
      ],
    },
    {
      type: "choice-set",
      id: "ppe-check",
      phase: "test",
      xpKind: "check",
      title: "Knowledge check",
      items: [
        {
          id: "hierarchy-ppe",
          prompt: "Where does PPE sit when a guard or local ventilation is feasible?",
          dimension: "knowledge",
          options: [
            {
              id: "first",
              label: "First. It is the fastest control.",
              correct: false,
              feedback: "Fast is not the hierarchy. PPE is the last layer, used with other controls when they are still needed.",
            },
            {
              id: "last",
              label: "After elimination, substitution, engineering, and administrative controls, where those are feasible.",
              correct: true,
              feedback: "Higher controls are generally preferred where they are feasible. PPE can still be required. It does not replace the higher control.",
            },
            {
              id: "only",
              label: "PPE is the only control the law accepts.",
              correct: false,
              feedback: "That is not how hazard control works, and it is not a statement of the law.",
            },
          ],
        },
      ],
    },
    {
      type: "choice-set",
      id: "ppe-challenge",
      phase: "test",
      xpKind: "challenge",
      title: "Final challenge — ready for the job?",
      intro: "One job. One first answer.",
      items: [
        {
          id: "ppe-challenge-item",
          prompt:
            "You are grinding a weld at ground level. The guard is on the tool. The procedure calls for a face shield over safety glasses, hearing protection, a hard hat, boots, and work gloves. A coworker offers street sunglasses “so you don’t scratch the good glasses.”",
          dimension: "decision",
          track: "challenge",
          options: [
            {
              id: "sun",
              label: "Take the sunglasses. They are darker, so they protect more.",
              correct: false,
              feedback: "Darkness is not an impact rating. Use the safety glasses and face shield the procedure names.",
            },
            {
              id: "spec",
              label: "Wear the listed gear. Leave the sunglasses in the cab.",
              correct: true,
              feedback: "The procedure already chose the eye protection. Substituting street sunglasses breaks that choice.",
            },
            {
              id: "harness",
              label: "Add a fall-arrest harness and skip the face shield.",
              correct: false,
              feedback: "There is no fall in this task. The face shield is there for grinding debris. Don’t trade one hazard’s gear for another.",
            },
            {
              id: "skip",
              label: "Skip eye protection. The guard is enough.",
              correct: false,
              feedback: "A guard reduces one path for debris. The procedure still calls for the shield and glasses. Use both.",
            },
          ],
        },
      ],
    },
  ],
};
