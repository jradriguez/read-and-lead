import test from "node:test";
import assert from "node:assert/strict";
import { placeTile, dropIndex } from "../src/features/lesson/placement.ts";
test("tap and drop replace only the addressed slot without mutating source", () => {
  const before = [null, "m"];
  assert.deepEqual(placeTile(before, "short-a", 0), ["short-a", "m"]);
  assert.deepEqual(before, [null, "m"]);
  assert.deepEqual(placeTile(before, "s", 1), [null, "s"]);
  assert.deepEqual(placeTile(before, "s", 3), before);
  assert.deepEqual(placeTile(before, "s", NaN), before);
});
test("drop bounds use both axes and reject empty space", () => {
  const boxes = [{ x: 100, y: 200, width: 80, height: 80 }];
  assert.equal(dropIndex(130, 240, boxes), 0);
  assert.equal(dropIndex(130, 100, boxes), -1);
  assert.equal(dropIndex(190, 240, boxes), -1);
});
