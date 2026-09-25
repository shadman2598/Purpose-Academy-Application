import type { RadioCall } from "./radio";
import type { ToolboxScenario } from "./toolbox";
import type { Trade } from "./trades";

export interface TradeCall {
  speaker: string;
  line: string;
  review: string;
  lesson: string;
  options: { id: string; label: string; correct: boolean; feedback: string }[];
}

const TRADES: Trade[] = ["labourer", "carpenter", "electrician", "plumber", "operator", "welder", "hvac", "roofing", "concrete", "supervisor", "apprentice", "other"];

function call(lesson: string, speaker: string, line: string, review: string, good: [string, string], bad: [string, string], worse: [string, string]): TradeCall {
  return {
    lesson,
    speaker,
    line,
    review,
    options: [
      { id: "bad", label: bad[0], correct: false, feedback: bad[1] },
      { id: "good", label: good[0], correct: true, feedback: good[1] },
      { id: "worse", label: worse[0], correct: false, feedback: worse[1] },
    ],
  };
}

const LESSONS: Record<string, Record<Trade, TradeCall>> = {
  orientation: {
    labourer: call("The material stays in the trailer until you have signed in and heard where it goes.", "Mike", "A load of gypsum is already in the walkway. Mike says to move it before you sign in.", "Sign-in", ["Sign in first, then move it with a second person or a cart so the exit stays clear.", "The board comes before the load."], ["Carry it alone so the walkway clears faster.", "A load you cannot see over needs help."], ["Leave it. Someone else will trip later.", "Leaving it keeps the route blocked."]),
    carpenter: call("The saw stays cased until the morning talk names the cut.", "Sarah", "Your saw is set up by the office. Sarah is still doing the board.", "Waiting for the talk", ["Leave the saw cased until the talk names the controls.", "The board is the orientation."], ["Make one test cut while she talks.", "A test cut skips the talk."], ["Have Alex try the saw. They want to help.", "That hands an unauthorized tool to someone newer."]),
    electrician: call("An open panel is not part of walking onto the site.", "Sarah", "The panel door is open beside the trailer. Nobody has said you are cleared for it.", "Electrical authorization", ["Leave the panel alone and tell Sarah you are not authorized for it.", "Interest in the trade is not authorization. This is not an electrical ticket."], ["Close it yourself so it looks tidy.", "Touching the panel is the work you are not cleared for."], ["Land one breaker so the crew has power.", "Watching is not a ticket."]),
    plumber: call("A trench beside the trailer is a reason to stop, not a shortcut to the board.", "Sam", "The walk to the office crosses an unmarked trench.", "Open edge", ["Stop and use the way around that Sarah names.", "The edge needs a control before anyone crosses."], ["Step across. It is only a short gap.", "A short gap is still a fall."], ["Lay a loose board over it and keep going.", "A loose board is not a cover."]),
    operator: call("The machine at the gate stays off until the spotter and the operator agree.", "Sam", "A machine is idling at the gate. Sam is not in the cab.", "Unattended machine", ["Leave it. Find Sam, and do not climb on.", "An idling machine is not an invitation. This does not authorize you to run it."], ["Climb up and shut it down. You know the key.", "Knowing a key is not authorization."], ["Move it two metres so the crew can pass.", "Two metres is still operating it."]),
    welder: call("Bottles at the office door are not storage.", "Jordan", "Gas bottles are standing loose by the sign-in board.", "Stored energy", ["Stop and tell Jordan. Do not roll them inside to tidy up.", "Loose bottles are a report, not a warm-up."], ["Lay them down so nobody trips.", "Laying a charged bottle down is not the storage plan."], ["Crack one to see if it is full.", "Opening it is the exposure."]),
    hvac: call("An unlabelled can by the trailer stays closed.", "Jordan", "A refrigerant-sized can with no name sits by the trailer step.", "Unknown product", ["Leave it closed and tell Jordan before anyone moves it.", "No name means no guess."], ["Smell it so you can write a label.", "Smelling an unknown is an exposure."], ["Pour it into a jug so the step is clear.", "Mixing an unknown is a second hazard."]),
    roofing: call("An opening on the first floor is not something you step around on the way to the talk.", "Sarah", "The walk to the office passes a floor opening with no cover and no guard.", "Floor opening", ["Stop. Use the site’s fall plan before anyone works beside it.", "Seeing the edge is not a control. This does not qualify you for roof work."], ["Step around it. You can see the edge.", "Seeing it is not a cover."], ["Lay a loose sheet over it.", "A loose sheet is not a cover."]),
    concrete: call("A dry saw does not start before the talk, and not without the dust kit.", "Mike", "The concrete saw is out and running before anyone has signed in.", "Dust before the talk", ["Shut the area approach and get Mike to stop it until the kit and the talk are done.", "Wind and habit are not the control."], ["Let it run. The wind will take the dust.", "Wind is not a respirator."], ["Hold a shirt over your face and walk past.", "A shirt is not protection."]),
    supervisor: call("A supervisor title in this game is not a reason to skip the board.", "Alex", "The crew says you can skip the board because you are running the morning.", "The board", ["Sign in anyway, and have the crew do the same.", "The list is the headcount. A title is not an exemption."], ["Skip it. You know everyone’s name.", "Names are not the list."], ["Sign the book for the whole crew.", "You cannot sign people who are not there."]),
    apprentice: call("Following Mike does not replace the board.", "Mike", "Mike says to skip the board. You are with him.", "Signing in", ["Sign in anyway, then join Mike.", "The list is for the headcount."], ["Skip it. Mike said so.", "Mike’s word does not replace the board."], ["Sign Mike’s name as well as yours.", "You sign for yourself."]),
    other: call("The general path still starts at the board.", "Sarah", "Sarah is at the board. The crew is already on the slab.", "Sign-in", ["Sign in, then report to the slab.", "A minute behind is still a sign-in."], ["Go to the slab. They know your face.", "A face is not the list."], ["Wait in the truck until lunch.", "The morning starts at the board."]),
  },
  ppe: {
    labourer: call("Carrying gypsum still needs boots, gloves, and a clear view of the route.", "Mike", "Mike hands you a sheet of gypsum and says gloves slow you down.", "Material handling", ["Wear the gloves and boots, and get help if you cannot see over the sheet.", "Speed is not a reason to drop the kit."], ["Carry it bare-handed so you can grip.", "Grip is not a cut that needs stitches."], ["Drag it so you do not have to lift.", "Dragging it through the walkway blocks the exit."]),
    carpenter: call("A circular saw needs eyes, ears, and a guard, not just a vest.", "Mike", "The saw is ready. You have a vest on.", "The cut", ["Stop until eyes, ears, and the rest of the kit for this cut are on.", "The vest shows where you are. It does not stop a chip."], ["Cut. The vest is what the site cares about.", "The site cares about the chip too."], ["Take the guard off so the vest does not snag.", "The guard stays."]),
    electrician: call("Gloves for a panel are the ones the task names, and you still may not be cleared to open it.", "Sarah", "Sarah points at a panel and a pair of cotton gloves.", "Electrical PPE", ["Leave the panel closed. Cotton gloves are not authorization.", "This scene is not an electrical ticket."], ["Put the cotton gloves on and open it.", "The wrong glove on the wrong task is still the task."], ["Use your bare hands so you can feel the heat.", "Feeling for heat is not the control."]),
    plumber: call("A drain opening needs a plan, not a dust mask from the truck.", "Jordan", "Jordan asks you to look into an unventilated tank with a cloth over your face.", "A confined space", ["Stop. A tank is a confined-space question for the people authorized to enter.", "A cloth is not a plan. This is not a plumbing ticket."], ["Look in. You will hold your breath.", "Breath-holding is not ventilation."], ["Tie a rope to your belt and go.", "A rope is not a rescue plan."]),
    operator: call("The cab does not replace a vest when you are on the ground.", "Sam", "You step out of the cab area in a hoodie. Sam cannot pick you out against the machine.", "High visibility", ["Put the high-vis on before you stand near the machine.", "The cab glass is not a vest."], ["Stay in the hoodie. Sam knows you.", "Knowing you is not seeing you."], ["Stand closer so Sam can tell who you are.", "Closer is into the swing."]),
    welder: call("Hot work needs the eyes and the clothing the task names, and a hot-work check.", "Jordan", "The helmet is on the bench. The cut is beside the NL-14 can. There is no hot-work check on the board.", "Hot work", ["Stop. Helmet and clothing come with the site’s hot-work steps, and the can moves under that plan.", "A helmet is not a permit. This is not a welding ticket."], ["Weld. The can is closed.", "A closed can beside sparks is still fuel."], ["Point a fan at the can and start.", "A fan is not the hot-work plan."]),
    hvac: call("A chemical for the unit still needs the sheet’s protection, not the gloves you like.", "Jordan", "The unit needs a solvent. The only gloves on the bench are for winter.", "Product PPE", ["Read the sheet for the product before you choose gloves or open it.", "Winter gloves are a guess."], ["Use the winter gloves. They are thick.", "Thick is not the sheet."], ["Skip gloves so you can feel the fitting.", "Feel is not a control."]),
    roofing: call("A harness without a planned anchor is not fall protection.", "Sarah", "Someone hands you a harness and points at a pipe near the opening.", "Anchor", ["Stop. Use the site’s fall plan. A pipe is not an anchor you invent.", "This does not qualify you for roof work."], ["Clip to the pipe.", "A handy pipe is not the plan."], ["Skip the harness. You can see the edge.", "Seeing the edge is not a control."]),
    concrete: call("A dry concrete cut needs the respirator the task calls for, plus eyes and ears.", "Mike", "The saw is out. You have a hard hat. Mike says the wind will take the dust.", "Respiratory protection", ["Stop until eyes, ears, and the respirator are on.", "Wind is not the control. This does not authorize the saw."], ["Cut. The hat counts.", "The hat does not catch dust."], ["Hold a shirt over your mouth.", "A shirt is not a respirator."]),
    supervisor: call("Sending someone into a cut without the kit is the call you stop.", "Alex", "Alex is at the saw with a hat and sunglasses. The schedule says the cut is late.", "Stopping the cut", ["Stop the cut until the kit matches the dust, the chips, and the noise.", "A late schedule is not a reason to drop protection. A supervisor title here is not a certificate."], ["Let it go. Sunglasses are close enough.", "Close enough is how the chip gets through."], ["Tell them to hurry so the exposure is short.", "A short exposure is still the exposure."]),
    apprentice: call("Asking for the kit is the job. Guessing the kit is not.", "Mike", "Mike says any glasses will do for your first cut.", "Asking", ["Ask which eye protection, hearing protection, and respirator this cut needs, and wait.", "Any glasses is how sunglasses get used."], ["Use your sunglasses so you do not slow the crew.", "Sunglasses are not the task."], ["Start without asking. You will copy whoever is nearest.", "Copying a gap copies the gap."]),
    other: call("The kit follows the task in front of you, not a single favourite item.", "Sarah", "You are dressed for the street. The task on the board is a cut.", "Matching the task", ["Stop and match eyes, ears, dust protection, and the site’s clothing rule before the tool starts.", "Street clothes are not the assessment."], ["Start. You will feel if something is wrong.", "Feeling it is the injury."], ["Put on a vest and call it done.", "The vest is one piece."]),
  },
  hazards: {
    labourer: call("A stack in the walkway is a hazard even when you put it there.", "Mike", "The gypsum you were going to move is now across the exit.", "Housekeeping", ["Clear the exit before the next lift.", "The route comes before the next sheet."], ["Leave it until the pile is finished.", "A finished pile in the exit is still the exit."], ["Tell people to step over it.", "A route you climb is blocked."]),
    carpenter: call("Offcuts in the only walkway are the hazard, not a sign of a busy saw.", "Sarah", "Offcuts cover the walk to the exit.", "Walkway", ["Stop the mess from growing and clear a path people can use.", "Busy is not a control."], ["Kick them to the side without looking.", "Kicking them moves the trip."], ["Leave them. Cleanup is Friday.", "The exit is today."]),
    electrician: call("A damaged cord is a hazard even when the tool still runs.", "Mike", "The saw still runs on a cord with a cut jacket.", "Energy", ["Take the cord out of service. Do not tape it and keep cutting.", "Running is not the same as sound."], ["Tape the jacket.", "Tape hides the cut."], ["Keep using it until it stops.", "Stopping by shock is not the plan."]),
    plumber: call("An open edge at a trench is the hazard, even if the spoil pile looks stable.", "Sam", "Spoil sits at the edge of an unmarked trench.", "Excavation", ["Keep people back until the edge has the control the site planned.", "Spoil is not a barrier."], ["Walk the edge to see how deep it is.", "The edge is the fall."], ["Knock the spoil in to fill it.", "Filling it yourself can bury the control and the people."]),
    operator: call("A person in the swing is the hazard, even when the machine is moving slowly.", "Sam", "Someone steps into the swing while you are spotting.", "Swing", ["Signal stop and keep the path empty until you and Sam confirm it.", "Slow still meets the person."], ["Wave them through.", "A wave does not move them."], ["Honk and keep going.", "The horn is not a clearance."]),
    welder: call("Sparks beside a fuel can are the hazard, even when the can is closed.", "Jordan", "The NL-14 can, flame pictogram visible, sits beside the spark work.", "Ignition", ["Stop the sparks until the can is stored the way the label and the site require.", "Closed is not the same as away from ignition."], ["Keep welding. The lid is on.", "The lid does not move the fuel."], ["Fan the sparks away.", "A fan is not the control."]),
    hvac: call("A missing guard on a unit fan is a hazard, even if the unit is “almost done.”", "Mike", "The fan guard is on the floor. The unit is about to be switched on.", "Missing guard", ["Leave it off until the guard is back on.", "Almost done still has an open fan."], ["Switch it on for a second to test.", "A second is the exposure."], ["Stand to the side and let Alex switch it on.", "The side of an unguarded fan is still the fan."]),
    roofing: call("An unguarded opening is the hazard, even when you can see it.", "Sarah", "The opening has no cover. The work is on the far side.", "Opening", ["Stop and use the fall plan before anyone works beside it.", "Seeing it is not a cover."], ["Step around it.", "The step is the fall."], ["Drop a loose board over it.", "Loose is not a cover."]),
    concrete: call("Dust from a dry cut is the hazard, even outdoors.", "Mike", "The concrete saw is throwing a cloud across the walk.", "Airborne dust", ["Stop the cut until people are out of the cloud and the respirator the task needs is on.", "Outdoor is not the same as controlled."], ["Walk through the cloud. It settles.", "Walking through it is the exposure."], ["Wet the pile with a water bottle and keep cutting.", "A bottle is not the dust plan."]),
    supervisor: call("A hazard you walk past becomes the crew’s hazard.", "Alex", "You see the blocked exit and the cut cord on the way to the schedule board.", "Stopping the start", ["Hold the start until the exit is clear and the cord is out of service.", "The schedule can wait on a door and a cord."], ["Note it for the afternoon talk.", "The afternoon is after someone uses them."], ["Tell the crew to be careful.", "Careful is not a control."]),
    apprentice: call("A hazard you are unsure about is still reported.", "Mike", "You think the cord looks cut. Mike says it has always looked like that.", "Asking", ["Take it out of use and tell Sarah. Always is not an inspection.", "Unsure is a reason to stop, not to copy the last person."], ["Use it. Mike has used it.", "Used before is not sound today."], ["Hide it in the bin so nobody argues.", "Hiding it loses the cord and the lesson."]),
    other: call("If you can name the hazard, you can keep people out of it.", "Sarah", "You are not sure of your trade yet. The exit is blocked and a cord is cut.", "The general path", ["Keep people out of both and report them the way this site asks.", "You do not need a trade title to report a blocked door."], ["Wait until you are assigned a trade.", "The door does not wait."], ["Fix the cord yourself with tape.", "Tape is not the repair."]),
  },
  tools: {
    labourer: call("A bar with a mushroomed head does not go into the wall.", "Mike", "The chisel head is mushroomed. Mike says one more hole.", "Hand tool", ["Take it out of service.", "One more hole is how the splinter leaves the head."], ["Use it for one hole.", "One hole is the exposure."], ["Grind the head on the concrete and keep going.", "An unplanned grind is a new hazard."]),
    carpenter: call("A circular saw with a dull, binding blade comes off the cut.", "Sarah", "The saw binds and kicks. Sarah says to push harder.", "Binding saw", ["Stop, unplug if you can do that safely, and tag the saw out.", "Pushing harder is how the kick wins."], ["Push harder.", "Force is not a sharp blade."], ["Wedge the guard open so it stops binding.", "The guard stays."]),
    electrician: call("A meter with a cracked case does not go on a live check.", "Sarah", "The tester case is cracked. The task is to check a circuit you are not cleared to open.", "Test equipment", ["Stop. The cracked tester stays down, and the circuit stays for the person authorized to test it.", "A crack and a missing authorization are two reasons. This is not an electrical ticket."], ["Tape the case and test.", "Tape is not a case."], ["Use a screwdriver to see if it sparks.", "A spark test is the injury."]),
    plumber: call("A ladder used as a plank over a trench is not a tool in service.", "Sam", "Someone has laid the stepladder flat across the trench.", "Wrong use", ["Take the ladder out of that use and keep people off the trench.", "A ladder is not a bridge."], ["Walk across it. It is aluminium.", "Aluminium does not make it a bridge."], ["Add a second ladder beside it.", "Two ladders flat are still not a cover."]),
    operator: call("A machine with a dead backup alarm does not roll.", "Sam", "The backup alarm is silent. Sam says everyone knows to look.", "Alarm", ["Keep the machine parked until the alarm works.", "Everyone knows is not an alarm. This does not authorize you to run it."], ["Back up slowly.", "Slow and silent still meets someone."], ["Have Alex stand behind and shout.", "A person behind a reversing machine is the hazard."]),
    welder: call("A lead with a cracked jacket does not get taped for one more bead.", "Jordan", "The lead jacket is cracked. The bead is almost done.", "Damaged lead", ["Stop and take the lead out of service.", "Almost done is still a cracked lead."], ["Tape it for the last bead.", "Tape is not insulation."], ["Hold the crack closed with a glove.", "A glove is not a repair."]),
    hvac: call("A fan with the guard off is out of service, even for a balance check.", "Mike", "The guard is off so you can see the fan. Mike wants a ten-second run.", "Unguarded fan", ["Leave it off until the guard is on.", "Seeing the fan is not a reason to run it."], ["Run it for ten seconds.", "Ten seconds is the exposure."], ["Hold the guard in place by hand while it runs.", "Your hand is not the guard."]),
    roofing: call("A ladder with a cracked rail does not go up to the opening.", "Sarah", "The rail is cracked. The opening still needs a look.", "Damaged ladder", ["Take the ladder out of service. The opening still needs the fall plan, not a cracked rail.", "This does not qualify you to work at height."], ["Climb carefully on the good rail.", "One rail is not a ladder."], ["Have someone hold it while you climb.", "Holding it does not heal the rail."]),
    concrete: call("A saw guard that will not sit stays on the bench.", "Mike", "The concrete-saw guard will not close. The cut is marked.", "Guard", ["Take the saw out of service.", "A marked cut can wait. Tape is not a guard."], ["Tape the guard up and cut.", "Tape is not a guard."], ["Cut without it for this one line.", "One line is the exposure."]),
    supervisor: call("A tool the crew wants to “just finish with” is still out of service.", "Alex", "Alex asks to finish one cut on the saw with the broken guard.", "Out of service", ["The saw stays down. The schedule does not put a guard back.", "A supervisor title here is not a licence to waive the guard."], ["Allow one cut.", "One cut is the policy you just broke."], ["Let Alex decide. It is their tool.", "Their hands do not make a broken guard sound."]),
    apprentice: call("A tool you have not been shown stays in the locker.", "Mike", "Mike says the grinder is easy and you should try a pass.", "Authorization", ["Leave it. Ask for the person authorized to use it, and for the inspection.", "Easy is not a lesson. This does not authorize the grinder."], ["Try one pass while Mike watches from the truck.", "The truck is not supervision."], ["Watch a video and then grind.", "A video is not this site’s authorization."]),
    other: call("If you cannot name the defect, you still do not guess the tool is fine.", "Sarah", "A cord looks shine-worn. You do not know the tool well.", "Unsure", ["Set it aside and ask Mike to look before anyone plugs it in.", "Unsure is a reason to pause."], ["Plug it in and see.", "Seeing by shock is not a test."], ["Tape the shiny part.", "Tape hides the wear."]),
  },
  falls: {
    labourer: call("A step ladder is not a place to stand on the top cap while you pass a sheet up.", "Mike", "Mike asks you to stand on the top of the step ladder and take the gypsum.", "Ladder use", ["Stop. Get a method that does not put you on the top cap.", "The top is not a step. This does not qualify you for work at height."], ["Stand on the top. It is only one sheet.", "One sheet is the fall."], ["Have Alex do it. They are lighter.", "Lighter is not the control."]),
    carpenter: call("Reaching past the rails is the fall, even on a short ladder.", "Sarah", "The cut is just past the right rail. Sarah says to lean.", "Overreach", ["Climb down and move the ladder. Do not lean past the rails.", "The rails are the limit."], ["Lean. It is only a little.", "A little past the rails is the fall."], ["Have someone push the base while you lean.", "A moving base is a second problem."]),
    electrician: call("A ceiling opening for a fixture still needs the fall plan.", "Sarah", "The tile is out. The opening is above the ladder. You are not cleared for the circuit or the height.", "Opening overhead", ["Stop. The opening and the circuit stay for the people authorized for them.", "This is not an electrical ticket and it does not qualify you for the height."], ["Pop your head through to look.", "Your head through the opening is the exposure."], ["Stand on the top cap so you can see.", "The top cap is not a step."]),
    plumber: call("A ladder over a wet floor, in front of a trench, is two hazards.", "Sam", "The floor is wet and the trench is behind the ladder feet.", "Base", ["Move the task until the feet are on a sound, level base away from the edge.", "Wet and an edge do not cancel out."], ["Have Alex stand on the feet.", "Standing on the feet does not dry the floor or move the trench."], ["Climb quickly so the slip does not have time.", "Speed is not a dry floor."]),
    operator: call("Climbing the machine to see the roof is not access.", "Sam", "Sam says to climb the machine for a better view of the edge.", "Machine as a ladder", ["Stay on the ground. The view is not a reason to climb the machine.", "This does not authorize the machine or the height."], ["Climb the tracks.", "Tracks are not a ladder."], ["Stand on the bucket while it is raised a little.", "A raised bucket is not a platform."]),
    welder: call("A spark job at an edge still needs the fall plan before the hot-work steps.", "Jordan", "The bead is at an unguarded edge. The hot-work check is also missing.", "Edge and sparks", ["Stop both. Fall plan first, then the site’s hot-work steps.", "Two missing plans do not make one job. This is not a welding ticket."], ["Weld sitting down so the edge matters less.", "Sitting is not a guard."], ["Clip to the handrail that is lying on the deck.", "A rail on the deck is not an anchor."]),
    hvac: call("A roof unit does not get a visit by stepping off the ladder onto the curb.", "Mike", "The ladder is short of the curb. Mike says to step across.", "The step across", ["Stop. Set the access the site planned. Do not step across a gap.", "A gap is the fall. This does not authorize the unit."], ["Step across holding the unit.", "The unit is not a handhold you invent."], ["Pull the ladder up behind you.", "Now you have no way down."]),
    roofing: call("The opening is the job and the hazard. Seeing it is not the control.", "Sarah", "There is still no cover and no guard. The work is on the far side.", "Fall plan", ["Stop and use the site’s fall plan before anyone works beside the opening.", "This scene does not qualify you for roof work."], ["Step around it.", "The step is the fall."], ["Use a loose board as a cover.", "Loose is not a cover."]),
    concrete: call("A form edge above the slab is still a fall if there is no plan.", "Mike", "The form is above your head height. Mike says to walk the top to check the line.", "Walking the form", ["Stay off the top until the site’s fall plan covers that walk.", "A line you can see is not a guard."], ["Walk the top. It is wide.", "Wide is not the plan."], ["Have Alex walk it. They have better balance.", "Balance is not a control."]),
    supervisor: call("Sending a person up a cracked ladder is the call you refuse.", "Alex", "The rail is cracked. Alex says the inspection is in ten minutes and someone has to look now.", "Refusing the climb", ["The ladder stays down. The look waits for a sound ladder and the fall plan.", "Ten minutes is not a reason to climb a crack. A title here is not a height ticket."], ["Send Alex. They volunteered.", "Volunteering does not heal the rail."], ["Climb yourself so you do not ask them to.", "Your climb is the same fall."]),
    apprentice: call("You do not climb a ladder you have not been shown, on a task you have not been given.", "Mike", "Mike says to pop up the ladder and see what the roof looks like.", "Asking first", ["Stay down and ask Sarah whether that look is the task and whether the ladder is the access.", "Curious is not authorization."], ["Climb. It is only a look.", "A look is the climb."], ["Climb because Mike said it was fine.", "Fine is not the fall plan."]),
    other: call("Any task off the ground starts with the site’s rule for that height.", "Sarah", "You are asked to climb and you do not have a trade assignment yet.", "The general rule", ["Stay on the ground until Sarah names the access and the protection.", "No trade title does not mean you invent a climb."], ["Climb slowly.", "Slow is not a plan."], ["Use the nearest pipe as an anchor if you find a harness.", "A pipe you find is not an anchor."]),
  },
  whmis: {
    labourer: call("A can in the material pile is still a chemical.", "Jordan", "Northline Contact Adhesive NL-14 is lying in the gypsum pile, flame pictogram up.", "Product in the pile", ["Leave it closed and tell Jordan before the pile moves.", "The flame does not get buried under sheets."], ["Toss it to the side so you can lift.", "Tossing a can is how it leaks."], ["Open it to see if it is sticky enough to matter.", "Opening it is the exposure."]),
    carpenter: call("Adhesive for a fit-up is still NL-14, not “the usual glue.”", "Mike", "Mike says to glue the joint with the can that has a flame on it and skip the sheet.", "Before you open it", ["Read the label for Northline Contact Adhesive NL-14 and the precautions before anyone opens it.", "Usual glue is a guess."], ["Open it. Flame just means it dries fast.", "The flame is fire, not a dry time."], ["Smell it to see if it matches the last job.", "The last job is not this label."]),
    electrician: call("A solvent can beside a panel is an ignition question.", "Sarah", "The NL-14 can, flame and DANGER visible, sits against the panel.", "Ignition and a panel", ["Move people back and tell Sarah. Do not open the panel and do not open the can.", "You are not cleared for the panel, and the can does not stay against it."], ["Open the panel to see if it is warm.", "That is the unauthorized task plus the vapour."], ["Spray a little on a rag to wipe the panel.", "The rag is a new fuel."]),
    plumber: call("Adhesive for a pipe is not “whatever is in the unmarked jug.”", "Jordan", "An unmarked jug sits next to the labelled NL-14 can.", "Two containers", ["Use only the labelled can, and only after the label and sheet are read. Leave the jug closed.", "Unmarked means unknown."], ["Mix a little of each.", "Mixing unknowns is a reaction you do not get to name."], ["Smell the jug so you can decide.", "Smelling it is the exposure."]),
    operator: call("The can does not ride in the cab.", "Sam", "Someone set Northline Contact Adhesive NL-14 on the cab step.", "Cab", ["Take the task to Jordan. The can does not ride in the cab and does not sit on the step.", "A flame pictogram in the cab is fuel in a closed space. This does not authorize the machine."], ["Put it behind the seat so it does not fall.", "Behind the seat is still the cab."], ["Open the window and call it ventilated.", "A window is not the storage plan."]),
    welder: call("NL-14 and sparks do not share a bench.", "Jordan", "The can is on the weld bench. The flame pictogram faces the spark.", "Hot work and adhesive", ["Stop. Store the can under the site’s rule before any spark.", "This is not a welding ticket, and the can is fuel."], ["Weld on the far end of the bench.", "The far end is still the bench."], ["Cover the can with a rag and weld.", "A rag is more fuel."]),
    hvac: call("A solvent for a coil is identified before it is poured.", "Jordan", "Jordan thinks the NL-14 can might work as a cleaner.", "Wrong product", ["Stop. Northline Contact Adhesive NL-14 is an adhesive with a flame pictogram, not a cleaner you invent.", "The label decides the use."], ["Try a splash on the coil.", "A splash is the exposure and the wrong product."], ["Pour it into a spray bottle and label it cleaner.", "Relabelling it yourself is a new hazard."]),
    roofing: call("Adhesive at an edge is still stored closed, and the edge still has a fall plan.", "Sarah", "The NL-14 can is open beside an unguarded opening.", "Two controls missing", ["Close it if you can do that without leaning over the opening, get people back, and use the fall plan.", "An open can and an open edge are both stops."], ["Work from the edge so you can reach the can.", "Reaching over the opening is the fall."], ["Kick the can away from the edge.", "Kicking it spills it."]),
    concrete: call("Do not use the adhesive can to weight down a plastic sheet.", "Mike", "Mike sets the NL-14 can on a sheet so the wind does not take it.", "Storage", ["Take the can to the labelled storage. Use something that is not a flame pictogram as a weight.", "A product is not a brick."], ["Leave it. The lid is on.", "The lid does not make it a weight in the dust."], ["Open it so the smell keeps people away from the sheet.", "The smell is the exposure."]),
    supervisor: call("You do not tell a new person to smell the can.", "Alex", "Alex asks if they can smell Northline Contact Adhesive NL-14 to learn it.", "The shortcut", ["No. Show them the label and the headings for precautions and protection.", "A title here is not a WHMIS sign-off."], ["Let them smell it once.", "Once is the exposure."], ["Tell them any adhesive smells the same.", "Same smell is a guess."]),
    apprentice: call("You ask where the precautions are. You do not guess.", "Mike", "Mike says the flame just means it is strong, and any gloves will do.", "Asking", ["Ask to read the label and the exposure controls together before the can opens.", "Strong is not a glove."], ["Put on any gloves and open it.", "Any glove is the guess."], ["Smell it so you can tell Mike what it is.", "The label already tells you."]),
    other: call("The general rule is the label you can already read.", "Jordan", "You can see Northline Contact Adhesive NL-14, a flame, and DANGER.", "The label", ["Leave it closed and use that name to find the sheet.", "You do not need a trade title to refuse a sniff."], ["Sniff it.", "The label is the name."], ["Pour a little out to see the colour.", "Pouring it is the spill."]),
  },
  conduct: {
    labourer: call("A joke that blocks the exit is not a joke.", "Mike", "Someone stacks the gypsum in front of the door and laughs.", "The exit", ["Clear the door and say the exit stays open.", "The laugh does not move the sheets."], ["Laugh and leave it.", "Leaving it keeps the route blocked."], ["Add your sheet to the stack.", "You just joined the block."]),
    carpenter: call("Noise is not an excuse to skip the read-back.", "Sarah", "The saw is loud. Sarah’s instruction did not land and the crane is about to move.", "Read-back", ["Stop the move. Show the plan again and ask for a read-back.", "Volume is not clarity."], ["Accept the nod.", "A nod is not a read-back."], ["Shout the same words faster.", "Faster is not clearer."]),
    electrician: call("You do not open a panel because someone dares you.", "Alex", "Alex says you are not a real electrician until you open the panel.", "Pressure", ["Leave it closed. A dare is not authorization.", "This scene is not an electrical ticket."], ["Open it so the joke stops.", "The joke stops when you refuse."], ["Let Alex open it to prove the point.", "That hands them the same hazard."]),
    plumber: call("Sending a new person into a tank is not a favour.", "Mike", "Mike says Alex should just pop into the tank and look.", "Confined space", ["Stop it. A tank entry is for the people authorized, with the site’s plan.", "A look is an entry."], ["Let Alex go. They volunteered.", "Volunteering is not a plan."], ["Go yourself so Alex does not have to.", "Your entry is the same hazard."]),
    operator: call("You do not let a spotter stand where you cannot see them.", "Sam", "The spotter steps behind the machine and says they will shout.", "The blind spot", ["Stop the move until the spotter is where you can see them, outside the swing.", "A shout from a blind spot is still a blind spot. This does not authorize the machine."], ["Keep moving if they shout.", "The shout arrives late."], ["Have them stand closer behind you.", "Closer behind is worse."]),
    welder: call("Horseplay with a spark tool stops, even when the bead is going well.", "Jordan", "Someone flicks a spark toward Alex “as a joke.”", "Horseplay", ["Stop the spark work and move the joke off the bench.", "A spark is not a punchline."], ["Flick one back.", "A second spark is the same hazard."], ["Film it.", "The clip does not catch the burn."]),
    hvac: call("A language gap on a start-up is a stop, not a louder voice.", "Sarah", "The start-up instruction did not land. The unit is about to be switched on.", "Read-back", ["Stop the start. Show the step and ask them to say back what they will do.", "Louder is not clearer."], ["Switch it on. They nodded.", "A nod is not a read-back."], ["Take them off the crew without explaining.", "Removing them hides the gap."]),
    roofing: call("You do not tease someone off an opening.", "Alex", "Alex is near the unguarded opening. Someone tells them to stop being slow.", "Pressure at an edge", ["Stop the talk and get people back from the opening.", "Slow is not the hazard. The opening is. This does not qualify you for roof work."], ["Tell Alex to hurry across.", "Hurrying is the fall."], ["Laugh so they loosen up.", "The laugh does not add a cover."]),
    concrete: call("Dust in someone’s face is not a prank.", "Mike", "A person aims the concrete-saw cloud at Alex.", "The cloud", ["Stop the saw. The cloud is an exposure, not a joke.", "Aiming it is the hazard."], ["Tell Alex to hold their breath.", "Breath-holding is not a respirator."], ["Film the cloud.", "The clip does not filter the air."]),
    supervisor: call("You stop the mockery when you hear it.", "Jordan", "A worker’s accent is mocked every time they ask a question.", "Harassment", ["Tell them to stop. If it continues, use the workplace process.", "Questions stop when mockery is the answer. This scene is practice, not the complaint itself."], ["Laugh so you stay liked.", "Laughing takes a side."], ["Post a clip.", "A public clip is not the process."]),
    apprentice: call("You can refuse a machine you have not been trained on.", "Mike", "Mike says the grinder is easy and the schedule needs it.", "Refusing", ["Leave the grinder. Tell Sarah you have not been cleared for it.", "Easy is not training. This does not authorize the tool."], ["Try it so Mike is not annoyed.", "Annoyance is not a guard."], ["Ask Alex to do it with you.", "Two unauthorized people are still unauthorized."]),
    other: call("Fitting in does not include a shove near the stair.", "Mike", "Someone shoves a worker near the stair and says it is only messing around.", "Horseplay", ["Tell them to stop, and move the joke away from the stair.", "The stair is not a set."], ["Shove them back.", "A second shove is the same hazard."], ["Film it for the chat.", "The chat does not catch the fall."]),
  },
  report: {
    labourer: call("A sheet that fell and missed someone is still a report.", "Sarah", "The gypsum missed Alex. Nobody is hurt.", "Near miss", ["Stop the work underneath and report the near miss the way this site asks.", "No injury is not no report."], ["Call it luck.", "Luck is the next sheet."], ["Hide the cracked sheet.", "Hiding it loses the cause."]),
    carpenter: call("A kickback that missed your hand is still a report.", "Mike", "The saw kicked and missed you.", "Near miss", ["Stop, tag the saw if it is damaged, and report what happened.", "A miss is the report."], ["Finish the cut. It missed.", "The next kick may not."], ["Blame the wood and move on.", "The wood does not file the report."]),
    electrician: call("A shock that “wasn’t much” is still a report.", "Sarah", "Alex says the panel tingled and they are fine.", "A shock", ["Stop work on that panel and report it. You still do not open the panel yourself.", "Fine is not an assessment. This is not an electrical ticket."], ["Tell them to shake it off.", "Shaking it off hides the fault."], ["Try the same spot to see if it tingles for you.", "A second person is a second exposure."]),
    plumber: call("A collapse of spoil that missed the trench crew is still a report.", "Sam", "Spoil slid and stopped short of the people in the trench.", "Near miss", ["Get the people out and report it before anyone goes back.", "Short of them is still the report."], ["Leave them working. It stopped.", "The next slide may not."], ["Push the spoil back and say nothing.", "Pushing it hides the edge."]),
    operator: call("A swing that missed a person is still a report.", "Sam", "The bucket passed where a worker had been standing.", "Near miss", ["Stop the machine and report the near miss. Do not roll again until the path is clear.", "A miss is the report. This does not authorize the machine."], ["Keep going. They moved.", "They moved is the luck."], ["Tell them not to tell Sarah.", "Hiding it keeps the swing."]),
    welder: call("A spark that caught a rag, even if you stamped it out, is still a report.", "Jordan", "The rag smoked and went out.", "Near miss", ["Report it and move fuel, including the NL-14 can, under the hot-work steps.", "Out now is not a reason to skip the report."], ["Stamp it and keep welding.", "The next rag may not go out."], ["Hide the rag.", "The rag is the evidence of the fuel."]),
    hvac: call("A guard that fell off and missed a hand is still a report.", "Mike", "The fan guard dropped and missed Alex.", "Near miss", ["Stop the unit and report it before anyone restarts.", "A miss does not put the guard back."], ["Clip it on and start.", "A clip you invent is not the guard."], ["Say nothing so the start-up stays on time.", "On time is how the next drop hits."]),
    roofing: call("A board that slid toward an opening is still a report.", "Sarah", "The loose board slid and stopped before the opening.", "Near miss", ["Keep people back from the opening and report it. Do not call the board a cover.", "Stopped short is the report. This does not qualify you for roof work."], ["Slide it back and keep working.", "Back is still loose."], ["Stand on it so it cannot move.", "You are now the weight on a loose board."]),
    concrete: call("A cloud that sent someone coughing, with no other injury, is still a report.", "Mike", "Alex coughed through the dry-cut cloud and says they are fine.", "Exposure", ["Stop the cut and report the exposure the way this site asks.", "Fine is not a respirator."], ["Tell them to drink water and continue.", "Water does not undo the dust."], ["Aim the cloud the other way and keep cutting.", "The other way still has people."]),
    supervisor: call("A near miss does not wait for a quieter day.", "Alex", "Two near misses happened before lunch. Alex says the report can wait until Friday.", "The same day", ["Report them today, the way this site asks.", "Friday is how the third one becomes an injury. A title here is not a reason to delay."], ["Wait for Friday.", "The crew is still in the hazard."], ["Write it down and keep it in your pocket.", "A pocket is not the process."]),
    apprentice: call("You can report a miss even if you caused it.", "Sarah", "You knocked a tool off the scaffold. It missed Mike.", "Owning the miss", ["Tell Sarah what fell, from where, and that Mike was below.", "The report is how the next drop gets a control."], ["Say nothing. It missed.", "Missed is the luck."], ["Ask Alex to say they did it.", "Handing the story off hides the cause."]),
    other: call("You do not need a trade title to report a near miss.", "Sarah", "A tool fell and missed someone. You are still on the general path.", "Near miss", ["Stop the work underneath and report it.", "The title can wait. The report cannot."], ["Call it luck.", "Luck is the next drop."], ["Wait until you are assigned a trade.", "The drop already happened."]),
  },
  emergency: {
    labourer: call("A sheet on fire in the waste pile is still an alarm, not a bucket you invent.", "Jordan", "The waste gypsum is smoking. You do not know the extinguisher for it.", "Alarm", ["Raise the alarm and leave by the route you were shown.", "A bucket you guess is not the plan."], ["Throw water on it.", "You do not know what is in the pile."], ["Pull the pile apart with your hands.", "Your hands are now in the smoke."]),
    carpenter: call("The saw smoking is a stop and an alarm, not one more cut.", "Mike", "The saw motor is smoking.", "Equipment fire", ["Kill the power if you can do that safely, raise the alarm, and leave if it grows.", "One more cut feeds it."], ["Finish the cut. Smoke means it is working hard.", "Working hard is the fire."], ["Pour a water bottle into the motor.", "Water in a live tool is a new hazard."]),
    electrician: call("You do not enter a smoking electrical room.", "Sarah", "Smoke is coming from the panel room. You are not authorized for the panel.", "Smoke", ["Raise the alarm and stay out. Tell Sarah what you saw from the door.", "This is not an electrical ticket, and it is not a reason to open the panel."], ["Open the panel and look.", "Looking is the exposure."], ["Spray an extinguisher into the panel.", "The wrong extinguisher in a panel is the next injury."]),
    plumber: call("A trench collapse is an alarm, not a jump in to dig.", "Sam", "The trench wall moved and someone is at the edge.", "Collapse", ["Keep everyone back and raise the alarm. Do not jump in.", "A rescue without a plan becomes two people in the trench."], ["Jump in and dig.", "You are now the second victim."], ["Drive the machine closer to scoop them.", "The machine on the edge is the next collapse."]),
    operator: call("The alarm means the machine stops, even in the middle of a pick.", "Sam", "The alarm sounds while a load is in the air.", "Stop", ["Stop the pick in the safest way you have been authorized to, and leave the cab by the route if the alarm says to leave.", "Finishing the pick is not the muster. This does not authorize a new operator."], ["Finish the pick, then leave.", "The alarm already sounded."], ["Lower the load onto the muster path.", "The muster path stays clear."]),
    welder: call("A cylinder that falls and hisses is an alarm, not a wrench you grab.", "Jordan", "A bottle fell and is hissing.", "Release", ["Raise the alarm, keep people back, and leave if that is the plan. Do not tighten it yourself.", "A hiss is the release. This is not a welding ticket."], ["Tighten the valve.", "Your face is now at the release."], ["Roll it outside through the crowd.", "The crowd is now in the gas."]),
    hvac: call("A chemical odour from a unit is an alarm, not a filter you pull.", "Jordan", "A sharp odour comes from the unit and you cannot name it.", "Unknown release", ["Get people out and raise the alarm. Do not pull the panel.", "Unknown means you do not open it."], ["Pull the panel to see.", "Seeing it is the exposure."], ["Spray air freshener.", "Freshener hides the warning."]),
    roofing: call("An alarm while you are near an opening means the route, not a shortcut across the hole.", "Sarah", "The alarm sounds. The opening is between you and the ladder.", "The route", ["Use the route you were shown. Do not cross the opening.", "A shortcut across the hole is the fall. This does not qualify you for roof work."], ["Jump the opening to save time.", "The jump is the fall."], ["Hide behind a curb until it stops.", "The count will mark you missing."]),
    concrete: call("Dust so thick you cannot see the exit is an alarm, not a harder cut.", "Mike", "The dry cut has filled the bay. You cannot see the door.", "The cloud", ["Stop the saw if you can do that safely, and leave by the route you can still find. Tell people to stay out.", "Another pass makes the cloud."], ["Keep cutting so you finish faster.", "Faster is more dust."], ["Walk people through the cloud to the door.", "Walking them through is the exposure."]),
    supervisor: call("You do not send someone back in for a phone.", "Alex", "The alarm is sounding. Alex wants to go back for a phone.", "Muster", ["Take Alex out with you. The phone stays.", "A title here is not a reason to waive the route."], ["Let them run back.", "The phone is how the count fails."], ["Go back yourself.", "Your return is the same miss."]),
    apprentice: call("You follow the route even if Mike is still talking.", "Mike", "Mike is mid-sentence when the alarm starts. He says to hang on.", "The alarm", ["Leave. Tell Mike the alarm already won.", "Hang on is how you miss the count."], ["Wait until he finishes.", "The sentence can wait."], ["Ask what the alarm means before you move.", "The route is the meaning you were shown."]),
    other: call("You do not need a trade to know the muster point.", "Jordan", "The alarm sounds. You have not been assigned a trade.", "Muster", ["Leave by the route you were shown and go to the muster point.", "The assignment can wait."], ["Stay until someone tells your trade what to do.", "The alarm already told you."], ["Look for the smoke first.", "The smoke is not the muster."]),
  },
  shift: {
    labourer: call("The morning for a labourer is the board, the exit, and the load path.", "Sarah", "You signed in. The exit is blocked by the sheets you are about to move, and a load is hanging over the door.", "The morning", ["Clear the exit, keep people out from under the load, and then move the sheets with help.", "The door and the load come before the pile."], ["Move the sheets first, under the load.", "Under the load is the injury."], ["Leave both until lunch.", "Lunch is after someone uses the door."]),
    carpenter: call("The morning for a carpenter is a sound saw and a clear walk.", "Mike", "The saw guard will not sit, the walk is full of offcuts, and the exit is behind them.", "The morning", ["The saw stays down and the walk to the exit gets cleared before any cut.", "A marked cut can wait."], ["Cut first and clean up after.", "After is how someone trips on the way out."], ["Take the guard off so the offcuts are the only problem.", "Now you have two problems."]),
    electrician: call("The morning does not include opening a panel you are not cleared for.", "Sarah", "The cord is cut, the panel is open, and the crew wants power.", "The morning", ["The cord comes out of service. The panel stays for the person authorized to close it.", "Power is not a reason to land a breaker. This is not an electrical ticket."], ["Land a breaker so the saw can run.", "The saw can wait."], ["Tape the cord and close the panel door without looking.", "Tape and a shut door hide both faults."]),
    plumber: call("The morning trench is an edge, not a start.", "Sam", "The trench is open, the ladder across it is flat, and the spoil is at the lip.", "The morning", ["Keep people back, get the ladder out of that use, and wait for the control the site planned.", "This is not a plumbing ticket."], ["Cross on the ladder.", "The ladder is not a bridge."], ["Start the pipe run in the trench.", "The edge is still moving."]),
    operator: call("The morning machine stays parked until the alarm and the spotter are right.", "Sam", "The backup alarm is silent and a person is in the swing.", "The morning", ["The machine stays parked. The person comes out of the swing. You do not drive it.", "Silent and occupied is a stop. This does not authorize the machine."], ["Back up slowly with a shout.", "A shout is not an alarm."], ["Move the person by swinging the bucket.", "The bucket is not a pointer."]),
    welder: call("The morning spark waits on the hot-work steps and the NL-14 can.", "Jordan", "The can of Northline Contact Adhesive NL-14 is on the bench and the hot-work check is blank.", "The morning", ["No spark until the can is stored and the site’s hot-work steps are done.", "This is not a welding ticket."], ["Weld on the far corner.", "The corner is still the bench."], ["Open the can so you know how close is too close.", "Opening it is the exposure."]),
    hvac: call("The morning start-up waits on the guard and a read-back.", "Sarah", "The fan guard is off and the person at the switch cannot say back the step.", "The morning", ["The unit stays off until the guard is on and the step is repeated back.", "A start is not a guess."], ["Switch it on and talk after.", "After is the exposure."], ["Hold the guard by hand for the start.", "Your hand is not the guard."]),
    roofing: call("The morning edge waits on the fall plan.", "Sarah", "The opening is uncovered and someone is already walking toward it with a sheet.", "The morning", ["Stop the walk. Use the site’s fall plan before the sheet moves.", "This does not qualify you for roof work."], ["Walk the sheet around the hole.", "Around is still beside it."], ["Cover it with the sheet, loose.", "Loose is not a cover."]),
    concrete: call("The morning cut waits on the respirator and a sound guard.", "Mike", "The concrete saw guard will not sit and nobody has a respirator.", "The morning", ["The saw stays down until the guard sits and the respirator the task needs is on.", "This does not authorize the saw."], ["Cut upwind.", "Upwind is not a respirator."], ["One quick cut without either.", "Quick is the exposure."]),
    supervisor: call("The morning you run still starts with the board and a stop you are willing to make.", "Alex", "The crew wants to skip the board, use the cut cord, and smell the NL-14 can so the schedule moves.", "The morning", ["The board happens, the cord stays down, and nobody smells the can.", "A title in this game is not a licence to waive those."], ["Allow all three so the hour is not lost.", "The hour is how someone gets hurt."], ["Allow the cord only.", "One waiver teaches the next."]),
    apprentice: call("The morning you are new is a morning of asking.", "Mike", "Mike says to skip the board, try the grinder, and sniff the can if you are unsure.", "The morning", ["Sign in, leave the grinder, and read the label instead of sniffing.", "Unsure is the question, not the exposure."], ["Do all three so you look willing.", "Willing is how the gap spreads."], ["Do the grinder only.", "Only is still unauthorized."]),
    other: call("The general morning is sign-in, a clear exit, and a label you do not sniff.", "Sarah", "The board is waiting, the exit is blocked, and Northline Contact Adhesive NL-14 is open.", "The morning", ["Sign in, clear the exit or get help, and keep people off the open can until Jordan has the sheet.", "You do not need a trade title for those three."], ["Skip the board and wipe the can.", "Both are the wrong way around."], ["Wait in the truck.", "The truck is not the muster or the board."]),
  },
};

