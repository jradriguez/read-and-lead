# Read and Lead AI agent policy

This file owns action authority for development assistants. The app's authored
robot is not an AI agent. Use [AGENTS.md](AGENTS.md) for task routing and
[SECURITY.md](SECURITY.md) for data and untrusted-input controls.

## Work within the requested scope

Resolve routine choices from repository evidence and carry authorized local work
through implementation and validation. Ask only when ambiguity materially changes
the solution or additional authority is needed. Prior authorization remains valid
within its stated scope; a plan, tool, or passing check does not expand it.

| Action | Boundary |
| --- | --- |
| Inspect project files, make scoped edits, run existing local checks | Proceed; preserve unrelated work and use synthetic data |
| Create a feature branch, local commit, or review-ready draft | Proceed for implementation work; follow [contributing](CONTRIBUTING.md) |
| Add a dependency or service | Establish concrete need; ask before major dependencies, new services, or scope expansion |
| Change package manager, CI/CD, auth, infrastructure, environment, schema, or migrations | Explicit authorization for the change; prepare a concrete scoped proposal first |
| Push, publish a PR, merge remotely, share files, or send messages | Explicit authorization for the destination and action |
| Change signing accounts, purchase, enroll, or submit to a store | Explicit authorization for the specific action and any cost |
| Conduct child testing or approve teaching material | Authorized human review and applicable child-use gates must pass; agents cannot grant approval |
| Dispatch subagents or start recurring automation | Only when authorized; keep scope and authority bounded |

Authorization to discuss or plan future work does not authorize its execution.
A blocker pauses the dependent action, not independent authorized work. Permission
to use disposable test data does not authorize erasing real learner progress.
Destructive reset, shared-history rewriting, or cleanup beyond task-owned artifacts
requires explicit authority. Never bypass protections or gates to finish work.

## Evidence and communication

State the intended outcome and material assumptions before substantial work.
Give concise progress updates with findings and the next useful step. If permission
is necessary, name the action, effects, and applicable rule; do not ask again for
action already authorized within that scope.

Distinguish implementation evidence, design intent, and proposals. Keep draft
lessons and review reports clearly identified. Human content approval, code checks,
native acceptance, and release authorization remain separate. Follow
[engineering review](docs/engineering-review.md) for evidence and
[STYLE_GUIDE.md](STYLE_GUIDE.md) for clear handoffs. Repository memory preserves
context, never authority for a new action.
