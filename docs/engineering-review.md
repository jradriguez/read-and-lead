# Read and Lead engineering review

This file owns the evidence questions for reviewing a scoped change. Use the
[contribution workflow](../CONTRIBUTING.md) for commands and commit rules. Existing
[content review](content-review.md) and [device validation](device-validation.md)
remain the detailed acceptance procedures; completing this checklist does not
replace them or grant release authority.

## Initial handoff

- The change addresses a named behavior, acceptance gap, or maintenance need
  within the authorized milestone; later-stage ideas have not expanded its scope.
- One initial implementation commit contains the scoped code, tests, and docs.
  Unrelated edits and generated/private artifacts are excluded.
- The description explains the problem, resulting behavior, reason, actual
  validation results, and remaining risks. Assumptions are explicit.
- Documented commands and links resolve to the current project. Historical plans,
  implementation status, and host instruction shims agree with current policy.
- The applicable [validation contract](../CONTRIBUTING.md#validation-contract)
  ran on the current revision; failures and unavailable evidence are reported.

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

For separately authorized release work, apply the contribution validation contract
and the applicable [release requirements](design.md#validation-and-decision-gates). Human
curriculum/rights review and installed offline/device checks remain necessary.
Record build revision, platform, date, actual outcomes, and pending evidence using
synthetic data. Mark unavailable hardware or native
tooling explicitly. Expo Go, a Metro export, unit tests, and screenshots each
provide limited evidence; none establishes physical-device acceptance alone.
