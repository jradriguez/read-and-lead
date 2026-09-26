import test from "node:test";
import assert from "node:assert/strict";
import { dragFlow } from "../scripts/check-native-drag.ts";
function tree() {
  return {
    children: [
      {
        attributes: {
          "resource-id": "tile-m",
          accessibilityText: "Letter m",
          bounds: "[500,600][580,700]",
          enabled: "true",
        },
      },
      {
        attributes: {
          "resource-id": "slot-0",
          accessibilityText: "Slot 1, empty",
          bounds: "[280,430][360,530]",
          enabled: "true",
        },
      },
    ],
  };
}
test("native drag uses current shuffled tile bounds and verifies the slot result", () => {
  const flow = dragFlow(tree(), "tile-m", "slot-0");
  assert.ok(flow.includes("start: 540, 650"));
  assert.ok(flow.includes("end: 320, 480"));
  assert.ok(flow.includes('assertVisible: "Slot 1, m"'));
});
test("native drag refuses ambiguous, disabled, populated or empty targets", () => {
  const duplicate = tree();
  duplicate.children.push(duplicate.children[0]);
  assert.throws(() => dragFlow(duplicate, "tile-m", "slot-0"), /one visible/);
  const disabled = tree();
  disabled.children[0].attributes.enabled = "false";
  assert.throws(() => dragFlow(disabled, "tile-m", "slot-0"), /enabled/);
  const filled = tree();
  filled.children[1].attributes.accessibilityText = "Slot 1, s";
  assert.throws(() => dragFlow(filled, "tile-m", "slot-0"), /empty slot/);
  const empty = tree();
  empty.children[1].attributes.bounds = "[0,0][0,0]";
  assert.throws(() => dragFlow(empty, "tile-m", "slot-0"), /nonempty/);
});
