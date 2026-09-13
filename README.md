# Read to Lead

An English reading adventure set in a robot workshop. This repository contains an
**adult development prototype**, not an approved child learning product.

**Read to Lead is provisional.** A [name review](docs/product-name-review.md)
found existing literacy products and app listings using this name or close variants.
Final branding is blocked pending clearance or a new name. The GitHub repository,
local directory and technical app identifiers retain their existing names.

Implemented: two cumulative draft mini-lessons, sound matching, ordered word building,
tap placement, drag handling, a robot reward, local SQLite progress, and a gated parent
area. Progress distinguishes independent, assisted, incorrect and skipped responses.
No backend, accounts, microphone, ads, purchases or live AI are part of M1.

## Run the local prototype

Requires Node 24 LTS, npm and macOS for the temporary voice-generation command.

```sh
npm ci
npm run draft:audio
NODE_OPTIONS=--dns-result-order=ipv4first npx expo start --go --localhost
```

Open `exp://127.0.0.1:8081` in **Expo Go SDK 57 on the local iOS simulator**.
That loopback address is for the simulator on this Mac, not a physical iPad.
Local draft audio files and their generated import map are ignored by Git. Run the
audio command after a fresh clone before bundling. Code checks run on any supported
Node 24 host without generated audio; the tracked declaration provides types only. The clips are
only placeholders for adult functional review: synthetic phoneme pronunciation is
not reliable and redistribution rights have not been established.

A custom development client uses `npm start`, `npm run ios`, or `npm run android`
after compatible native tools are installed. Xcode 26.4+ and CocoaPods are required
for iOS builds. Android requires the SDK, JDK and emulator/device toolchain.
See [toolchain](docs/toolchain.md) for installed versions and native build commands.

## Check the code and release readiness

```sh
npm run validate:code
npm run content:check:draft
npm run content:check
npm run security:check
```

`validate:code` covers ESLint, strict types, unit tests, UI tests and repository
boundaries. `content:check:draft` checks the local draft catalog and actual asset
files. `content:check` is the strict release gate and **currently fails intentionally**
for unreviewed lessons, unapproved audio rights and missing human review digests.
`validate` includes that release gate and is therefore not green yet.
A non-development app refuses to start a draft catalog. Do not bypass this to test
with children. See [content review](docs/content-review.md).

## Evidence and next work

Local iOS simulator and Android debug builds completed both draft lessons using
tap controls, retained earned parts across restarts, and rejected an empty parent
gate answer in ordered Maestro tests. Native privacy configuration and dependency
evidence are recorded locally. Physical-device use, drag completion, reviewed
audio, standalone offline release and no-egress acceptance remain unverified.
Debug clients use Metro; passing these checks does not approve child use or release.

See [implementation status](docs/implementation-status.md),
[device validation](docs/device-validation.md), [design](docs/design.md),
[original plan](docs/implementation-plan.md), and [reuse inventory](docs/reuse-inventory.md).

The [product excellence roadmap](docs/product-excellence-roadmap.md) accounts for
[merged PR #11](https://github.com/jradriguez/read-and-lead/pull/11) and prioritizes
responsive letter placement, reviewed narration, a polished workshop mission and
physical-device acceptance. Its [learning and experience research](docs/learning-and-experience-research.md)
records teaching evidence and comparison apps; [development tools and workflows](docs/development-tools-and-workflows.md)
records the installed Codex plugins, dependency decisions and specialist assignments.

Original app code has no public redistribution license yet; template and dependency
licenses remain applicable. The public development repository is
[jradriguez/read-and-lead](https://github.com/jradriguez/read-and-lead).
See [contributing](CONTRIBUTING.md) and [GitHub setup](docs/github-setup.md).
No store submission has been created.

For platform, privacy, child-safety and commercial release planning, see the
[mobile requirements research](docs/mobile-requirements-research.md) and
[readiness implementation plan](docs/mobile-readiness-plan.md). These distinguish
current evidence, store rules, legal-review questions and proposed release gates;
they do not establish approval to use the prototype with children or publish it.

## Working in this repository

Start with [AGENTS.md](AGENTS.md) for required reading, task-specific references,
and the M1 scope boundary. [CONTRIBUTING.md](CONTRIBUTING.md) owns validation and
the one-initial-commit workflow. Use current implementation status to choose work;
load historical plans only for the relevant task. Instruction provenance is in
[the reuse inventory](docs/reuse-inventory.md).
