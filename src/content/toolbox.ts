export interface ToolboxScenario {
  id: string;
  work: string;
  hazards: string[];
  ppe: string[];
  controls: string[];
  equipment: string[];
  emergency: string[];
  decoys: string[];
  briefing: string;
}

export const TOOLBOX: ToolboxScenario[] = [
  {
    id: "concrete",
    work: "Concrete cutting",
    hazards: ["Airborne dust", "Noise", "The blade", "A cord across the walk"],
    ppe: ["Goggles or a face shield", "Hearing protection", "Respiratory protection", "Boots, gloves, hard hat, high-vis"],
    controls: ["Wet cut or another dust control if the task allows", "Keep other people out of the dust", "A cord that is intact and out of the path"],
    equipment: ["The saw the task calls for", "A guard that returns", "The respirator the task requires"],
    emergency: ["Who has first aid", "Where the exit is", "How to kill the power"],
    decoys: ["A sunny forecast", "Street sunglasses", "Tape the cord and keep cutting", "Skip the guard to reach farther", "Wait until the end of the shift to find the exit"],
    briefing:
      "Today’s work is a concrete cut. Dust, noise, and the blade are the hazards. Eyes, ears, and a respirator go on before the saw starts. If the guard sticks or the cord is cut, the saw stays down. The exit stays clear.",
  },
  {
    id: "ladder",
    work: "Short ladder access",
    hazards: ["A bad set", "Overreach", "Something stored on the ground under the feet"],
    ppe: ["Hard hat", "Boots", "Whatever the task on the ladder also needs"],
    controls: ["Firm clear ground", "A safer angle", "Three points of contact", "A second way if the ladder is the wrong tool"],
    equipment: ["A ladder with sound rails and feet"],
    emergency: ["Do not climb if you are not fit for it", "How to call for help if someone is hung up"],
    decoys: ["Hold the ladder while they climb a cracked rail", "Lean past the rails to reach the work", "Coffee instead of saying you are too tired", "A loose board over an opening"],
    briefing:
      "The ladder is for a short reach. Check the rails and the feet, set it on clear ground, and do not lean past the rails. A cracked rail means a different ladder or a different way up. This talk is not hands-on ladder training.",
  },
];
