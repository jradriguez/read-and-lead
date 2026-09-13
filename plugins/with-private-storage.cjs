const {
  withAppDelegate,
  withAndroidManifest,
  withDangerousMod,
} = require("expo/config-plugins");
const { mkdir, readFile, writeFile, lstat } = require("node:fs/promises");
const { join, dirname } = require("node:path");
function protectIos(source) {
  const marker =
    "// Read and Lead: exclude local learning state from cloud backup.";
  const anchor = "    let delegate = ReactNativeDelegate()";
  if (!source.includes(anchor))
    throw new Error(
      "APP_DELEGATE_TEMPLATE: inspect the new template before applying private storage",
    );
  const block = `    ${marker}
    do {
      var directory = try FileManager.default.url(for: .documentDirectory, in: .userDomainMask, appropriateFor: nil, create: true).appendingPathComponent("SQLite", isDirectory: true)
      try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: true)
      var values = URLResourceValues()
      values.isExcludedFromBackup = true
      try directory.setResourceValues(values)
    } catch {
      // Do not open the learner database if its privacy boundary could not be set.
      fatalError("Unable to prepare private local learning storage")
    }
${anchor}`;
  if (source.includes(marker)) {
    if (!source.includes(block))
      throw new Error(
        "PRIVATE_STORAGE_CHANGED: inspect existing iOS protection",
      );
    return source;
  }
  return source.replace(anchor, block);
}

const domains = [
  "root",
  "file",
  "database",
  "sharedpref",
  "external",
  "device_root",
  "device_file",
  "device_database",
  "device_sharedpref",
];
const excludes = domains
  .map((domain) => `    <exclude domain="${domain}" path="." />`)
  .join("\n");
const backupRules = `<?xml version="1.0" encoding="utf-8"?>\n<full-backup-content>\n${excludes}\n</full-backup-content>\n`;
const extractionRules = `<?xml version="1.0" encoding="utf-8"?>\n<data-extraction-rules>\n  <cloud-backup>\n${excludes}\n  </cloud-backup>\n  <device-transfer>\n${excludes}\n  </device-transfer>\n</data-extraction-rules>\n`;
// Metro remains available in debug builds. The M1 release has no network feature.
const releaseManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android" xmlns:tools="http://schemas.android.com/tools">
${["android.permission.INTERNET", "android.permission.ACCESS_NETWORK_STATE", "android.permission.RECORD_AUDIO", "android.permission.SYSTEM_ALERT_WINDOW", "android.permission.READ_EXTERNAL_STORAGE", "android.permission.WRITE_EXTERNAL_STORAGE", "com.google.android.gms.permission.AD_ID"].map((permission) => `  <uses-permission android:name="${permission}" tools:node="remove" />`).join("\n")}
  <application android:usesCleartextTraffic="false" />
</manifest>
`;
function protectAndroid(manifest) {
  const app = manifest.application?.[0];
  if (!app) throw new Error("ANDROID_MANIFEST_TEMPLATE");
  app.$["android:allowBackup"] = "false";
  app.$["android:fullBackupContent"] = "@xml/read_and_lead_backup_rules";
  app.$["android:dataExtractionRules"] = "@xml/read_and_lead_extraction_rules";
}
async function writeAndroidRules(root) {
  const files = [
    ["app/src/main/res/xml/read_and_lead_backup_rules.xml", backupRules],
    [
      "app/src/main/res/xml/read_and_lead_extraction_rules.xml",
      extractionRules,
    ],
    ["app/src/release/AndroidManifest.xml", releaseManifest],
  ];
  // Inspect every destination before writing any file; preserve unknown native edits.
  for (const [relative, content] of files) {
    const path = join(root, relative);
    try {
      let directory = root;
      for (const part of ["", ...dirname(relative).split("/")]) {
        directory = join(directory, part);
        try {
          if ((await lstat(directory)).isSymbolicLink())
            throw new Error(`PRIVATE_RESOURCE_CONFLICT:${relative}`);
        } catch (error) {
          if (error.code === "ENOENT") break;
          throw error;
        }
      }
      if (
        (await lstat(path)).isSymbolicLink() ||
        (await readFile(path, "utf8")) !== content
      )
        throw new Error(`PRIVATE_RESOURCE_CONFLICT:${relative}`);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }
  for (const [relative, content] of files) {
    const path = join(root, relative);
    await mkdir(dirname(path), { recursive: true });
    await writeFile(path, content);
  }
}
function withPrivateStorage(config) {
  config = withAppDelegate(config, (c) => {
    c.modResults.contents = protectIos(c.modResults.contents);
    return c;
  });
  config = withAndroidManifest(config, (c) => {
    protectAndroid(c.modResults.manifest);
    return c;
  });
  return withDangerousMod(config, [
    "android",
    async (c) => {
      await writeAndroidRules(c.modRequest.platformProjectRoot);
      return c;
    },
  ]);
}
module.exports = withPrivateStorage;
module.exports.protectIos = protectIos;
module.exports.protectAndroid = protectAndroid;
module.exports.writeAndroidRules = writeAndroidRules;
