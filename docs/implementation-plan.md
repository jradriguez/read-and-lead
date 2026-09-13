# Read and Lead First Playable Implementation Plan

Original approved plan. See [implementation status](implementation-status.md) for current completion evidence and remaining gates.

> **Current execution policy:** Follow [AGENTS.md](../AGENTS.md) and
> [CONTRIBUTING.md](../CONTRIBUTING.md). Work inline unless delegation is authorized.
> Read only the task relevant to the requested work. Checkboxes are historical
> implementation checkpoints, not commit boundaries or evidence of current gaps.
> Current code and `package.json` supersede scaffold/interface/command examples;
> the contribution workflow governs commits and checks.

**Goal:** Create a new mobile repository and deliver two reviewed, offline robot-workshop mini-lessons with native interaction, audio, local progress, and a parent area.

**Architecture:** One Expo application with a pure TypeScript lesson engine, bundled reviewed content, a SQLite progress repository, and native UI/audio adapters. No server or live AI is required. Build the smallest complete lesson loop before expanding the content library.

**Tech Stack:** Stable Expo SDK 57, React Native, TypeScript, Node 24 LTS, npm; expo-audio, expo-sqlite, expo-asset; compatible gesture/reanimated packages only for drag; Node test runner through tsx, Jest/React Native Testing Library, Maestro.

**Spec:** [Read and Lead design](design.md), especially M1 and its ten acceptance criteria.

**Execution boundary:** This is a plan, not a generated application. Use inline execution by default; do not dispatch agents without authorization. M2 microphone/song/library expansion and M3 billing/public release require separate implementation plans informed by M1 results. Package additions below are design recommendations to apply when implementation is authorized, not installed dependencies.

## Global Constraints

- Name: Read and Lead; repository directory: read-and-lead.
- Language: English only, with US English model recordings.
- Primary layout/test target: iPad; retain Android and phone layouts.
- Framework baseline: stable Expo SDK 57, Node 24 LTS, npm, strict TypeScript.
- Core lessons must work offline in an installed release build.
- Child runtime has no live generative AI, ads, social features, or purchases.
- Required child reading uses only introduced sound-spelling patterns and explicitly taught irregular words.
- Every drag interaction has a tap-to-select and tap-to-place equivalent.
- Attempt history distinguishes independent, assisted, incorrect, and skipped responses.
- Private learner data, recordings, credentials, and test artifacts stay out of git.
- Physical-device validation is required before declaring native readiness.
- No hardware integrations, math curriculum, account service, or content CDN in the first milestone.

## File map and command contract

All paths below are inside the future `read-and-lead` repository, not Atlas.
Create a fresh repository under the owner's existing projects directory; resolve
that parent from the active workspace rather than writing a personal path into
committed docs. If a repository already exists, inspect its instructions/status
and adapt; never overwrite it or initialize inside the parent projects repository.

```text
read-and-lead/
  AGENTS.md                     # scope, workflow, privacy and validation routing
  README.md                     # actual setup, commands and prototype limitations
  SECURITY.md                   # private data and reporting boundaries
  App.tsx                       # boot and small screen switch
  app.json                      # local display/platform config, no signing values
  package.json / package-lock.json / tsconfig.json
  eslint.config.mjs / jest.config.cjs
  src/
    content/types.ts            # canonical pattern, word, lesson and asset types
    content/validate.ts         # fail-closed content validation
    content/catalog.ts          # reviewed lesson/media lookup
    learning/types.ts           # attempt/session contracts
    learning/evaluate.ts        # deterministic response classification
    learning/session.ts         # question order, hint, demonstration, skip
    progress/schema.sql        # version 1 SQLite schema
    progress/repository.ts      # progress interface and shared query functions
    progress/native.ts          # Expo SQLite adapter
    audio/controller.ts        # playback interface and cancellation ownership
    audio/native.ts            # Expo audio adapter
    features/workshop/WorkshopScreen.tsx
    features/lesson/LessonScreen.tsx
    features/lesson/SoundMatch.tsx
    features/lesson/WordBuilder.tsx
    features/lesson/LetterTile.tsx
    features/lesson/placement.ts
    features/parent/ParentGate.tsx
    features/parent/ParentScreen.tsx
    features/parent/gate.ts
    ui/Robot.tsx / ui/tokens.ts
  content/lessons/01-first-sounds.json
  content/lessons/02-first-words.json
  content/words.json / content/patterns.json / content/assets.json
  assets/audio/ / assets/art/     # only reviewed, licensed/original material
  scripts/check-content.ts
  scripts/check-repo.ts
  tests/content.test.ts / tests/evaluate.test.ts / tests/session.test.ts
  tests/progress.test.ts / tests/placement.test.ts / tests/audio.test.ts
  tests/ui/lesson.test.tsx / tests/ui/parent.test.tsx
  tests/fixtures/catalog.ts
  .maestro/lesson.yaml / .maestro/resume.yaml / .maestro/parent.yaml
  docs/design.md / docs/implementation-plan.md / docs/context.md
  docs/reuse-inventory.md / docs/toolchain.md / docs/content-review.md
  docs/device-validation.md / docs/privacy-data-map.md
  outputs/                      # ignored device evidence and private observations
```

