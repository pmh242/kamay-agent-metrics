# Agent Instructions

This repository is a local PoC for provider-agnostic agent metrics. It is not production-ready, deploy-ready, or feature-complete.

## Start Here

- Read `README.md`, `docs/current-state.md`, `docs/principles.md`, and `docs/architecture.md` before changing behavior.
- Keep planned, implemented, tested, deployed, and verified status separate.
- Preserve the read-only provider posture and the service-first metrics boundary.
- Keep experiments isolated under `experiments/**` unless a task explicitly promotes work elsewhere.

## Scope Guardrails

- Do not change root `src/**`, runtime behavior, package/dependency files, or experiment code unless the task explicitly allows it.
- Do not add persistence, provider writes, cloud/infra/deployment config, auth, WebSockets, product UI, pet/avatar logic, or runtime selection without an approved plan.
- Treat `vnext/**` as speculative and non-committed.
- Prefer small, reversible changes that match existing docs and decisions.

## Goal / Plan / Task Permission Doctrine

- A **Goal** gives durable direction, not ongoing execution authorization.
- A **Plan** gives reasoning, sequencing, and scoped interpretation.
- A **Task** is the only permission to execute.
- Do not continue a broader goal, recommended next action, or adjacent plan after the approved task is complete unless a new task explicitly authorizes it.
- Mandatory hard stop: after completing the approved task, validate, report, and stop.

## Workflow

Use this execution sequence for implementation tasks:

1. **Build**: implement the approved change inside the allowed scope.
2. **Smoke Test**: run a fast, shallow critical-path check. This is usually the first QA pass, not proof of broad readiness.
3. **QA Pass**: run broader validation and review for regressions, scope drift, security/data exposure, and documentation accuracy.
4. **Ship**: checkpoint only after validation and any requested audit have passed. A shipped checkpoint is not a production deployment unless deployment actually happened.

## Kamay Test Lab

Kamay Test Lab is the evidence workflow for agent-driven work in this repo. It is not product tooling here; any full Test Lab product belongs later in the main Kamay repo.

- Collect evidence only when it helps validate the task or explain risk.
- Keep local artifacts under ignored `agent-lab/` folders: `screenshots/`, `logs/`, `traces/`, `reports/`, and `scratch/`.
- Do not commit Test Lab artifacts unless the task explicitly approves them.
- Artifacts must not contain secrets, raw prompts, raw responses, provider files, or sensitive telemetry content.

## Validation Expectations

- Always record `git status --short --branch` before and after scoped work.
- Use the validation commands requested by the task. If none are specified, default to:

```powershell
pnpm typecheck
pnpm test
```

- Run `pnpm build` when source/runtime code or build output correctness is relevant.
- For experiment-local work, also run the relevant experiment script under `experiments/**`.
- If no automated command applies, say so explicitly and explain what manual review was performed.

## Reporting

- Report exact commands run and whether each passed.
- Separate smoke test results from QA pass results.
- State whether files changed are docs-only, source/runtime, experiment-local, or tooling.
- Do not claim deployed, verified, production-ready, or client-ready status unless that evidence exists.
- Do not commit or push unless the task explicitly asks for it.
