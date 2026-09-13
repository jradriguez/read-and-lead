# Contributing to Read and Lead

Read [AGENTS.md](AGENTS.md), [README.md](README.md) and the current
[implementation status](docs/implementation-status.md) first. This is an adult
prototype; draft content must not be used to assess or teach children.

Use Node 24 and npm. Run `npm ci` and `npm run validate:code` on a fresh clone.
Code checks work without local voice assets; native bundling requires the separate
macOS draft-audio setup in the README. Do not add generated speech to Git.

## Working agreement

Read [AI_AGENT_POLICY.md](AI_AGENT_POLICY.md), [CODING_GUIDELINES.md](CODING_GUIDELINES.md),
and [STYLE_GUIDE.md](STYLE_GUIDE.md) for the applicable implementation rules.
Inspect `git status` before changes. Work inline on a focused feature branch,
such as `docs/project-guidance` or `fix/lesson-replay`, and preserve unrelated edits.
Do not reset, rebase, or clean another task's work to simplify your branch.

Complete the initial implementation in **one commit before review**, including
its tests and documentation. Do not make a separate commit for each file, plan
step, or intermediate fix. Stage task-owned paths explicitly and inspect the
staged diff. Use an imperative subject that describes the complete change.
A few focused commits for subsequent review fixes are welcome; keep the review
history understandable. Do not rewrite shared history without authorization.

Before the initial commit, run focused checks, `npm run validate:code`,
`npm run security:check`, and `git diff --check`. Check the staged diff with
`git diff --cached --check` too. Missing tooling or a failing check must be reported
with its exact blocker; never bypass hooks or weaken gates to get a green result.
For Markdown changes, verify relative links and commands against current files
and package scripts; do not copy commands from another repository unverified.

## Review and merge

Use [the engineering review checklist](docs/engineering-review.md) and the
[PR template](.github/pull_request_template.md). Lead with the concrete problem
and resulting behavior, followed by the reason, validation, and relevant risks.
Distinguish passed, failed, and not-run checks. Do not claim a new independent
review when only the implementation author checked the diff.

Prepare the commit and review notes locally. Remote push, PR publication, and
merge need explicit authorization under [the agent policy](AI_AGENT_POLICY.md).
When authorized, use a focused PR and verify review findings before merge.
Require green checks on the current PR head, then squash merge; never bypass
branch protection or autoapprove teaching content. Confirm the remote merged
state before declaring a merge complete or cleaning task-owned branches.

## Content and release gates

Changes to curriculum, permissions, storage or native behavior need the associated
content/device checks as well. `npm run validate` remains the strict release gate;
it currently fails for unreviewed content. CI green is prototype engineering
evidence only. Native builds, human review and store submission are separate gates.

Use only synthetic test data. See [SECURITY.md](SECURITY.md) for private reporting.
Original application code has no public redistribution license yet; see
[LICENSE.md](LICENSE.md). A public repository does not grant permission to copy
the application, curriculum or artwork beyond applicable platform terms.
