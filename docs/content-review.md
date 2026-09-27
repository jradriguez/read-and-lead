# Content and audio review pack

Status: **draft; adult development only**. No lesson or voice asset is human-approved.

For reviewer sourcing and recording handoffs, use the
[professional review plan](professional-review-plan.md). This file remains the
owner of actual approval; a contractor plan is not approval.

Current authoring source is `content/catalog.json`. Keeping the small pack together
makes cross-references and review easy; splitting into many lesson files is deferred
until the library grows. `content/audio-scripts.json` is development narration input,
not a pronunciation standard. In particular, synthesized m/s and the short-a/t prompts
must be replaced by clean human sound models without added schwa or letter-name cues.
The current synthetic prompts must not be used to teach or assess a child.

| Lesson | Patterns introduced | Practice | Connected reading |
| --- | --- | --- | --- |
| Wake up the workshop | m, short a /æ/, s | Match sounds; build am and Sam | None |
| Build a robot seat | t /t/ | Match t; build mat and sat | Sam sat. |

A literacy reviewer should check:

- Explicit sound modeling and oral blending precede practice; review the precise
  short-a model and stop consonant /t/. No letter-name proxy for phoneme assessment.
- Cumulative patterns are sufficient for every displayed word. Model Sam as a name,
  its capital S, the space between words and the full stop in “Sam sat.” orally.
- Every instructional step can be followed without reading UI labels. The draft now
  includes workshop entry, sound introduction, placement/check/help, retry,
  demonstration, save failure and test/finish guidance. Check the actual control
  order and discoverability; narrated labels alone do not establish independence.
- Replace temporary audio with recordings whose speaker permission and distribution
  license explicitly cover the product. Listen on actual tablets, including replay,
  interruptions and quiet playback; validate the sound, not just the transcript.
- Review original robot art, instructional images and future songs. System/template
  app icons are temporary, not final store assets.

Approval procedure (performed by an authorized human reviewer):

1. Supply final recordings under assets/audio and update the bundled native import
   catalog paths/creator/rights/SHA-256 fields. Run `npx tsx scripts/create-audio-map.ts`
   to regenerate the ignored native import map from those exact paths. This replaces
   local draft imports without granting content approval. Do not edit the map by hand.
2. Review the entire pack and runtime instructions. Set asset reviewed flags only
   after actual listening and rights review.
3. Calculate SHA-256 of `reviewPayload(catalog)` from `src/content/review.ts`. This
   excludes review metadata but binds the semantic pack, attribution and asset hashes.
4. Record the authorized reviewer's non-private identifier, approved state and digest
   in each lesson. This digest detects later changes; it does not authenticate a person.
5. Run `npm run validate`, then complete the native device checks before child use.

Do not auto-sign an agent-authored lesson as reviewed. The runtime rejects draft
review states and stale semantic digests in non-development builds; the release CLI checks actual
files, path/symlink boundaries, hashes, digest equality and the exact generated
native import map. Run the release gate immediately before bundling; a type
declaration alone supplies no audio and cannot pass this gate. No family test has run.


## Workshop narration and test scene — 2026-09-25

The adult pack has **26 draft clips: nine existing models/prompts and 17 navigation,
feedback and completion cues**. `src/content/narration.ts` lists required guidance
IDs; the catalog validator rejects a missing guidance asset. All clips use the
existing catalog file/hash/rights/review fields and remain unapproved. Run
`npm run draft:audio` on the development Mac after script changes, then
`npm run content:check:draft`. Generated synthetic speech and its import map stay
ignored. Do not distribute them as approved production recordings.

Automatic guidance is short: first activity of each kind receives a direction and
its prompt; later activities receive feedback and their prompt. **Hear it again**
repeats the model; **Hear instructions** also explains check/help/skip. Show me and
the demonstration sequence model each answer sound in order. Replay, navigation,
saving and backgrounding cancel queued speech. Foregrounding does not automatically
resume it. No music, effects, autoplay video or idle-animation loops were added.

The new scenes provisionally identify the robot as Sam. Review that identity, the
mat/seat meaning, capital S, and the wording of `Sam sat.` before approval. The seat
and lights are optional cause-and-effect play after the lesson has been recorded;
Test does not earn another attempt, part or mastery credit. Done for now remains
available without testing. Reduced motion shows the same final state immediately.
These scenes are not a STEM curriculum or an independent reading assessment.

For production, review every line of `content/audio-scripts.json`, the runtime copy
in both screens and the new scene descriptions. Use one consistent human narrator,
short phrasing and clearly modeled phonemes. Review final exported files in the
full sequence, including fast replay, a skipped activity, failed-save retry,
background interruption and sound disabled. The source revision and final runtime
copy must accompany the existing semantic-pack digest, which binds catalog/media
content but does not hash the application source itself.
