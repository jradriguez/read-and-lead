import test from "node:test";
import assert from "node:assert/strict";
import { startSession, reduceSession } from "../src/learning/session.ts";
test("two wrong attempts lead to demonstration and supported completion", () => {
  let s = startSession("l", "s");
  s = reduceSession(s, {
    type: "answered",
    outcome: "incorrect",
    activityCount: 1,
  });
  assert.equal(s.hints, 1);
  assert.equal(s.activityIndex, 0);
  s = reduceSession(s, {
    type: "answered",
    outcome: "incorrect",
    activityCount: 1,
  });
  assert.equal(s.phase, "demonstrate");
  s = reduceSession(s, { type: "demonstrated", activityCount: 1 });
  assert.equal(s.phase, "complete");
  assert.deepEqual(reduceSession(s, { type: "hint" }), s);
});
test("success advances once and resets support for next activity", () => {
  let s = reduceSession(startSession("l", "s"), { type: "hint" });
  assert.equal(s.hints, 1);
  s = reduceSession(s, {
    type: "answered",
    outcome: "assisted",
    activityCount: 2,
  });
  assert.equal(s.activityIndex, 1);
  assert.equal(s.hints, 0);
});
test("invalid activity counts cannot wrap into a lesson", () =>
  assert.throws(() =>
    reduceSession(startSession("l", "s"), {
      type: "answered",
      outcome: "independent",
      activityCount: 0,
    }),
  ));
