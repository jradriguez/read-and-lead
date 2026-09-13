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