Task 1 creates these npm script names so later commands are real interfaces:

```json
{
  "start": "expo start --dev-client",
  "ios": "expo run:ios",
  "android": "expo run:android",
  "lint": "eslint . --max-warnings=0",
  "typecheck": "tsc --noEmit",
  "test:unit": "tsx --test tests/*.test.ts",
  "test:ui": "jest --runInBand",
  "content:check": "tsx scripts/check-content.ts --release",
  "repo:check": "tsx scripts/check-repo.ts",
  "validate": "npm run lint && npm run typecheck && npm run test:unit && npm run test:ui && npm run content:check && npm run repo:check",
  "security:check": "npm audit --audit-level=high && gitleaks git --redact && gitleaks dir . --redact",
  "test:native": "maestro test .maestro"
}
```

Use one ESLint config compatible with the scaffolded SDK and exclude generated
native folders, dependencies and outputs from lint. Jest discovers only
`tests/ui/**/*.test.tsx`, uses `jest-expo`, and has no paid/cloud fixtures.
Keep the secret scanner's scope reviewable; use its normal ignore support for
generated dependencies/builds without excluding authored content or specifications.
Verify CLI flags against installed help before wiring them. An empty placeholder
test suite is not a passed feature test.

## Task 1: Create a safe, bootable native foundation

**Files:** root scaffold/configuration, `App.tsx`, `src/ui/Robot.tsx`, `src/ui/tokens.ts`, `scripts/check-repo.ts`, `tests/ui/lesson.test.tsx`, `docs/{toolchain,reuse-inventory,design,implementation-plan}.md`.

**Interfaces:** produces a native root screen with `testID="workshop"`, accessible
"Read and Lead" title, and `testID="start-lesson"` action. No network/data APIs yet.

- [ ] Inspect the parent instructions, existing destination, source repository
  committed trees, Node, npm, Xcode and Android tooling. Record versions and the
  actual iPad OS privately; publish only the general tested-device matrix later.
  Current planning evidence is Node 24.14.1 and Command Line Tools selected.
  Check full Xcode availability before proposing installation or selection.
