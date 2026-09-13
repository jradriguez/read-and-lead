# Mobile application requirements and risk assessment

Read and Lead should progress through a reviewed family pilot, an iOS/iPadOS
release, and then a Google Play release on explicitly tested Android devices.
Samsung phones and tablets do not require a separate application architecture:
Google Play can serve them. Galaxy Store is an optional additional distribution
channel with its own rules. Retaining one offline application, bundled lessons,
minimal local data, and no advertising offers the best balance of protection,
development cost, and dependable learning.

This assessment was checked against public primary sources on **2026-09-12**.
It distinguishes law, contractual store rules, engineering recommendations, and
unresolved applicability. It is a planning baseline, not a legal opinion,
compliance certification, teaching approval, or authorization to publish.
No finite report establishes compliance in every jurisdiction. The implementation
plan therefore makes territory-specific applicability and current release evidence
mandatory decisions, rather than assuming worldwide clearance.

## Scope and current position

The working launch assumption is US direct-to-family distribution, ages roughly
4–7, English only, and iPad priority. International markets are expansion options,
not approved launch territories. The [design](design.md) remains authoritative:
M1 is a first playable, M2 a family pilot expansion, and M3 commercial readiness.
This report does not convert two prototype lessons into a public launch product.

Evidence comes from [implementation status](implementation-status.md),
[the privacy map](privacy-data-map.md), [content review](content-review.md),
[device validation](device-validation.md), [the package manifest](../package.json),
[native configuration](../app.json), and inspected application/plugin source.
Repository baseline inspected: `e9fa63a`. No signed release artifact or
authenticated store account was audited.

| Area | Existing foundation | Unresolved acceptance |
| --- | --- | --- |
| Product boundaries | No application backend, accounts, ads, microphone, billing, live AI, remote lessons, or analytics service in M1 | Inspect the complete release binary and SDK behavior; source intent alone cannot prove this |
| Teaching | Cumulative catalog validation, human-review states, semantic digests, asset-byte checks | Two lessons remain drafts; phoneme recordings, rights and actual literacy review are missing |
| Data | Fixed local learner key, transactional SQLite, 90-day detail pruning, confirmed reset | Native backup/transfer tests; retention rationale; residual deleted bytes; crash/log exposure |
| Interaction | Tap alternative to drag, retry/demo/skip, reduced motion, accessibility labels | Complete spoken navigation, real drag, screen readers, switch/keyboard access, device interruption tests |
| Security workflow | Strict types, tests, npm audit, Gitleaks, pinned CI actions, CodeQL/Dependabot configuration | Native dependency inventory, binary review, threat assessment, release signing and incident operations |
| Native delivery | Expo 57 and generated native configuration; limited Expo Go simulator evidence | Standalone compilation, physical iPad/Android execution, first-launch offline operation |
| Business/store | Working product name and prototype identifiers | Publishing entity, trademark clearance, enrollment, public privacy/support information, ratings and store submissions |

## Distribution requirements

### Apple App Store: iPhone and iPad

Apple requires complete, functional submissions, accurate metadata and privacy
information, appropriate security, and rights to included material. Kids Category
apps restrict third-party data transmission and ordinarily exclude advertising
and analytics. Outbound links and purchasing opportunities belong behind an adult
gate. These child protections continue in subsequent updates even if the category
is deselected. A parent gate is not verifiable parental consent.[^1]

Select the Kids age band that truthfully represents the primary audience: Apple
offers 5 and under, 6–8, and 9–11. The app's 4–7 design crosses two bands; the owner
and literacy reviewer must resolve positioning before submission. Content age
rating, Kids audience band, OS age signals, and legal consent are different
decisions.[^2]

The technical submission baseline since April 28, 2026 is the iOS/iPadOS 26 SDK
or later. That is a build SDK requirement, not a requirement to drop all older
supported devices. Expo 57 documents iOS 16.4+, Xcode 26.4+, React Native 0.86,
and Android compile/target SDK 36. Verify the actual archive, not just these
framework defaults.[^3][^4]

Review bundled `PrivacyInfo.xcprivacy` files, required-reason API use, and applicable
third-party SDK signature requirements. Use reasons that describe real behavior;
do not copy a blanket list. Generate and inspect Xcode's aggregated privacy report.
A privacy manifest, App Store privacy answers, and the public privacy policy are
three separate artifacts that must agree.[^5]

