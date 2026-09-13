import test from "node:test";
import assert from "node:assert/strict";
import { validateCatalog } from "../src/content/validate.ts";
import { makeCatalog } from "./fixtures/catalog.ts";
test("valid cumulative draft lessons can be inspected by adults", () =>
  assert.deepEqual(validateCatalog(makeCatalog(), false), []));
const cases: [string, string, (c: ReturnType<typeof makeCatalog>) => void][] = [
  [
    "later vowel cannot enter an early activity",
    "UNTAUGHT_PATTERN",
    (c) => {
      c.lessons[0].activities[0].answer = ["short-i"];
    },
  ],
  [
    "duplicate pattern IDs are rejected",
    "DUPLICATE_ID",
    (c) => {
      c.patterns.push(c.patterns[0]);
    },
  ],
  [
    "missing prompt audio is rejected",
    "MISSING_AUDIO",
    (c) => {
      c.assets = [];
    },
  ],
  [
    "segments must spell displayed word",
    "WORD_SEGMENTS",
    (c) => {
      c.words[0].text = "dog";
    },
  ],
  [
    "cycles cannot grant future patterns",
    "PREREQUISITE_CYCLE",
    (c) => {
      c.lessons[0].prerequisiteLessonIds = ["first-words"];
    },
  ],
  [
    "missing prerequisite fails closed",
    "MISSING_PREREQUISITE",
    (c) => {
      c.lessons[0].prerequisiteLessonIds = ["missing"];
    },
  ],
  [
    "answers must be selectable",
    "ANSWER_NOT_SELECTABLE",
    (c) => {
      c.lessons[0].activities[0].choices = ["s"];
    },
  ],
  [
    "connected text cannot disguise untaught words",
    "CONNECTED_TEXT",
    (c) => {
      c.lessons[1].connectedText = "Sam flies.";
    },
  ],
  [
    "word answer must follow its phoneme sequence",
    "WORD_ANSWER",
    (c) => {
      c.lessons[0].activities[1].answer = ["m", "short-a"];
    },
  ],
];
for (const [name, code, change] of cases)
  test(name, () => {
    const c = makeCatalog();
    change(c);
    assert.ok(validateCatalog(c, false).includes(code));
  });
test("draft content and media cannot enter release", () => {
  const errors = validateCatalog(makeCatalog(), true);
  assert.ok(errors.includes("UNAPPROVED_LESSON"));
  assert.ok(errors.includes("UNAPPROVED_ASSET"));
});
