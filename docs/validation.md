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

At that earlier checkpoint, native compilation awaited tooling authorization.
The subsequent authorized installation and native builds are recorded in
[toolchain](toolchain.md#authorized-native-build-setup) and
[device validation](device-validation.md#custom-native-development-build-checkpoint).
No schema, CI/CD, signing-account, store, publication or paid-service changes were made.
Human content/recording/rights and legal approvals, physical-device acceptance,
independent review and the later pilot/store packages remain incomplete.

## Authorized native toolchain follow-up

The owner authorized the proposed local tools and Android SDK license acceptance.
CocoaPods/JDK/Android SDK/Maestro are installed; [toolchain](toolchain.md) records
versions, download integrity, locations, effects and commands. No npm dependency set,
schema, CI/CD, signing-account or store change was needed. The native test command
now selects an ordered smoke journey instead of unordered directory discovery.

Fresh follow-up checks:

| Check | Result / scope |
| --- | --- |
| `npm run validate:code` | Passed: lint, strict types, 47 unit and 20 component tests, repository boundary check |
| `npm run security:check` | Passed: zero npm audit vulnerabilities; no leaks in history/directory scans |
| `npm run content:check` | Failed as expected: UNAPPROVED_LESSON, UNAPPROVED_ASSET and REVIEW_DIGEST for both lessons. Full release validation remains blocked |
| `sh -n scripts/native-tools.sh`, wrapper help and Java invocation | Passed |
| `maestro check-syntax .maestro/smoke.yaml` | Passed, including nested flows |
| iOS Debug simulator build / Android ARM64 Debug APK | Both compiled successfully; actual outputs and native inspection limits are in device-validation.md |
| iOS native ordered smoke | Passed with Maestro 2.10.0 on dedicated iPad simulator: both lessons, connected sentence, one/two-part persistence across restart, invalid parent-gate rejection and return to workshop |
| Android native ordered smoke | Passed with Maestro 2.10.0 on API 36 ARM64 Pixel Tablet emulator: same full journey, including scrolling to the second-lesson finish control and retaining both parts after restart |

Earlier failed/interrupted runs are retained: development launcher/deep-link setup,
iOS keyboard dismissal, developer menu dismissal, Android finish control below the
landscape viewport, and a diagnostic driver collision. Startup now uses the visible
manual URL controls and conditional developer-menu handling; the second-lesson flow
scrolls to the finish button. No lesson, storage, parent-gate or review condition
was weakened. Diagnostics against the same device must wait for its test to end.

Local evidence: `outputs/native-build-evidence/`, `outputs/maestro-ios-scroll.log`
and `outputs/maestro-android-scroll.log` with their corresponding artifact folders.
App code is from `1f42e31`, with ignored local draft media (49 recorded input
hashes matched the isolated build copy); this
follow-up changes tooling, tests, npm test routing and documentation. Debug builds
require Metro and do not establish offline/no-egress release behavior. No release
archive/AAB or physical-device testing was performed. Child/store gates remain blocked.

## Tactile workshop refresh — 2026-09-14

The visual change implements the workshop presentation portion of the excellence
roadmap: original native-shape scenery, consistent tactile buttons, mission context,
letter/slot trays, and accessible activity/part progress. The installed Frontend
Design skill informed the palette, hierarchy and visual critique. Typography uses
system fonts and existing React Native controls; no media/service/runtime dependency
was added. The reference image was inspiration only and is not stored in the repo.

| Check | Result / scope |
| --- | --- |
| `npm run validate:code` | Passed: lint, strict types, 51 unit tests, 22 component tests and repository boundaries |
| Focused workshop/lesson tests | Passed: empty collection, next mission/replay callback, selected/disabled controls, activity progress, ordered placement, failed-save retry and duplicate-submit protection |
| `npm run content:check:draft` | Passed against the existing local draft media |
| `npm run security:check` | Passed: zero npm audit vulnerabilities and no Gitleaks findings |
| `git diff --check` | Passed |
| iPad Pro 11-inch (M5), iOS 26.5, Expo Go 57.0.9 | Initial portrait run passed: workshop, sound introduction/matching, two/three-slot word placement, full first-lesson completion, celebration and return with previously collected parts retained. Final single-line letter sizing was subsequently verified on phone |
| iPhone 17 Pro, iOS 26.5, Expo Go 57.0.9 | Final default-size run passed: workshop start visible, sound matching, two/three-slot word placement, full first lesson, celebration, return with one collected part and the next mission shown; controls reachable by scrolling |
| Same phone, extra-extra-extra-large system text | Introduction and sound-match flow passed; letters stayed legible, text wrapped and controls remained reachable. Original default size restored afterward |
| iPad landscape automation | Unverified: rotation/relaunch runs returned to the Expo launcher or workshop without reaching the expected lesson; a later portrait tap also missed after rotation. The cause is not established. Failed artifacts retained; a successful orientation command is not landscape acceptance |
| Physical devices, Android, VoiceOver/TalkBack, drag, standalone offline release | Not run for this presentation change; existing acceptance gaps remain open |

The first phone scene pushed the build action below the viewport. A compact scene
and smaller phone heading now keep it visible at default size. A redundant activity
badge was removed and support controls grouped below the check action to reduce
scrolling. Larger-text letter labels fit a single line within each tile/slot.

Evidence is local under `outputs/visual-refresh/`, including Maestro flows,
screenshots, failed launcher/rotation runs and check logs. These are synthetic adult
simulator exercises. The Expo development overlay appears in captures and is not
app navigation. No child observations, private source image or generated speech
were added to Git. The strict release gate was not rerun for this UI-only change;
reviewed narration/art/content and applicable native acceptance remain required.
