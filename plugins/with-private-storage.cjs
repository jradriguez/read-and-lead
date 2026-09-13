const { withAppDelegate, withAndroidManifest } = require("expo/config-plugins");
function protectIos(source) {
  const marker =
    "// Read and Lead: exclude local learning state from cloud backup.";
  if (source.includes(marker)) return source;
  const anchor = "    let delegate = ReactNativeDelegate()";
  if (!source.includes(anchor))
    throw new Error(
      "APP_DELEGATE_TEMPLATE: inspect the new template before applying private storage",
    );
  return source.replace(
    anchor,
    `    ${marker}
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
${anchor}`,
  );
}
function withPrivateStorage(config) {
  config = withAppDelegate(config, (c) => {
    c.modResults.contents = protectIos(c.modResults.contents);
    return c;
  });
  return withAndroidManifest(config, (c) => {
    const app = c.modResults.manifest.application?.[0];
    if (!app) throw new Error("ANDROID_MANIFEST_TEMPLATE");
    app.$["android:allowBackup"] = "false";
    app.$["android:fullBackupContent"] = "false";
    return c;
  });
}
module.exports = withPrivateStorage;
module.exports.protectIos = protectIos;