export function tradeCall(moduleId: string, trade: Trade | null): TradeCall | null {
  return LESSONS[moduleId]?.[trade ?? "other"] ?? null;
}

export function tradesInBank(): Trade[] {
  return TRADES;
}

const AREA_LINES: Record<string, Record<Trade, string>> = {
  office: {
    labourer: "Sign in before you touch the gypsum. The pile can wait.",
    carpenter: "Sign in before the saw comes out of the case.",
    electrician: "Sign in. The open panel by the trailer is not your first job.",
    plumber: "Sign in. Do not cross the trench to get here faster.",
    operator: "Sign in. Leave the idling machine for Sam.",
    welder: "Sign in. Tell me about those loose bottles before you roll them.",
    hvac: "Sign in. Leave the unlabelled can on the step alone.",
    roofing: "Sign in. The floor opening on the way here is a stop, not a step.",
    concrete: "Sign in. That dry saw does not start until the talk and the kit.",
    supervisor: "Sign in yourself. A title does not take your name off the board.",
    apprentice: "Sign in even if Mike already walked past the board.",
    other: "Sign in, then walk the yard with me. Do not cut across.",
  },
  building: {
    labourer: "The sheets do not go under that load, and they do not block the door.",
    carpenter: "Offcuts do not pile up in this walkway.",
    electrician: "The cord with the cut jacket does not feed a saw in here.",
    plumber: "Spoil does not sit on the edge of the trench beside this door.",
    operator: "Nobody stands under the pick, including the person spotting.",
    welder: "No sparks in here while the NL-14 can is in the building.",
    hvac: "The fan guard goes back on before anyone stands under the unit.",
    roofing: "The opening inside stays covered or guarded before the sheets move.",
    concrete: "The dust cloud does not get aimed through this door.",
    supervisor: "If the door is blocked, the crew does not start.",
    apprentice: "If you are unsure about the load, you stop and ask. You do not stand under it.",
    other: "Watch the load. Nobody stands under it.",
  },
  ladder: {
    labourer: "You do not stand on the top cap to pass gypsum up.",
    carpenter: "Move the ladder. Do not lean past the rails for the cut.",
    electrician: "A ceiling opening is not a reason to climb a ladder you are not cleared to use.",
    plumber: "Wet feet and a trench behind the ladder are a stop.",
    operator: "The machine is not a ladder. Stay on the ground.",
    welder: "No spark at this edge until the fall plan and the hot-work steps are both done.",
    hvac: "Do not step from the ladder onto the curb.",
    roofing: "This opening still needs the site’s fall plan. Seeing it is not the plan.",
    concrete: "Do not walk the top of the form to sight the line.",
    supervisor: "A cracked rail stays down, even if the look is late.",
    apprentice: "Ask before you climb. A look is still a climb.",
    other: "That ladder is the job for today only if it is set right.",
  },
  electrical: {
    labourer: "The panel stays shut while you move material past it.",
    carpenter: "Do not plug the saw into a cord with a cut jacket, and do not open the panel to find another outlet.",
    electrician: "If you are not authorized for this panel, you do not open it. This is not a ticket.",
    plumber: "A wet floor in front of this panel is a stop, not a mop you invent while it is open.",
    operator: "The machine does not get power from a panel you are not cleared to touch.",
    welder: "No spark work against this panel, and the NL-14 can does not sit here.",
    hvac: "The unit does not get a test start from a panel you are not cleared to open.",
    roofing: "A lead draped over the opening and into this panel is two stops.",
    concrete: "The saw does not get plugged in here until the cord is sound.",
    supervisor: "You do not tell a new person to open this panel so the schedule moves.",
    apprentice: "A dare to open the panel is a dare you refuse.",
    other: "If you are not authorized for this panel, you do not open it.",
  },
  tools: {
    labourer: "A mushroomed chisel stays in the bin.",
    carpenter: "A binding saw comes off the cut.",
    electrician: "A cracked tester does not go on a circuit, and you may not be the person who tests it.",
    plumber: "The ladder does not become a bridge.",
    operator: "A silent backup alarm keeps the machine parked.",
    welder: "A cracked lead does not get one more bead.",
    hvac: "A fan without a guard does not get a test run.",
    roofing: "A cracked rail does not go up.",
    concrete: "A guard that will not sit means the saw stays here.",
    supervisor: "“Just finish the cut” does not put a guard back on.",
    apprentice: "A tool you have not been shown stays in the locker.",
    other: "Check it before you carry it. If you are unsure, set it aside.",
  },
  chemical: {
    labourer: "NL-14 in the gypsum pile stays closed until Jordan sees it.",
    carpenter: "The flame on Northline Contact Adhesive NL-14 is not a reason to skip the sheet.",
    electrician: "That can does not sit against the panel.",
    plumber: "The unmarked jug beside NL-14 stays closed. Do not mix them.",
    operator: "The can does not ride in the cab.",
    welder: "NL-14 and sparks do not share this bench.",
    hvac: "NL-14 is not a cleaner you invent for the coil.",
    roofing: "An open can does not sit beside the opening.",
    concrete: "The can is not a weight for the plastic sheet.",
    supervisor: "Nobody on your crew smells the can to learn it.",
    apprentice: "Ask where the precautions are. Do not sniff Northline Contact Adhesive NL-14.",
    other: "Read the label before you move the can.",
  },
  excavation: {
    labourer: "Sheets do not get stacked on the spoil at the edge.",
    carpenter: "Offcuts do not fill a trench.",
    electrician: "A lead does not run across the trench as a shortcut.",
    plumber: "The edge stays back until the control is in place. This is not a ticket to enter.",
    operator: "The machine stays back from the lip.",
    welder: "No spark work on the lip.",
    hvac: "The unit does not get set on the spoil.",
    roofing: "A trench edge is the same idea as the opening: seeing it is not a cover.",
    concrete: "Wash water and concrete slurry do not get dumped in the trench.",
    supervisor: "You do not send someone in to “just look.”",
    apprentice: "If Mike says to hop in, you still ask Sarah.",
    other: "The edge is unmarked. Stay back until the control is in place.",
  },
  equipment: {
    labourer: "You do not carry a sheet through the swing.",
    carpenter: "The saw does not get set up in the swing.",
    electrician: "You do not run a lead through the swing to save a walk.",
    plumber: "Pipe does not get stacked where Sam cannot see past it.",
    operator: "If you cannot see the operator, the operator cannot see you. This does not authorize the machine.",
    welder: "No spark work in the swing.",
    hvac: "The unit does not get landed in the swing.",
    roofing: "A sheet in the wind does not cross the swing.",
    concrete: "The saw does not throw dust across the operator’s view.",
    supervisor: "A person in the swing stops the machine, schedule or not.",
    apprentice: "Do not stand behind the machine to prove Sam can hear you.",
    other: "If you cannot see the operator, the operator cannot see you.",
  },
  emergency: {
    labourer: "If the alarm sounds, the gypsum stays where it is.",
    carpenter: "If the alarm sounds, the saw stops and you leave.",
    electrician: "If you see smoke at a panel, you raise the alarm and stay out.",
    plumber: "If the trench moves, you keep people back and raise the alarm.",
    operator: "If the alarm sounds, the pick stops. You do not finish it.",
    welder: "A hissing bottle is an alarm, not a valve you grab.",
    hvac: "An unknown odour from a unit is an alarm, not a panel you pull.",
    roofing: "The alarm means the route you were shown, not a jump across the opening.",
    concrete: "If the dust hides the door, you stop the saw and leave.",
    supervisor: "You do not send anyone back for a phone.",
    apprentice: "Leave even if Mike says to hang on.",
    other: "Alarm, route, muster. The plan beats a guess.",
  },
  firstaid: {
    labourer: "Know the attendant before a sheet drops on a hand.",
    carpenter: "Know the attendant before the saw kicks.",
    electrician: "A tingle from a panel is a report and a trip to the attendant, not a shrug.",
    plumber: "Know the attendant before anyone goes near the trench.",
    operator: "Know the attendant before the machine rolls.",
    welder: "A burn from a spark goes to the attendant with the product name if a chemical was involved.",
    hvac: "Product on the skin means the attendant and the name on the label, Northline Contact Adhesive NL-14 if that was the can.",
    roofing: "Know the attendant before anyone works beside the opening.",
    concrete: "A coughing fit from the dust is a reason to stop and get the attendant, not a reason to keep cutting.",
    supervisor: "You learn the attendant’s name yourself. You do not delegate the muster list.",
    apprentice: "Ask who the attendant is today before you ask to use a tool.",
    other: "Know who the attendant is before someone is hurt.",
  },
};

