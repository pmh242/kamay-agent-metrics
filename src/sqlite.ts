import { DatabaseSync } from "node:sqlite";
import path from "node:path";

import { scalarToNumber, sqliteBoolean } from "./allowlist.js";
import { errorMessage } from "./discovery.js";
import { asString } from "./jsonl.js";
import type { SqliteThreadCandidate } from "./types.js";

export interface SqliteInspection {
  tables: Record<string, number>;
  rows: Record<string, number>;
  threads: SqliteThreadCandidate[];
  warnings: string[];
}

export function inspectSqliteFiles(sqlitePaths: string[]): SqliteInspection {
  const tables: Record<string, number> = {};
  const rows: Record<string, number> = {};
  const threads: SqliteThreadCandidate[] = [];
  const warnings: string[] = [];

  for (const sqlitePath of sqlitePaths) {
    try {
      const db = openReadOnly(sqlitePath);
      try {
        const tableNames = listTables(db);
        tables[path.basename(sqlitePath)] = tableNames.length;
        for (const tableName of tableNames) {
          if (isAllowedCountTable(tableName)) {
            const count = countRows(db, tableName);
            if (count !== undefined) {
              rows[`${path.basename(sqlitePath)}:${tableName}`] = count;
            }
          }
        }
        if (tableNames.includes("threads")) {
          threads.push(...readThreads(db));
        }
      } finally {
        db.close();
      }
    } catch (error) {
      warnings.push(`SQLite read failed for ${sqlitePath}: ${errorMessage(error)}`);
    }
  }

  return { tables, rows, threads, warnings };
}

function openReadOnly(sqlitePath: string): DatabaseSync {
  const uriPath = sqlitePath.replace(/\\/g, "/");
  return new DatabaseSync(`file:${uriPath}?mode=ro&immutable=1`);
}

function listTables(db: DatabaseSync): string[] {
  const rows = db
    .prepare("select name from sqlite_master where type = 'table' and name not like 'sqlite_%' order by name")
    .all() as Array<{ name: unknown }>;
  return rows.map((row) => asString(row.name)).filter((name): name is string => name !== undefined);
}

function isAllowedCountTable(tableName: string): boolean {
  return ["logs", "threads", "thread_goals"].includes(tableName);
}

function countRows(db: DatabaseSync, tableName: string): number | undefined {
  if (!isAllowedCountTable(tableName)) {
    return undefined;
  }
  const row = db.prepare(`select count(*) as count from ${tableName}`).get() as { count?: unknown } | undefined;
  return row === undefined ? undefined : scalarToNumber(row.count);
}

function readThreads(db: DatabaseSync): SqliteThreadCandidate[] {
  const rows = db
    .prepare(
      `select id, rollout_path, created_at, updated_at, source, model_provider, cwd, sandbox_policy,
              approval_mode, tokens_used, archived, cli_version, model, updated_at_ms
         from threads
        order by coalesce(updated_at_ms, updated_at, created_at, 0) desc
        limit 25`
    )
    .all() as Array<Record<string, unknown>>;

  const threads: SqliteThreadCandidate[] = [];
  for (const row of rows) {
    const id = asString(row.id);
    if (id === undefined) {
      continue;
    }
    const updatedAtMs = scalarToNumber(row.updated_at_ms) ?? scalarToNumber(row.updated_at);
    const candidate: SqliteThreadCandidate = { id };
    const archived = sqliteBoolean(row.archived);
    if (archived !== undefined) {
      candidate.archived = archived;
    }
    if (updatedAtMs !== undefined) {
      candidate.updatedAtMs = updatedAtMs;
      candidate.updatedAt = new Date(updatedAtMs).toISOString();
    }
    setString(candidate, "rolloutPath", row.rollout_path);
    setString(candidate, "cwd", row.cwd);
    setString(candidate, "source", row.source);
    setString(candidate, "modelProvider", row.model_provider);
    setString(candidate, "model", row.model);
    setString(candidate, "cliVersion", row.cli_version);
    setString(candidate, "sandboxPolicy", row.sandbox_policy);
    setString(candidate, "approvalMode", row.approval_mode);
    const tokensUsed = scalarToNumber(row.tokens_used);
    if (tokensUsed !== undefined) {
      candidate.tokensUsed = tokensUsed;
    }
    threads.push(candidate);
  }
  return threads;
}

function setString<T extends object, K extends keyof T>(target: T, key: K, value: unknown): void {
  const stringValue = asString(value);
  if (stringValue !== undefined) {
    target[key] = stringValue as T[K];
  }
}
