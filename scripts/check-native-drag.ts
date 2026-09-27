import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";

type Node = { attributes?: Record<string, string>; children?: Node[] };

// Resolve both ends from current native IDs: tile order and layout are variable.
export function dragFlow(tree: Node, tileId: string, slotId: string): string {
  const matches: Record<string, Record<string, string>[]> = {
    [tileId]: [],
    [slotId]: [],
  };
  const walk = (node: Node) => {
    const attributes = node.attributes;
    if (attributes && matches[attributes["resource-id"]])
      matches[attributes["resource-id"]].push(attributes);
    node.children?.forEach(walk);
  };
  walk(tree);
  if (matches[tileId].length !== 1 || matches[slotId].length !== 1)
    throw new Error(
      "Expected one visible tile and slot; open a word-building activity first.",
    );
  const tile = matches[tileId][0],
    slot = matches[slotId][0];
  const label = (node: Record<string, string>) =>
    node.accessibilityText || node.text;
  const letter = /^Letter ([A-Za-z])$/.exec(label(tile))?.[1];
  const number = /^Slot ([1-9]\d*), empty$/.exec(label(slot))?.[1];
  if (!letter || !number)
    throw new Error("Expected a letter tile and an empty slot.");
  const center = (node: Record<string, string>) => {
    const bounds = /^\[(\d+),(\d+)\]\[(\d+),(\d+)\]$/.exec(node.bounds);
    if (!bounds) throw new Error("Invalid native bounds.");
    const [x, y, right, bottom] = bounds.slice(1).map(Number);
    if (right <= x || bottom <= y || node.enabled !== "true")
      throw new Error("Target must be enabled with nonempty bounds.");
    return `${Math.floor((x + right) / 2)}, ${Math.floor((y + bottom) / 2)}`;
  };
  return `appId: com.readandlead.prototype
---
- assertVisible: "Slot ${number}, empty"
- swipe:
    start: ${center(tile)}
    end: ${center(slot)}
    duration: 1000
- assertVisible: "Slot ${number}, ${letter}"
`;
}

if (process.argv[1]?.endsWith("check-native-drag.ts")) {
  const [device, tileId = "tile-m", slotId = "slot-0"] = process.argv.slice(2);
  if (
    !device ||
    !/^(?:[A-Fa-f0-9-]{36}|emulator-\d+)$/.test(device) ||
    !/^tile-[a-z-]+$/.test(tileId) ||
    !/^slot-\d+$/.test(slotId)
  )
    throw new Error(
      "Usage: npx tsx scripts/check-native-drag.ts DISPOSABLE_DEVICE [tile-m] [slot-0]",
    );
  const wrapper = resolve("scripts/native-tools.sh");
  const hierarchy = execFileSync(
    wrapper,
    ["maestro", "--udid", device, "hierarchy"],
    { encoding: "utf8" },
  );
  // Validate before writing a flow or sending any touch input.
  const flow = dragFlow(JSON.parse(hierarchy) as Node, tileId, slotId);
  mkdirSync("outputs", { recursive: true });
  const output = mkdtempSync(resolve("outputs/native-drag-"));
  const file = join(output, "drag.yaml");
  writeFileSync(file, flow);
  execFileSync(
    wrapper,
    ["maestro", "--udid", device, "test", file, "--test-output-dir", output],
    { stdio: "inherit" },
  );
}
