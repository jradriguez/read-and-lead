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
