# Read and Lead repository memory

Use this reference for durable decision rationale and hard-won implementation
lessons. Current rules live in [AGENTS.md](AGENTS.md) and its linked policies;
current delivery evidence lives in [implementation status](docs/implementation-status.md).
This file is not runtime state, a transcript, or approval for a new action.

## Decision rationale

| Decision | Why / reference |
| --- | --- |
| One native app with a pure learning layer and shared SQL | Test the actual behavior without importing a platform; [coding guidelines](CODING_GUIDELINES.md) |
| Independent, assisted, incorrect, and skipped remain distinct | Supported completion must not inflate learning claims; [vocabulary](docs/context.md) |
| One initial implementation commit before review | Keep the complete change easy for the owner to assess; [contributing](CONTRIBUTING.md) governs later fixes |
| Adapt useful workflow concepts instead of importing AI-OS | Keep the child app free of unrelated runtimes and authority; [reuse inventory](docs/reuse-inventory.md) |

## Implementation lessons

- Portable code checks need no generated speech. Native bundling does; the
  tracked audio declaration supplies types only. Use [README setup](README.md).
- Synthetic phonemes are adult development fixtures. Asset hashes and semantic
  digests detect changes; they cannot prove pronunciation or human approval.
  Use [content review](docs/content-review.md).
- Expo Go does not apply the app's native backup-exclusion plugin. Validate
  standalone behavior with [device checks](docs/device-validation.md) and
  [the privacy map](docs/privacy-data-map.md).
- Recovery/reset controls must remain accessible after storage failure. Completed
  lessons can be replayed without multiplying parts. Preserve their regressions
  when changing navigation, startup, or persistence.

## Maintenance

Update these notes when requested by the owner, linking each durable lesson to
its governing rule or evidence. Replace superseded notes rather than accumulating
competing instructions. Keep test counts, temporary blockers, and tool versions in
dated validation/toolchain records, and recheck them before relying on them.
Never store secrets, real learner data, family observations, private contacts,
recordings, or database exports here. This project file does not authorize updates
to global assistant memory or another repository.
