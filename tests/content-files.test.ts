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
import { reviewPayload } from "../src/content/review.ts";
import { renderAudioSources } from "../scripts/audio-sources.ts";
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

test("release check rejects missing, swapped or changed native audio imports", () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-map-"));
  try {
    const c = makeCatalog();
    mkdirSync(join(root, "assets/audio"), { recursive: true });
    mkdirSync(join(root, "src/audio"), { recursive: true });
    for (const a of c.assets) {
      writeFileSync(join(root, "assets", a.file), a.id);
      a.sha256 = createHash("sha256").update(a.id).digest("hex");
      a.reviewed = true;
      a.rights = "Original test fixture";
    }
    const digest = createHash("sha256").update(reviewPayload(c)).digest("hex");
    for (const l of c.lessons)
      l.review = { state: "approved", reviewer: "fixture", digest };
    assert.ok(checkContent(root, c, true).includes("AUDIO_MAP_MISSING"));
    writeFileSync(
      join(root, "src/audio/draft-sources.ts"),
      `export const draftSources = { m: require('../../assets/audio/s.wav') };`,
    );
    assert.ok(checkContent(root, c, true).includes("AUDIO_MAP_MISMATCH"));
    const map = renderAudioSources(c);
    writeFileSync(join(root, "src/audio/draft-sources.ts"), map);
    assert.deepEqual(checkContent(root, c, true), []);
    writeFileSync(
      join(root, "src/audio/draft-sources.ts"),
      map.replace("audio/m.wav", "audio/s.wav"),
    );
    assert.ok(checkContent(root, c, true).includes("AUDIO_MAP_MISMATCH"));
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
