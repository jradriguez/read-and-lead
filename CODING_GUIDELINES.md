# Read and Lead coding guidelines

This file owns application structure, implementation conventions, and test design.
Use the existing Expo SDK 57, React Native, strict TypeScript, Node 24 LTS, and
npm toolchain. [package.json](package.json) and its lockfile define the installed
commands and package set. Consult the versioned Expo docs before native API
changes; do not silently change the SDK to work around a failure.

Start from the current implementation, not the historical plan's scaffold or sample
interfaces. Define an observable acceptance condition for the requested behavior.
Keep feature work within the [product scope](COMPANY_CONTEXT.md); add abstractions
only for demonstrated reuse or to clarify an existing responsibility.

## Boundaries and conventions

| Location | Responsibility |
| --- | --- |
| `src/content/`, `content/` | Typed catalog, cumulative patterns, review contracts, and authored data |
| `src/learning/` | Pure evaluation and deterministic session transitions |
| `src/progress/` | Shared SQL, transactional persistence, retention, and native storage adapter |
| `src/audio/` | Playback ownership, cancellation, and native audio adapter |
| `src/features/` | Workshop, lesson interactions, and gated parent controls |
| `src/ui/` | Shared visual tokens and robot presentation |
| `plugins/` | Existing native private-storage configuration |
| `scripts/`, `tests/`, `.maestro/` | Content/repository checks, deterministic tests, and native flows |

Keep components and modules focused. Follow nearby naming and imports: PascalCase
for components, camelCase for functions/values, and descriptive domain types.
Use the existing Prettier conventions: two-space indentation, double quotes,
semicolons, and trailing commas. Format touched code only; `npm run format`
rewrites all configured application/test directories, so avoid it for narrow edits.
Do not introduce speculative shared frameworks or suppress type/lint failures.

Keep clocks, random IDs, I/O, and native APIs outside the pure learning layer.
Inject deterministic inputs for tests. Keep platform adapters separate so domain
tests work without a device. Reuse established helpers before adding abstractions.

## Behavior that must survive changes

- Evaluate ordered answers exactly. Preserve independent, assisted, incorrect,
  and skipped outcomes; a corrected retry or demonstrated answer is not independent.
- Route tap placement and drag placement through the same rules. Invalid or
  cancelled gestures must not become reading errors. Disable duplicate submissions
  while a save is in flight and preserve the same event ID for a retry.
- Parameterize SQL values. Keep shared statements in `src/progress/schema.ts`
  and `repository.ts`; test them with real SQLite. Attempts and completion updates
  share a transaction, and replayed saves must not duplicate progress or rewards.
- Reject newer or corrupt databases without silent deletion. Preserve recoverable
  save errors and explicit parent reset confirmation. Schema/migration changes
  require authorization and a data-preservation plan.
- Cancel old audio on new playback, leaving an activity, or backgrounding. Late
  callbacks must not affect the current prompt. Add no recording path in M1.
- Keep catalog and native audio bindings consistent. Validate actual asset bytes,
  paths, rights metadata, and review digests. Do not hand-edit generated audio maps
  or check generated draft speech into Git.

## Testing and validation

Use Node's test runner through `tsx` for unit/content/real-SQLite tests, Jest and
React Native Testing Library for component behavior, and Maestro for installed
native flows. Prefer accessible roles/labels and existing stable test IDs. Wait
for state, not arbitrary delays. Playwright browser emulation is not native proof.

For behavior fixes, reproduce the failure and add meaningful regression coverage.
Exercise failure, retry, interruption, duplicate-save, and approval rejection paths
when affected. Keep fixtures synthetic and test-scoped; approved test fixtures do
not approve the shipped catalog. Avoid live model/network calls in tests.

Run focused checks first, then the required gates in [CONTRIBUTING.md](CONTRIBUTING.md).
Documentation-only work needs link/command consistency and the required code gate,
not a new test that merely restates its text. Record unavailable device evidence
instead of substituting mocks for native acceptance.
