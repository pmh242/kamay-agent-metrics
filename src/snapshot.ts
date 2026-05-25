import { readFile, stat } from "node:fs/promises";

import { normalizeSessionEvent, normalizeSessionIndexRow } from "./allowlist.js";
import { discoverSources, resolveCodexHome } from "./discovery.js";
import { parseJsonlText } from "./jsonl.js";
import { resolveActiveThread } from "./resolver.js";
import { inspectSqliteFiles } from "./sqlite.js";
import type { SessionFileCandidate, SessionIndexRow, TelemetrySnapshot } from "./types.js";

const DEFAULT_STALE_AFTER_MS = 30 * 60 * 1000;

export interface SnapshotOptions {
  codexHome?: string;
  staleAfterMs?: number;
}

export async function collectTelemetrySnapshot(options: SnapshotOptions = {}): Promise<TelemetrySnapshot> {
  const codexHome = resolveCodexHome(options.codexHome);
  const discovered = await discoverSources(codexHome);
  const warnings: string[] = [];
  const nowMs = Date.now();

  const sessionIndexRows = await readSessionIndex(discovered.sessionIndexPath, warnings);
  const sessionFiles = await readSessionFiles(discovered.sessionJsonlPaths, warnings);
  const sqliteInspection = inspectSqliteFiles(discovered.sqlitePaths);
  warnings.push(...sqliteInspection.warnings);

  const resolution = resolveActiveThread({
    sqliteThreads: sqliteInspection.threads,
    sessionIndexRows,
    sessionFiles,
    staleAfterMs: options.staleAfterMs ?? DEFAULT_STALE_AFTER_MS,
    nowMs
  });
  warnings.push(...resolution.warnings);

  return {
    observedAt: new Date(nowMs).toISOString(),
    codexHome,
    sources: discovered.observations,
    activeThread: resolution.activeThread,
    metrics: {
      sessionIndexRows: sessionIndexRows.length,
      sessionJsonlFiles: discovered.sessionJsonlPaths.length,
      sessionJsonlEvents: sessionFiles.reduce((sum, file) => sum + (file.eventCount ?? 0), 0),
      malformedJsonlLines: sessionFiles.reduce((sum, file) => sum + (file.malformedLineCount ?? 0), 0),
      sqliteTables: sqliteInspection.tables,
      sqliteRows: sqliteInspection.rows
    },
    warnings
  };
}

async function readSessionIndex(filePath: string | undefined, warnings: string[]): Promise<SessionIndexRow[]> {
  if (filePath === undefined) {
    return [];
  }
  try {
    const parsed = parseJsonlText(await readFile(filePath, "utf8"));
    if (parsed.malformedLineCount > 0) {
      warnings.push(`session_index.jsonl has ${parsed.malformedLineCount} malformed JSONL line(s).`);
    }
    return parsed.records.map(normalizeSessionIndexRow).filter((row): row is SessionIndexRow => row !== null);
  } catch (error) {
    warnings.push(`Unable to read session_index.jsonl: ${error instanceof Error ? error.message : String(error)}`);
    return [];
  }
}

async function readSessionFiles(filePaths: string[], warnings: string[]): Promise<SessionFileCandidate[]> {
  const candidates: SessionFileCandidate[] = [];
  const newestFiles = [...filePaths].sort().slice(-5);

  for (const filePath of newestFiles) {
    try {
      const [info, content] = await Promise.all([stat(filePath), readFile(filePath, "utf8")]);
      const parsed = parseJsonlText(content);
      for (const record of parsed.records) {
        normalizeSessionEvent(record);
      }
      if (parsed.malformedLineCount > 0) {
        warnings.push(`${filePath} has ${parsed.malformedLineCount} malformed JSONL line(s).`);
      }
      candidates.push({
        path: filePath,
        modifiedAtMs: info.mtimeMs,
        modifiedAt: info.mtime.toISOString(),
        eventCount: parsed.records.length,
        malformedLineCount: parsed.malformedLineCount
      });
    } catch (error) {
      warnings.push(`Unable to read session JSONL ${filePath}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  return candidates;
}
