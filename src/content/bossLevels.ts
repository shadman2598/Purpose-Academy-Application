export interface BossStep {
  id: string;
  speaker: string;
  prompt: string;
  review: string;
  options: { id: string; label: string; correct: boolean; feedback: string }[];
}

export interface BossLevelDef {
  id: string;
  title: string;
  detail: string;
  moduleId: string;
  steps: BossStep[];
}

function step(
  id: string,
  speaker: string,
  prompt: string,
  review: string,
  good: string,
  goodWhy: string,
  bad: [string, string],
  worse: [string, string],
): BossStep {
  return {
    id,
    speaker,
    prompt,
    review,
    options: [
      { id: "bad", label: bad[0], correct: false, feedback: bad[1] },
      { id: "good", label: good, correct: true, feedback: goodWhy },
      { id: "worse", label: worse[0], correct: false, feedback: worse[1] },
    ],
  };
}

export const BOSS_LEVELS: BossLevelDef[] = [
  {
    id: "orientation",
    title: "Site orientation boss",
    detail: "A new worker’s first hour. Six calls, from the gate to the first task. This does not replace that site’s orientation.",
    moduleId: "orientation",
    steps: [
      step("ob1", "Sarah", "You arrive as the crew is already walking to the slab. Sarah is at the board.", "Sign-in", "Sign in, then catch the crew.", "The board is the headcount. A minute behind is still a sign-in.", ["Skip it. They know your name.", "The list is how the site counts people."], ["Text a photo of the yard and go in.", "A photo is not the board."]),
      step("ob2", "Mike", "Mike points at two doors. One has a green cross. One is the lunch room.", "First aid", "Confirm the green cross is the first-aid station, and who the attendant is.", "The mark is a cue. You still learn the attendant’s name.", ["Use the lunch room. It is closer.", "The lunch room is not the station."], ["Wait until someone is hurt to find it.", "That is when the minute matters."]),
      step("ob3", "Jordan", "The alarm sounds for the drill. Your phone is in the trailer.", "Muster", "Leave by the route you were shown and go to the muster point.", "Out, then the count. The phone waits.", ["Go back for the phone first.", "The drill is the route, not the phone."], ["Look for the smoke so you can report it.", "Finding smoke is not the muster."]),
      step("ob4", "Sarah", "A pallet sits across the door marked as the exit.", "Exit", "Stop and get the exit clear before work starts.", "The route you just learned has to stay usable.", ["Step over it. You can still fit.", "A route you have to climb is blocked."], ["Leave it until Friday’s cleanup.", "The crew uses that door today."]),
      step("ob5", "Alex", "Alex says the morning talk was long and asks you to start the saw while Sarah finishes the board.", "Waiting for the talk", "Wait. The saw stays down until the talk names the controls.", "The board and the talk are the orientation. The saw is not a shortcut around them.", ["Start it. You have used one before.", "Used before is not this site’s orientation."], ["Have Alex start it. They are keen.", "That hands the same gap to someone newer."]),
      step("ob6", "Sarah", "Orientation is done on this screen. Sarah asks what you do before the first task.", "After the walk", "Repeat the task, the hazard, and who you call if it changes.", "A read-back. This boss is practice. It is not the employer’s orientation.", ["Say you’re good and figure it out on the slab.", "Good is not a read-back."], ["Sign Sarah’s book so the crew can start.", "A signature is not the orientation."]),
    ],
  },
  {
    id: "whmis",
    title: "WHMIS boss",
    detail: "Northline Contact Adhesive NL-14 arrives, gets stored, and then leaks. Six calls in the chemical room.",
    moduleId: "whmis",
    steps: [
      step("wb1", "Jordan", "The can at the door reads Northline Contact Adhesive NL-14, flame pictogram, signal word DANGER.", "The can arrives", "Leave it closed and read that label before anyone moves it.", "The name and the flame are the start. The can stays closed.", ["Open it to judge the smell.", "Smelling it is an exposure."], ["Carry it by the cap to the heater to warm it.", "A flame pictogram does not go to a heater."]),
      step("wb2", "Alex", "Alex asks which part of the label says how serious it is.", "Signal word", "The signal word DANGER, read with the hazard statements.", "DANGER is the stronger signal word. The statements say the nature of the hazard.", ["The colour of the can.", "Colour is not the signal word."], ["The barcode.", "The barcode is stock, not the hazard."]),
      step("wb3", "Mike", "Mike asks what the flame on this can means for the crew.", "Pictogram", "It can catch fire. Keep ignition away and read the precautions.", "The flame is the flammable mark. The sheet still names the controls.", ["It means the same as the skull and crossbones.", "Those are different pictograms."], ["It means the product is only an irritant.", "The exclamation mark is a different pictogram. This can shows the flame."]),
      step("wb4", "Jordan", "You need spill measures and the protective equipment for NL-14. The binder is outside the spill.", "SDS headings", "Open accidental release measures, and exposure controls / personal protection.", "The headings answer the moment. You do not need a memorized section number.", ["Open a section because you memorized its number and stop.", "The heading is the check. A number is only a location."], ["Skip the sheet. The flame is enough.", "The flame starts the question. The sheet answers it."]),
      step("wb5", "Sarah", "The can is still closed. Where does it go?", "Storage", "Upright, closed, in the labelled storage this site uses, away from ignition.", "Handling and storage, plus the site’s own cabinet. This boss does not authorize the product.", ["On its side in the walkway so people notice it.", "That is a leak and a trip."], ["Beside the grinder, in the sun.", "Sparks and heat are ignition."]),
      step("wb6", "Jordan", "The can is now on its side. You can still read NL-14 and the flame from the doorway.", "The leak", "Step out, keep people off the trail, and match that name to the sheet.", "Out of the vapour first. Cleanup stays with the people the site plan names.", ["Wipe it before anyone sees.", "That puts you in the product."], ["Sniff it so you are sure of the name.", "The label already names it."]),
    ],
  },
  {
    id: "ppe",
    title: "PPE boss",
    detail: "A dry concrete cut. Six calls about the kit. Wearing it here does not authorize the saw.",
    moduleId: "ppe",
    steps: [
      step("pb1", "Mike", "The saw is out for a dry concrete cut. You have a hard hat on and nothing else.", "The kit", "Stop. Dust, chips, and noise are still uncovered.", "The hat is one piece. It is not the cut.", ["Start. The hat is the important part.", "The hat does not catch dust or chips."], ["Hold a shirt over your mouth and cut.", "A shirt is not a respirator."]),
      step("pb2", "Alex", "Alex offers street sunglasses “so you look the part.”", "Eyes", "Use the eye protection the task needs. Sunglasses stay in the trailer.", "Chips do not care how the glasses look.", ["Take them. They are darker.", "Dark is not impact protection."], ["Skip eye protection. You will look away.", "Looking away is how the chip finds you."]),
      step("pb3", "Sarah", "Nobody has hearing protection. The cut is loud.", "Hearing", "Put hearing protection on before the saw starts.", "Noise is part of this task, not a surprise after the cut.", ["Cut, then worry if your ears ring.", "The ring is the exposure you already took."], ["Turn the radio up so you can hear something else.", "More noise is not hearing protection."]),
      step("pb4", "Mike", "The respirator is in the locker. Someone says the wind will take the dust.", "Dust", "Stop until the respiratory protection the task needs is on.", "Wind is not the control. This does not fit-test you or authorize the saw.", ["Trust the wind and cut.", "Wind is not a respirator."], ["Use a dust mask from a previous job without checking the task.", "The task and the sheet decide the respirator, not the last job."]),
      step("pb5", "Jordan", "Gloves, boots, and a high-vis vest are still on the bench.", "The rest of the kit", "Put on the gear the cut needs, then look again before you start.", "The kit matches the dust, the chips, the noise, and the site’s clothing rule.", ["Start bare-handed so you can feel the saw.", "Feeling the saw is not the control."], ["Wear the vest only. It shows you are working.", "The vest does not stop dust."]),
      step("pb6", "Sarah", "The kit is on. Sarah asks what that means for the saw.", "Authorization", "The kit is ready. The saw still needs the site’s authorization and a guard that works.", "PPE did not become permission.", ["The kit means you can cut.", "Dressed is not authorized."], ["Take the guard off so the kit can do the work.", "The guard is a control. The kit does not replace it."]),
    ],
  },
  {
    id: "hazards",
    title: "Hazard boss",
    detail: "Walk the start of shift and decide what happens next. Six calls. The clock in the hunt game is a different screen.",
    moduleId: "hazards",
    steps: [
      step("hb1", "Mike", "A pallet blocks the door the crew would use as an exit.", "Blocked exit", "Get the exit clear, or get someone who can, before work starts.", "A blocked exit is today’s problem.", ["Leave it. People can step over.", "A route you climb is blocked."], ["Wait for the Friday cleanup.", "The crew is here now."]),
      step("hb2", "Sarah", "The extension cord jacket is cut. The saw is plugged into it.", "Damaged cord", "Unplug it if you can do that safely, and take the cord out of service.", "Tape is not a jacket. You do not keep cutting.", ["Tape the cut and keep going.", "Tape hides the damage."], ["Pull the bare copper out so it looks shorter.", "That is not a repair."]),
      step("hb3", "Alex", "Alex is about to cut with a hard hat and no eye protection.", "Eyes at the cut", "Stop the cut until the eye protection is on.", "The hat does not cover chips.", ["Let them cut. They will be careful.", "Careful is not a shield."], ["Hand them sunglasses.", "Sunglasses are not the eye protection."]),
      step("hb4", "Jordan", "A can by the bench has no product name and no pictogram.", "Unlabelled container", "Leave it closed. Tell Sarah. Do not guess what is inside.", "No name means no guess.", ["Smell it so you can label it yourself.", "Smelling an unknown is an exposure."], ["Pour it into a labelled can to tidy up.", "Mixing unknowns is a second hazard."]),
      step("hb5", "Sam", "A worker is standing under a suspended load.", "The load path", "Get the person out of the path and tell Sam before the pick moves.", "The path stays empty.", ["Take a photo for the toolbox talk.", "The photo does not move the person."], ["Wave them through. Sam can see.", "If they are under the load, the pick stops."]),
      step("hb6", "Sarah", "You have found the hazards. Sarah asks what should happen next.", "Reporting", "Report them through the site’s process. Fix one yourself only when you are allowed to and it creates no new hazard.", "Name it, keep people out, use the site’s way.", ["Fix all of them yourself, including the panel and the cord.", "Some fixes need authorization."], ["Wait until the end of the shift.", "The crew is about to start."]),
    ],
  },
  {
    id: "emergency",
    title: "Emergency boss",
    detail: "Two things go wrong at once: an alarm, and the NL-14 can on its side. Six calls. This is not emergency-response certification.",
    moduleId: "emergency",
    steps: [
      step("eb1", "Jordan", "The alarm sounds. Alex turns back for a phone.", "The alarm", "Leave by the route you were shown. The phone stays.", "Muster first.", ["Wait while Alex gets the phone.", "The count does not wait on a phone."], ["Go find the smoke so you can describe it.", "Searching is not the route."]),
      step("eb2", "Sarah", "On the way out you see Northline Contact Adhesive NL-14 on its side, flame and DANGER readable from the hall.", "The can during the alarm", "Keep walking the route. Tell Sarah the name and the place at the muster point.", "You already have the name. You do not stop in the vapour.", ["Stop and wipe the trail.", "The alarm is the exit."], ["Kick the can upright as you pass.", "Kicking it can splash you."]),
      step("eb3", "Mike", "At the muster point, Mike is not in the group.", "The count", "Tell the person taking the count that Mike is missing, and where you last saw him.", "The count is the point of the muster.", ["Go back in to look for Mike.", "The search is assigned. It is not a solo return."], ["Assume he is fine because he knows the site.", "The count is how you know."]),
      step("eb4", "Jordan", "Someone at muster has product on their hands and says it is from that can.", "Exposure", "Get them to the first-aid attendant and say the product name you read: Northline Contact Adhesive NL-14.", "The attendant and the sheet. You do not invent a treatment.", ["Rinse it with whatever is in your bottle and send them back to work.", "The attendant follows the sheet and the site plan."], ["Smell their hands to confirm the product.", "The label already named it."]),
      step("eb5", "Sam", "Sam wants to drive the machine out through the muster crowd.", "The crowd", "Hold the crowd clear and tell Sam to wait until the count and the route are confirmed.", "A machine through a muster is a second emergency.", ["Wave Sam through slowly.", "Slow still meets people."], ["Move the muster onto the equipment path.", "The muster point is the one you were shown."]),
      step("eb6", "Sarah", "The all-clear is given. Sarah asks what you do before anyone goes back to the can.", "The return", "Wait until the site says the area is clear, then use the sheet for NL-14 with the people assigned to the spill.", "All-clear is not a licence to clean an adhesive.", ["Run back and tidy the can so the day can start.", "Tidy is how you re-enter the product."], ["Forget the name. The alarm is over.", "The name is how the next person finds the sheet."]),
    ],
  },
  {
    id: "shift",
    title: "Final site boss",
    detail: "One morning, six calls, from sign-in to the leak. The debrief is the last step. This is practice on this device.",
    moduleId: "shift",
    steps: [
      step("sb1", "Sarah", "07:10. The crew knows your name. The board is still empty beside it.", "Sign-in", "Sign in anyway.", "The list is the headcount.", ["Skip it.", "Knowing your name does not replace the list."], ["Sign out now so you can leave early.", "The morning list is the arrival."]),
      step("sb2", "Mike", "07:40. A cord at the saw has a cut jacket.", "The cord", "Take that cord out of service.", "The saw waits for a sound cord.", ["Tape it.", "Tape is not a jacket."], ["Use it for one cut.", "One cut is the exposure."]),
      step("sb3", "Alex", "08:20. Alex has never used the saw. The schedule says the cut has to happen.", "The saw", "Keep Alex on work they are cleared for. An authorized person runs the saw.", "A schedule is not authorization.", ["Let Alex try it while you watch from across the yard.", "Watching from across the yard is not supervision of a machine they are not cleared for."], ["Tell them it is easy.", "Easy is how an unauthorized person starts."]),
      step("sb4", "Sam", "09:05. You are the spotter. A worker steps into the swing.", "The swing", "Signal stop. Keep the swing empty until you and Sam both confirm it is clear.", "Stop, then a read-back. This does not authorize you to run the machine.", ["Wave them through.", "A wave does not move them."], ["Honk and keep swinging slowly.", "Slow still meets the person."]),
      step("sb5", "Jordan", "10:30. Northline Contact Adhesive NL-14 is leaking. The flame and DANGER are readable from the door.", "The leak", "Step out, keep people back, and use that name to find the sheet.", "The label from a distance. No sniff, no wipe.", ["Sniff to be sure.", "The label is the name."], ["Wipe it up.", "Your hands are not the spill plan."]),
      step("sb6", "Sarah", "End of the morning. Sarah asks for the debrief.", "Debrief", "Name what you stopped, who you told, and what is still not authorized.", "A debrief is the record of the practice. It is not a certificate.", ["Say the morning was fine and skip the details.", "Fine hides the cord, the saw, and the can."], ["Sign a card that says you are now ticketed.", "This boss does not issue a ticket."]),
    ],
  },
];
