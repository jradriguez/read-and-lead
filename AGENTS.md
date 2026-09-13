# Read and Lead repository instructions

Build an English reading adventure where beginning readers help a friendly robot
in its workshop: hear/read → assemble → test → celebrate → finish. Prioritize
accurate instruction, guided independence, and a calm, accessible offline loop.
The current application is an adult prototype; M1 child-use acceptance is pending.

## Read in this order

1. Read [README.md](README.md) and [implementation status](docs/implementation-status.md)
   for setup, delivered behavior, and the next bounded work.
2. Before edits, read [agent policy](AI_AGENT_POLICY.md), [security](SECURITY.md),
   and [contributing](CONTRIBUTING.md) for authority, data protection, and checks.
3. Load the relevant references below. Read a document once per task; revisit it
   when its scope or contents change. Do not load every historical plan by default.

| Task | Read next |
| --- | --- |
| Product scope or feature choice | [Product context](COMPANY_CONTEXT.md), relevant [design](docs/design.md) sections |
| Code or tests | [Coding guidelines](CODING_GUIDELINES.md); relevant task in the [original plan](docs/implementation-plan.md) when needed |
| UI, narration, or teaching copy | [Style guide](STYLE_GUIDE.md), [vocabulary](docs/context.md), [content review](docs/content-review.md) for instruction/media |
| Storage, reset, or permissions | [Privacy map](docs/privacy-data-map.md), [device validation](docs/device-validation.md) |
| Native APIs or device work | [Toolchain](docs/toolchain.md), [device validation](docs/device-validation.md), [Expo SDK 57](https://docs.expo.dev/versions/v57.0.0/) before native API changes |
| Review or release planning | [Engineering review](docs/engineering-review.md); [release requirements](docs/design.md#validation-and-decision-gates) for applicable release work |
| Prior decisions or external reuse | [Repository memory](MEMORY.md) or [reuse inventory](docs/reuse-inventory.md), as needed |

This file owns routing and essential guardrails. Detailed rules belong in their
linked owner document. Keep `CLAUDE.md` and `GEMINI.md` as thin entry points.
Deeper instructions refine their scope without weakening privacy or approval.
Design defines intent; code and dated evidence establish what exists. Plans and
research propose work, not authorization. Resolve material conflicts explicitly.

## Keep the work bounded

- Tie the requested change to a lesson/parent outcome, a documented acceptance
  gap, or a concrete maintenance need. Defer unrelated ideas. M2/M3 features
  require separately scoped work.
- Preserve one Expo/strict TypeScript app, parameterized SQL, bundled content,
  and equivalent tap/drag paths. No backend, accounts, live AI, ads, analytics,
  microphone, billing, or network lessons in M1.
- Keep child identifiers, recordings, credentials, and private family observations
  out of Git. Human review approves teaching material; never approve drafts to
  pass a test. Completion is not mastery; simulator success is not device acceptance.
- Inspect first; work inline on a feature branch, preserve unrelated edits, and
  use existing patterns. Do not dispatch subagents unless authorized. Complete
  authorized local work without repeated permission requests; additional authority
  follows the agent policy. Remote push, messaging, spending, and submission are
  not implied.
- Keep the initial implementation in **one commit before review**; a few focused
  review-fix commits may follow. Do not create a commit per plan step.

## Finish with evidence

Run focused checks, `npm run validate:code`, and `git diff --check` for changes;
add `npm run security:check` before review. Before release, also require
`npm run validate` and applicable human/native acceptance. Follow the complete
check table in [contributing](CONTRIBUTING.md#validation-contract). Report what
changed, why, actual results, and remaining risks or unavailable evidence.
Never weaken a blocked gate.
