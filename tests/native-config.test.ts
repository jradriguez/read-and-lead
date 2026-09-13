import test from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  mkdirSync,
  writeFileSync,
  symlinkSync,
  existsSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const { protectIos, protectAndroid, writeAndroidRules } =
  require("../plugins/with-private-storage.cjs") as {
    protectIos: (s: string) => string;
    protectAndroid: (manifest: {
      application?: { $: Record<string, string> }[];
    }) => void;
    writeAndroidRules: (root: string) => Promise<void>;
  };
test("backup exclusion is inserted before React starts and remains idempotent", () => {
  const source =
    "func application() {\n    let delegate = ReactNativeDelegate()\n}";
  const out = protectIos(source);
  assert.ok(out.indexOf("isExcludedFromBackup = true") >= 0);
  assert.ok(
    out.indexOf("isExcludedFromBackup = true") < out.indexOf("let delegate"),
  );
  assert.equal(protectIos(out), out);
});
test("unsupported native template fails instead of silently omitting backup protection", () =>
  assert.throws(() => protectIos("unknown"), /APP_DELEGATE_TEMPLATE/));

test("a stale iOS privacy marker cannot conceal removed protection", () => {
  const out = protectIos(
    "func application() {\n    let delegate = ReactNativeDelegate()\n}",
  );
  assert.throws(
    () =>
      protectIos(
        out.replace(
          "isExcludedFromBackup = true",
          "isExcludedFromBackup = false",
        ),
      ),
    /PRIVATE_STORAGE_CHANGED/,
  );
});

test("Android connects explicit legacy and device-transfer exclusion resources", async () => {
  const manifest = { application: [{ $: {} as Record<string, string> }] };
  protectAndroid(manifest);
  assert.equal(manifest.application[0].$["android:allowBackup"], "false");
  assert.equal(
    manifest.application[0].$["android:fullBackupContent"],
    "@xml/read_and_lead_backup_rules",
  );
  assert.equal(
    manifest.application[0].$["android:dataExtractionRules"],
    "@xml/read_and_lead_extraction_rules",
  );
  const root = mkdtempSync(join(tmpdir(), "read-lead-native-"));
  try {
    await writeAndroidRules(root);
    const modern = readFileSync(
      join(root, "app/src/main/res/xml/read_and_lead_extraction_rules.xml"),
      "utf8",
    );
    for (const section of ["cloud-backup", "device-transfer"]) {
      const rules = modern.split(`<${section}>`)[1].split(`</${section}>`)[0];
      for (const domain of [
        "root",
        "file",
        "database",
        "sharedpref",
        "external",
        "device_root",
        "device_file",
        "device_database",
        "device_sharedpref",
      ])
        assert.ok(rules.includes(`domain="${domain}" path="."`));
    }
    const legacy = readFileSync(
      join(root, "app/src/main/res/xml/read_and_lead_backup_rules.xml"),
      "utf8",
    );
    assert.ok(legacy.includes('<exclude domain="database" path="."'));
    const release = readFileSync(
      join(root, "app/src/release/AndroidManifest.xml"),
      "utf8",
    );
    assert.ok(
      release.includes('android.permission.INTERNET" tools:node="remove"'),
    );
    assert.ok(
      release.includes('android.permission.RECORD_AUDIO" tools:node="remove"'),
    );
    await writeAndroidRules(root);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("unexpected Android resources are preserved rather than overwritten", async () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-native-"));
  const path = join(root, "app/src/release/AndroidManifest.xml");
  try {
    mkdirSync(join(root, "app/src/release"), { recursive: true });
    writeFileSync(path, "custom manifest");
    await assert.rejects(writeAndroidRules(root), /PRIVATE_RESOURCE_CONFLICT/);
    assert.equal(readFileSync(path, "utf8"), "custom manifest");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("Android generation refuses a redirected parent directory before writing", async () => {
  const root = mkdtempSync(join(tmpdir(), "read-lead-native-"));
  const external = mkdtempSync(join(tmpdir(), "read-lead-external-"));
  try {
    mkdirSync(join(root, "app/src"), { recursive: true });
    symlinkSync(external, join(root, "app/src/release"), "dir");
    await assert.rejects(writeAndroidRules(root), /PRIVATE_RESOURCE_CONFLICT/);
    assert.equal(existsSync(join(external, "AndroidManifest.xml")), false);
    assert.equal(existsSync(join(root, "app/src/main")), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
    rmSync(external, { recursive: true, force: true });
  }
});
