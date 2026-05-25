import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import os from "node:os";

import type { SourceObservation } from "./types.js";

export interface DiscoveredSources {
  codexHome: string;
  observations: SourceObservation[];
  sessionIndexPath?: string;
  historyPath?: string;
  sessionJsonlPaths: string[];
  archivedSessionJsonlPaths: string[];
  sqlitePaths: string[];
}

export function resolveCodexHome(override?: string): string {
  return path.resolve(override ?? process.env.CODEX_HOME ?? path.join(os.homedir(), ".codex"));
}

export async function discoverSources(codexHome: string): Promise<DiscoveredSources> {
  const observations: SourceObservation[] = [];
  const sessionJsonlPaths: string[] = [];
  const archivedSessionJsonlPaths: string[] = [];
  const sqlitePaths: string[] = [];

  const sessionIndexPath = path.join(codexHome, "session_index.jsonl");
  const historyPath = path.join(codexHome, "history.jsonl");
  await observePath(observations, "session_index", sessionIndexPath);
  await observePath(observations, "history", historyPath);

  const sessionsRoot = path.join(codexHome, "sessions");
  sessionJsonlPaths.push(...(await findFiles(sessionsRoot, ".jsonl")));
  await observeCollection(observations, "session_jsonl", sessionsRoot, sessionJsonlPaths);

  const archivedRoot = path.join(codexHome, "archived_sessions");
  archivedSessionJsonlPaths.push(...(await findFiles(archivedRoot, ".jsonl")));
  await observeCollection(observations, "archived_session_jsonl", archivedRoot, archivedSessionJsonlPaths);

  for (const filePath of await findFiles(codexHome, ".sqlite", 1)) {
    const name = path.basename(filePath);
    if (/^(logs|state|goals)_.*\.sqlite$/.test(name)) {
      sqlitePaths.push(filePath);
      await observePath(observations, "sqlite", filePath);
    }
  }

  return {
    codexHome,
    observations,
    sessionIndexPath,
    historyPath,
    sessionJsonlPaths,
    archivedSessionJsonlPaths,
    sqlitePaths
  };
}

async function observePath(observations: SourceObservation[], kind: SourceObservation["kind"], filePath: string): Promise<void> {
  try {
    const info = await stat(filePath);
    observations.push({
      kind,
      path: filePath,
      status: "discovered",
      sizeBytes: info.size,
      modifiedAt: info.mtime.toISOString()
    });
  } catch (error) {
    observations.push({
      kind,
      path: filePath,
      status: "missing",
      error: errorMessage(error)
    });
  }
}

async function observeCollection(
  observations: SourceObservation[],
  kind: SourceObservation["kind"],
  rootPath: string,
  filePaths: string[]
): Promise<void> {
  try {
    const rootInfo = await stat(rootPath);
    observations.push({
      kind,
      path: rootPath,
      status: "discovered",
      modifiedAt: rootInfo.mtime.toISOString(),
      fileCount: filePaths.length
    });
  } catch (error) {
    observations.push({
      kind,
      path: rootPath,
      status: "missing",
      error: errorMessage(error)
    });
  }
}

async function findFiles(root: string, extension: string, maxDepth = Number.POSITIVE_INFINITY): Promise<string[]> {
  const results: string[] = [];
  await walk(root, 0);
  return results;

  async function walk(current: string, depth: number): Promise<void> {
    let entries;
    try {
      entries = await readdir(current, { withFileTypes: true });
    } catch {
      return;
    }
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory() && depth < maxDepth) {
        await walk(fullPath, depth + 1);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        results.push(fullPath);
      }
    }
  }
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}