Prepare verified enrollment, final bundle identity, release version/build numbers,
icons, screenshots from the reviewed build, support contact, privacy information,
reviewer instructions for the parent gate, and export-compliance answers. Review
encryption in Expo/native dependencies before declaring an export exemption.
Organization enrollment requires genuine legal-entity information and applicable
verification; do not borrow another project's business identity.[^6][^7]

### Google Play: Samsung, Pixel and other Android devices

Because the intended audience includes children, Google Families requirements
apply. Declare the real age groups, keep child-facing content appropriate, and
check every SDK's permitted use. A general-audience label cannot remove these
obligations. Avoid advertising identifiers and unnecessary sensitive permissions.
The Families advertising SDK program does not certify an arbitrary non-ad SDK
or make an entire application compliant.[^8]

Google requires an accurate Data safety form and public privacy-policy link even
where no user data is collected. Closed/open/production tracks are covered;
exclusive internal testing has a stated exemption. Google defines collection in
this form around off-device transmission, including SDK behavior. On-device-only
processing generally is not declared as collection, but this does not mean local
learning records cease to deserve protection.[^9]

New apps and updates must target **Android 16 / API 36** from August 31, 2026.
Do not use the lower existing-app availability threshold for a new submission.
Google documents a possible extension to November 1, 2026; this plan does not
depend on receiving one.[^10]

React Native applications contain native libraries. Inspect every packaged `.so`
and test the delivered build on a 16 KB page-size environment. Google's current
page states that API 35+ apps must support 16 KB pages on 64-bit devices and gives
February 1, 2027 as the update-blocking date. Treat compatibility as required for
our launch, regardless of grace periods. Older November 2025 summaries are not
the deadline baseline used here.[^11]

Use an Android App Bundle and Play App Signing, with separately protected
upload/signing access and tested upgrade continuity.[^46] Final artifact
format and account requirements must be checked in the selected Play account.
Organization identity information must match verification records. Personal
accounts created after November 13, 2023 have a production-access prerequisite
of at least 12 testers continuously opted into a closed test for 14 days;
meeting that period permits an application for access, not automatic approval.
Use adult testers unless the separate child-use gates are satisfied.[^12][^13]

Android developer verification begins applying on September 30, 2026 to
participating stores in Brazil, Indonesia, Singapore and Thailand on certified
Android 7+ devices, with broader expansion planned for 2027. Confirm identity and
package registration when adding countries or non-Play stores.[^14]

### Galaxy Store and other distribution channels

| Channel | Additional requirement or uncertainty | Recommendation |
| --- | --- | --- |
| Galaxy Store | Separate Seller Portal verification/review, appropriate rating, privacy/rights evidence, native Samsung testing. Its Kids category says no outbound links; do not assume Apple's gate exception applies. Samsung also specifies silent-mode and interruption behavior | Defer until Google Play is stable; embed legal/support information in the app and resolve any external-contact design before this channel |
| Galaxy packaging | Samsung's public FAQ lists target API ≥33 and a 64-bit binary; portal notices may be newer. Separate package identities may prevent cross-store updates but also separate local progress and purchases | Keep the stronger shared API 36 baseline; decide signing/package/update strategy before registering a second listing |
| Amazon Fire tablets | Amazon ended Appstore support on general Android devices on August 20, 2025 while retaining Fire devices | Evaluate only for demonstrated Fire-tablet demand; test exact Fire OS hardware and absence of Google-service assumptions |
| Huawei AppGallery | Separate review rules and device/runtime compatibility; the app has no tested Huawei native artifact | Run a bounded feasibility and country review first; do not promise Expo Android compatibility across every HarmonyOS device |
| ChromeOS, foldables, desktop, web, TV, watches, XR | Layout availability is not a tested or supported product | Advertise only an explicit device/OS support matrix; assess each extra surface separately |
| Direct APKs or alternative iOS distribution | Different installation, signing, update/support and regional obligations | Defer; avoid creating another consumer update channel for the pilot |

Sources: Samsung distribution guide and FAQ, Amazon's discontinuation notice,
and Huawei's review-policy entry point.[^15][^16][^17][^18] The narrower initial
channel choice is a business recommendation, not a store requirement.

