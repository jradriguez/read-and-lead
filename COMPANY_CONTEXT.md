# Read to Lead product context

This file owns product identity, priorities, and scope decisions. The detailed
[design](docs/design.md) defines requirements; [implementation status](docs/implementation-status.md)
tracks delivery. **Read to Lead** is the owner-requested provisional display name.
The [name review](docs/product-name-review.md) found material conflicts in literacy
products and app listings. Final adoption needs clearance or a new name; neither
this spelling nor **Read 2 Lead** is established as legally available.

## Vision

Beginning English readers help a friendly robot invent, assemble, and test things.
Reading gives each mission a purpose. Spoken guidance and demonstrations support
guided independence, with optional parent participation and a natural stopping
point. Teach explicit, cumulative sound-spelling patterns and blending; preserve
curiosity and confidence without pressure to keep playing.

The design targets roughly ages 4–7, with placement by skill readiness. Use English
content and US English model recordings, prioritize iPad, and retain phone/Android
layouts. Use **Read to Lead** in current display copy. Keep **read-and-lead** for
the existing checkout, GitHub repository, npm package and Expo slug while naming
is unresolved. Preserve native app identifiers and stored progress. A later final
identity change needs a scoped migration; this is not a new legal entity or an
approved store listing. Use the [vocabulary](docs/context.md) for learning concepts.

## Scope decisions

M1 proves two reviewed offline mini-lessons, equivalent tap/drag controls, authored
robot feedback, reliable local progress, and gated parent controls. It is an adult
prototype until the applicable content and device gates pass. Consult current
implementation status before choosing work; do not rebuild completed plan tasks.

Accept a proposed feature when it addresses an observed learner/parent need or a
specific acceptance gap, fits the current milestone, and has a testable outcome.
Maintenance should address a concrete reliability, security, or development need.
Prefer the smallest complete lesson loop over more screens or infrastructure.
If content or device review is blocked, continue independent authorized engineering
work and keep the affected child-use gate blocked.

M2 expands the reviewed curriculum and family pilot; M3 addresses commercial
readiness. Accounts, cloud services, live AI, ads, analytics, microphone practice,
billing, broader curricula, and new platforms are not additions to M1. The
[mobile readiness plan](docs/mobile-readiness-plan.md) informs separately scoped
work; its recommended markets, budgets, and distribution order are not commitments.

## Decision ownership

The owner decides scope, publishing identity, spending, markets, and release.
Authorized human reviewers assess literacy and asset rights. Engineering provides
reproducible behavior and evidence; it does not grant teaching approval or infer
learning gains from rewards. Follow [agent policy](AI_AGENT_POLICY.md) for authority.

The repository is [jradriguez/read-and-lead](https://github.com/jradriguez/read-and-lead).
See [LICENSE.md](LICENSE.md) for redistribution status. Keep other projects'
company identities, branding, customer information, and private context separate.
