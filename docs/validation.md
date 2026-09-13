# Validation checkpoint — 2026-09-12

- `npm run validate:code`: passed (ESLint, strict TypeScript, 37 unit tests, 19 component
  tests and tracked-file repository boundary checks).
- `npm run content:check:draft`: passed against the generated local voice files.
- `npm run validate`: code checks passed; strict content stage failed as expected:
  UNAPPROVED_LESSON, UNAPPROVED_ASSET and REVIEW_DIGEST for both lessons.
  This is an outstanding release gate, not a green full validation result.
- `npx expo install --check`: dependencies up to date.
- `npx expo prebuild --no-install`: iOS and Android generated successfully, including
  the scoped uuid override and private-storage plugin. Expo warns that Android's
  userInterfaceStyle needs expo-system-ui; theme integration remains a native polish
  item. The app's own palette is fixed by its React Native styles.
- `npx expo export --platform ios --output-dir outputs/export-ios --max-workers 2`:
  succeeded, including nine local draft assets and a Hermes bundle.
- Equivalent Android export to outputs/export-android: succeeded. These are bundle
  exports, not compiled native apps, signed packages or install/device acceptance.
- `npm audit --audit-level=moderate`: zero vulnerabilities after the scoped override.
- `gitleaks dir . --redact --no-banner`: passed; authored content and specifications
  included, generated dependencies/native products/local outputs excluded.
- `npm run test:native`: could not run; Maestro is not installed.
- `git diff --check`: passed. Local documentation link checks passed after correcting
  the copied product-vocabulary link.

Node emits its experimental SQLite warning during the actual SQL tests. Expo's
export workers emit a NO_COLOR/FORCE_COLOR environment warning. Neither is a failing
application assertion. Full logs and generated bundles remain in ignored outputs.

See device-validation.md for exactly which simulator interactions were observed and
which physical, offline, drag, audio-quality and backup checks remain open.

## Independent review follow-up

The initial review requested fixes to parent storage recovery, completed-lesson
replay, native audio-map binding and fresh-clone typechecking. Regression tests
reproduced the missing recovery/replay controls and missing audio-map gate before
fixes. The updated code gate passes all 56 tests. Workflow YAML passes actionlint.

The updated Expo Go iPhone simulator rendered the workshop, arithmetic gate and
parent counts/preferences without blank screens or observed text overflow. Its
parent data was synthetic. This does not verify corrupted-database recovery on a
physical device; that path has component/native-adapter boundary coverage and
remains on the native acceptance checklist. Drag acceptance is still pending.

A clean temporary clone passed `npm ci` and `npm run validate:code` without any
local voice files. A second review found a reset/startup race across navigation;
a deferred-recovery regression reproduced it. App initialization now waits for the
shared recovery operation before reopening storage, and the regression passes.

The first GitHub run passed prototype tests, secret scanning and the CodeQL job,
but the CodeQL alert check flagged Math.random-derived session identifiers.
Session IDs now use expo-crypto UUIDs, separate from choice shuffling. A fixed-clock
regression verifies distinct session/attempt IDs across lesson re-entry.

## Mobile readiness implementation checkpoint

Fresh local checks for the readiness controls on 2026-09-12:

| Check | Result / scope |
| --- | --- |
| `npm run validate:code` | Passed: lint, strict TypeScript, 47 unit tests, 20 UI tests across five suites, repository boundary check |
| Regression evidence | Reproduced then fixed: stale iOS protection marker, Android resource/permission gaps and redirected directory writes, readable deleted SQLite details (including Expo-style separate transaction connections), Android Back leaving parent/lesson navigation unresolved |
| Jest discovery | A concurrent nested checkout reproduced duplicate-project/native-module failures. Discovery now starts at this project's `tests/ui`; all five intended suites run, nested checkout preserved |
| `npm run content:check:draft` | Passed against local synthetic audio files |
| `npm run content:check` | Failed: `UNAPPROVED_LESSON`, `UNAPPROVED_ASSET`, `REVIEW_DIGEST:first-sounds`, `REVIEW_DIGEST:first-words`; release remains blocked |
| `npm run validate` | Not run as a separate wrapper in this implementation; its code and strict-content components were run above. Full release validation cannot pass with the current content |
| `npm run security:check` | Passed: npm audit reported zero vulnerabilities; Gitleaks history and directory scans reported no leaks |
| `expo prebuild ... --no-install` and repeat `--no-clean` | Passed in a task-owned ignored copy; actual generated-source assertions passed. Existing native workspaces preserved; no native package/tool installation |
| `expo export --platform ios --dev --output-dir outputs/readiness-dev-ios --max-workers 2` | Passed; development JS and nine local draft sound files bundled |
| Equivalent Android development export | Passed to `outputs/readiness-dev-android`; this is not an APK/AAB, native compilation or release content approval |
| `tsx scripts/capture-build-inputs.ts` | Passed; 49 source/config/media input hashes and an 816-component npm CycloneDX inventory captured; native SBOM and binary evidence explicitly absent |
| Simulator UI | iPhone portrait and iPad landscape parent notice inspected without observed text clipping; see device validation for limits |

The generated native-source copy is under `outputs/native-config-os7JKT` and input
snapshots use `outputs/build-inputs-*`. These are local ignored development artifacts,
not public evidence bundles. Recreate them after changing their inputs. Node's
experimental SQLite warning and Expo's color-environment warning remain non-failing.
Expo also warns that Android theme integration needs expo-system-ui; no dependency
was added solely to remove the warning.

Standalone CocoaPods/Android compilation and Maestro/device checks await the
specific tooling authorization in [toolchain](toolchain.md). No toolchain, schema,
CI/CD, signing-account, store, publication or paid-service changes were made.
Human content/recording/rights and legal approvals, physical-device acceptance,
independent review and the later pilot/store packages remain incomplete.
