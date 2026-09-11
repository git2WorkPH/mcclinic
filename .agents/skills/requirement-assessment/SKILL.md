---
name: requirement-assessment
description: Assess EHR requirements against repository code and tests and propose traceable findings and tasks before implementation.
---

# Requirement assessment

Read project-governance for record lifecycle and gates. Start from validated session memory and the relevant requirement, project scope, and accepted ADRs.

1. Identify the approved requirement version and acceptance criteria. If intent is incomplete, draft clarifications with explicit assumptions; do not label them approved.
2. Inspect relevant code, interfaces, persistence, migrations, tests, and documentation. Distinguish implemented behavior, verified behavior, missing behavior, and unknowns. Cite paths/symbols and concrete evidence; test existence alone is not proof.
3. Map each criterion to current behavior, evidence, gaps, and proposed verification. Assess auth/authz, audit, clinical integrity, concurrency, and compatibility when affected, using ehr-architecture.
4. Record actionable gaps in Findings. Search existing findings/tasks first. Link each proposed task to requirements, findings, scope, acceptance criteria, dependencies, likely test classifications, and potential deletions.
5. Save concrete proposed tasks under `Documentation/Tasks/Proposed/`. Record the recommendation and exact next action in session memory. Present the proposal for explicit approval; assessment does not start implementation.

Do not weaken a requirement to match current code or a failing test. Treat disputed behavior as a finding requiring a decision. Use focused inspection; broaden only when evidence is stale, incomplete, or contradictory.
