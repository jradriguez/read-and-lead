# Device validation — 2026-09-12

## Earlier Expo Go observations

| Surface | Result |
| --- | --- |
| iPad Pro 11-inch (M5), iOS 26.5 simulator, Expo Go 57.0.9 | Workshop and sound introductions rendered; first lesson completed using tap choices/slots; native SQLite save returned successfully; celebration and one earned part displayed |
| Same iPad, portrait and landscape | Workshop and lesson layouts visible without text overflow; landscape workshop screenshot retained locally |
| iPhone 17 Pro, iOS 26.5 simulator, Expo Go 57.0.9 | Narrow workshop, arithmetic gate and parent progress/settings rendered without visible text clipping |
| Automated simulator drag | Not verified. Attempts selected tiles, but no native pan callbacks were observed during diagnosis. Tap placement works. Do not infer native drag readiness from geometry unit tests |
| iOS/Android prebuild | Native projects generated. iOS Documents/SQLite exclusion code precedes React startup; iOS microphone key absent. Android backup flags false and RECORD_AUDIO removal directive present |
| Native compile / release | Earlier compile blocked by tooling; superseded by the native checkpoint below. Release still blocked |
| Android runtime / physical devices / Maestro | Earlier tools unavailable; see native checkpoint below. Physical devices remain untested |

Expo Go uses development network loading and its own native configuration. This is
not proof of offline startup, backup exclusion, absence of SDK traffic or store readiness.
Temporary voice clips played without an application error in the observed lesson;
pronunciation quality and physical-speaker audibility have not been approved.

Local screenshot: `outputs/device-validation/ipad-workshop-landscape.png` (ignored).
No real learner observations or child audio were captured.

## Required physical-device checklist

- Human-approved content and licensed final audio; no temporary phoneme proxies.
- Install a standalone build, disconnect network before first lesson launch; complete
  both lessons, force-close/reopen, and verify one part per lesson on replay.
- Verify drag/tap equivalence, invalid/cancelled drops and rotation during movement.
- Small phone and tablet portrait/landscape; system large text, VoiceOver/TalkBack,
  reduced motion, and controls reachable by scrolling with real touch.
- Audio replay/interruption/background/foreground, muted preferences, no overlap,
  no microphone permission prompt and no unexpected audio collection.
- Save failure leaves a retryable activity; reset cancellation and successful reset;
  unknown database version produces a recoverable upgrade path.
- Parent gate expires after 60 seconds inactivity and immediately on background.
- Verify iOS backup flags on actual DB directory/sidecars and Android cloud/transfer
  exclusions on supported devices. Review app-level network capture separately from
  OS traffic.
- Run `npm run validate`, `npm run security:check`, and verified Maestro flows against
  the reviewed build. Record the tested commit and binary; use synthetic data only.

## Readiness implementation observations

Checked the changed parent information in Expo Go on the existing iPhone 17 Pro
portrait and iPad Pro 11-inch (M5) landscape simulators (iOS 26.5). The workshop,
gate, counts/preferences and embedded privacy text rendered. The notice wrapped
without observed horizontal clipping; lower text and the reset control could be
brought into view. Parent inactivity returned to the workshop. No real child data
or destructive reset was used. This was visual and accessibility-tree inspection,
not a VoiceOver, large-text, physical touch or Android Back acceptance test.

In an isolated ignored copy, current Expo prebuild completed for both platforms
with `--no-install`, then repeated successfully with `--no-clean`. Assertions on
the generated files confirmed the iOS exclusion block before React, no microphone
usage-description key, Android references to the backup/extraction resources,
nine exclusions in each cloud/D2D section, and seven release permission removal
directives plus cleartext disabled. Existing native directories were preserved.
The generated Info.plist still contains development-launcher local-network keys;
final release plist/entitlements and traffic need inspection after compilation.

Android Back has component regression coverage for lesson exit, parent reset
confirmation exit, re-entry through the gate and default home behavior. Actual
At that earlier checkpoint, Android navigation, native manifest merging, startup
offline, backup/transfer, 16 KB compatibility, audio quality and storage sidecars
remained unverified. The next checkpoint supersedes only its named checks.

## Custom native development build checkpoint

Authorized local CocoaPods/JDK/SDK/Maestro installation is complete. Both unsigned
iOS simulator Debug compilation and Android ARM64 Debug APK compilation passed.
Build inputs are the app code at `1f42e31`; all 49 captured app input hashes matched
the isolated build copy. Tests use synthetic app data and local Metro only.

| Native check | Observed evidence / limit |
| --- | --- |
| iOS compiled plist | No microphone usage-description key; arbitrary loads false; development local networking/Bonjour keys remain |
| iOS compiled privacy manifests | Eight files inspected; aggregate declares no collected data or tracking; required reasons UserDefaults CA92.1, file timestamps C617.1, boot time 35F9.1 |
| iOS SQLite backup exclusion | Foundation URL resource query on the installed app's Documents/SQLite returned `isExcludedFromBackup=true`; actual device backup/restore remains open |
| Android merged release manifest | targetSdkVersion=36, minSdkVersion=24; allowBackup=false; cleartext=false; extraction rules linked; Internet, microphone, overlay and AD_ID absent. Remaining permissions: audio settings, vibration, wake lock and app-local non-exported receiver |
| Android debug APK alignment | `zipalign -c -P 16 -v 4` passed; all 20 ARM64 libraries have PT_LOAD alignment >=16384. Emulator page size is 4096; this does not verify execution on a 16 KB device or the final release artifact |
| Native dependency/binary evidence | Pod lock, Gradle resolutions, plists/privacy manifests, merged manifest and artifact hashes captured privately under `outputs/native-build-evidence/` |

Dedicated iOS device: `ReadLead Native QA`, iPad Pro 11-inch (M5), iOS 26.5.
Android device: `ReadLead_API36`, API 36 default ARM64 image, Pixel Tablet profile,
headless with audio disabled. Native playback quality, physical gestures, screen
readers, real backup/transfer, disconnected first launch and no-egress are still
separate acceptance checks. Development clients contain debug/network surfaces;
they cannot establish the final offline release's behavior.

The final ordered Maestro journey passed on both devices: complete first lesson,
restart retaining one part, reject an empty parent answer, return to the workshop,
complete second lesson/connected sentence, scroll to finish where required, and
restart retaining two parts. iOS ran portrait; the Android tablet ran landscape.
This establishes tap completion and durable progress on these debug installs.
It does not verify lesson replay, a successful arithmetic gate/reset, denied saves,
physical backup/restore, gesture equivalence or the full device matrix.
Task-owned Metro/emulator/simulator sessions were stopped after verification;
tools, synthetic test devices, logs and binaries are retained locally for reuse.
