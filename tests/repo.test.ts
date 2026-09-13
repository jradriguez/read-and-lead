import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  writeFileSync,
  rmSync,
  mkdirSync,
  readFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { execFileSync } from "node:child_process";
import {
  checkRepo,
  isPrivatePath,
  checkPublicationIdentity,
} from "../scripts/check-repo.ts";
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
    mkdirSync(join(root, "assets/draft"), { recursive: true });
    writeFileSync(join(root, "assets/draft/m.wav"), "synthetic");
    execFileSync("git", ["-C", root, "add", "."]);
    assert.ok(checkRepo(root).includes("PRIVATE_PATH:assets/draft/m.wav"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("private artifacts are ignored and rejected even when force-added", () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-exclusions-"));
  const paths = [
    "docs/private/contract.md",
    "private/.env.example",
    "learner-data/trial.csv",
    "contracts/release.pdf",
    "quotes/offer.pdf",
    "auditions/voice.wav",
    "raw-audio/take.wav",
    "exports/results.csv",
    "backups/copy.json",
    "browser-profiles/state.json",
    "cookies/browser.json",
    "sessions/state.json",
    ".auth/browser.json",
    "auth/session.json",
    "credentials/token.json",
    ".ssh/id_ed25519",
    ".aws/config",
    ".docker/config.json",
    ".config/gcloud/config.json",
    ".codex/session.jsonl",
    ".env.production",
    ".envrc",
    ".npmrc",
    "certificate.pfx",
    "signing.p8",
    "secret.key",
    "data.db-wal",
    "data.sqlite-shm",
    "device.har",
    "device.pcapng",
    "app.ipa",
    "app.apk",
    "app.aab",
    "debug.xcresult/report.json",
    "logs/device.txt",
    "archive.zip",
    "owner-review-notes.md",
    "storage-state.json",
    "storageState.json",
    "service-account-test.json",
  ];
  try {
    execFileSync("git", ["init", "-q", root]);
    writeFileSync(
      join(root, ".gitignore"),
      readFileSync(new URL("../.gitignore", import.meta.url)),
    );
    for (const file of paths) {
      mkdirSync(dirname(join(root, file)), { recursive: true });
      writeFileSync(join(root, file), "synthetic");
    }
    const ignored = execFileSync(
      "git",
      ["-C", root, "check-ignore", "--no-index", "--stdin"],
      {
        input: paths.join("\n") + "\n",
        encoding: "utf8",
      },
    )
      .trim()
      .split("\n");
    assert.deepEqual(ignored, paths);
    execFileSync("git", ["-C", root, "add", "-f", "--", ...paths]);
    const errors = checkRepo(root);
    for (const file of paths)
      assert.ok(errors.includes(`PRIVATE_PATH:${file}`), file);
    for (const file of [
      ".env.example",
      "docs/.env.example",
      "MEMORY.md",
      "docs/content-review.md",
      "content/catalog.json",
      "assets/audio/final.wav",
      "THIRD_PARTY_NOTICES/Expo-template-LICENSE",
    ])
      assert.equal(isPrivatePath(file), false, file);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("publication checks inspect staged bytes and never echo personal values", () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-staged-"));
  // Construct synthetic negative examples without publishing a literal address.
  const fakeEmail = ["synthetic-person", "gmail.com"].join("@");
  const fakeHome = ["", "Users", "synthetic-person", "project"].join("/");
  try {
    execFileSync("git", ["init", "-q", root]);
    writeFileSync(join(root, "note.md"), `${fakeEmail}\n${fakeHome}\n`);
    execFileSync("git", ["-C", root, "add", "note.md"]);
    writeFileSync(
      join(root, "note.md"),
      "Redacted working copy, unsafe index remains.",
    );
    const errors = checkRepo(root);
    assert.ok(errors.includes("PERSONAL_EMAIL:note.md"));
    assert.ok(errors.includes("PERSONAL_HOME_PATH:note.md"));
    assert.ok(!errors.join("\n").includes(fakeEmail));
    assert.ok(!errors.join("\n").includes(fakeHome));
    execFileSync("git", ["-C", root, "add", "note.md"]);
    assert.ok(!checkRepo(root).some((e) => e.startsWith("PERSONAL_")));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("publication identity rejects personal email without printing it", () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-identity-"));
  const saved = { ...process.env };
  try {
    execFileSync("git", ["init", "-q", root]);
    process.env.GIT_AUTHOR_NAME = "Synthetic Author";
    process.env.GIT_COMMITTER_NAME = "Synthetic Author";
    process.env.GIT_AUTHOR_EMAIL = ["synthetic-person", "gmail.com"].join("@");
    process.env.GIT_COMMITTER_EMAIL = "synthetic@users.noreply.github.com";
    assert.deepEqual(checkPublicationIdentity(root), [
      "PUBLICATION_EMAIL:GIT_AUTHOR_IDENT:use your verified GitHub noreply address",
    ]);
    process.env.GIT_AUTHOR_EMAIL = "synthetic@users.noreply.github.com";
    assert.deepEqual(checkPublicationIdentity(root), []);
  } finally {
    for (const key of [
      "GIT_AUTHOR_NAME",
      "GIT_COMMITTER_NAME",
      "GIT_AUTHOR_EMAIL",
      "GIT_COMMITTER_EMAIL",
    ]) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    rmSync(root, { recursive: true, force: true });
  }
});
