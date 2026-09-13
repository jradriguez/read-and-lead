# Read to Lead style guide

This file owns app presentation, teaching copy, and contributor communication.
Use [product vocabulary](docs/context.md) consistently; code conventions
live in [CODING_GUIDELINES.md](CODING_GUIDELINES.md).

## App voice and teaching copy

- Keep implementation details, review digests, policy language, and developer
  diagnostics out of learner flows. Parent messages explain actionable choices
  and data loss plainly; developer evidence belongs in development records.
- Be warm, concrete, and brief. Give one action at a time and let the learner
  replay spoken instructions. Do not rely on a beginning reader decoding navigation.
- Separate narrator vocabulary from text the learner is expected to decode.
  Learner text uses introduced patterns and explicitly taught irregular words.
  Sound models are not letter names; phonetic notation belongs in adult review notes.
- Praise the observed action: “You put the sounds together.” Avoid claiming that
  speech was correct when it was not measured, or that finishing proves mastery.
- Use neutral corrective prompts and offer support, demonstration, or skip.
  No shame, countdown pressure, lost rewards for missed days, streaks, or purchase
  prompts. A session needs a natural stopping point.
- Parent summaries describe practice and separate outcome counts. Do not invent
  reading ages, diagnoses, proficiency certification, or validated mastery scores.

All new instructional text and audio remain drafts until the human review in
[content review](docs/content-review.md) is complete. Clear prose is not proof of
phonics correctness or permission to redistribute a recording.

## Visual and interaction direction

Keep the friendly workshop recognizable and uncluttered. Reuse
[the existing tokens](src/ui/tokens.ts): soft sky backgrounds, warm paper panels,
dark ink, blue actions, and restrained yellow/mint accents. Use original robot
shapes and purposeful motion; avoid unrelated branding or decorative dashboards.
Change shared tokens deliberately instead of scattering new visual conventions.

Prioritize readable letters and words, generous space, clear selection/focus states,
and at least 56 logical-pixel interaction targets. Keep choices legible in iPad
portrait/landscape and narrow phone layouts. Do not use color alone to convey
feedback or distinguish an answer. Every drag has a tap equivalent.

Provide useful accessibility labels, logical focus order, replay controls, and
reduced-motion equivalents. Check VoiceOver/TalkBack, text scaling, interruptions,
and touch behavior on native devices when affected. Screenshots establish visual
appearance only; they do not prove speech, gestures, accessibility, or offline use.

## Documentation and handoff

Lead with the concrete outcome. Use plain language, short paragraphs, and lists or
tables where they make steps or comparisons easier to scan. Avoid filler, hype,
generic claims of quality, and invented technical labels. Use repository-relative
Markdown links and working commands; keep personal filesystem paths out of docs.

Separate implemented behavior from design intent and recommendations. Cite the
source or evidence when a claim needs support. Summarize what changed, why,
validation results, and remaining risks. Keep PR descriptions focused on the final
change and useful reviewer evidence, not the conversation or each intermediate step.
