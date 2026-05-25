# Codex Telemetry Discovery PoC

This document records observed behavior for the local read-only Codex telemetry PoC. Codex local schemas are treated as unstable internal details.

## Runtime Assumption

The PoC requires local Node support for `node:sqlite`. This is a PoC-only assumption and not a production architecture commitment.

Implementation must stop as blocked if `node:sqlite` is unavailable instead of adding SQLite dependencies or changing architecture.

## Observed Local Sources

The PoC looks under the configured Codex home, resolved from:

1. `--codex-home`
2. `CODEX_HOME`
3. `%USERPROFILE%/.codex`

Observed source families:

- `session_index.jsonl`
- `history.jsonl`
- `sessions/**/*.jsonl`
- `archived_sessions/*.jsonl`
- `logs_*.sqlite`
- `state_*.sqlite`
- `goals_*.sqlite`

`archived_sessions` is discovered for visibility but is not used as the preferred active-thread source.

## Allowlisted Fields

The snapshot may include operational metadata such as:

- source paths, file sizes, modified timestamps, and file counts
- thread id, rollout path, cwd, source, model provider, model, CLI version
- sandbox and approval mode
- timestamps, durations, event types, counts, archived status, token counts
- SQLite table counts and selected row counts

## Denied Fields

The PoC must not print or persist:

- prompt text
- response content
- tool output
- `history.text`
- `logs.feedback_log_body`
- `threads.first_user_message`
- `threads.preview`
- `stage1_outputs.raw_memory`
- `stage1_outputs.rollout_summary`
- job instructions
- row JSON or result JSON
- encrypted or raw content fields

## Read-only Behavior

The CLI uses filesystem reads/stat calls for JSONL and opens SQLite with `mode=ro&immutable=1`. It does not create databases, migrations, cache files, provider API calls, servers, daemons, overlays, or UI surfaces.

Because this validation ran while Codex itself was active, before/after metadata changed in live Codex files. That comparison cannot prove the CLI caused no writes. The read-only claim is therefore based on code path review and SQLite open mode, not a quiescent provider-state diff.

## Known Instability

- Codex schemas may change without notice.
- SQLite WAL state may affect freshness when using immutable read-only mode.
- Active-thread resolution is best-effort and must return warnings or `null` instead of guessing.
- Console output is for local discovery only and is not a user-facing HUD.
