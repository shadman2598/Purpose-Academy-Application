export interface RoomStop {
  id: string;
  label: string;
  col: number;
  row: number;
  speaker: string;
  line: string;
  review: string;
  options: { id: string; label: string; correct: boolean; feedback: string }[];
}

export const WHMIS_ROOM: RoomStop[] = [
  {
    id: "door",
    label: "Receiving door",
    col: 0,
    row: 0,
    speaker: "Jordan",
    line: "A can is on the threshold. The label reads Northline Contact Adhesive NL-14, with a flame pictogram and the signal word DANGER.",
    review: "Receiving a chemical",
    options: [
      { id: "carry", label: "Carry it in by the cap and set it by the heater.", correct: false, feedback: "The cap is not a handle, and a flame pictogram does not sit by a heater." },
      { id: "read", label: "Leave it closed. Read the label from here before anyone moves it.", correct: true, feedback: "The name, the flame, and DANGER are already visible. The can stays closed until the label and the sheet agree." },
      { id: "open", label: "Open it to see how strong it smells.", correct: false, feedback: "Smelling it is an exposure. The label already names the product." },
    ],
  },
  {
    id: "label",
    label: "Label bench",
    col: 1,
    row: 0,
    speaker: "Jordan",
    line: "The supplier label for Northline Contact Adhesive NL-14 is face up. Alex asks which part tells you how serious the hazard is.",
    review: "Supplier label",
    options: [
      { id: "colour", label: "The colour of the can.", correct: false, feedback: "Can colour is not a WHMIS element." },
      { id: "signal", label: "The signal word DANGER, with the hazard statements beside it.", correct: true, feedback: "DANGER is the stronger signal word. The hazard statements say what the danger is. Precautions say what to do about it." },
      { id: "barcode", label: "The barcode.", correct: false, feedback: "The barcode is for stock. The signal word, pictogram, and statements are the label." },
    ],
  },
  {
    id: "marks",
    label: "Pictogram wall",
    col: 2,
    row: 0,
    speaker: "Mike",
    line: "The flame is on this can of Northline Contact Adhesive NL-14. Mike asks what that mark is telling the crew.",
    review: "Flame pictogram",
    options: [
      { id: "wash", label: "It washes off with water, so the mark is only a suggestion.", correct: false, feedback: "The flame is a fire hazard. Water is not the decision." },
      { id: "flame", label: "It can catch fire. Keep it from ignition, and read the precautions before use.", correct: true, feedback: "The flame pictogram is the flammable mark. The label and SDS still name the precautions. This room does not authorize the adhesive." },
      { id: "skull", label: "A flame means the same thing as the skull and crossbones.", correct: false, feedback: "Those are different pictograms. This can shows the flame." },
    ],
  },
  {
    id: "binder",
    label: "SDS binder",
    col: 0,
    row: 1,
    speaker: "Jordan",
    line: "The sheet for Northline Contact Adhesive NL-14 is in the binder. You need the spill measures, not a section number from memory.",
    review: "Safety data sheet",
    options: [
      { id: "eight", label: "Open whatever section you memorized as number 8 and stop there.", correct: false, feedback: "The heading is the skill. Exposure controls and personal protection is where PPE lives. The spill heading is accidental release measures." },
      { id: "headings", label: "Open accidental release measures for the spill, and exposure controls / personal protection for the gear.", correct: true, feedback: "Those headings answer this can. The site plan still decides who cleans it up." },
      { id: "skip", label: "Skip the sheet. The flame is enough.", correct: false, feedback: "The flame starts the question. The sheet answers the precautions for NL-14." },
    ],
  },
  {
    id: "shelf",
    label: "Storage shelf",
    col: 1,
    row: 1,
    speaker: "Sarah",
    line: "Where does the closed can of Northline Contact Adhesive NL-14 go?",
    review: "Storage",
    options: [
      { id: "sun", label: "On the sunny sill, beside the grinder.", correct: false, feedback: "Heat and sparks are ignition. The flame pictogram does not go there." },
      { id: "cabinet", label: "Closed, upright, in the labelled storage the site uses for this product, away from ignition.", correct: true, feedback: "Closed and identified. The handling and storage heading, and the site’s own rule, decide the exact cabinet." },
      { id: "floor", label: "On its side in the walkway so people see it.", correct: false, feedback: "On its side it can leak, and the walkway is not storage." },
    ],
  },
  {
    id: "bench",
    label: "Work bench",
    col: 2,
    row: 1,
    speaker: "Alex",
    line: "I’ve never used Northline Contact Adhesive NL-14. Can I just smell it and put on any gloves?",
    review: "Asking for a shortcut",
    options: [
      { id: "smell", label: "Yes. A quick smell tells you if it is strong.", correct: false, feedback: "Smelling it is an exposure. The label is how you name it." },
      { id: "sheet", label: "No. We read the label, the precautions, and the exposure controls before anyone opens it.", correct: true, feedback: "You look it up together. Guessing the glove is how the wrong one gets used." },
      { id: "any", label: "Any glove is fine for adhesive.", correct: false, feedback: "The sheet names the protection. “Any glove” is a guess." },
    ],
  },
  {
    id: "spill",
    label: "Spill station",
    col: 1,
    row: 2,
    speaker: "Jordan",
    line: "The same can, Northline Contact Adhesive NL-14, is on its side. You can read the flame and DANGER from the doorway. A wet trail is on the floor.",
    review: "A leaking can",
    options: [
      { id: "wipe", label: "Wipe it up before the crew sees it.", correct: false, feedback: "That puts your hands in the product. You are not the spill crew because you walked in." },
      { id: "back", label: "Step out, keep people off the trail, and use the label you can already read to open the matching sheet.", correct: true, feedback: "Out of the vapour first. The name on the label finds the sheet. Cleanup stays with the people the site plan names." },
      { id: "sniff", label: "Step closer and sniff so you are sure it is NL-14.", correct: false, feedback: "The label is already readable. Sniffing is the exposure." },
    ],
  },
];
