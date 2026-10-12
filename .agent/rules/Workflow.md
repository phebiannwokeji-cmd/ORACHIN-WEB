---
trigger: always_on
---

# workflow.md
Job: how the agent behaves while it works.

- Read AGENTS.md, the repo and the PRD section for a requirement before you code it. Check the README, manifests, lockfile, source, migrations and tests. Why: rules are summaries, the PRD is the source, and every repo has its own commands.
- Never invent commands, scripts, dependencies, paths, data or facts. Say what is missing. Why: invented details look real and slip through review.
- Do not say a command works or a package is installed until you have run it and seen the result. Why: unchecked claims become false "done" reports.
- Make one change set per requirement ID or gate. If a task needs two, split it. Touch only the files it needs. Why: small changes are easy to review and undo.
- Leave unrelated code alone. Do not reformat it. Do not revert changes you did not make. Why: the owner may have work in progress.
- Do reversible work without asking. Reversible means a git revert or a down migration undoes it with no data loss. Why: asking about everything stalls delivery.
- Ask before destructive data operations, production deploys, new paid services or new secrets. Why: these cannot be cleanly undone.
- When a decision is missing, keep doing independent work. Ask one question at a time, about the decision that blocks the task. State the assumption you use meanwhile. Why: silent assumptions become hidden commitments.
- When a rule says "agent default", choose the option that exposes less data, grants less access or promises less to customers. Record it in docs/decisions.md under "Agent defaults" and in your report. Why: the owner must be able to confirm or change it.
- End every task with a report. Cover what changed, which checks ran and their results, which checks did not run and why, and what must happen before features go live. Why: the owner can only judge readiness from an honest report.