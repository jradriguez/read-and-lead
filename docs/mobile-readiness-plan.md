# Mobile readiness implementation plan

This is a proposed execution plan based on the
[requirements research](mobile-requirements-research.md), checked on 2026-09-12.
It adds release planning to the existing [product design](design.md) and
[implementation status](implementation-status.md); it does not approve teaching
content, new infrastructure, spending, external outreach, or distribution.

**Recommended sequence:** close M1's child-use blockers; conduct an authorized
family pilot; develop the M3 release scope from evidence; launch US iOS/iPadOS;
then launch Google Play on tested Samsung/Pixel devices. Reuse the same application
and control evidence. Add Galaxy Store, Fire tablets and countries only where
demand justifies additional support and legal work. Geography is a planning
assumption until the owner confirms it.

## Decision rules and accountability

- The owner is accountable for product scope, publishing identity, markets,
  commercial terms, spending and the final go/no-go decision.
- Engineering implements and supplies reproducible source/binary evidence.
  QA verifies supported devices and failure paths. An independent reviewer checks
  security-sensitive changes before release; this document is not that review.
- A qualified literacy reviewer approves instruction and listens to final audio.
  Rights review establishes distribution permission separately.
- Privacy/children's-product counsel resolves applicable law and documents
  decisions. An accessibility reviewer evaluates actual native use. A small team
  may combine engineering roles, but software cannot stand in for these approvals.
- Findings use **open**, **in progress**, **blocked**, **verified**, or
  **not applicable with rationale**. Lack of evidence never becomes “verified.”
  Required legal or store conditions cannot be waived by accepting a product risk.

App changes, drafts and local checks can proceed within an authorized work package.
Under [the agent policy](../AI_AGENT_POLICY.md), environment/toolchain changes,
CI/CD, schema/migrations, new services and major dependencies need specific
authorization. Prepare those changes for review before requesting execution.
Enrollment, purchases, signing-account changes, push/PR publication, child outreach
and store submission have their own explicit authorization boundaries.

## Requirements and evidence register

This register is the initial backlog. Suggested future files below do not yet
exist unless linked as an existing path. Requirement IDs persist across future
implementation tasks and release records. “Partial” describes available evidence,
not a pass. Source sections refer to the companion research report.

