# Toolchain evidence — 2026-09-12

- Generator: create-expo-app 4.0.0; blank TypeScript template metadata 57.0.24.
- Expo ~57.0.22; React Native 0.86.3; React 19.2.3; strict TypeScript 6.
- Node 24.14.1; npm 11.11.0. Exact dependency resolution is in package-lock.json.
- Xcode 26.6 (17F113), iOS simulator runtime 26.5. System developer selection remains
  Command Line Tools; native commands use a process-local `DEVELOPER_DIR` pointing
  to the installed Xcode application. No signing account or global selection changed.
- Expo Go 57.0.9 installed on iPad Pro 11-inch (M5) and iPhone 17 Pro simulators.
- Native setup was authorized and installed in this task: CocoaPods 1.17.0 with
  Homebrew Ruby 4.0.6_1, OpenJDK 21.0.12.1, Android SDK and Maestro 2.10.0.
  The earlier system-Ruby installation failure is superseded by this setup.
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

## Authorized native build setup

The owner authorized the concrete setup proposal with “ok, implement it”. Installed
CocoaPods and `openjdk@21` using the existing `/opt/homebrew` Homebrew installation
with auto-update and install cleanup disabled. Homebrew also installed/updated
required dependencies (including Ruby, libyaml, certificate/font/graphics libraries).
No system Ruby replacement, shell-profile edit, global Java symlink, global Xcode
selection, signing-account change, paid service or store submission was performed.
Native dependencies and caches were downloaded; SDK package licenses were accepted
within this authorized setup. CocoaPods/Homebrew also use caches outside the repo.

Use `scripts/native-tools.sh <command> [arguments...]` to set process-local Xcode,
Java, SDK, AVD and Gradle paths. It disables Expo/CocoaPods/Maestro telemetry where
supported and Maestro update checks. It does not install tools or alter profiles.
It targets this macOS host's recorded locations; another host must verify them.

| Tool / package | Installed version / location under `outputs/native-tools/` |
| --- | --- |
| Android command-line tools | build 15859902, `android-sdk/cmdline-tools/15859902` |
| Android platform / build tools | API 36 revision 2; build-tools 36.0.0 and Gradle-required 35.0.0 |
| NDK / CMake | 27.1.12297006 / 3.22.1 |
| platform-tools / emulator | 37.0.1 / 37.1.11 |
| Emulator image | `system-images;android-36;default;arm64-v8a`, revision 2 |
| Maestro | 2.10.0, `maestro-2.10.0/maestro/bin` |
| Gradle | Native wrapper 9.3.1; cache in `gradle-cache` |

Verified downloads before execution:

- [Official Android macOS ARM64 tools](https://developer.android.com/studio):
  `commandlinetools-mac_arm64-15859902_latest.zip`, SHA-256
  `835b62a26162b229b441d1f6d4680383815a270809eb33522c0d480fa5002c4e`.
- [Maestro cli-2.10.0](https://github.com/mobile-dev-inc/Maestro/releases/tag/cli-2.10.0):
  `maestro.zip`, SHA-256
  `29b675e10cc12080e445e9bfb2e2b4e4dfb9c0f2e30d5884120d258b5e1cd991`,
  matched against the GitHub release asset digest.

Recovery is scoped to task-installed directories and unused task-installed
Homebrew formulae after checking dependents. Do not run broad cleanup, delete
unrelated simulators or erase actual learner data. No cleanup was performed.

### Native build reproduction

The paths and `ReadandLead` scheme below record PR #11's tested artifacts. The
[provisional rename](product-name-review.md) changes `expo.name` to Read to Lead;
fresh prebuilds may derive a different workspace/scheme/product name. Inspect the
generated project before adapting these commands. Existing binaries were not
rebuilt for the rename, and their input hashes do not certify the new configuration.

The tested sandbox is `outputs/native-build-EYvdgD`, containing the app inputs and
local draft audio plus a link to this checkout's node_modules. Original ignored
native workspaces were preserved. All 49 captured app input hashes matched this
sandbox before verification. Build fresh generated native projects when inputs
change; do not silently reuse an old sandbox.

From the repository root, generate this isolated copy using Expo prebuild with
`--no-install`. In its `ios` directory run `scripts/native-tools.sh pod install`
using the script's absolute repository path. Then from the repository root:

```sh
scripts/native-tools.sh xcodebuild \
  -workspace outputs/native-build-EYvdgD/ios/ReadandLead.xcworkspace \
  -scheme ReadandLead -configuration Debug -sdk iphonesimulator \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath outputs/native-ios-derived CODE_SIGNING_ALLOWED=NO -jobs 4 build
```

For Android, start from the repository root and retain it before entering the sandbox:

```sh
read_lead_repo="$PWD"
cd outputs/native-build-EYvdgD/android
"$read_lead_repo/scripts/native-tools.sh" \
  ./gradlew :app:assembleDebug --no-daemon --max-workers=4 \
  -PreactNativeArchitectures=arm64-v8a
```

Both builds passed. iOS output is
`outputs/native-ios-derived/Build/Products/Debug-iphonesimulator/ReadandLead.app`;
Android output is the sandbox's `android/app/build/outputs/apk/debug/app-debug.apk`.
These are adult development clients requiring local Metro, not offline releases.
Do not disable the production content gate to ship them.

Private native evidence is in `outputs/native-build-evidence/`: exact app input
hashes/npm inventory, Podfile.lock, Gradle dependency report, merged release
manifest, packaged iOS plist/privacy manifests, per-file app hashes, APK digest
and Android alignment checks. It is development evidence, not a complete native
license audit, signed release record or proof of reproducible binary bytes.

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
