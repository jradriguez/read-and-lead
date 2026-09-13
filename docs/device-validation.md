# Device validation — 2026-09-12

## Observed

| Surface | Result |
| --- | --- |
| iPad Pro 11-inch (M5), iOS 26.5 simulator, Expo Go 57.0.9 | Workshop and sound introductions rendered; first lesson completed using tap choices/slots; native SQLite save returned successfully; celebration and one earned part displayed |
| Same iPad, portrait and landscape | Workshop and lesson layouts visible without text overflow; landscape workshop screenshot retained locally |
| iPhone 17 Pro, iOS 26.5 simulator, Expo Go 57.0.9 | Narrow workshop, arithmetic gate and parent progress/settings rendered without visible text clipping |
| Automated simulator drag | Not verified. Attempts selected tiles, but no native pan callbacks were observed during diagnosis. Tap placement works. Do not infer native drag readiness from geometry unit tests |
| iOS/Android prebuild | Native projects generated. iOS Documents/SQLite exclusion code precedes React startup; iOS microphone key absent. Android backup flags false and RECORD_AUDIO removal directive present |
| Standalone compile / release | Not run to completion; compatible CocoaPods/Ruby toolchain missing |
| Android runtime / physical devices / Maestro | Not run; tools/devices unavailable in this session |

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
Android navigation, native manifest merging, startup offline, backup/transfer,
16 KB compatibility, audio quality and storage sidecars remain unverified.
