import type {
  ActiveThread,
  ActiveThreadResolution,
  ActiveThreadResolutionInput,
  SessionIndexRow,
  SqliteThreadCandidate
} from "./types.js";

export function resolveActiveThread(input: ActiveThreadResolutionInput): ActiveThreadResolution {
  const warnings: string[] = [];
  const sqliteThread = newestSqliteThread(input.sqliteThreads);

  if (sqliteThread !== null) {
    const staleness = getStaleness(sqliteThread.updatedAtMs, input.nowMs, input.staleAfterMs);
    if (staleness === "stale") {
      warnings.push(`Resolved active thread ${sqliteThread.id} is stale.`);
    }
    return {
      activeThread: {
        ...sqliteThread,
        staleness,
        resolvedFrom: "sqlite_threads"
      },
      warnings
    };
  }

  const sessionIndexRow = newestSessionIndexRow(input.sessionIndexRows);
  if (sessionIndexRow !== null) {
    const updatedAtMs = parseTime(sessionIndexRow.updatedAt);
    const staleness = getStaleness(updatedAtMs, input.nowMs, input.staleAfterMs);
    if (staleness === "stale") {
      warnings.push(`Resolved session-index thread ${sessionIndexRow.id} is stale.`);
    }
    const activeThread: ActiveThread = {
      id: sessionIndexRow.id,
      updatedAtMs,
      staleness,
      resolvedFrom: "session_index"
    };
    if (sessionIndexRow.updatedAt !== undefined) {
      activeThread.updatedAt = sessionIndexRow.updatedAt;
    }
    return { activeThread, warnings };
  }

  const sessionFile = [...input.sessionFiles].sort((a, b) => b.modifiedAtMs - a.modifiedAtMs)[0];
  if (sessionFile !== undefined) {
    const staleness = getStaleness(sessionFile.modifiedAtMs, input.nowMs, input.staleAfterMs);
    if (staleness === "stale") {
      warnings.push(`Newest session file ${sessionFile.path} is stale.`);
    }
    const activeThread: ActiveThread = {
      id: sessionFile.path,
      rolloutPath: sessionFile.path,
      updatedAtMs: sessionFile.modifiedAtMs,
      staleness,
      resolvedFrom: "session_file"
    };
    if (sessionFile.modifiedAt !== undefined) {
      activeThread.updatedAt = sessionFile.modifiedAt;
    }
    return { activeThread, warnings };
  }

  return {
    activeThread: null,
    warnings: ["No active thread candidate could be resolved from read-only telemetry sources."]
  };
}

function newestSqliteThread(candidates: SqliteThreadCandidate[]): SqliteThreadCandidate | null {
  const active = candidates.filter((candidate) => candidate.archived !== true);
  const sorted = active.sort((a, b) => (b.updatedAtMs ?? 0) - (a.updatedAtMs ?? 0));
  return sorted[0] ?? null;
}

function newestSessionIndexRow(rows: SessionIndexRow[]): SessionIndexRow | null {
  const sorted = [...rows].sort((a, b) => parseTime(b.updatedAt) - parseTime(a.updatedAt));
  return sorted[0] ?? null;
}

function getStaleness(updatedAtMs: number | undefined, nowMs: number, staleAfterMs: number): ActiveThread["staleness"] {
  if (updatedAtMs === undefined || Number.isNaN(updatedAtMs)) {
    return "unknown";
  }
  return nowMs - updatedAtMs > staleAfterMs ? "stale" : "active";
}

function parseTime(value: string | undefined): number {
  if (value === undefined) {
    return Number.NaN;
  }
  const parsed = Date.parse(value);
  return Number.isNaN(parsed) ? Number.NaN : parsed;
}
