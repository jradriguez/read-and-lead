# Implementation status — 2026-09-12

The repository foundation and adult simulator prototype are implemented. **M1 is not
ready for family use or public release.** This record supersedes unchecked progress
boxes in the original approved implementation plan, which remains a design reference.

| Plan task | Current evidence | Remaining acceptance |
| --- | --- | --- |
| 1. Native foundation | Separate Git root and feature branch; Expo 57 template; strict TS; native workspace generated; unsigned iOS simulator and Android debug compilation passed | Final icon/art and release acceptance |
| 2. Content contract | Cumulative patterns, word/answer checks, prereq cycles, connected text, asset bytes/path checks and review digests | Human literacy review, human phoneme recordings, asset rights |
| 3. Learning engine | Ordered evaluation, hints, supported retry, demonstration and skip; deterministic unit tests | Child usability observation after review |
| 4. Local progress | Shared real SQLite queries; rollback, serialization, duplicate saves, pruning and reset tests; both native lessons and one/two-part persistence across restart on iOS/Android | Physical backup exclusion and error recovery |
| 5. Touch and audio | Tap builds and automatic prompt transitions; audio cancellation tests; bounded native playback adapter; gesture/drop implementation | Drag could not be verified through the available simulator automation; playback quality, interruption and physical gesture checks |
| 6. Workshop and parent controls | First-lesson reward in simulator; parent gate/phone screen; reset cancellation/error UI tests; OS reduced motion | Full navigation narration; persistent preferences if required; both-lesson replay and confirmed native reset |
| 7. Native/offline handoff | Expo Go iPad portrait/landscape and phone screenshots; native source/config generation; native tools/debug builds and verified both-lesson/restart/gate smoke flows | Standalone offline release and physical-device acceptance |

## Deliberate implementation adjustments

- One `content/catalog.json` holds the small draft pack, replacing several planned
  JSON files. Pure content types and validation remain separate from UI.
- Shared SQL statements live in schema.ts so Expo and Node execute identical bytes,
  avoiding divergent .sql imports/bundler rules. The initial schema is version 1.
- Audio is generated locally into ignored files for adult testing. None is approved
  or included in Git. A fresh clone runs `npm run draft:audio` before bundling; portable code checks
  require no generated audio. The release gate verifies exact native import paths.
- `validate:code` is a separate development gate. `validate` still includes strict
  release content validation and fails while human review is pending.
- Audio and animation preferences are session-only. Learning progress persists.
- The robot uses original native shapes and action-triggered Animated motion. No
  image generation service, game engine or runtime AI is needed.
- Native imports are static following a reproduced Expo Go lazy-module error.
- The xcode build dependency has a scoped uuid security override, with zero current
  npm audit findings. No broad forced SDK downgrade was applied.

## Next bounded work

1. Stabilize and verify drag on a real iPad or a native test driver with functioning
   touch movement, then add a native regression flow. The current automation selected
   a tile without producing pan callbacks; the cause is not established.
2. Complete spoken navigation and curriculum/audio review. Replace development-only
   speech with licensed recordings; validate its bound review digest.
3. Use the installed native toolchain and custom development builds to complete
   backup/transfer and denied-save acceptance, then a reviewed offline release.
4. Run the full first-lesson and second-lesson loops on physical iPad and Android
   tablet, including interrupted playback, rotation, VoiceOver/TalkBack, reset and
   force-close/reopen. Record synthetic evidence only.
5. Only then begin a small family usability trial and use observations for M2.

The native runtime also verifies the semantic catalog digest using expo-crypto before
opening local progress in non-development builds. This small native dependency avoids
shipping a handwritten cryptographic implementation. File-byte verification remains
in the release CLI, before bundling.

## Review fixes

The parent gate remains accessible when storage initialization fails. Recovery
offers a non-destructive retry, a newer-version warning when applicable, and an
explicit confirmed reset/reopen operation. Native close failure prevents deletion.
Completed lessons have individual replay controls and keep existing rewards.
Release content validation rejects missing or modified native audio import maps.
These behaviors have regression coverage; native recovery and physical-device
acceptance remain separate checks. See [GitHub setup](github-setup.md).

## Mobile readiness controls

The first readiness implementation adds explicit Android cloud/device-transfer
exclusions and release permission removal, verifies iOS backup code integrity,
and verifies SQLite secure deletion on both reader and exclusive-transaction
connections. Parent information describes local retention/reset boundaries;
Android Back leaves lessons/parent controls and requires the gate again.
The [build-input command](toolchain.md#build-input-evidence-command) captures hashes
and an npm inventory without adding dependencies or services.

See [validation](validation.md#mobile-readiness-implementation-checkpoint) for this
change's results. Generated native configuration and Expo Go layout checks do not
close standalone, transfer, network or physical-device acceptance. The
[native setup](toolchain.md#authorized-native-build-setup) is authorized and installed;
human literacy/audio/rights and legal decisions remain open. No M1 child-use or store-release gate has been marked complete.

## Tactile workshop refresh — 2026-09-14

The adult prototype now has a layered native-shape workshop, a compact phone scene,
chunky action buttons with pressed/disabled states, recessed word slots, and a
visible mark on selected letter tiles. The next mission title comes from the same
catalog/completion state used by lesson entry. Earned parts have accessible collected
and uncollected labels; completed lessons retain individual replay controls.

Lesson progress lights count finished activities, including assisted/skipped work;
they do not report accuracy or mastery. The lesson workbench emphasizes the letter
choices and check action, with support/skip controls below. Development notices
remain visible at the bottom of the screens. Existing lesson evaluation, tap/drag
placement rules, persistence, audio, parent gates, and release checks remain intact.

The design uses the existing sky/paper/ink/blue/yellow/mint palette, system type,
and original native shapes. It interprets tactile machinery as an interaction cue;
no third-party screenshot, branding, audio, or artwork is bundled. No dependency,
service, native configuration, or curriculum expansion was needed. See the
[validation record](validation.md#tactile-workshop-refresh--2026-09-14) for actual checks.
Human art/content review, complete navigation narration, physical drag and device
acceptance remain open; this refresh does not close those roadmap items.
