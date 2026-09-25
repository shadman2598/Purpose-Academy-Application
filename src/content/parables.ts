export type ParableId =
  | "signin"
  | "gate"
  | "ask"
  | "housekeeping"
  | "ppe"
  | "hierarchy"
  | "cord"
  | "opening"
  | "ladder"
  | "report"
  | "stop"
  | "alarm"
  | "label"
  | "spill"
  | "talk"
  | "load"
  | "dust";

export function parableFor(text: string): { id: ParableId; story: string } {
  const t = text.toLowerCase();
  if (/cord/.test(t) && /unlabelled|chemical/.test(t) && /load/.test(t)) {
    return { id: "load", story: "Before the crew starts, Alex spots the cut cord, the blocked exit, the missing eye protection, the can with no name, and the person under the load." };
  }
  if (/sunglass|goggle|respirator|harness|high-vis|glove|hard hat|footwear|ppe|gear/.test(t)) {
    return { id: "ppe", story: "Alex grabs the sunglasses from the truck. Sarah hands over the goggles the cut actually needs." };
  }
  if (/dust|concrete|silica|water suppression/.test(t)) {
    return { id: "dust", story: "The dry cut throws a cloud. The same cut with water on the blade keeps the cloud down." };
  }
  if (/hierarch|elimination|substitution|guardrail|higher control|be careful/.test(t)) {
    return { id: "hierarchy", story: "The opening can be covered. The harness stays in the box until a cover is not possible." };
  }
  if (/opening|fall|edge|unprotected/.test(t)) {
    return { id: "opening", story: "The cover is beside the hole. Until it is on the hole, the fall is still there." };
  }
  if (/ladder|cracked rail|bent rail|rung/.test(t)) {
    return { id: "ladder", story: "The rail is cracked. Alex leaves it and takes the stair." };
  }
  if (/cord|tape|guard|out of service|damaged tool/.test(t)) {
    return { id: "cord", story: "Tape goes toward the cut cord. It comes off. The cord goes on the out-of-service hook." };
  }
  if (/sign in|signing in|the board|headcount|skip the board/.test(t)) {
    return { id: "signin", story: "Mike waves Alex past the board. Alex still stops and signs in." };
  }
  if (/fence|the gate|site access/.test(t)) {
    return { id: "gate", story: "The gap in the fence is shorter. Alex walks the long way, through the gate." };
  }
  if (/scrap|housekeep|trip|walkway|coiled/.test(t)) {
    return { id: "housekeeping", story: "Offcuts sit in the only path. Alex moves them to the bin before anyone walks through." };
  }
  if (/alarm|muster|fire|leave by the route/.test(t)) {
    return { id: "alarm", story: "The alarm sounds. Alex leaves the tool and walks to the muster point." };
  }
  if (/spill|sniff|smell|wipe/.test(t)) {
    return { id: "spill", story: "The can is on its side. Alex steps back and calls it in, instead of wiping it up." };
  }
  if (/label|sds|pictogram|chemical|adhesive|whmis|unlabel/.test(t)) {
    return { id: "label", story: "The can has no name. Alex does not lean in. Alex goes to the label and the sheet." };
  }
  if (/report|tell someone|who you tell|supervisor/.test(t)) {
    return { id: "report", story: "Alex can pick up the board. The damaged cord is a different story, so Alex tells Sarah." };
  }
  if (/stop the|stop work|get people out|refuse/.test(t)) {
    return { id: "stop", story: "The guard will not sit. The blade stops. The crew steps back." };
  }
  if (/load|suspended|under a/.test(t)) {
    return { id: "load", story: "The load is still in the air. Alex steps out from under it." };
  }
  if (/\bask before\b|did not hear|harassment|conversation|shortcut/.test(t)) {
    return { id: "talk", story: "Alex did not hear the instruction. Alex asks, and waits, before moving." };
  }
  return { id: "ask", story: "Alex is about to move. Sarah shows the step on the yard before anyone starts." };
}
