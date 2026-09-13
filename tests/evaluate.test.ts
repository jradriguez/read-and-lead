import test from "node:test";
import assert from "node:assert/strict";
import { evaluate } from "../src/learning/evaluate.ts";
import { makeCatalog } from "./fixtures/catalog.ts";
const a = makeCatalog().lessons[0].activities[1];
test("ordered answers distinguish independent, assisted and incorrect", () => {
  assert.equal(
    evaluate(a, { selected: ["short-a", "m"], hints: 0, skipped: false }),
    "independent",
  );
  assert.equal(
    evaluate(a, { selected: ["short-a", "m"], hints: 1, skipped: false }),
    "assisted",
  );
  assert.equal(
    evaluate(a, { selected: ["m", "short-a"], hints: 0, skipped: false }),
    "incorrect",
  );
  assert.equal(
    evaluate(a, { selected: [], hints: 0, skipped: false }),
    "incorrect",
  );
});
test("skipping takes precedence even when tiles match", () =>
  assert.equal(
    evaluate(a, { selected: a.answer, hints: 0, skipped: true }),
    "skipped",
  ));
