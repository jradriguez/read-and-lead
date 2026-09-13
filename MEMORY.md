# Read and Lead repository memory

Durable, non-sensitive project decisions only. This is a contributor reference,
not runtime state, a transcript, or a source of new approval. Check current code,
instructions, and dated evidence before relying on a note. Product design lives in
[design](docs/design.md); changing implementation evidence belongs in
[implementation status](docs/implementation-status.md) and [validation](docs/validation.md).

## Established decisions

| Decision | Reason and authoritative reference |
| --- | --- |
| One Expo application, strict TypeScript, Node 24, npm | Small native offline product; [coding guidelines](CODING_GUIDELINES.md) and [package manifest](package.json) |
| Robot workshop, English-only, iPad first | Beginning-reader guided independence; [product context](COMPANY_CONTEXT.md) |
| Keep one initial implementation commit before review; allow a few later fix commits | Owner review preference; [contributing](CONTRIBUTING.md). Per-task commits in old plans do not apply |
| Work inline on a feature branch and preserve unrelated work | Predictable scope and review; [agent policy](AI_AGENT_POLICY.md) |
| One fixed `local-learner` key in M1 | No names or account system; [privacy map](docs/privacy-data-map.md) |
| Shared SQL and a pure learning layer | Real SQLite verification and deterministic behavior; [coding guidelines](CODING_GUIDELINES.md) |
| Completion is distinct from independent performance | Support and rewards must not inflate learning claims; [vocabulary](docs/context.md) |
| Human review and actual asset checks gate teaching content | Software cannot certify instruction or grant rights; [content review](docs/content-review.md) |
| Code validation and release validation are separate | Draft prototypes can be checked without approving child use; [README](README.md) |
| Reimplement useful AI-OS guidance for this app | Avoid importing an unrelated runtime or authority; [reuse inventory](docs/reuse-inventory.md) |

## Lessons to retain

- Code checks work without generated speech. Native bundling requires the local
  audio setup. The tracked audio declaration supplies types, not playable media.
- Draft synthetic phonemes are for adult functional review only. Passing hashes
  and review digests does not establish pronunciation quality or human approval.
- Expo Go does not apply this app's native backup-exclusion plugin. Simulator or
  Metro export success cannot establish standalone offline/privacy acceptance.
- A completed lesson may be replayed without multiplying parts. Recovery and reset
  must stay available after storage failure without silently deleting data.
- Native/device evidence has a specific platform, build, and date. Recheck current
  blockers before repeating toolchain claims from older notes.

## Maintenance

Add or revise durable notes when the owner requests a memory update. Keep entries
short, linked to the governing decision or evidence, and free of secrets, child
identifiers, real observations, recordings, database exports, and private contacts.
Do not copy another project's memory wholesale. Use dated implementation records
for test counts and temporary blockers. This repository file does not authorize
updates to the assistant's global memory or other projects.