export function areaSpeech(areaId: string, trade: Trade | null, fallback: string): string {
  return AREA_LINES[areaId]?.[trade ?? "other"] ?? fallback;
}

export function tradeRadio(trade: Trade | null): RadioCall | null {
  const id = trade ?? "other";
  const scene = LESSONS.conduct[id];
  if (!scene) return null;
  return {
    id: `trade-${id}`,
    from: scene.speaker,
    call: scene.line,
    options: scene.options,
  };
}

export function tradeToolbox(trade: Trade | null): ToolboxScenario | null {
  const id = trade ?? "other";
  const scene = LESSONS.shift[id];
  if (!scene) return null;
  return {
    id: `trade-${id}`,
    work: `Your morning: ${tradeTitleSafe(id)}`,
    hazards: [scene.review, "A blocked exit", "A damaged tool left in service"],
    ppe: ["The protection the task names", "High-vis where machines are moving"],
    controls: ["Stop the job that is missing a control", "Keep people out of the line of fire"],
    equipment: ["A tool that has been checked", "A guard that sits"],
    emergency: ["The route you were shown", "Who has first aid"],
    decoys: ["Skip the sign-in board", "Smell the can to learn it", "One quick cut without the guard", "A shirt instead of a respirator"],
    briefing: `${scene.lesson} This talk is practice for a ${tradeTitleSafe(id)}. It does not certify that trade. The real briefing is the one your supervisor gives on that site.`,
  };
}

function tradeTitleSafe(trade: Trade): string {
  const names: Record<Trade, string> = {
    labourer: "general labourer",
    carpenter: "carpenter",
    electrician: "electrician",
    plumber: "plumber",
    operator: "equipment operator",
    welder: "welder",
    hvac: "HVAC",
    roofing: "roofing",
    concrete: "concrete",
    supervisor: "supervisor",
    apprentice: "apprentice",
    other: "general site path",
  };
  return names[trade];
}
