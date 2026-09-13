import test from "node:test";
import assert from "node:assert/strict";
import {
  checkGate,
  gateActive,
  makeChallenge,
} from "../src/features/parent/gate.ts";
test("adult answer accepts only complete decimal digits, not blank or prefixes", () => {
  const c = makeChallenge(12, 13);
  assert.equal(checkGate("156", c.answer), true);
  for (const v of ["", "156abc", "1.56e2", "156.0", "0x9c", "  "])
    assert.equal(checkGate(v, c.answer), false);
});
test("parent access expires at 60 seconds and immediately on background", () => {
  assert.equal(gateActive(100, 60099, true), true);
  assert.equal(gateActive(100, 60100, true), false);
  assert.equal(gateActive(100, 101, false), false);
  assert.equal(gateActive(100, 99, true), false);
});
