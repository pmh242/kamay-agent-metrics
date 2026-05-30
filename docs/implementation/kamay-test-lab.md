# Kamay Test Lab

Kamay Test Lab is the evidence workflow for agent-driven work in this repository.

It is intentionally lightweight here. This repo should not grow full Test Lab product tooling, browser automation setup, Playwright configuration, npm scripts, dependency additions, or a generic QA framework. Any full Kamay Test Lab product or platform belongs later in the main Kamay repo.

## Workflow

1. **Build**: implement the approved change inside the allowed scope.
2. **Smoke Test**: run fast critical-path validation. This should answer whether the change starts, responds, or performs the narrow path it was built for.
3. **QA Pass**: run broader systematic review and try to break the change. This should check regressions, scope drift, security/data exposure, docs accuracy, and relevant edge states.
4. **Ship**: checkpoint only validated and, when requested, audited changes. Shipping a checkpoint is not production deployment.

## Evidence Artifacts

Use local artifacts when they make validation easier to understand or reproduce:

- `agent-lab/screenshots/` for local visual evidence.
- `agent-lab/logs/` for command or runtime logs.
- `agent-lab/traces/` for browser or runtime traces if a task explicitly uses them.
- `agent-lab/reports/` for local QA notes or summaries.
- `agent-lab/scratch/` for temporary evidence-processing work.

These folders are ignored by default. Do not create tracked placeholder directories. Do not commit artifacts unless a task explicitly approves a specific artifact for review.

For human runtime UX checks, use `docs/implementation/manual-runtime-ux-review.md` as the local review checklist and observation format.

## Artifact Safety

Artifacts must not include:

- secrets, credentials, tokens, or environment values
- raw prompts or raw model responses
- raw tool output containing private content
- provider files or provider-state copies
- sensitive telemetry content

Prefer sanitized summaries, counts, timestamps, state labels, and screenshots that avoid private text.

## Reporting

Reports should distinguish:

- **Smoke Test**: fast critical-path checks and their result.
- **QA Pass**: broader review, attempted breakage, and remaining risk.
- **Ship**: commit/push/checkpoint evidence, if the task explicitly requested it.

List exact commands run and whether they passed. If no automated validation applies, say so and describe the manual review performed.
