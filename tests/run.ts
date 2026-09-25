import assert from "node:assert/strict";
import { concreteReady } from "../src/content/gear";
import { jurisdictionApplies, jurisdictionHeading } from "../src/content/jurisdiction";
import { recordId } from "../src/content/record";
import { warningList } from "../src/content/warnings";

assert.equal(jurisdictionHeading("CANADA"), "General Canadian information");
assert.equal(jurisdictionHeading("ALBERTA"), "Alberta-specific information");
assert.equal(jurisdictionHeading(["ALBERTA", "BRITISH_COLUMBIA"]), "Alberta and British Columbia-specific information");
assert.equal(jurisdictionApplies("ALBERTA", "ONTARIO"), false);
assert.equal(jurisdictionApplies("ALBERTA", "ALBERTA"), true);
assert.equal(jurisdictionApplies(["ALBERTA", "BRITISH_COLUMBIA"], "BRITISH_COLUMBIA"), true);
assert.equal(jurisdictionApplies("CANADA", "ONTARIO"), true);
assert.deepEqual(warningList(["site-specific"], ["site-specific", "hands-on"]), ["site-specific", "hands-on"]);
assert.equal(recordId("Alex", ["orientation", "ppe"], "2026-09-24"), recordId("Alex", ["orientation", "ppe"], "2026-09-24"));
assert.notEqual(recordId("Alex", ["orientation"], "2026-09-24"), recordId("Sam", ["orientation"], "2026-09-24"));
assert.match(recordId("Alex", ["whmis"], "2026-09-24"), /^SW-[0-9A-F]{8}$/);
assert.equal(concreteReady(["hardhat", "goggles", "ear", "vest", "gloves", "boots"]).ok, false);
assert.equal(
  concreteReady(["hardhat", "goggles", "ear", "vest", "gloves", "boots", "respirator"]).ok,
  true,
);
console.log("ok");
