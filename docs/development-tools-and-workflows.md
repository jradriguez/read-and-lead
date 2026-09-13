# Development tools and operating workflow

Decision record: 2026-09-12; updated after PR #11 on 2026-09-13 UTC. Supports the
[product excellence roadmap](product-excellence-roadmap.md). This document owns
tool selection and proposed work assignments; existing repository policy owns
authority and release checks. It is not a new agent runtime or scheduled service.

## What was installed

The owner authorized useful Codex plugins and justified dependencies. The following
three plugins were installed through the existing Codex marketplace CLI. Their
manifests identify Expo and Callstack as their authors and declare MIT licenses.
Installation succeeded; the installed/enabled state is checked in the roadmap's
handoff record. These are development-assistant skills, not mobile runtime SDKs.

| Plugin / exact selector | Installed version | Why it earns a place |
| --- | --- | --- |
| Expo — `expo@openai-curated-remote` | 1.0.2 | Official Expo guidance for native UI, development clients, native modules, SDK maintenance and debugging; fits this repository's existing framework |
| Building React Native Apps — `building-react-native-apps@openai-curated-remote` | 0.2.0 | Callstack guidance for rendering, startup, memory, bundle size and native integration; directly relevant to the current JavaScript-driven drag path |
| Testing React Native Apps — `testing-react-native-apps@openai-curated-remote` | 0.1.0 | Callstack React Native Testing Library guidance, exploratory QA and agent-device skills; complements current tests and incomplete native gesture evidence |

