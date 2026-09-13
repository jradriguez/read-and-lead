# Reuse inventory

M1 uses original TypeScript implementation informed by existing repository patterns.
It does not copy AI-OS Python code, an agent runtime, private data, a release workflow,
branding or a source repository's Git history. This avoids carrying unrelated runtime
cost and unverified redistribution rights into a children's app.

| Source and inspected path | Commit evidence | Reused idea / change | License and validation |
| --- | --- | --- | --- |
| AI-OS `src/ai_os/workflows.py`, `docs/templates/agent-workflow/` | committed origin/main `679244276deb19db399e6777948efa173e992afb`; checkout HEAD `c3f0bed7f68faa8dc452a5cf9358969d470549b3` | Typed boundaries, explicit review state and evidence; implemented afresh as content contracts and release checks | No root license established; no literal code copied. Content and file-integrity tests |
| playwright-e2e `package.json` and QA conventions | `a898979c0e3a5257d6ba9652741275337cd5e8d0` | Stable test IDs and independent behavior assertions; native test plan | No source copied. RNTL and real SQLite tests; web emulation is not native proof |
| jrodriguez-site `scripts/prepare-release-artifact.mjs`, `scripts/public-assets.json` | `3fbb367c2eacf6c2d89c9fd8c884799a6bdf0efc` | Explicit asset inventory and reviewed-content hashes, original implementation here | No site code/art copied. Asset path/hash and stale-review tests |
| Atlas sanitized planning documents | planning commit `4188de5` on `docs/read-and-lead-plan` | Approved design, implementation plan and product vocabulary copied with local links | Owner-authorized project documents; private interview note was not copied |
| Expo blank TypeScript template | template 57.0.24; generator 4.0.0 | Actual mobile bootstrap, entry point, TypeScript baseline and placeholder icons | MIT notice retained in THIRD_PARTY_NOTICES; Expo compatibility and Metro bundle checked |

AI-OS had unrelated modified runtime files during inspection. They were neither
read for extraction nor changed. Atlas's unrelated skill edit remains untouched.

Highest-value future reuse is the pure learning/progress/content boundary, which can
support a later math game without importing infrastructure. Do not copy financial,
authentication, publishing, purchasing or agent execution systems into the child app.

## Project instruction curation — 2026-09-12

Source: AI-OS committed tree `c3f0bed7f68faa8dc452a5cf9358969d470549b3`.
The inspected instruction files match that tree; unrelated runtime edits were
excluded. This is an original project-specific adaptation of workflow concepts,
not a wholesale document or runtime import. No root AI-OS redistribution license
was established; this work adds no license grant or third-party assets.

| AI-OS source paths | Read and Lead destination and adaptation |
| --- | --- |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Compact root routing and thin host entry points for the mobile app |
| `AI_AGENT_POLICY.md`, `docs/templates/tool-approval-matrix.md` | `AI_AGENT_POLICY.md`: authorized local work, explicit external actions, human curriculum approval, inline execution |
| `CODING_GUIDELINES.md` | `CODING_GUIDELINES.md`: strict TypeScript, Expo adapters, real SQLite, native QA; no Python/provider setup |
| `COMPANY_CONTEXT.md` | `COMPANY_CONTEXT.md`: product, learner/parent roles, M1 scope, owner authority; no invented company identity |
| `CONTRIBUTING.md` | `CONTRIBUTING.md` and existing PR template: npm gates and one initial commit before review |
| `STYLE_GUIDE.md` | `STYLE_GUIDE.md`: Read and Lead vocabulary, accessible workshop UI, truthful learning copy, concise handoffs |
| `SECURITY.md`, `docs/templates/security-review.md` | `SECURITY.md`, `docs/engineering-review.md`: child-data boundaries, content integrity, persistence, native evidence |
| `MEMORY.md` | `MEMORY.md`: durable non-sensitive project decisions with links; no copied operational or personal memory |

AI-OS's agent-pack `SYSTEM_PROMPT`, `TOOLS`, `DATA`, `RUNBOOK`, and `EVALS`
templates, runtime specifications, provider/gateway setup, and historical plans
are not needed for M1. Existing content-review, privacy-map, device-validation,
and implementation-status docs serve the app's corresponding responsibilities.
No new agent framework, service, hook, or dependency is introduced.

Verification for this adaptation uses source-tree comparison, local Markdown
link and npm-command checks, `npm run validate:code`, `npm run security:check`,
and Git diff hygiene. These checks validate repository guidance and code health,
not teaching approval or native/device readiness.
