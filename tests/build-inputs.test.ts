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
import { hashInputs } from "../scripts/capture-build-inputs";

test("evidence detects changed local assets and refuses missing or redirected inputs", () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-inputs-"));
  try {
    mkdirSync(join(root, "assets"));
    writeFileSync(join(root, "assets/sample.wav"), "synthetic audio one");
    const first = hashInputs(root, ["assets/sample.wav"])[0];
    writeFileSync(join(root, "assets/sample.wav"), "synthetic audio two");
    assert.notEqual(
      hashInputs(root, ["assets/sample.wav"])[0].sha256,
      first.sha256,
    );
    assert.throws(() => hashInputs(root, ["missing.wav"]), /ENOENT/);
    assert.throws(() => hashInputs(root, ["../sample.wav"]), /INPUT_PATH/);
    symlinkSync(join(root, "assets"), join(root, "redirect"), "dir");
    assert.throws(
      () => hashInputs(root, ["redirect/sample.wav"]),
      /INPUT_SYMLINK/,
    );
    assert.deepEqual(
      hashInputs(root, ["assets/sample.wav", "assets/sample.wav"]).length,
      1,
    );
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
