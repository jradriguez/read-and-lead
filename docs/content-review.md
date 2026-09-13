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
- Every instructional step can be followed without reading UI labels. The current
  prototype has game prompts but does not yet narrate every navigation instruction.
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
