# Read and Lead engineering review

Use this checklist for the affected scope, with [CONTRIBUTING.md](../CONTRIBUTING.md).
It adapts AI-OS's security-review concept to a local learning app. Existing
[content review](content-review.md) and [device validation](device-validation.md)
remain the detailed acceptance procedures; completing this checklist does not
replace them or grant release authority.

## Initial handoff

- One initial implementation commit contains the scoped code, tests, and docs.
  Unrelated edits and generated/private artifacts are excluded.
- The description explains the problem, resulting behavior, reason, actual
  validation results, and remaining risks. Assumptions are explicit.
- Documented commands and links resolve to the current project. Historical plans,
  implementation status, and host instruction shims agree with current policy.
- `npm run validate:code`, `npm run security:check`, `git diff --check`, and
  `git diff --cached --check` passed, or their failures/unavailability are reported.

## Affected behavior

| Change | Evidence to inspect |
| --- | --- |
| Lesson engine | Ordered answers; independent/assisted distinction; supported completion, skip, and bounded retry |
| Storage or reset | Real SQLite tests; transactional/idempotent saves; recovery without silent deletion; reset confirmation; retention and backup impact |
| Touch or layout | Tap/drag equivalence; invalid drops; repeated input; readable targets; orientation, narrow layouts, and native accessibility evidence |
| Audio or lifecycle | Replay/cancel; stale callbacks; background/unmount interruption; actual device playback evidence |
| Content or media | Cumulative patterns; exact asset paths/hashes/import map; rights; authorized human review and current digest |
| Permissions, dependencies, or configuration | Concrete need and authorization; no M1 network lesson, microphone, live AI, ad, billing, or analytics addition |
| Instructions and documentation | Correct project identity, implemented commands, scoped authority, one-commit workflow, and no private source material |

Inspect happy paths and realistic failure paths. Verify reported findings against
the current diff before changing code. Do not modify unrelated tests to pass a gate.
After review fixes, rerun affected checks and the required gate on the updated
revision. A previous green run is not evidence for new code.

## Release evidence

Before any separately authorized release, require `npm run validate` and
`npm run security:check`, human curriculum/rights review, and applicable installed
offline/device checks. Record build revision, platform, date, actual outcomes,
and pending evidence using synthetic data. Mark unavailable hardware or native
tooling explicitly. Expo Go, a Metro export, unit tests, and screenshots each
provide limited evidence; none establishes physical-device acceptance alone.