Sources: [Expo's official skills documentation](https://docs.expo.dev/skills/),
[Callstack's plugin announcement](https://www.callstack.com/blog/announcing-codex-plugins-for-react-native-development),
[Building plugin source](https://github.com/callstackincubator/agent-skills/tree/main/plugins/building-react-native-apps),
[Testing plugin source](https://github.com/callstackincubator/agent-skills/tree/main/plugins/testing-react-native-apps).
Installation and versions above are direct local CLI observations, not inferred
from those websites. The inspected manifests declare skills rather than a new
MCP server or hook. No app permissions, signing accounts or service connections
were configured by this installation.

The supported local commands were inspected with `codex plugin --help` before use:

```sh
codex plugin list --available --json
codex plugin add expo@openai-curated-remote --json
codex plugin add building-react-native-apps@openai-curated-remote --json
codex plugin add testing-react-native-apps@openai-curated-remote --json
codex plugin list --json
```

Do not rerun installation as a routine project setup step. Plugins are installed
in this user's Codex environment and are not reproduced by `npm ci`. Recheck
versions and skill availability on another host. The app dependency manifest and
lockfile were not changed. Installing the testing skill did not install a native
testing CLI. Separately, merged PR #11 installed a local native toolchain including
Maestro 2.10.0 and recorded successful iOS-simulator/Android-emulator smoke tests;
see [toolchain](toolchain.md). No physical-device test is implied.
The repository's `plugins/` directory still contains Expo native configuration;
it is separate from the Codex plugin catalog and installation location.

## Use the capable tools already available

The live Codex inventory also reported these installed and enabled. Access to a
plugin's skill does not establish authorization or successful access to every
external account it can use.

| Existing tool / plugin | Recommended use | Limit for this product |
| --- | --- | --- |
| Superpowers 6.3.0, curated version | Bounded independent research, implementation planning and reviewer handoffs | Give each worker explicit context and file ownership; no automatic delegation or recurring jobs outside authorized work |
| Figma 2.0.21 + Product Design 0.1.55 | Art direction, interaction states, layout, components, accessible prototypes and reference analysis | Figma prototypes are design evidence; native playability still needs a running app. External asset uploads need the appropriate authorization |
| Creative Production 0.1.25 + built-in image generation | Original robot concepts, expression sheets, environment studies and production briefs | Generated art is a draft; review consistency and rights. Keep learner lettering and phoneme audio under explicit human review |
| Built-in web research + Deep Research Work 0.1.15 | Retrieve primary papers, contrary results and platform documentation | Read the actual methods/limitations; search summaries and model consensus are not evidence grades |
| Data Analytics 1.0.8 + spreadsheet tools | Analyze synthetic performance runs and later authorized private study/store aggregates | No child analytics SDK, raw learner exports to connectors or third-party tracking in M1 |
| Marketing Skills 2.11.1 | Parent interviews, positioning, pricing hypotheses and store-copy drafts | Adult-facing research; no unsupported learning claims, auto-outreach or child conversion funnels |
| Remotion 1.0.7 | Later adult-facing product demos and store video drafts | Video production tooling, not a native interactive animation engine |
| Code Review and Context7 | Focused engineering review and documentation lookup | Verify findings and match documentation to the installed SDK; preserve the existing test/release gates |
| Playwright | A later actual website or parent web surface | Browser phone emulation is not iPad/Android native testing |

The curated Superpowers installation is active. A second installation from the
Claude marketplace was already disabled; it was left untouched. Avoid enabling
duplicate skill bundles merely to increase tool count.

No additional research subscription, general game-builder plugin, backend,
advertising service or project-management service is needed for the next mission.
Consensus/SciSpace may be useful if a later literature-access task reveals a
specific gap, but the present primary-source research did not require them.
Game-engine and 3D plugins would add a different implementation model without
solving the current teaching, touch or asset-production gaps.

## Apply skills selectively

Read the selected skill at the point of use. Preserve the repository's Expo 57,
strict TypeScript, existing file naming and offline boundaries. The Expo native-UI
skill contains general Expo Router, iOS styling and Expo Go defaults. This app has
no Expo Router requirement and has a native backup-exclusion plugin: those defaults
do not authorize a navigation rewrite or turn Expo Go into native/privacy proof.
Callstack navigation, TV and library-generation skills are optional capabilities,
not a request to expand platform scope. Do not modify installed plugin files to
make them project policy.

For native QA, retain [the ordered Maestro smoke suite](../.maestro/smoke.yaml)
as the existing regression entry point. PR #11 ran it against both native debug
clients for two-lesson tap completion, earned-part persistence across restarts and
invalid parent-gate rejection. Use `scripts/native-tools.sh npm run test:native`
with the documented Metro/target prerequisites. Do not repeat tool installation
as a new project requirement. These checks do not cover physical drag, standalone
offline launch, no-egress acceptance or assistive technology. The
new agent-device skill can support exploratory diagnosis when its executable,
target and session prerequisites are separately established. It complements
scripted tests; it does not replace them. Verify actual supported interactions
before assigning physical-device work. See
[agent-device introduction](https://oss.callstack.com/agent-device/docs/introduction)
and the existing [device checklist](device-validation.md).

## Runtime dependency decisions

The current package set already includes Reanimated 4.5.1, Worklets 0.10.1,
Gesture Handler ~2.32.0, Expo Audio and SQLite. The following is an implementation
decision sequence, not an instruction to install every candidate.

| Choice | Decision | Admission evidence |
| --- | --- | --- |
| Native views + existing Animated/Reanimated + Gesture Handler | Use now for tiles, controls, robot poses and short transitions | Move per-frame drag presentation off React state; preserve one semantic drop/tap evaluation path and native accessible controls |
| Existing Expo Audio | Keep for bundled narration and effects | Measure prompt start, cancellation, route changes and memory; only preload a bounded next-prompt set if measurement justifies it |
| `expo-image` or `react-native-svg` | Candidate when final art demands efficient raster loading or authored vectors | Show the actual asset and native rendering need; compare existing Image/View cost, compatible resolution, licenses and accessibility |
| `@rive-app/react-native` | Spike only if interactive character state authoring becomes a production bottleneck | Compare one equivalent character with the baseline on both platforms; verify released package peers, Nitro/native build requirements, local assets, accessibility fallback and editor/export costs |
| `@shopify/react-native-skia` | Spike only for measured drawing/scene needs that native views cannot meet economically | Compare frame timing, memory, package size and developer effort for the same scene; keep text and touch semantics accessible |
| `lottie-react-native` | Candidate for bounded, noninteractive authored sequences | Test an actual exported animation for feature fidelity, replay/stop behavior, memory and reduced-motion fallback; avoid adding alongside Rive for the same job |
| Unity, Godot, Flutter/Flame, WebGPU/Three.js | Defer | Reopen only after an equivalent native 2D slice fails explicit requirements and the alternative wins a measured maintenance/cost comparison |
| Speech scoring, live AI, cloud analytics, remote lessons | Outside M1 | Requires a separately scoped need and data/accuracy/platform evaluation; none is necessary to deliver excellent beginning-reading practice |

References checked for this decision: [Expo 57](https://docs.expo.dev/versions/v57.0.0/),
[Reanimated in Expo 57](https://docs.expo.dev/versions/v57.0.0/sdk/reanimated/),
[React Native performance](https://reactnative.dev/docs/performance),
[Rive React Native](https://rive.app/docs/runtimes/react-native/react-native),
[Skia installation](https://shopify.github.io/react-native-skia/docs/getting-started/installation/),
[Lottie source](https://github.com/lottie-react-native/lottie-react-native).
These establish supported approaches, not a benchmark win in this app.

For any admitted package: record the concrete behavior it enables, why existing
tools are insufficient, exact SDK-compatible version and license, native peers,
network/permission behavior, binary size delta, measured before/after results,
and removal path. Use the repository's Expo-compatible install workflow; inspect
the resulting lockfile. Never use a forced upgrade to obtain a superficially
clean audit. Full native/privacy evidence must be refreshed after native changes.
Do not replace a working native-driven robot bounce solely to standardize libraries.

## A small team of roles, dispatched when needed

The owner asked for specialized workflows. Use the following responsibilities
within bounded tasks; they can be performed by a small team. No always-running
agent system, new database or cross-repository runtime is necessary.

| Work lane | Concrete output | Independent check / decision owner |
| --- | --- | --- |
| Research and instructional design | Evidence table with population, comparison, effect, limitations and one proposed lesson change | Second source check; qualified literacy reviewer decides teaching suitability |
| Art, interaction and audio | One mission storyboard, native layout/state specification, editable source and asset-rights manifest | Art/UX reviewer plus human literacy listening review |
| Native engineering and performance | Small implementation with reproducible baseline, trace and after-results | Engineering reviewer verifies correctness; device QA verifies touch/audio/lifecycle |
| Content production | Versioned lesson/recording pack with decodability and review evidence | Authorized human content and rights reviewers; a drafting agent cannot approve its work |
| QA and accessibility | Reproduction steps, failures, device/build identity, synthetic evidence and regression recommendation | Human review for native accessibility and real use; code tests alone are insufficient |
| Product research and marketing | Parent need, competitor/access evidence, value hypothesis, consented-research proposal and truthful copy | Owner decides audience, spending, outreach and public claims |
| Maintenance and release | Dependency/security triage, exact-build evidence and support issue dispositions | Existing engineering/release process; owner authorizes external release actions |

Parallelize different evidence questions or separately owned files. Keep an
implementation and its dependent integration sequential. Give one agent ownership
of a simulator/device session; concurrent agents must not fight over the same UI.
Use the dispatching-parallel-agents skill with explicit, self-contained context,
without inherited conversation history. The three research lanes used for this
roadmap followed that model. The coordinating agent checks conclusions and
integrates them; agent agreement is not independent scientific replication.

### Reusable assignment contract

Use this short task brief in a normal Codex task. This is a prose template, not
an installed command or automation:

```text
Decision or learner/parent problem:
Current milestone and source revision:
Read these exact policy/code/research paths:
Owned files or read-only research scope:
Question/hypothesis and strongest contrary explanation:
Primary sources or reproducible baseline needed:
Budget: maximum time, searches/runs and optional cost ceiling:
Deliverable and measurable acceptance:
Forbidden scope / stop and escalation conditions:
Validation and reviewer:
```

Workers must be told they are not alone in the checkout and must preserve others'
edits. Reassign overlapping files instead of hoping changes will merge. Return
the source, finding, uncertainty and next decision together. Stop research when
the decision is supported or the agreed time budget expires; record the unresolved
question instead of collecting endlessly similar sources.

## Product and business operating loop

Use one prioritized roadmap and the existing validation records. A proposed
weekly review asks: what changed a learner outcome, which blocker remains, what
was measured, and which small task should happen next? Maintain separate measures
for learning, usability, technical quality and business health. The
[research report](learning-and-experience-research.md) explains why those measures
cannot substitute for each other.

For each original mission, track authoring hours, audio/art revisions, review
turnaround, implementation time and escaped defects. Favor reusable reviewed
mechanics and a stable production template when they lower the cost of the next
lesson without narrowing the learning goal. Do not optimize for number of agents,
generated assets, commits or lesson count alone.

Before marketing, draft a parent-facing value proposition: a short, calm offline
workshop in which reading makes an invention work. Treat demand for that combination
as a hypothesis. [The name screen](product-name-review.md) found material conflicts
for the provisional Read to Lead brand; settle a cleared final identity before
investing in branded campaigns, store art, domains or a repository migration.
Name-independent product/art work can continue. After authorized interviews/pilot use, record the parent problem,
observed value, alternatives used, willingness to pay and reasons to stop. Compare
the proposed one-time starter-world model with recurring value before deciding on
a subscription. The prices in [design](design.md) remain hypotheses.

Use an aggregate business worksheet after a real channel is authorized:

- Activation: families reaching a usable first lesson / eligible installs, with
  the data source and missingness recorded. Do not add tracking just to fill it.
- Commercial conversion: adult purchases / eligible adult offers; separate refunds.
- Contribution per purchase: realized receipts minus applicable fees, refunds and
  variable support/content-delivery cost. Acquisition spending must fit contribution.
- Support load: actionable contacts and resolution time per active paying family.
- Production throughput: reviewed, usable missions per unit of real production
  time, including rework and human review.

Use store-supplied aggregate analytics where appropriate and authorized; keep
learner research in an approved private process. No single commercial target is
validated yet. Do not claim ratings, installs or revenue prove learning gains.
Independent replication is a later evidence investment, not a marketing slogan.

Recommended maintenance cadence: inspect security and data-loss signals promptly;
triage dependency/support issues weekly; recheck store/platform changes before
each affected release; repeat native performance and accessibility checks after
relevant changes. The [mobile readiness plan](mobile-readiness-plan.md) remains
the detailed release/maintenance owner. No scheduled monitor was created here.
