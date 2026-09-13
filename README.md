# Read and Lead

An English reading adventure set in a robot workshop. This repository contains an
**adult development prototype**, not an approved child learning product.

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
See [toolchain](docs/toolchain.md) for observed versions and build blockers.

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

An Expo Go iPad simulator session completed the first lesson using tap controls,
saved one part, and displayed the landscape workshop. The iPhone simulator rendered
the workshop and parent area. Drag completion, physical-device use, a standalone
offline build and Android runtime behavior remain unverified. Expo Go does not apply
this app's native backup-exclusion plugin and is not release/privacy evidence.

See [implementation status](docs/implementation-status.md),
[device validation](docs/device-validation.md), [design](docs/design.md),
[original plan](docs/implementation-plan.md), and [reuse inventory](docs/reuse-inventory.md).

Original app code has no public redistribution license yet; template and dependency
licenses remain applicable. The public development repository is
[jradriguez/read-and-lead](https://github.com/jradriguez/read-and-lead).
See [contributing](CONTRIBUTING.md) and [GitHub setup](docs/github-setup.md).
No store submission has been created.

## Working in this repository

Start with [AGENTS.md](AGENTS.md) for required reading, task-specific references,
and the M1 scope boundary. [CONTRIBUTING.md](CONTRIBUTING.md) owns validation and
the one-initial-commit workflow. Use current implementation status to choose work;
load historical plans only for the relevant task. Instruction provenance is in
[the reuse inventory](docs/reuse-inventory.md).
