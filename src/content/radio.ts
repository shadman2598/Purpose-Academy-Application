export interface RadioCall {
  id: string;
  from: string;
  call: string;
  options: { id: string; label: string; correct: boolean; feedback: string }[];
}

export const RADIO: RadioCall[] = [
  {
    id: "spill",
    from: "Jordan",
    call: "Hey, we’ve got a spill near the south entrance.",
    options: [
      { id: "walk", label: "Copy. I’ll walk through it and see what it is.", correct: false, feedback: "Walking through it is an exposure." },
      { id: "hold", label: "Copy. I’m holding people back from the south entrance and I’ll look from a distance.", correct: true, feedback: "You heard the place, you kept people out, and you did not enter the product." },
      { id: "ignore", label: "I’m on a cut. Tell someone else.", correct: false, feedback: "The south entrance is a route. The call needs an answer." },
    ],
  },
  {
    id: "stop",
    from: "Sarah",
    call: "Stop work. There’s an issue with the equipment.",
    options: [
      { id: "finish", label: "I’ll finish this screw, then stop.", correct: false, feedback: "Stop means stop. The screw can wait." },
      { id: "stop", label: "Stopping. Where do you want us, and what stays clear?", correct: true, feedback: "You stop, then you ask for the place and the limit." },
      { id: "what", label: "Which equipment? I’ll keep going until you say.", correct: false, feedback: "The stop already landed. Details come after the tools are down." },
    ],
  },
  {
    id: "spot",
    from: "Sam",
    call: "I can’t see you. Step where I can, or stay out of the swing.",
    options: [
      { id: "behind", label: "I’ll stay behind the machine. You know I’m here.", correct: false, feedback: "If Sam cannot see you, you are not in a safe spot." },
      { id: "clear", label: "Copy. I’m moving to where you can see me, outside the swing.", correct: true, feedback: "You repeat the instruction and you move to a place the operator can see." },
      { id: "wave", label: "I’ll wave from where I am.", correct: false, feedback: "A wave from a blind spot is still a blind spot." },
    ],
  },
];