| ID | Requirement / class | Current state | Work and acceptance evidence | Accountable role / gate |
| --- | --- | --- | --- | --- |
| GOV-01 | Entity, ownership and geographic scope / legal-business | Open | Written publisher/rights/territory decision; actual legal and public contact identity; no imported company assumptions | Owner + counsel / before enrollment and pilot |
| GOV-02 | Legal applicability / law | Open | Per-jurisdiction assessment: trigger, provision/version, effective date, enforcement/court status, applicable control, evidence and reviewer; US state survey included | Counsel / before affected use/distribution |
| GOV-03 | Trademark, contractor and asset rights / law-store | Blocked for final audio | Brand clearance; exact asset inventory with creator/license, signed grants stored privately, public-safe rights reference and file hash | Owner + rights reviewer / before child use of assets; brand before listing |
| PRI-01 | Actual data flows and disclosures / law-store | Partial | Extend existing privacy map to native SDKs, diagnostics, OS backups, support/website, retention and access; compare with binary and disclosures | Engineering + privacy / before pilot |
| PRI-02 | COPPA determination and consent if required / law | Open | Written no-covered-collection rationale or compliant notice/consent/parent-rights implementation for every covered flow; no gate-as-consent claim | Counsel / before child use |
| PRI-03 | No unexpected egress or permissions / product-store | Source controls only | Release-binary permission/entitlement report plus app-attributed traffic tests in connected/offline modes; no unexpected traffic or microphone prompt | Engineering + QA / before pilot |
| PRI-04 | Backup and device transfer / product-security | Partial | Real iOS backup checks and Android cloud/D2D exclusions including Samsung transfer; all DB sidecars covered; unsupported behavior resolved | Engineering + QA / before pilot |
| PRI-05 | Retention and deletion / law-product | Logical tests exist | Justify 90-day details and aggregate lifetime; measure pruning, reset and residual files/WAL behavior; accurate local-loss and deletion wording | Privacy + engineering / before pilot |
| PRI-06 | Regional age assurance / conditional law | Open | Current applicability; if required, tested age/approval adapter, offline/unknown states, significant changes and revocation; store-specific support | Counsel + engineering / before affected distribution |
| SEC-01 | Mobile threat assessment / recommended standard | Open | Proportionate MASVS/MASTG mapping with evidence or justified exclusions; privacy, storage, platform, code and supply-chain review | Security reviewer / before pilot; renew for launch |
| SEC-02 | Dependencies and licenses / security-law | JS lockfile and scanners exist | JS/native/build SBOM; purpose, license, advisories, permissions, privacy behavior, maintained version; third-party notices; reviewed override | Engineering + rights / before release |
| SEC-03 | Signing and build provenance / store-security | Open | Owner-controlled signing, MFA/least privilege and private recovery procedure; final IDs; release artifacts bound to source, lockfiles and content hashes | Owner + release engineering / before signed distribution |
| SEC-04 | Incident and vulnerability operations / law-recommendation | Private report route exists | Named responder, private intake, triage/remediation targets, jurisdiction-specific notification procedure, tabletop exercise and update recovery | Owner + security + counsel / before public release |
| EDU-01 | Human-reviewed teaching and media / product | Blocked | Final recordings, cumulative lesson review and rights; approved current semantic digests and exact native assets; strict content gate passes | Literacy + rights reviewers / before child use |
| EDU-02 | Honest assessment and child well-being / product-consumer law | Partial | Assisted/independent/skip verified; narration and safe feedback reviewed; no unsubstantiated efficacy claims, shame, pressure or unsafe activities | Product + literacy + QA / before pilot |
| A11Y-01 | Native accessibility / recommended baseline, conditional law | Partial | Reviewed WCAG 2.2 AA mobile mapping, VoiceOver/TalkBack/switch/keyboard, focus, contrast, scaling, replay and non-drag completion evidence | Accessibility reviewer / before pilot; full audit before public release |
| QUA-01 | Lifecycle and local-data reliability / product-store | Partial | Physical restart/upgrade/interrupt/low-storage tests; no false saves, duplicated rewards, silent destructive recovery or overlapping audio | QA + engineering / before pilot |
| QUA-02 | Supported devices and performance / product-store | Expo Go simulator only | Exact device/OS matrix; two-lesson native core flow; performance measurements, orientation/back/insets and accessibility results | QA / before each platform claim |
| QUA-03 | First launch offline / product | Unverified | Installed release completes all bundled content without prior runtime download; connected test also proves no hidden traffic | QA / before pilot |
| APP-01 | Apple readiness / store | Open | Correct Kids band and rating, SDK/manifest/reason API/export checks, metadata, functional support/privacy pages, final archive and review notes | Release engineering + owner / before Apple submission |
| AND-01 | Google Play readiness / store | Open | API 36+, 64-bit/16 KB checks, AAB/signing, Families/audience/rating/Data safety, verification and account-specific testing prerequisites | Release engineering + owner / before Play submission |
| GAL-01 | Samsung-specific distribution / optional store | Deferred | Seller verification, no outbound links in Kids build, silent-mode/device tests, package/signing/update/entitlement decision and separate review | Owner + QA / only if Galaxy Store chosen |
| INT-01 | International expansion / conditional law-store | Deferred | Local review and notices; GDPR/UK Code, CRA/EAA/DSA and other country requirements resolved; legal text/commencement checked | Counsel + owner / before enabling each territory |
| PIL-01 | Family-pilot protection / product-privacy | Blocked by earlier gates | Adult permission/child assent procedure, bounded cohort, stop rules, minimal private observations and retention, explicit outreach authorization | Owner + literacy/privacy / before any child session |
| REL-01 | Public product scope and release approval / product-store | Open | M3 content/value acceptance based on pilot; all applicable controls verified; exact artifact record, rollback/update plan and explicit release authorization | Owner / before rollout |

