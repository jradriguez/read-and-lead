# Contributing to Read to Lead

This file owns branch, commit, validation, and review workflow. Start with
[AGENTS.md](AGENTS.md) for required reading and scope; [agent policy](AI_AGENT_POLICY.md)
owns authorization. Use Node 24 and npm. Fresh-clone setup is in [README.md](README.md).

## Implement a bounded change

Inspect `git status` and relevant code first. Work inline on a focused feature
branch, preserve unrelated edits, and name the behavior, acceptance gap, or
maintenance need the change addresses. Define how to verify it before editing.
Load coding/style guidance for the affected work; avoid unrelated refactors,
features, dependencies, or changes to failing tests outside the task.

Keep the initial implementation in **one commit before review**, including tests
and documentation. Do not commit each file, plan step, or intermediate fix.
Stage task-owned paths explicitly, inspect the staged diff, and use an imperative
subject describing the complete change. A few focused review-fix commits may
follow. Do not rewrite shared history or clean another task's work.

## Validation contract

[package.json](package.json) defines executable commands. Run focused checks first,
then apply this table to the current revision. Reuse results from that revision;
repeat or broaden checks only after relevant changes or unresolved failures.

| Point / affected scope | Required checks |
| --- | --- |
| Every change | `npm run validate:code`, `git diff --check` |
| Before commit/review and authorized push | Above, plus `npm run security:check`; inspect staged content and run `git diff --cached --check` before committing |
| Immediately before a publication-bound local commit | `npm run publication:check` on the exact index and identity; use the verified GitHub noreply address for both author and committer |
| Markdown instructions | Verify local links, npm command references, policy consistency, and document ownership |
| Content/media | Relevant content tests and `npm run content:check:draft` against actual files; [human approval](docs/content-review.md) before child use |
| Native, storage, touch, or audio behavior | Affected automated tests and [device checklist](docs/device-validation.md); report unavailable evidence |
| Release | `npm run validate`, `npm run security:check`, and applicable human/content/native acceptance |

Code checks do not require generated audio; native bundling does. The strict
release gate rejects unreviewed content. Its failure blocks release, not unrelated
adult prototype work. Never bypass hooks, fabricate review, or weaken a gate.
Report failed or unavailable checks with their cause; do not label partial
validation green. Use synthetic fixtures and keep generated speech/private data
out of Git. See [SECURITY.md](SECURITY.md) for scan scope and private reporting.

## Review and authorized merge

Use [engineering review](docs/engineering-review.md) and the
[PR template](.github/pull_request_template.md). Explain the problem, resulting
behavior, reason, checks actually run, and remaining risks. Identify self-review
honestly; do not call it independent review. Verify findings before fixing them.

Prepare the commit and review notes locally. Remote publication and merge follow
the agent policy. When authorized, require green checks on the current PR head,
resolve review findings, and squash merge without bypassing branch protection.
Confirm the remote merged state before declaring completion or cleaning task-owned
branches. See [LICENSE.md](LICENSE.md) for redistribution status.

## Keep instructions useful

Give each rule one detailed home and link to it from the routing map. Keep only
essential scope/privacy/authority guardrails repeated in `AGENTS.md`. Host shims
must not fork policy. Update affected references when a decision changes; keep
historical plans labeled and dated evidence separate from standing instructions.
Do not add another checklist, agent pack, or policy file unless it has a distinct
purpose that existing documents cannot serve. Documentation is guidance; do not
claim automated enforcement where no executable check exists.
