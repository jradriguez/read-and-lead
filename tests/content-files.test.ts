import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  mkdirSync,
  writeFileSync,
  symlinkSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";
import { checkContent } from "../scripts/check-content.ts";
import { makeCatalog } from "./fixtures/catalog.ts";
test("content checker rejects missing assets, traversal, symlinks and altered bytes", () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-content-"));
  try {
    mkdirSync(join(root, "assets/audio"), { recursive: true });
    const c = makeCatalog();
    assert.ok(
      checkContent(root, c, false).some((e) => e.startsWith("ASSET_MISSING")),
    );
    for (const a of c.assets) {
      writeFileSync(join(root, "assets", a.file), "fixture");
      a.sha256 = createHash("sha256").update("fixture").digest("hex");
    }
    assert.deepEqual(checkContent(root, c, false), []);
    writeFileSync(join(root, "assets/audio/m.wav"), "changed");
    assert.ok(
      checkContent(root, c, false).some((e) => e.startsWith("ASSET_HASH")),
    );
    c.assets[0].file = "../outside";
    assert.ok(
      checkContent(root, c, false).some((e) => e.startsWith("ASSET_PATH")),
    );
    symlinkSync(join(root, "assets/audio"), join(root, "assets/link"));
    c.assets[0].file = "link/m.wav";
    assert.ok(
      checkContent(root, c, false).some((e) => e.startsWith("ASSET_PATH")),
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
test("approved review becomes stale after semantic content changes", async () => {
  const { reviewPayload } = await import("../src/content/review.ts");
  const c = makeCatalog();
  assert.doesNotThrow(() => JSON.parse(reviewPayload(c)));
  const first = createHash("sha256").update(reviewPayload(c)).digest("hex");
  c.lessons[0].review = {
    state: "approved",
    reviewer: "test-reviewer",
    digest: first,
  };
  assert.equal(
    createHash("sha256").update(reviewPayload(c)).digest("hex"),
    first,
  );
  c.lessons[0].title = "Different instruction";
  assert.notEqual(
    createHash("sha256").update(reviewPayload(c)).digest("hex"),
    first,
  );
});
