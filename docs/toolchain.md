# Toolchain evidence — 2026-09-12

- Generator: create-expo-app 4.0.0; blank TypeScript template metadata 57.0.24.
- Expo ~57.0.22; React Native 0.86.3; React 19.2.3; strict TypeScript 6.
- Node 24.14.1; npm 11.11.0. Exact dependency resolution is in package-lock.json.
- Xcode 26.6 (17F113), iOS simulator runtime 26.5. System developer selection remains
  Command Line Tools; native commands use a process-local `DEVELOPER_DIR` pointing
  to the installed Xcode application. No signing account or global selection changed.
- Expo Go 57.0.9 installed on iPad Pro 11-inch (M5) and iPhone 17 Pro simulators.
- CocoaPods was not installed. A project-local install under ignored outputs failed
  because the system Ruby 2.6.10 is below current dependency requirements. No global
  Ruby upgrade was made. Use a maintained Ruby and CocoaPods before standalone builds.
- Android SDK / adb / Maestro are not available on PATH; Android runtime/native
  automation is pending. No SDK installation or store account was created.
- Metro's localhost listener initially resolved IPv6 while Expo Go opened IPv4.
  `NODE_OPTIONS=--dns-result-order=ipv4first` makes the local simulator connection work.
- Static native imports avoid an observed Expo Go development lazy-module load error.
- SDK checks requested @types/jest 29.5.14; that compatible version is pinned.
- The template's xcode build dependency used uuid 7, which caused ten transitive
  moderate audit findings. A scoped `xcode -> uuid ^11.1.1` override retains the
  CommonJS v4 API used by xcode. The resulting audit reports zero vulnerabilities.
  Recheck Expo prebuild compatibility when removing or changing the override.

Versioned references: [Expo 57](https://docs.expo.dev/versions/v57.0.0/),
[Audio](https://docs.expo.dev/versions/v57.0.0/sdk/audio/),
[SQLite](https://docs.expo.dev/versions/v57.0.0/sdk/sqlite/).

Development prerequisites are not evidence that an application was compiled,
signed, installed on a physical device, or accepted by a store.

## Native build setup proposal — awaiting authorization

For the readiness implementation, install CocoaPods (Homebrew currently resolves
1.17.0, with its maintained Ruby dependency) and `openjdk@21`. Use the existing
Homebrew installation under `/opt/homebrew`; no system Ruby replacement, shell
profile edit, global Java symlink, or global Xcode selection is needed.

```sh
HOMEBREW_NO_AUTO_UPDATE=1 brew install cocoapods openjdk@21
```

Use process-local `DEVELOPER_DIR`, `JAVA_HOME`, and `PATH` when building. CocoaPods
will resolve native dependencies and write its cache and ignored native build
files. Preserve the resulting Pod lockfile as release evidence. The app's npm
dependency set and schema do not change for this setup.

For Android and native automation, download official Android command-line tools
and a pinned Maestro distribution into ignored `outputs/native-tools/`. Verify
published integrity values before executing downloaded tools. Use a project-local
Android SDK root with API 36 platform/build tools, platform-tools, the matching
NDK/CMake required by the installed React Native Gradle configuration, and an
ARM64 emulator image only if needed. Accepting the Android SDK license requires
owner authorization; do not pipe automatic acceptance before that authorization.
Select and record exact package versions before installation. Do not upload to a
build service or store, attach signing accounts, or install on personal devices.

Effects: network downloads, local executable tools, Homebrew dependencies/caches,
native package caches and several GB of SDK/build output (exact size depends on
selected SDK packages). There is no subscription or store-enrollment charge.
Recovery: remove only task-installed tool directories and unused task-installed
Homebrew formulae after checking dependents; never run broad cleanup or erase
learner data. Existing tools, Xcode, unrelated work and signing material remain.

Authorization boundary: [AI_AGENT_POLICY.md](../AI_AGENT_POLICY.md) requires
explicit authorization for environment changes. The implementation request
authorizes preparation and app changes; this section makes the machine change
concrete for the owner's decision.

## Build-input evidence command

With the actual local audio/import map prepared, run:

```sh
node_modules/.bin/tsx scripts/capture-build-inputs.ts
```

This existing-toolchain command writes a fresh ignored `outputs/build-inputs-*`
directory containing `inputs.json` and `npm-sbom.cdx.json`. It records source
revision, dirty state, source/config/lockfile and bundled-media SHA-256 values,
Node/npm versions and current strict-content failures. Missing/invalid media or
redirected input paths stop capture. It installs nothing and does not certify a
build, license clearance or release approval.

The CycloneDX inventory uses `npm sbom --package-lock-only --sbom-format cyclonedx
--sbom-type application`, including build dependencies. The initial inventory had
816 components; npm omitted license metadata for `exit@0.1.2`. Inspection found
its installed `LICENSE-MIT` and legacy `licenses` declaration; `npm explain exit`
places it in the Jest development toolchain. Do not edit generated inventory to
pretend it was complete. Final shipped notices and native licenses remain open.

After native compilation, attach the actual Pod and Gradle resolutions, build
tool versions, final Info.plist/entitlements/privacy manifests, merged Android
manifest, packaged native libraries/16 KB results and binary digest to the same
private release record. Re-capture inputs after any change; an earlier dirty
snapshot is development evidence, not a substitute for the reviewed source revision.
