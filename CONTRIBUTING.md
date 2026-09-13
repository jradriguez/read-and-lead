# Contributing

Read [AGENTS.md](AGENTS.md), [README.md](README.md) and the current
[implementation status](docs/implementation-status.md) first. This is an adult
prototype; draft content must not be used to assess or teach children.

Use Node 24 and npm. Run `npm ci` and `npm run validate:code` on a fresh clone.
Code checks work without local voice assets; native bundling requires the separate
macOS draft-audio setup in the README. Do not add generated speech to Git.

Create a focused feature branch and PR. Run `npm run validate:code`,
`npm run security:check` and `git diff --check` before review. Review findings must
be verified and fixed before merge. Require green checks on the current PR head,
then squash merge. Never bypass branch protection or autoapprove teaching content.

Changes to curriculum, permissions, storage or native behavior need the associated
content/device checks as well. `npm run validate` remains the strict release gate;
it currently fails for unreviewed content. CI green is prototype engineering
evidence only. Native builds, human review and store submission are separate gates.

Use only synthetic test data. See [SECURITY.md](SECURITY.md) for private reporting.
Original application code has no public redistribution license yet; see
[LICENSE.md](LICENSE.md). A public repository does not grant permission to copy
the application, curriculum or artwork beyond applicable platform terms.