## Privacy, children and geographic applicability

### US COPPA and state obligations

The app is intentionally child-directed. COPPA's collection-dependent duties
must be assessed against the actual application, SDKs, website, support handling,
and pilot practices. No backend is a useful design constraint, not a legal
exemption certificate. The FTC identifies child-directed services and collection
of under-13 personal information as central scope factors.[^19]

For covered collection, plan for parent notice and verifiable consent before
collection unless a specific exception applies; parental review/deletion and
revocation; limited collection; security; and bounded retention. The amended
rule requires a written security program and retention policy, and separate
consent for certain third-party disclosures. Its general compliance deadline
was April 22, 2026, so treating the amendment as a future obligation is wrong.
An arithmetic puzzle, OS permission, or store download approval is not by itself
COPPA consent.[^20][^21]

**Recommended decision:** Obtain a written applicability assessment of the exact
offline build before family use. If no covered collection is confirmed, retain
that rationale rather than adding a consent vendor and new identifiers. If
collection is found, remove it where feasible or implement the applicable legal
controls before use. Keep a parent-facing explanation of local records regardless.

State privacy, children's design/age-assurance, consumer protection, biometric,
breach-notification and student-data laws need a current US applicability matrix.
CCPA/CPRA has business thresholds and special under-16 sale/sharing protections;
being a small developer should not be treated as an exemption from every other
law. The simplest product position remains no sale, sharing for ads, profiling,
biometrics, or child accounts.[^22]

Regional age-assurance law is a distinct release risk. Apple's framework guidance
and Google's Age Signals tooling cover age bands, significant changes and
revoked approvals. Apple separately reported that a Texas injunction paused its
previously announced implementation. That notice is not proof of the present
enforcement status of all state laws. Obtain a current legal assessment for
Texas, Utah, Louisiana and every other applicable state, including effective
dates, injunctions, exceptions, permitted use of signals and necessary app
behavior.[^23][^24][^25]

Do not assume a US storefront can exclude individual states, or that declaring
the whole app child-safe satisfies every age-signal requirement. If legally
required APIs cannot preserve the intended offline experience, resolve the
behavior or distribution decision before launch. Any eventual adapter needs tests
for unknown age, unavailable store services, revoked approval, offline startup and
significant updates. Play signals are limited to Play-updated apps and cannot be
assumed to work as the Galaxy/Fire solution.[^24]

### Expansion markets and conditional regimes

| Market or trigger | Applicability assessment required | Practical disposition |
| --- | --- | --- |
| EU/EEA | GDPR territorial scope and controller/processor roles for each flow; lawful basis, minimization, rights, security, DPIA need, vendor transfers and representation. Consent-based child services have national thresholds between 13 and 16 | No blanket GDPR certification; assess even local processing and separate parent support flows before enabling countries [^26] |
| UK | UK GDPR and Children's Code where the service falls within scope; child best interests, high privacy defaults, data minimization and DPIA. ICO offers applying protections to everyone as an alternative to unnecessary age collection in suitable cases | Use the Code as a design baseline now; assess legal scope and current amendments before launch [^27] |
| EU commercial software | Cyber Resilience Act product/activity scope, including indirect connections; do not infer exemption from offline lessons or public source. Article 14 reporting applies from September 11, 2026; general application begins December 11, 2027 | Before EU availability, resolve vulnerability reporting, support period, technical documentation, SBOM and eventual conformity obligations [^28] |
| EU storefront/business | DSA trader declarations and contact disclosure through the store; assess EAA coverage of any e-commerce/e-book services and national implementation rather than claiming all apps are covered | Confirm actual trader identity/contact publication; legal review must determine EAA scope/exemptions [^29][^30] |
| EU product liability | Directive (EU) 2024/2853 explicitly includes software; its new regime concerns products placed on the market or put into service after December 9, 2026 | Review national implementation, product safety/support obligations, contracts and insurance before EU launch; an EULA is not a blanket liability shield [^47] |
| Canada | PIPEDA and applicable provincial rules; OPC's position generally calls for parent consent below 13 when consent is required | Evaluate Quebec and other provincial requirements, notices and support before enabling Canada [^31] |
| Australia | Existing privacy/consumer obligations plus the status and applicability of the Children's Online Privacy Code | The consulted OAIC material is an exposure draft/consultation, not proof of a final operative code; recheck before launch [^32] |
| Brazil | LGPD children's best interests, legal basis, and current digital child/age-assurance rules; Android verification rollout also matters | Country-specific review before availability; regulator age-assurance guidance is evolving [^33] |
| India | DPDP Act/2025 Rules and their staged commencement, child processing and parental verification, applicable exceptions | Require provision-level effective-date review; do not describe the entire framework as immediately operative [^34] |
| Other countries | Local child/privacy, consumer, ratings, language, business, tax and distribution rules | Remain unapproved until a named reviewer completes a country assessment; China and South Korea are not covered by US clearance |
| Schools or districts | FERPA relationships, school-official contracts/control, state student privacy laws, retention/deletion and procurement accessibility | Separate B2B project; a family learning app is not automatically a FERPA-certified product [^35] |
| Microphone, AI, accounts, telemetry, ads, billing, cloud sync | New data flows, permissions, consent/rights, vendor terms and threats; medical/diagnostic claims may introduce another regulatory regime | New scoped assessment before implementation; retain M1 exclusions |

