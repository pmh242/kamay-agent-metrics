import { asBoolean, asNumber, asString, isRecord } from "./jsonl.js";
import type { JsonRecord, NormalizedSessionEvent, SessionIndexRow } from "./types.js";

const ALLOWED_PAYLOAD_FIELDS = new Set([
  "approval_policy",
  "approval_mode",
  "archived",
  "cli_version",
  "collaboration_mode_kind",
  "completed_at",
  "completed_at_ms",
  "cwd",
  "duration_ms",
  "effort",
  "id",
  "level",
  "memory_mode",
  "model",
  "model_context_window",
  "model_provider",
  "name",
  "originator",
  "phase",
  "realtime_active",
  "sandbox_policy",
  "source",
  "started_at",
  "thread_id",
  "thread_source",
  "timestamp",
  "time_to_first_token_ms",
  "turn_id",
  "type"
]);

export function normalizeSessionEvent(record: JsonRecord): NormalizedSessionEvent {
  const payload = isRecord(record.payload) ? record.payload : {};
  const normalizedPayload: Record<string, string | number | boolean | null> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (!ALLOWED_PAYLOAD_FIELDS.has(key)) {
      continue;
    }
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null
    ) {
      normalizedPayload[key] = value;
    }
  }

  const normalized: NormalizedSessionEvent = {
    payload: normalizedPayload
  };
  const timestamp = asString(record.timestamp);
  const type = asString(record.type);
  if (timestamp !== undefined) {
    normalized.timestamp = timestamp;
  }
  if (type !== undefined) {
    normalized.type = type;
  }
  return normalized;
}

export function normalizeSessionIndexRow(record: JsonRecord): SessionIndexRow | null {
  const id = asString(record.id);
  if (id === undefined) {
    return null;
  }

  const row: SessionIndexRow = { id };
  const threadName = asString(record.thread_name);
  const updatedAt = asString(record.updated_at);
  if (threadName !== undefined) {
    row.threadName = threadName;
  }
  if (updatedAt !== undefined) {
    row.updatedAt = updatedAt;
  }
  return row;
}

export function scalarToNumber(value: unknown): number | undefined {
  const numeric = asNumber(value);
  if (numeric !== undefined) {
    return numeric;
  }
  if (typeof value === "bigint") {
    return Number(value);
  }
  return undefined;
}

export function sqliteBoolean(value: unknown): boolean | undefined {
  const bool = asBoolean(value);
  if (bool !== undefined) {
    return bool;
  }
  const numeric = scalarToNumber(value);
  if (numeric === 0) {
    return false;
  }
  if (numeric === 1) {
    return true;
  }
  return undefined;
}
