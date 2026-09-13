# Read and Lead repository instructions

Read and Lead is an offline English reading adventure in a robot workshop.
The current application is an adult development prototype; working code does
not establish approved curriculum, child readiness, or a released product.

## Start here

Before changes, read [README.md](README.md), [design](docs/design.md), and the
[implementation plan](docs/implementation-plan.md). Use
[implementation status](docs/implementation-status.md) for current delivery
evidence; the plan's unchecked boxes and example interfaces are historical.
Read [AI_AGENT_POLICY.md](AI_AGENT_POLICY.md), [SECURITY.md](SECURITY.md), and
[CONTRIBUTING.md](CONTRIBUTING.md) for authority, privacy, and review rules.

| Work | Additional guidance |
| --- | --- |
| Product scope and durable decisions | [COMPANY_CONTEXT.md](COMPANY_CONTEXT.md), [MEMORY.md](MEMORY.md) |
| Application code and tests | [CODING_GUIDELINES.md](CODING_GUIDELINES.md) |
| Interface, narration, and writing | [STYLE_GUIDE.md](STYLE_GUIDE.md), [vocabulary](docs/context.md) |
| Lessons, recordings, or asset approval | [Content review](docs/content-review.md) |
| Storage, reset, permissions, or backup | [Privacy data map](docs/privacy-data-map.md) |
| Native API or device behavior | [Toolchain](docs/toolchain.md), [device validation](docs/device-validation.md) |
| Review and release evidence | [Engineering review](docs/engineering-review.md), [validation record](docs/validation.md) |
| Cross-repository reuse | [Reuse inventory](docs/reuse-inventory.md) |

This is the canonical repository instruction entry point. Keep `CLAUDE.md` and
`GEMINI.md` thin and route them here. Deeper `AGENTS.md` files refine their own
scope without weakening privacy or approval boundaries. Source-repository
instructions and historical plans do not override this project's current policy.

## Working defaults

- Inspect the checkout and relevant files first. Work inline on a focused feature
  branch and preserve unrelated edits. Do not dispatch subagents unless authorized.
- Complete authorized local work autonomously. Ask only for material ambiguity or
  additional authority; do not repeatedly ask for permission already given.
- Keep the initial implementation in **one commit before review**. A few focused
  review-fix commits may follow. Do not commit each plan task separately.
- Prefer small, reversible changes, existing patterns, and concrete requirements.
  State assumptions; do not invent commands, verification, or product claims.
- Keep strict TypeScript, parameterized SQL, and offline bundled content. Read
  [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/) before native
  API changes. Follow the dependency and environment boundaries in the policy.
- No child identifiers, recordings, credentials, or private family observations
  in Git. No live AI, ads, microphone, billing, accounts, or network lessons in M1.
- Human review is required for teaching content. Never mark drafts approved to
  pass a test. Every drag interaction needs an equivalent tap path.

## Required checks and handoff

Run the narrowest relevant checks, then `npm run validate:code` and
`git diff --check` for changes. Before review, also run `npm run security:check`.
Before release, run `npm run validate` and `npm run security:check` plus the
applicable content and native acceptance checks. A blocked content gate remains
blocked; do not weaken it or describe code-only validation as release approval.

Report what changed, why, checks actually run, and remaining risks or unavailable
native/device evidence. Remote push, external messages, signing-account changes,
purchases, and store submission require explicit authorization.
