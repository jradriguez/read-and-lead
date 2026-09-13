# Implementation status — 2026-09-12

The repository foundation and adult simulator prototype are implemented. **M1 is not
ready for family use or public release.** This record supersedes unchecked progress
boxes in the original approved implementation plan, which remains a design reference.

| Plan task | Current evidence | Remaining acceptance |
| --- | --- | --- |
| 1. Native foundation | Separate Git root and feature branch; Expo 57 template; strict TS; native workspace generated; iPad/phone Expo Go UI | Standalone compilation; final icon/art |
| 2. Content contract | Cumulative patterns, word/answer checks, prereq cycles, connected text, asset bytes/path checks and review digests | Human literacy review, human phoneme recordings, asset rights |
| 3. Learning engine | Ordered evaluation, hints, supported retry, demonstration and skip; deterministic unit tests | Child usability observation after review |
| 4. Local progress | Shared real SQLite queries; rollback, serialization, duplicate saves, pruning and reset tests; native iPad first-lesson save | Force-close/reopen, physical backup exclusion and error recovery |
| 5. Touch and audio | Tap builds and automatic prompt transitions; audio cancellation tests; bounded native playback adapter; gesture/drop implementation | Drag could not be verified through the available simulator automation; playback quality, interruption and physical gesture checks |
| 6. Workshop and parent controls | First-lesson reward in simulator; parent gate/phone screen; reset cancellation/error UI tests; OS reduced motion | Full navigation narration; persistent preferences if required; both-lesson replay and confirmed native reset |
| 7. Native/offline handoff | Expo Go iPad portrait/landscape and phone screenshots; native source/config generation; draft Maestro flows | CocoaPods/Ruby toolchain; Android SDK/JDK/Maestro; standalone offline builds and physical devices |

## Deliberate implementation adjustments

- One `content/catalog.json` holds the small draft pack, replacing several planned
  JSON files. Pure content types and validation remain separate from UI.
- Shared SQL statements live in schema.ts so Expo and Node execute identical bytes,
  avoiding divergent .sql imports/bundler rules. The initial schema is version 1.
- Audio is generated locally into ignored files for adult testing. None is approved
  or included in Git. A fresh clone runs `npm run draft:audio` before bundling.
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
3. Install a compatible native build toolchain. Build a custom development client,
   verify backup behavior and denied-save handling, then a reviewed offline release.
4. Run the full first-lesson and second-lesson loops on physical iPad and Android
   tablet, including interrupted playback, rotation, VoiceOver/TalkBack, reset and
   force-close/reopen. Record synthetic evidence only.
5. Only then begin a small family usability trial and use observations for M2.

The native runtime also verifies the semantic catalog digest using expo-crypto before
opening local progress in non-development builds. This small native dependency avoids
shipping a handwritten cryptographic implementation. File-byte verification remains
in the release CLI, before bundling.