For an EU CRA in-scope product, the current requirements need more than an annual
audit: assign vulnerability response, investigate exploited vulnerabilities and
severe incidents, and have a reporting process ready before distribution. The
statutory reporting clock can be shorter than a normal engineering sprint.
This app's classification and complete reporting procedure remain unresolved.[^28]

EU/UK DPO appointment, representatives, consent systems, and vendor contracts are
not universal requirements for every app. Record why each applies or does not.
Country expansion is a release decision, not a translation-only task.

## Security and dependencies

Use OWASP MASVS/MASTG to structure a proportionate mobile review and NIST SSDF
to organize secure development and vulnerability handling. These are engineering
frameworks, not mandatory universal store certifications. SOC 2, ISO 27001 and
a paid mobile assessment should be demand-driven; they do not replace checking
the application.[^36][^37]

### Threats and acceptance evidence

| Threat | Recommended control and evidence |
| --- | --- |
| Hidden SDK transmission | Inventory JS and native dependencies, inspect release permissions/endpoints, and capture app-attributable traffic during connected and offline first launch, lessons, background/restart, reset and parent use. Expected M1 app egress is zero; unexplained traffic blocks release |
| Cloud or OEM transfer of progress | Inspect iOS directory and sidecar exclusion; define/test Android cloud and device-transfer rules on real supported manufacturers. Android documents that `allowBackup=false` may not block D2D transfer [^38] |
| Local data exposure | Verify app-private storage, iOS file-protection behavior, Android sandbox, logs, crash artifacts, shared files and app-switcher previews. OS protection is a starting point; record locked-device and shared-device residual risk |
| Misleading deletion/retention | Test confirmed reset, pruning, aggregation and interrupted cleanup. SQL `DELETE` does not alone prove forensic erasure from free pages/WAL/SHM or backups. Decide a justified sanitation strategy without silently changing schema or promising perfect flash erasure |
| Lost/corrupt progress | Preserve transactions, serialization, event idempotency and unknown-schema rejection. Test disk-full/write failure, interrupted writes, retries, upgrade, failed reopen and cancelled reset |
| Compromised lessons/assets | Keep human review separate from automated validation. Bind semantic catalog and exact media bytes to the reviewed build; ensure a changed asset or stale approval cannot ship |
| Parent-area bypass | Check expiry/backgrounding, navigation entry points and accessible gate behavior; no back-door bypass in release. The gate is friction against children, not strong authentication |
| Compromised release/dependencies | Protected signing access and recovery, least privilege/MFA, verified tools, pinned lockfiles and CI actions, review of lifecycle scripts and dependency changes, reproducible build inputs, artifact digests |
| Leaked real learner/support data | Synthetic tests only; private reporting channel, redacted logs, no automatic database attachments, documented access and deletion of support material |

Threat-model limits must remain explicit: a device owner with advanced access,
a rooted/jailbroken device, or malware in the OS is not defeated by an arithmetic
gate. App-specific database encryption is a decision based on threats and key
management, not a checkbox to solve everything. No new encryption dependency is
authorized by this report.

### Dependency admission and maintenance

