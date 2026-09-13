import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { execFileSync } from "node:child_process";
import { checkRepo } from "../scripts/check-repo.ts";
test("repository checker rejects tracked runtime data while allowing manifests", () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-repo-"));
  try {
    execFileSync("git", ["init", "-q", root]);
    mkdirSync(join(root, "content"));
    writeFileSync(join(root, "content/assets.json"), "[]");
    execFileSync("git", ["-C", root, "add", "."]);
    assert.ok(!checkRepo(root).some((e) => e.startsWith("PRIVATE_PATH")));
    writeFileSync(join(root, "progress.sqlite"), "synthetic");
    execFileSync("git", ["-C", root, "add", "."]);
    assert.ok(checkRepo(root).some((e) => e.startsWith("PRIVATE_PATH")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
