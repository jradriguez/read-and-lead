# GitHub configuration

Repository: [jradriguez/read-and-lead](https://github.com/jradriguez/read-and-lead).
The owner created it public; visibility is preserved. This hosts an adult prototype,
not an App Store release. Original code's redistribution license remains undecided.

## Configuration target

- Description and relevant mobile/reading/robotics topics; no invented product URL.
- Default branch `main`; squash merges only; delete merged feature branches.
- Issues with a synthetic-data bug template; wiki and unused project board disabled.
- CODEOWNERS and PR template. No required self-approval: GitHub does not let an author
  approve their own PR. Independent agent review is recorded in the PR evidence.
- Protect `main` for administrators too: PR required, current-base status checks,
  resolved conversations, linear history, no forced pushes or branch deletion.
- Required checks: `Prototype code checks`, `Secret scan`, `CodeQL analysis`,
  and the separate `CodeQL` alert-result check. Required checks are bound to their
  GitHub Actions/code-scanning integration IDs.
- Dependabot alerts, security updates and weekly package/action update PRs.
  Expo native packages still need compatibility review; no automatic dependency merge.
- Secret scanning, push protection and private vulnerability reporting.

These are free public-repository features. Workflows use standard GitHub-hosted
Ubuntu runners, pinned action commits, a checksum-pinned Gitleaks binary and no
deployment credentials. CodeQL's job can write security analysis results; other
workflow permissions are read-only. No paid runner, plan upgrade, EAS service,
Pages deployment, signing credential or billing setup is included.

Sources checked September 12, 2026: [protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches),
[GitHub Actions](https://github.com/features/actions),
[security features](https://docs.github.com/en/code-security/getting-started/quickstart-for-securing-your-repository).

## Engineering and release gates

Prototype CI runs lint, TypeScript, deterministic domain/SQLite/component tests,
repository boundaries, npm audit, Gitleaks and CodeQL. It needs no generated voice
assets. Content-validator regression tests exercise approved synthetic fixtures and
rejection paths; they never approve the actual curriculum.

`npm run validate` remains the release gate. It checks the real local audio bytes,
native import map, review status and bound human-review digest. It currently fails
because the real pack is unreviewed. CI does not run this knowingly blocked gate
or disguise its failure. Human content/rights review, native builds and physical
device acceptance must pass before family use or store preparation.

The empty remote is initialized with an empty `main` baseline so the complete
prototype can be reviewed and merged through a PR. No existing remote history is
overwritten. Actual applied settings and exact-head CI/merge evidence are verified
through GitHub before the handoff; this document describes the intended contract.