Keep Node 24/npm and Expo's compatible dependency set. Review the scoped
`xcode -> uuid` override on upgrades, rather than removing it blindly or forcing
unrelated changes. Record exact versions from `package-lock.json`; acquire native
Pod/Gradle resolution and bundled-library details when builds become available.

For each runtime and build dependency, record purpose, maintainer/source, exact
version/integrity, license/notice obligations, supported SDK range, native code,
permissions, data behavior, vulnerability status and disposition. Generate a
machine-readable SBOM from the resolved release inputs, including native packages;
a list of npm package names is incomplete. Audit fonts, artwork, audio and build
tools separately from application packages.

The public-source repository does not grant redistribution rights to original
app content. License scanners are discovery aids; someone must review obligations
and produce appropriate third-party notices. Obtain written recording/performer,
music, artwork and contractor rights covering distribution and modification.
Resolve rights before spending effort on polished store media.

Proposed maintenance policy: examine dependency/security alerts weekly and
before every release; triage actively exploited or credible critical findings
the same business day, high findings within two business days, and other findings
weekly. Set a risk-based remediation owner and deadline after triage. These are
internal targets, not legal reporting periods or service promises. An audit pass
does not detect all malicious behavior, native vulnerabilities or license issues.

## Child safety, accessibility and experience

### Educational and emotional safety

Human literacy review is a prerequisite to child use. Review pronunciation
without added schwa, segmentation, cumulative decodability, prompts, connected
text, replay and ambiguous answers. Separate assisted performance from independent
answers. Test that feedback never asserts an unobserved spoken response or calls
completion mastery. Assess whether screen-reader speech accidentally supplies
answers and agree an equivalent teaching path with the literacy reviewer.

Retain short optional sessions, a clear finish, bounded retries, demonstration
and skip. Avoid guilt, reward loss, streak pressure, timers, manipulative
notifications and child-facing commercial prompts. Robot workshop activities
should stay fictional and on-screen; do not encourage unsupervised tools,
electricity, heat, swallowing parts or other physical experiments.

For a pilot, prepare adult permission and understandable child assent, a stop
rule for discomfort, synthetic or minimized observation records, restricted
access and a retention deadline. Do not record children's voices/video merely
to simplify QA. Have an authorized human decide whether a proposed study or
publication requires institutional ethics review. No child outreach is authorized
by creating this plan.

### Accessibility baseline

Adopt WCAG 2.2 AA as an internal design/QA target interpreted for native mobile
interfaces. W3C's WCAG2Mobile document is a **draft guidance note**, not an endorsed
new conformance standard. This engineering target does not assert that every
jurisdiction legally mandates WCAG 2.2 for this app.[^39][^40]

Test logical focus, names/roles/states, error announcements, text enlargement,
contrast, non-color feedback, portrait/landscape, reduced motion, and equivalent
non-drag interaction. Use at least 4.5:1 normal-text contrast and 3:1 for large
text/relevant non-text controls as appropriate to the criteria. Retain the
project's larger 56 logical-pixel touch-target design. Include VoiceOver,
TalkBack, switch access and hardware keyboard use on supported devices.
Provide replay and visual equivalents for spoken navigation; document where an
auditory phonics objective needs a separately reviewed adaptation.[^39]

If selling to public schools, assess ADA Title II/Section 504/508 and contractual
requirements separately. DOJ's updated guidance gives Title II technical-rule
deadlines of April 26, 2027 or April 26, 2028 depending on public-entity size/type;
older April 2026 guidance is superseded on those dates. This does not eliminate
existing accessibility duties or automatically apply the public-entity rule to
all private consumer apps.[^41]

### Reliability and device coverage

Use Android's core quality guidance as a baseline for lifecycle, responsive
layout and resource behavior.[^42] The project acceptance matrix should include:

- A physical oldest-supported iPad class, a current iPad, and a supported small
  iPhone. Add current shipping iOS/iPadOS and the supported OS floor.
- A modest Samsung tablet, a Samsung phone and a Pixel/reference Android device.
  Cover actual minimum-supported hardware, API 36 behavior, and 16 KB pages.
- Rotation, Android back, edge-to-edge insets, large text, split/resized windows
  where available, and foldable posture if advertised.
- First launch without network after installation; all approved lessons and
  assets; force-close/reopen; upgrade with preserved progress; low storage;
  competing audio; Bluetooth/headphone changes; interruptions and silent mode.