- [ ] Confirm the stable Expo 57 template metadata before generation; record the
  resolved generator/template versions in `docs/toolchain.md`. The template
  command below is documented by [Expo](https://docs.expo.dev/more/create-expo/).
  If the resolved template targets another SDK, inspect compatible template tags
  and select 57 explicitly; do not silently change the architecture baseline.

```bash
npm view create-expo-app version
npm view expo-template-blank-typescript version dependencies --json
npx create-expo-app@latest read-and-lead --template blank-typescript --no-install
cd read-and-lead
git rev-parse --show-toplevel
```

- [ ] Ensure the new folder is its own Git root. If the generator did not create
  one, run `git init -b main` inside it, then confirm `--show-toplevel` again.
  Work on a local `feat/first-playable` branch. Do not create a remote or push.
- [ ] Install only the compatible package set needed by this plan. Let Expo
  select native versions and use a lockfile; inspect audit output before proceeding.

```bash
npm install
npx expo install expo-dev-client expo-audio expo-sqlite expo-asset
npx expo install react-native-gesture-handler react-native-reanimated react-native-worklets
npx expo install jest-expo --dev
npm install --save-dev tsx jest @types/jest @testing-library/react-native eslint typescript
npx expo install --check
```

- [ ] Configure strict types, Jest/ESLint and the command contract. Add ignored
  paths for `.env*` except `.env.example`, `.expo/`, `node_modules/`, `outputs/`,
  signing credentials, device reports, recordings and local databases. Do not
  copy private data, broad scanner exemptions or source-repository git history.
- [ ] Write the following UI test, observe the missing screen failure, then add
  a minimal native screen/robot matching it. Keep example art clearly labeled.

```tsx
import { render, screen } from '@testing-library/react-native';
import App from '../../App';

test('a non-reader can find the lesson entry action', () => {
  render(<App />);
  expect(screen.getByTestId('workshop')).toBeTruthy();
  expect(screen.getByRole('button', { name: 'Start lesson' })).toBeTruthy();
});
```

- [ ] Implement `scripts/check-repo.ts` to inspect `git ls-files -z`: reject
  tracked `.env`/signing credentials, files in outputs, audio recordings, SQLite
  runtime files, `.auth`, and real learner data paths. Fail on missing documented
  npm commands. Test with a temporary Git fixture containing a forbidden runtime
  file, then a safe `content/assets.json` manifest; do not create secrets as fixtures.
- [ ] Add `docs/reuse-inventory.md` with source/path/SHA/license/change/test columns.
  For M1 adapt original neutral instructions and test conventions; copy no AI-OS
  Python runtime. Verify any later literal extraction against a committed tree.
- [ ] Run `npm run lint`, `npm run typecheck`, `npm run test:ui`, `npm run repo:check`,
  and one simulator build when tooling permits. Confirm no microphone prompt.
  Treat the completed foundation as a validation checkpoint. The full content gate
  becomes required in Task 2, when content exists; do not weaken it to make Task 1
  look complete.

## Task 2: Establish the content contract and reviewed mini-lessons

**Files:** `src/content/*`, `content/*`, `assets/audio/*`, `assets/art/*`,
`scripts/check-content.ts`, `tests/content.test.ts`, `tests/fixtures/catalog.ts`,
`docs/content-review.md`.

**Interfaces:** `validateCatalog(catalog: Catalog, release: boolean): string[]`
returns explicit error codes; `catalog` exports a validated `Catalog`.
`getLesson(id: string): Lesson` rejects missing IDs. Define these canonical types:

```ts
export type Asset = {
  id: string; file: string; sha256: string;
  creator: string; rights: string; reviewed: boolean;
};
export type Pattern = { id: string; grapheme: string; modelAudioId: string };
export type Word = {
  id: string; text: string;
  segments: { text: string; patternId: string }[];
  modelAudioId: string;
};
export type Activity = {
  id: string; kind: 'sound-match' | 'word-build';
  promptAudioId: string; answer: string[]; choices: string[];
  wordId?: string;
};
export type Lesson = {
  id: string; version: number; introducedPatternIds: string[];
  prerequisiteLessonIds: string[]; activities: Activity[];
  connectedText: string; connectedWordIds: string[];
  connectedTextAudioId: string;
  review: { state: 'draft' | 'approved'; reviewer: string; digest: string };
};
export type Catalog = {
  patterns: Pattern[]; words: Word[]; lessons: Lesson[]; assets: Asset[];
};
```

- [ ] Add synthetic fixtures with patterns m/a/s/t, words am/Sam/mat/sat,
  and two mini-lessons. Lesson 2 includes the modeled sentence "Sam sat."
  Define `sam` as `s/short-a/m`, with its capitalization handled explicitly.
  `answer` contains selectable pattern IDs in order, not audio text or a plaintext
  child answer. Only include distractors already introduced by this point.
- [ ] Add failing tests for duplicate IDs, missing audio, concatenated word
  segments not matching text case-insensitively, unknown/untaught pattern use,
  invalid prerequisites/cycles, answers absent from choices, and unapproved release
  content. Fixtures are data inside tests and never shipped as approved lessons.

```ts
import test from 'node:test';
import assert from 'node:assert/strict';
import { validateCatalog } from '../src/content/validate.ts';
import { makeCatalog } from './fixtures/catalog.ts';

test('a later vowel cannot enter an earlier lesson silently', () => {
  const c = makeCatalog();
  c.lessons[0].activities[0].answer = ['short-i'];
  assert.ok(validateCatalog(c, false).includes('UNTAUGHT_PATTERN'));
});
test('drafts are useful locally but cannot become a release pack', () => {
  const c = makeCatalog();
  c.lessons[0].review.state = 'draft';
  assert.ok(validateCatalog(c, true).includes('UNAPPROVED_LESSON'));
});
```

- [ ] Implement traversal in prerequisite order with an introduced-pattern set;
  reject unknown nodes and cycles rather than guessing order. Compare answers,
  word segments and connected-word IDs with that cumulative set. Use the exact
  error code `UNTAUGHT_PATTERN` consistently across implementation and tests.
  Tokenize connected text and verify it matches `connectedWordIds` in sequence,
  allowing only explicitly handled case/punctuation differences. The lesson must
  not declare safe word IDs while displaying different, unreviewed text.
- [ ] The CLI resolves asset paths within `assets/`, rejects traversal/symlinks,
  missing or empty files, duplicate IDs and SHA-256 mismatch. It checks review
  state plus a digest of semantic lesson content and referenced asset hashes.
  A changed prompt or recording invalidates approval. Use stable canonical JSON
  key sorting before hashing; exclude review metadata from its own digest.
  `catalog.ts` also runs strict validation for non-development builds and refuses
  to launch draft content. A review digest detects change; it does not authenticate
  a reviewer. Repository access and human review remain the approval authority.
- [ ] Create original minimal art and obtain reviewed US English recordings for
  the prompts, sounds, words and connected text. Draft voice assets may be used
  by adults during development but are blocked from child/pilot bundles.
  Record creator and redistribution rights; human review changes state to approved
  only after listening/reading. Do not auto-sign AI-authored content as reviewed.
- [ ] Run `npm run test:unit`, `npm run content:check`, and `npm run validate`.
  If human review is unavailable, domain work may continue with fixtures, but
  record the blocked child-test/release gate instead of claiming a green content pack.
  Include the reviewed contract and safe content in the initial implementation;
  keep private reviewer contact information outside git.

## Task 3: Implement a deterministic lesson and feedback engine

**Files:** `src/learning/{types,evaluate,session}.ts`, `tests/evaluate.test.ts`,
`tests/session.test.ts`.

**Interfaces:** `evaluate(activity, response): Outcome`; `startSession(lessonId,
sessionId): Session`; `reduceSession(state, event): Session`. No framework, clock,
randomness, file access or network calls inside these functions.

```ts
export type Outcome = 'independent' | 'assisted' | 'incorrect' | 'skipped';
export type Response = { selected: string[]; hints: number; skipped: boolean };
export type Attempt = {
  id: string; sessionId: string; learnerId: string;
  lessonId: string; lessonVersion: number; activityId: string;
  outcome: Outcome; hints: number; createdAt: number;
};
export type Session = {
  lessonId: string; sessionId: string; activityIndex: number;
  hints: number; failures: number; phase: 'answer' | 'demonstrate' | 'complete';
};
export type SessionEvent =
  | { type: 'hint' }
  | { type: 'answered'; outcome: Outcome; activityCount: number }
  | { type: 'demonstrated'; activityCount: number };
```

- [ ] Write tests for ordered word answers, assisted correct answers, skip, and
  an incorrect answer containing all the right letters in the wrong order.

```ts
test('a correct response after a hint is assisted', () => {
  const a = { id: 'build-am', kind: 'word-build' as const,
    promptAudioId: 'build-am', answer: ['short-a', 'm'], choices: ['m', 'short-a'] };
  assert.equal(evaluate(a, { selected: ['short-a', 'm'], hints: 1, skipped: false }), 'assisted');
  assert.equal(evaluate(a, { selected: ['m', 'short-a'], hints: 0, skipped: false }), 'incorrect');
});
```

- [ ] Implement evaluation using exact ordered equality, not sorted arrays or
  word familiarity. Skip takes precedence. A correct answer is independent only
  when hints are zero; otherwise assisted. The session must carry a hint after
  an incorrect attempt so a corrected retry cannot become a first-attempt success.
- [ ] Test two failures transition to `demonstrate`; demonstration completion
  advances as supported practice without creating an independent outcome. A final
  supported completion ends the lesson. Clamp/fail invalid activity counts;
  don't wrap into an unrelated lesson.
- [ ] Prevent repeated submit taps while an answer/save is in flight in the UI,
  while retaining repository-level attempt-ID idempotency in Task 4. Generate IDs
  in the adapter, passing them into the deterministic layer.
- [ ] Run focused unit tests, then `npm run validate`. Keep the engine separate
  from native interactions in code so its logic can be reviewed and reused; include
  both in the single initial implementation commit.

## Task 4: Save attempts and progress without losing or duplicating rewards

**Files:** `src/progress/{schema.sql,repository.ts,native.ts}`, `tests/progress.test.ts`,
`docs/privacy-data-map.md`.

**Interfaces:** `ProgressRepository.record(attempt: Attempt, completedLesson?:
{ id: string; version: number }): Promise<void>`;
`summary(learnerId: string): Promise<ProgressSummary>`; `reset(learnerId: string):
Promise<void>`; `prune(before: number): Promise<void>`. `ProgressSummary` contains
`independent`, `assisted`, `incorrect`, `skipped` numeric totals and `completedLessonIds: string[]`.
Use one constant local learner ID for M1; it is not a name or cross-device identity.

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS attempts (
  id TEXT PRIMARY KEY, learner_id TEXT NOT NULL, session_id TEXT NOT NULL,
  lesson_id TEXT NOT NULL, lesson_version INTEGER NOT NULL,
  activity_id TEXT NOT NULL, outcome TEXT NOT NULL
    CHECK(outcome IN ('independent','assisted','incorrect','skipped')),
  hints INTEGER NOT NULL CHECK(hints >= 0), created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS completions (
  learner_id TEXT NOT NULL, lesson_id TEXT NOT NULL, lesson_version INTEGER NOT NULL,
  PRIMARY KEY(learner_id, lesson_id, lesson_version)
);
CREATE TABLE IF NOT EXISTS totals (
  learner_id TEXT NOT NULL, outcome TEXT NOT NULL, count INTEGER NOT NULL,
  PRIMARY KEY(learner_id, outcome)
);
PRAGMA user_version = 1;
```

- [ ] Define `openProgressRepository(db)` against a small async SQL interface
  exposing parameterized `run`, `all` and `transaction`. Adapt it to Expo SQLite
  on device and Node's built-in `node:sqlite` for tests. The schema and queries
  must be shared; do not test a fake map and claim SQL correctness.
- [ ] Write tests with an in-memory SQLite database: same attempt twice counts
  once; failed transaction leaves no attempt/completion; reset clears all three
  learner tables; independent and assisted remain distinct after pruning.

```ts
test('replayed saves cannot inflate progress', async () => {
  const repo = openProgressRepository(makeSqliteTestAdapter());
  await repo.record(sampleAttempt);
  await repo.record(sampleAttempt);
  assert.equal((await repo.summary(sampleAttempt.learnerId)).independent, 1);
});
```

- [ ] Define `makeSqliteTestAdapter()` and `sampleAttempt` inside this test file;
  use a fixed timestamp and `outcome: 'independent'`. Parameterize all inserts.
  Record completion only when the engine finishes a lesson; pass the optional
  second `completedLesson` argument defined above. Perform the attempt and optional
  completion in one transaction. A terminal demonstration or skip must generate
  its own supported/skipped attempt before committing completion; otherwise a
  supported finish would have no durable completion path.
- [ ] Preserve details for 90 days. `prune` transactionally aggregates expired
  rows into totals, then deletes them; repeated pruning must not double-count.
  Completion/earned parts remain independent of raw attempt retention. Unit-test
  the exact timestamp boundary and a second prune call.
- [ ] Startup reads `user_version`: initialize empty DBs; reject newer schemas
  with a recoverable parent message. Do not reset on open errors or write errors.
  Configure/test exclusion of learning DB and its sidecars from OS cloud backup;
  if this requires a native config plugin, isolate it and test generated config.
- [ ] Run SQL tests and a native open/save/reopen check. Inject a failed save and
  verify the child sees a retry message while their current activity remains usable.
  Run `npm run validate` and record the storage validation checkpoint.

## Task 5: Deliver equivalent touch interactions and controlled audio

**Files:** `src/features/lesson/*`, `src/audio/*`, `tests/placement.test.ts`,
`tests/audio.test.ts`, `tests/ui/lesson.test.tsx`.

**Interfaces:** `placeTile(slots: (string | null)[], patternId: string, index: number):
(string | null)[]`; `AudioController.play(assetId: string): Promise<void>`;
`AudioController.stop(): void`; `LessonScreen` receives a Lesson, ProgressRepository
and AudioController, and calls `onComplete()` only after the completion save succeeds.

- [ ] Test placement at a valid index, an out-of-bounds drop, replacing a filled
  slot and preserving the original array. Both drag release and tap selection
  call this function. Treat tiles as reusable letters so future doubled letters
  do not depend on unique physical tiles. An invalid drop makes no attempt.

```ts
test('placement changes only the addressed slot', () => {
  const before = [null, 'm'];
  assert.deepEqual(placeTile(before, 'short-a', 0), ['short-a', 'm']);
  assert.deepEqual(before, [null, 'm']);
  assert.deepEqual(placeTile(before, 'short-a', 3), before);
});
```

- [ ] Render sound-match and word-builder with Pressable controls, accessible
  labels, at least 56 logical-pixel targets and room between choices. Word slots
  have `slot-0`, `slot-1`, `slot-2` test IDs. Give tiles `tile-m`, `tile-short-a`,
  `tile-s`, `tile-t` IDs and the submit control `check-answer`. Choice order is
  shuffled once per activity outside the reducer with an injected random source;
  keep that order fixed during retries. On reopening, restart the current activity
  with a new session while preserving saved attempts/completions. Exact in-progress
  tile positions and choice order are not promised to survive process termination.
- [ ] Add a UI test that taps a tile then a slot, submits a word, and sees the
  expected feedback; a hinted correct answer must persist as assisted. Add a
  second test for repeated fast submits with one completion/reward.
- [ ] Use gesture-handler/reanimated for drag only; derive drop coordinates from
  actual layout bounds. On rotation or resize cancel the drag and measure again.
  Never score a cancelled/invalid drag as a reading error. Keep tap handling usable
  with VoiceOver and reduced motion.
- [ ] Implement the audio adapter using `expo-audio` playback only. A new play
  cancels/unloads the previous player; each request carries a generation token
  so a late callback cannot resume or stop a newer prompt. On AppState background
  or screen unmount stop playback and clear pending callbacks. No recording APIs
  or microphone permissions in this milestone.
- [ ] Test play A, then play B, then A's late completion: B remains current.
  Test stop during loading and repeated stop. Missing media produces a replayable
  fallback message and an adult diagnostic without exposing personal data.
- [ ] Measure readability and touch layout on iPad portrait/landscape and a narrow
  phone layout; capture only synthetic-data evidence under ignored outputs.
  Run unit/UI/content checks plus a native gesture/audio pass; record the
  playable-activity checkpoint.

## Task 6: Connect the workshop, completion and parent controls

**Files:** `App.tsx`, `src/features/workshop/WorkshopScreen.tsx`,
`src/features/parent/{ParentGate,ParentScreen}.tsx`, `src/features/parent/gate.ts`,
`src/ui/Robot.tsx`, `tests/ui/parent.test.tsx`.

**Interfaces:** `makeChallenge(left: number, right: number): { prompt: string;
answer: number }`; `checkGate(input: string, expected: number): boolean`;
parent session is in memory and expires after 60 seconds of inactivity or when
backgrounded. This is an adult-friction gate, not authentication or legal consent.

- [ ] Use an adult-language, two-digit multiplication challenge generated on
  entry; require text/numeric entry and generate new values after a failed attempt.
  Test exact numeric parsing, blank/wrong answers and expired/background access.
  Inject operands and clock for deterministic tests. Reassess the gate for public
  store release rather than claiming prototype approval by Apple.
- [ ] Connect boot -> workshop -> lesson -> saved completion -> workshop. Parts
  are derived from completed lesson IDs; replay does not multiply parts. Audio
  introduces the Start action automatically only after the user's first touch.
  Provide a persistent replay button and a clear session-end choice.
- [ ] Parent view shows practiced patterns and separate outcome counts. Avoid
  reading-age/mastery labels. Show audio/reduced-motion preferences and a clear
  warning that local progress is not synced. No outbound links or purchase UI.
- [ ] Reset requires gate plus a second explicit confirmation, calls `reset`,
  and returns to a fresh workshop only after successful deletion. A failure
  leaves a visible error and does not show a false reset confirmation.

```tsx
test('cancelling reset preserves saved progress', async () => {
  const repo = makeParentTestRepository();
  const ui = render(<ParentScreen repository={repo} learnerId="local-learner" />);
  fireEvent.press(ui.getByRole('button', { name: 'Reset progress' }));
  fireEvent.press(ui.getByRole('button', { name: 'Keep progress' }));
  expect(repo.reset).not.toHaveBeenCalled();
});
```

- [ ] Define `makeParentTestRepository` with Jest mocks of all ProgressRepository
  methods; include a separate confirmed-reset success/failure test. Add an end-to-end
  UI flow from start to earned part to reopen. Run `npm run validate`; record
  the checkpoint.

## Task 7: Prove installed offline behavior and hand off the first playable

**Files:** `.maestro/{lesson,resume,parent}.yaml`, `docs/device-validation.md`,
`docs/privacy-data-map.md`, `README.md`; ignored `outputs/device-validation/`.

**Interfaces:** installed bundle IDs `com.readandlead.prototype` on both platforms
are local testing identifiers only; availability/ownership is not a store claim.
Native automation uses the stable test IDs defined in Tasks 1 and 5.

- [ ] Add native flows that use tap controls for deterministic completion; a
  separate manual checklist proves drag equivalence. Example first interaction:

```yaml
appId: com.readandlead.prototype
---
- launchApp
- assertVisible:
    id: workshop
- tapOn:
    id: start-lesson
- assertVisible:
    id: lesson-screen
```

- [ ] Extend the flow with the actual first activity from the reviewed catalog,
  then assert visible feedback and saved progress. Resume flow must relaunch
  without clearing data. Parent flow proves cancelled reset and gated confirmed
  reset with a deterministic test-build challenge, never a release bypass.
- [ ] Build release artifacts locally with `npx expo run:ios --configuration Release`
  and `npx expo run:android --variant release`. Simulator results are reported as
  simulator results. Signing and physical installation require the device/tooling
  prerequisites; no store upload occurs in this task.
- [ ] On a physical iPad, install the build, disconnect network before the first
  lesson launch, complete the full loop, force-close, reopen and replay. Test sound
  interruption, app backgrounding, device rotation, reduced motion, VoiceOver,
  denied storage/failed write simulation, and parent reset. Confirm zero microphone
  prompts and no remote asset or model dependency. Distinguish app traffic from
  OS/device traffic in a reviewed network capture.
- [ ] Repeat the core flow on an Android tablet before claiming Android readiness.
  Record unavailable hardware or signing as explicit pending evidence, not a test
  pass. Use synthetic progress for captures; do not retain real child audio.
- [ ] Run `npm run validate`, `npm run security:check`, `npm run test:native` and
  `git diff --check`. Document exact versions, build SHA, devices and outcomes.
  Ensure content review passed before child use. Prepare one initial implementation
  commit containing the completed scope and truthful handoff evidence before review.

## Acceptance coverage and next increments

| Design requirement | Task |
| --- | --- |
| Native iPad entry and robot workshop | 1, 6, 7 |
| Reviewed cumulative patterns, words and connected text | 2 |
| Hints, demonstration, skip and truthful progress | 3, 6 |
| Idempotent saves, retention, reset and failure behavior | 4, 6 |
| Tap/drag parity, readable targets and audio lifecycle | 5, 7 |
| Offline release behavior and no microphone/network dependency | 1, 5, 7 |
| Parent gate and local-only data | 4, 6, 7 |
| Android/native accessibility/device validation | 5, 7 |
| Provenance, licensing, security and reusable foundations | 1, 2, 7 |

M1 is ready for the family only when the reviewed content and iPad acceptance
checks pass. A working simulator demo alone is not the milestone. Use actual
family observations to write the M2 plan: ten lessons, read-an-instruction activity,
song, optional ephemeral recording/playback, multiple local slots and review queue.
Automatic speech scoring remains a separate capability experiment. Public beta,
billing, restore, legal/privacy checks and store assets belong to M3.

This historical plan does not authorize purchases, account creation, external
communications, a remote push, or app submission. The current user request and
repository policy determine the authorized scope of subsequent implementation.