## Work packages

### Implementation checkpoint

Authorized local implementation has begun. P0's reviewer brief is prepared below;
P1's authorized native setup, successful debug builds and input-inventory command
are in [toolchain](toolchain.md).
P2's backup, release permission, deletion and parent-information controls are
implemented; their device acceptance is still open. Android Back has regression
coverage and parent text has phone/tablet simulator layout evidence. See
[current validation](validation.md#mobile-readiness-implementation-checkpoint).
No full P0–P5 package or child/store gate is declared complete by these changes.

| Register update | Evidence now available | Still open |
| --- | --- | --- |
| PRI-01, PRI-03–05 | Expanded data map, embedded parent notice, native backup/resource generation, release permission directives, raw SQLite page tests on separate connections | Final release binary/traffic/transfer and deletion sidecars; legal retention rationale |
| SEC-01–04 | Threat assessment and incident handoff; input hashes/npm CycloneDX, Pod/Gradle resolutions and debug binary hashes | Independent native review, license notices, signing and incident rehearsal |
| QUA-01–02, A11Y-01 | Android Back/gate regression; phone/tablet text inspection; native iOS/Android lesson/restart/gate smoke checks | Physical gestures/assistive technology, large text and measured performance |
| EDU-01–02, PIL-01, REL-01 | Human recording/review brief and pilot procedure prepared | Qualified approvals, complete narration, authorized pilot and release scope |

### Prepared counsel, literacy and rights brief

This is ready for owner review and later authorized private sharing; no outside
reviewer has been contacted. Use [product context](../COMPANY_CONTEXT.md),
[the data map](privacy-data-map.md), [content review](content-review.md),
[the threat assessment](../SECURITY.md#m1-threat-assessment--implementation-review),
the current input inventory and the [primary-source research](mobile-requirements-research.md).

**Product facts:** beginning English readers, design ages roughly 4–7, two bundled
draft lessons, one anonymous local slot, local response/timestamp history and
90-day aggregation on open. No runtime accounts, ads, analytics, microphone,
billing, remote lessons or application backend. The parent gate is arithmetic
friction. Development uses Expo Go/Metro and must use synthetic data. Publisher,
cleared brand, final support contact, monetization and territories are undecided;
do not borrow another repository's legal entity. US iPad first remains a recommendation.

| Decision for authorized human | Required written finding | When it blocks |
| --- | --- | --- |
| Owner / counsel | Publisher, ownership chain, age positioning, chosen pilot locations and distribution territories, business model, public/private contact details | Before recruitment, enrollment or public notices |
| Children's privacy counsel | Actual COPPA collection analysis including native diagnostics, future support/site and observations; parental notice/consent/rights if triggered; retention justification | Before any child use |
| Counsel for each chosen state/country | Provision/version, commencement, court/enforcement status, age-assurance or consent trigger, offline/unknown signal treatment and required controls; exclusions with reasons | Before affected pilot/distribution; US-wide availability is not assumed |
| Literacy specialist | Exact two-lesson sequence, sound models, blending, capital Sam, connected sentence and all navigation/feedback; accessible participation without misleading assessment cues | Before approving current catalog digest or using it with a child |
| Rights reviewer / owner | Trademark review; ownership/license of robot/icon/art/code; speaker and recording distribution rights; exact asset hash and restricted grant reference | Before affected assets are approved/distributed |
| Privacy/accessibility reviewer | Final parent notice, support/website data handling, usable notice/reset/withdrawal and assistive-technology paths on selected devices | Before pilot and public release |

For each finding record reviewer, date, evidence reference, applicability/rationale,
required change and the exact affected product inputs. Reviewer identifiers in
Git must be public-safe; contracts, family identities and consent records stay in
restricted storage. Unassigned reviewers and unanswered legal questions remain
open; the owner chooses reviewers/budget and authorizes any outreach.

**Pilot procedure draft, not recruitment authorization:** after content, legal,
privacy and device gates pass, use an owner-selected small supervised cohort.
Obtain adult participation permission and age-appropriate child assent under the
reviewed process; keep required processing consent separate. State that prototype
practice counts do not establish reading level or educational efficacy. The adult
remains present; the child may pause or stop immediately without pressure or loss
of already-earned progress. Use questions about understanding spoken directions,
tap/drag access, sound clarity, frustration and ability to finish/leave.

Record only coded, minimal observations outside Git: tested build/device, task,
observed difficulty and proposed correction. No names, birthdays, contact lists,
voice/video or screenshots containing identifying data by default. Propose removal
of raw notes within 30 days of the review decision and retain only de-identified
issue summaries; counsel/owner must approve the actual storage, access, withdrawal
and retention procedure before recruitment. A withdrawal request stops participation
and routes any processing-rights request through that reviewed procedure. Stop the
affected pilot for distress, misleading instruction, unexpected collection,
inaccessible essential actions or unreliable reset/data loss. Resolve and reverify
the affected gates before an authorized restart.

Estimates below are engineering planning ranges for closing the present foundation
gaps, not quotes or a promised launch date. They assume one experienced engineer,
available hardware and timely reviewers. They exclude recording production, legal
lead times, store-account delays and the broader M2/M3 curriculum expansion.

### P0 — Resolve launch and pilot assumptions

**Estimate:** 2–3 engineering days preparing the evidence brief; external review
time separate. **Dependencies:** none. **Requirements:** GOV-01–03, PRI-01–02,
PRI-06, EDU-01, PIL-01.

1. Prepare a compact counsel/reviewer brief from the design, data map, dependency
   inventory and this register. Ask for findings against the actual offline
   product, including support and pilot handling.
2. Resolve entity, rights ownership, territories, age positioning and proposed
   business model. US-first is recommended, not already authorized distribution.
3. Commission or schedule qualified literacy and media-rights review under a
   separately approved budget. Start this early: final content is on the critical
   path to child use and release builds.
4. Produce a country/state applicability record, including age assurance.
   Each unresolved legal trigger has an owner and due date, and blocks the
   affected use rather than the whole unrelated engineering effort.
5. Create a parent-pilot procedure with withdrawal, child stop rules and private
   retention. Identify the distinction between consent to participate and legally
   required consent to data processing.

**Exit:** human-readable scope decisions and named reviewers; a reviewed task
list for content/legal blockers. Document preparation can finish while legal
approval remains blocked. No child testing begins at this exit alone.

### P1 — Establish reproducible native builds and dependency evidence

**Estimate:** 3–5 engineering days after toolchain authorization.
**Dependencies:** publisher decisions before permanent signing/IDs, but local
adult development can proceed. **Requirements:** SEC-02–03, APP-01, AND-01.

1. Verify [toolchain evidence](toolchain.md) live. Prepare a scoped maintained
   Ruby/CocoaPods and Android SDK/JDK/Maestro setup proposal with versions,
   locations, side effects and recovery; do not silently change global tools.
2. Build using the installed Expo 57 workflow. Keep adult development artifacts
   separate from reviewed release artifacts. Never disable production content
   rejection to obtain a runnable child build.
3. Capture native resolutions, permissions, entitlements, privacy manifests,
   required-reason APIs and packaged libraries. Verify Android target SDK and
   16 KB compatibility against the actual artifact.
4. Record signing responsibility and private credential recovery. Distinguish
   signing-key backup from the deliberate exclusion of learner backups.
5. Establish a release-input manifest: source revision, JS/native resolutions,
   build tools, platform/config, catalog/media hashes, approval references,
   binary digest and creation date. Signed artifacts may not be byte-identical
   across rebuilds; preserve provenance without promising deterministic signatures.

**Likely paths:** [app.json](../app.json), [package.json](../package.json),
[lockfile](../package-lock.json), [toolchain](toolchain.md), `plugins/` and a
future release-evidence template. Native/env/dependency changes need their scoped
authorization first.

**Exit:** repeatable native development builds and captured resolutions. A
release-capable toolchain can be verified while release execution remains blocked
on EDU-01. Do not call the development artifact store-ready.

### P2 — Close storage and privacy gaps

**Estimate:** 4–7 engineering days. **Dependencies:** P1 for native verification;
PRI-01/02 decisions for any collection changes. **Requirements:** PRI-03–06,
SEC-01, QUA-01.

1. Extend [the existing storage plugin](../plugins/with-private-storage.cjs)
   only after validating current Expo/native templates. Evaluate explicit Android
   data-extraction rules for cloud and D2D rather than relying on `allowBackup`.
   Test Samsung transfer on disposable synthetic test devices.
2. Review SQLite deletion semantics, sidecars, pruning and aggregate retention.
   Decide whether sanitation is necessary and feasible for the threat model;
   preserve transaction safety. Any schema/migration change requires a separate
   authorization and preservation plan.
3. Verify app-private storage and protection classes, logs, debug surfaces,
   release permissions, background behavior and no runtime collection.
4. Prepare on-device parent privacy/reset information and matching web/store
   drafts. Embedded legal text supports offline use and simplifies a later
   Samsung build; do not add an outbound link to its Kids experience by default.
5. If a legal age-assurance adapter is necessary, scope its platform integration
   separately. Establish lawful treatment of unavailable signals and offline
   states before writing defaults. A new service or backend is not preapproved.
6. Add meaningful regression tests for the changed privacy/recovery paths and
   record connected/offline network and backup acceptance evidence.

**Likely paths:** `plugins/`, `src/progress/`, `src/features/parent/`,
[privacy map](privacy-data-map.md), [device checklist](device-validation.md),
existing storage/UI tests. Do not introduce a general privacy platform.

**Exit:** no unexplained app transmission, no prohibited permission, verified
storage/backup behavior on supported pilot devices, accurate reset/retention
wording, and all applicable consent/age obligations resolved for the pilot.

### P3 — Complete teaching, accessibility and native quality

**Estimate:** 5–9 engineering days for foundation fixes; recording, curriculum
production and human review are separately scheduled. **Dependencies:** P1;
P2 before family use. **Requirements:** EDU-01–02, A11Y-01, QUA-01–03.

1. Replace draft phoneme audio with appropriately licensed reviewed recordings
   following [content review](content-review.md). Review navigation and feedback
   as part of the teaching experience, not just individual files.
2. Complete spoken navigation and verify interruption/replay. Decide persistent
   parent audio/motion settings deliberately; the current session-only behavior
   must not contradict parent expectations or disclosures.
3. Reproduce drag on physical iPad; correct only established causes and preserve
   tap equivalence. Verify gesture cancellation and rotation do not create errors.
4. Test screen readers, focus and announcement behavior on both native platforms.
   Review possible answer leakage and alternative participation with a literacy
   specialist. Test large text, contrast, switch/keyboard use and motor access.
5. Run the full device matrix with synthetic progress: first-launch offline,
   both lessons, retries/demo/skip, replay, interruptions, restart, reset, failed
   saves and upgrade. Expand lesson coverage with each approved content pack.
6. Measure performance on minimum hardware. Adjust supported-device policy from
   evidence; an Expo OS floor is not a promise that every old device performs well.

**Likely paths:** `src/features/`, `src/audio/`, `src/ui/`, `content/`,
`assets/audio/`, existing `tests/` and `.maestro/` flows. Approved asset changes
must invalidate old digests and be reviewed again.

**Exit:** strict release/content gate passes, critical accessibility paths are
usable, all physical pilot-device acceptance checks pass, and no safety/privacy/
data-loss blocker remains. Native validation is still platform-specific.

### P4 — Run a bounded authorized pilot and decide M3 scope

**Estimate:** 2–3 engineering days for setup/analysis plus an owner-selected
observation period, provisionally 1–2 weeks. **Dependencies:** all child-use gates
below. **Requirements:** PIL-01, EDU-02, REL-01.

Use adult-supervised observation focused on navigation independence, understood
instructions, sound clarity, motor usability, frustration, ability to stop and
parent understanding of progress. Preserve the distinction between usability
findings and educational efficacy. Do not collect names/recordings into the app
or repository to make analysis easier.

Stop for harmful/misleading instruction, distress, inaccessible essential tasks,
unexpected collection, unreliable reset or data loss. Repair and revalidate
before resuming affected use. Define the observation questions and stop criteria
before recruiting so the pilot produces decisions rather than open-ended notes.

**Exit:** documented usability findings, resolved critical issues and an explicit
M3 content/value decision. Thirty lessons in the design are a planning target;
this schedule does not promise their production. Optional microphone practice
remains a separately gated M2 decision, not a prerequisite to store preparation.

### P5 — Prepare and authorize each store release

**Estimate:** 3–5 engineering days per initial store package after product/content
completion; store review, account verification and any required 14-day testing
period are separate. **Dependencies:** P0–P4 and adequate M3 content/value.
**Requirements:** all applicable rows, especially APP-01/AND-01/SEC-04/REL-01.

1. Finish reviewed legal/support/rights documents and actual business contact
   information. Prepare accessible, functional public pages without adding
   tracking by default. Publishing those pages requires authorization.
2. Complete the store packet using the exact release build: ratings/audience,
   privacy answers, screenshots, native reports, export/signing declarations,
   review instructions and current account prerequisites.
3. Recheck living requirements and selected-country legal decisions at release
   freeze and again immediately before submission. Resolve conflicting deadline
   summaries using current official notices and portal evidence.
4. Conduct an independent mobile/security and accessibility review proportionate
   to the final build. Close findings; do not relabel a self-check independent.
5. Rehearse an incident with synthetic evidence: receive a report, classify,
   assess legal notice timing, pause distribution and prepare a safe update.
6. Present a complete go/no-go package to the owner. After explicit authorization,
   use the store's available controlled rollout or release-timing mechanism.
   Confirm the actual published version and distribution scope.
7. Use an initial observation period with store-provided diagnostics and parent
   support that has passed privacy review. Do not silently add child analytics.

**Exit:** approved store-specific release with verified published metadata/build,
an operating support process and an assigned maintenance owner. Approval on one
platform does not complete another platform's gate.

## Critical path, cost control and capacity

P0–P3 total roughly **14–24 engineering days for the foundation**, plus
human review/recording, toolchain and hardware availability. P4 and each P5 add
their own work and external lead times. This is not a total public-launch estimate:
M2/M3 curriculum volume and findings may dominate it. Re-estimate after P0/P1.

Content/rights review and the legal applicability brief can progress while native
tooling is prepared. Keep implementation changes focused and sequential in the
shared checkout; parallel workstreams here describe scheduling opportunities,
not authorization to dispatch agents.

Avoid spending on a compliance SaaS suite, account backend, analytics, speech AI,
subscription engine or additional stores before proving the existing lesson
experience. Spend first on accurate recordings, literacy/privacy review and
representative physical devices. Request quotes rather than inventing professional
fees. Reuse available hardware after checking it represents the support matrix.

The owner budget decision should separately cover review/recording, device access,
developer enrollment, legal/support hosting if needed, security/accessibility
review, insurance and ongoing support. No enrollment, hosting subscription,
purchase or paid assessment has been made by this planning work.

## Validation and release gates

### Existing commands

These commands exist in [package.json](../package.json). They are not substitutes
for legal or human approval:

```sh
npm run validate:code
npm run content:check:draft
npm run content:check
npm run security:check
npm run test:native
git diff --check
```

`npm run validate` combines the code and strict content gates. Draft checking
requires the relevant local asset files. `test:native` requires Maestro and a
prepared installed build/device. Run narrow affected tests first, then the repo's
required checks. Never weaken the strict gate because reviewed content is missing.

**Proposed checks, not implemented npm scripts:** native permission/entitlement
diff; required-reason/privacy-manifest audit; JS/native SBOM and license review;
artifact digest capture; target-SDK and 16 KB alignment checks; complete backup/
network/device acceptance. Add only small focused scripts when their actual build
inputs and repeated use justify them. CI changes need explicit authorization.

### Go/no-go conditions

| Gate | Required before passing | Current state |
| --- | --- | --- |
| Adult development | Existing code/security checks; synthetic data; draft content clearly bounded | Available prototype path; use current check results |
| Child/family use | EDU-01; applicable legal/consent decisions; private pilot procedure; accessible reviewed lesson; installed offline/device/privacy acceptance; owner authorization | **Blocked** |
| Public iOS/iPadOS | Child-use conditions plus M3 scope, Apple packet, business/rights, independent review, incident/support readiness and exact-build authorization | **Blocked** |
| Public Google Play | Common public conditions plus Families/Data safety, API/native/signing, account eligibility and actual Android acceptance | **Blocked** |
| Galaxy Store / other territories | Shared conditions plus channel/country decisions and verified differences | **Not approved; deferred** |

For every release, retain a public-safe summary and a restricted evidence bundle.
The bundle records build/source IDs and hashes, device/OS/results, data/permissions
inventory, content and rights approval references, source dates, store disclosure
copies, review findings/disposition, and owner approval. Keep signing secrets,
real learner data, consent records and private contracts out of Git. Retain only
the minimum necessary private evidence under a documented access/retention policy.

Evidence expires when its inputs change: content edits invalidate affected human
review, native dependency/config changes invalidate binary/privacy checks, and a
new device/store/country invalidates the corresponding applicability assumption.
Tie approval to exact inputs rather than a permanently green spreadsheet cell.

## Maintenance after launch

| Cadence / trigger | Assigned action |
| --- | --- |
| Every release | Refresh applicable policy/SDK deadlines, content approvals, dependency/permission changes, notices and exact-artifact device evidence |
| Weekly | Engineering/security triages dependency alerts and private support reports; owner reviews safety or data-loss signals |
| Monthly | Owner/release lead checks store policy notices, age-assurance developments and upcoming SDK/verification deadlines |
| Quarterly | Refresh representative device/OS checks, access to signing/recovery, privacy/retention review and incident exercise as warranted |
| New country, school customer, data feature or monetization | Reopen the relevant legal/store/threat assessment before implementation or availability |
| Suspected exposure, harmful instruction or compromised dependency | Immediate human escalation; contain and preserve minimal private evidence; counsel determines notification duties; verify fixes before resuming affected distribution |

This is a proposed operating schedule, not an installed automation or a promise
of background monitoring. Name actual people and support hours before launch.

## First implementation task to authorize

Begin with **P0/P1: the legal/content evidence brief and reproducible standalone
build foundation**. The concrete environment proposal should address the existing
CocoaPods/Ruby and Android tooling blockers, name install locations and versions,
and preserve the current Expo stack. In parallel, the owner can secure final
recording rights and the necessary human reviewers. These unblock the highest-risk
proofs before spending on additional features or stores.

Keep each bounded implementation's initial change in one commit before review,
with a few focused review fixes if needed. Follow [CONTRIBUTING.md](../CONTRIBUTING.md).

## Planning handoff validation

Checked on 2026-09-12 for this documentation change:

| Check | Result |
| --- | --- |
| Local Markdown targets, numbered footnotes and npm command references | Passed |
| `npm run validate:code` | Passed: lint, strict types, 37 unit tests, 19 UI tests across five suites, and repository boundaries |
| `npm run security:check` | Passed: npm audit reported zero vulnerabilities; Gitleaks history/directory scans reported no leaks |
| `npm run content:check` | Failed as expected: `UNAPPROVED_LESSON`, `UNAPPROVED_ASSET`, `REVIEW_DIGEST:first-sounds`, `REVIEW_DIGEST:first-words`; release remains blocked |
| Full `npm run validate` wrapper | Not run separately; its code and strict-content components were run above, and the content component fails |
| Native builds, device tests, store-account review, legal opinions, human content/accessibility review | Not performed by this documentation work; remain explicit gates |

No runtime, dependency, environment, CI, signing, account or publication changes
are included in this planning handoff.