- Repeated sessions and rapid taps without duplicate outcomes, runaway animation,
  leaked audio players, excessive heating or unbounded data growth.

Suggested performance budgets, to measure and revise before promising them:
cold start to usable workshop within three seconds on the lowest supported
device; visible response to input within 100 ms; bundled prompt start within
500 ms; no app crash/ANR or data-loss defect in the agreed acceptance suite.
These are engineering targets, not established measurements or store thresholds.
Do not add child telemetry merely to obtain performance statistics.

## Business protection and truthful operation

Have counsel/accounting confirm the publishing entity, ownership assignments,
contracts, public contact details, tax treatment and appropriate insurance.
Organization structure and insurance address different risks; neither makes
privacy violations or misleading claims harmless. Seek quotes for suitable
technology E&O, cyber/privacy and media/IP coverage based on actual exposures,
including exclusions for minors and content. This is a recommendation to scope
professional review, not a purchase authorization.[^43]

Perform trademark clearance for Read and Lead before final branding. A federal
database search alone is only part of comprehensive clearance; evaluate similar
names, relevant goods/services and unregistered use. The current name and
prototype package IDs are not evidence of ownership.[^44]

Prepare a plain-language privacy policy, local retention/reset explanation,
support process, appropriate terms/EULA, license notices and adult-facing
commercial disclosures. Separate website/support data from app learning data.
Warn support users not to send children's names, recordings or databases.
Publish only business contact information approved for public disclosure.

Claims need evidence before advertising: accurate descriptions of practice are
different from promises to improve reading, diagnose dyslexia or produce a reading
age. Do not turn a small pilot or general phonics literature into product-specific
efficacy claims. Testimonials do not replace substantiation.[^45]

Keep M1 free of billing. For eventual commercial design, compare a paid download
or adult-gated one-time unlock with subscription complexity and ongoing value.
Use applicable store payment rules and test purchase, cancellation, pending state,
restore, refund/revocation and offline entitlement behavior. Do not copy a payment
rule across jurisdictions or stores; current terms and consumer cancellation/tax
requirements need separate review before choosing the model.

Create an incident procedure before public release: named decision-maker,
private intake, classification, containment, evidence preservation, legal notice
assessment, fix and verification. Suspected child-data exposure or harmful content
gets immediate human escalation. Do not publish private reports into GitHub issues.
No universal notification deadline applies to every incident; counsel must map
the relevant jurisdictions and triggers.

Plan for recovery without remote configuration: pause a rollout, stop new
distribution where appropriate, and submit a corrected signed version. Installed
offline copies may continue running; unpublishing is not a remote recall and a
store cannot be assumed to permit an immediate binary downgrade. Keep compatible
upgrade paths and a privately retained release evidence package.

## Requirements that must not be conflated

| Evidence or mechanism | What it does not establish |
| --- | --- |
| App Store / Google / Samsung approval | Legal compliance everywhere, sound instruction or no security vulnerabilities |
| Zero npm audit findings | Native SDK security, absence of malicious dependencies, privacy behavior or rights |
| “Data not collected” store label | No on-device sensitive records, no support data, or exemption from all laws |
| Parent gate / OS permission / app-download approval | Every legally required form of parental consent |
| Human content review | Proven learning outcomes or native reliability |
| Expo Go / simulator / unit tests | Standalone offline use, real backup exclusions, accessible physical gestures |
| Public Git repository | Cleared brand, licensed recordings, transferable ownership or CRA exemption |
| Proposed compliance tracker | Implemented controls or human approval |

## Sources

All sources were accessed on 2026-09-12. Undated living pages need a fresh check
before submission. Section references identify the claims used; the implementation
plan's controls are recommendations unless explicitly identified as law/store rules.
EUR-Lex full-text GDPR/EAA URLs redirected to an index during retrieval; the
assessment uses Commission/ICO guidance for that overview and leaves article-level
legal review open. No account-specific portal requirements, court docket or full
50-state legal survey has been represented as completed.

[^1]: Apple, [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/), especially 1.3, 2.1, 2.3 and 5.1; living policy.
[^2]: Apple, [Design safe and age-appropriate experiences](https://developer.apple.com/kids/), Kids Category age bands; living guidance.
[^3]: Apple, [Upcoming SDK minimum requirements](https://developer.apple.com/news/?id=ueeok6yw), February 3, 2026; effective April 28, 2026.
[^4]: Expo, [SDK 57 reference](https://docs.expo.dev/versions/v57.0.0/), SDK/version compatibility tables.
[^5]: Apple, [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) and [Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api), living technical requirements.
[^6]: Apple, [Program enrollment](https://developer.apple.com/help/account/membership/program-enrollment/), identity and organization requirements.
[^7]: Apple, [Overview of export compliance](https://developer.apple.com/help/app-store-connect/manage-app-information/overview-of-export-compliance/), encryption declarations.
[^8]: Google, [Google Play Families Policies](https://support.google.com/googleplay/android-developer/answer/9893335), audience, SDK and data rules.
[^9]: Google, [Provide information for Google Play's Data safety section](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en), tracks, collection and disclosure scope. See also Apple, [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/), on-device processing.
[^10]: Google, [Target API level requirements](https://support.google.com/googleplay/android-developer/answer/11926878?hl=en), 2026 submission and availability requirements.
[^11]: Android Developers, [Support 16 KB page sizes](https://developer.android.com/guide/practices/page-sizes), current compatibility requirement and ELF/package verification.
[^12]: Google, [App testing requirements for new personal developer accounts](https://support.google.com/googleplay/android-developer/answer/14151465?hl=en-GB), closed-test eligibility.
[^13]: Google, [Required information to create a Play Console developer account](https://support.google.com/googleplay/android-developer/answer/13628312?hl=en), verification.
[^14]: Android Developers, [Android developer verification](https://developer.android.com/developer-verification), September 30, 2026 rollout and planned expansion.
[^15]: Samsung, [App Distribution Guide](https://developer.samsung.com/galaxy-store/distribution-guide.html), sections 1.4, 3.1–3.3; [Galaxy Self-Check List](https://developer.samsung.com/galaxy-store/self-check-list-galaxy.html?lang=en).
[^16]: Samsung, [Galaxy Store FAQ](https://developer.samsung.com/galaxy-store/faq.html), API, 64-bit, packaging and Seller Portal; [Developer API prerequisites](https://developer.samsung.com/galaxy-store/galaxy-store-developer-api/get-started-with-the-gsd-api.html), commercial seller status.
[^17]: Amazon, [Upcoming changes to Amazon Appstore for Android devices and other programs](https://developer.amazon.com/apps-and-games/blogs/2025/02/upcoming-changes-to-amazon-appstore-for-android-devices-and-coins-program), February 2025; effective August 20, 2025.
[^18]: Huawei, [AppGallery Review Guidelines](https://developer.huawei.com/consumer/en/doc/distribution/app/50104), review-policy entry point; compatibility not verified.
[^19]: FTC, [Complying with COPPA: Frequently Asked Questions](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions), child-directed service and collection scope.
[^20]: eCFR, [16 CFR Part 312](https://www.ecfr.gov/current/title-16/chapter-I/subchapter-C/part-312), particularly §§312.4–312.6 and 312.8–312.10; retrieved edition current through September 10, 2026.
[^21]: Federal Register, [April 22, 2025 Rules and Regulations](https://www.govinfo.gov/content/pkg/FR-2025-04-22/pdf/FR-2025-04-22.pdf), COPPA final rule compliance date; FTC, [Finalized COPPA changes](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data), January 2025 summary.
[^22]: California DOJ, [California Consumer Privacy Act](https://www.oag.ca.gov/privacy/ccpa), business applicability and children's sale/sharing rules.
[^23]: Apple, [Age assurance frameworks Q&A](https://developer.apple.com/support/age-assurance/), regional responsibility, significant changes and revocation.
[^24]: Android Developers, [Play Age Signals overview](https://developer.android.com/google/play/age-signals/overview), updated July 20, 2026; permitted use and store scope.
[^25]: Apple, [Update on age requirements for apps distributed in Texas](https://developer.apple.com/news/?id=8jzbigf4), injunction-related pause; current legal disposition requires recheck.
[^26]: European Commission, [Specific safeguards for data about children](https://commission.europa.eu/law/law-topic/data-protection/information-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en); Your Europe, [Data protection under GDPR](https://europa.eu/youreurope/business/governance-and-sustainability/digital-and-data-compliance/data-protection-gdpr/index_en.htm), August 2026 overview.
[^27]: ICO, [Children's Code standards](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/standards-of-age-appropriate-design/), [DPIAs](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/2-data-protection-impact-assessments/), and [Age appropriate application](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/3-age-appropriate-application/), living guidance.
[^28]: European Commission services, [Cyber Resilience Act summary](https://digital-strategy.ec.europa.eu/en/policies/cra-summary) and [Implementation timeline](https://digital-strategy.ec.europa.eu/en/factpages/cyber-resilience-act-implementation), Regulation (EU) 2024/2847; summary is explanatory, not a substitute for legal text.
[^29]: Apple, [EU Digital Services Act trader requirements](https://developer.apple.com/help/app-store-connect/manage-compliance-information/manage-european-union-digital-services-act-trader-requirements/), identity/contact disclosure.
[^30]: European Commission, [The EU becomes more accessible for all](https://commission.europa.eu/news-and-media/news/eu-becomes-more-accessible-all-2025-07-31_en), July 31, 2025; EAA sector overview, not an app-specific determination.
[^31]: OPC Canada, [PIPEDA consent principle](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/p_principle/principles/p_consent/), meaningful child consent.
[^32]: OAIC, [Children's Online Privacy Code exposure draft](https://www.oaic.gov.au/news/media-centre/oaic-releases-exposure-draft-of-the-childrens-online-privacy-code), 2026 consultation; proposal status.
[^33]: ANPD, [Children and adolescents' data guidance](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-divulga-enunciado-sobre-o-tratamento-de-dados-pessoais-de-criancas-e-adolescentes), 2023; [Preliminary age-assurance guidance](https://www.gov.br/anpd/pt-br/assuntos/noticias/anpd-publica-orientacoes-preliminares-e-cronograma-para-afericao-de-idade-no-ambiente-digital), 2026.
[^34]: MeitY, [Digital Personal Data Protection Rules 2025](https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa), official rules/publication entry point; commencement review pending.
[^35]: US Department of Education, [Responsibilities of Third-Party Service Providers under FERPA](https://studentprivacy.ed.gov/resources/responsibilities-third-party-service-providers-under-ferpa), provider guidance.
[^36]: OWASP, [Mobile Application Security Verification Standard](https://mas.owasp.org/MASVS/), mobile controls and companion testing resources.
[^37]: NIST, [Secure Software Development Framework](https://csrc.nist.gov/projects/ssdf), secure development practices; SP 800-218 v1.1 baseline.
[^38]: Android Developers, [Back up user data with Auto Backup](https://developer.android.com/identity/data/autobackup), OEM device-transfer caveat and exclusion rules.
[^39]: W3C, [WCAG 2.2](https://www.w3.org/TR/WCAG22/), contrast, interaction and accessibility criteria.
[^40]: W3C, [Guidance on Applying WCAG 2.2 to Mobile Applications](https://www.w3.org/TR/wcag2mobile-22/), Group Draft Note; work in progress.
[^41]: US DOJ, [First steps for the Title II web/mobile accessibility rule](https://www.ada.gov/resources/web-rule-first-steps/), updated 2026 guidance reflecting the April 2026 deadline extension.
[^42]: Android Developers, [Core app quality guidelines](https://developer.android.com/docs/quality-guidelines/core-app-quality), native behavior and quality checks.
[^43]: SBA, [Get business insurance](https://www.sba.gov/business-guide/launch-your-business/get-business-insurance), structure versus insurance protection; coverage selection remains a professional review task.
[^44]: USPTO, [Comprehensive clearance search for similar trademarks](https://www.uspto.gov/trademarks/search/comprehensive-clearance-search-similar-trademarks), search scope.
[^45]: FTC, [Advertising FAQs for small business](https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business), objective claim substantiation.
[^46]: Android Developers, [Upload your app to Play Console](https://developer.android.com/studio/publish/upload-bundle), App Bundle and Play App Signing requirements for new apps.
[^47]: European Parliament, [Liability for defective products](https://oeil.europarl.europa.eu/oeil/en/procedure-document-summary/pdf?id=1795969), adopted Directive (EU) 2024/2853 summary; software and application date.
