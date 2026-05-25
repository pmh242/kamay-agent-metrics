export type SourceKind =
  | "session_index"
  | "history"
  | "session_jsonl"
  | "archived_session_jsonl"
  | "sqlite";

export type SourceStatus = "discovered" | "missing" | "error" | "stale";

export interface SourceObservation {
  kind: SourceKind;
  path: string;
  status: SourceStatus;
  sizeBytes?: number;
  modifiedAt?: string;
  fileCount?: number;
  error?: string;
}

export interface JsonRecord {
  [key: string]: unknown;
}

export interface JsonlParseResult {
  records: JsonRecord[];
  malformedLineCount: number;
  lineCount: number;
}

export interface NormalizedSessionEvent {
  timestamp?: string;
  type?: string;
  payload: Record<string, string | number | boolean | null>;
}

export interface SessionIndexRow {
  id: string;
  threadName?: string;
  updatedAt?: string;
}

export interface SessionFileCandidate {
  path: string;
  modifiedAtMs: number;
  modifiedAt?: string;
  eventCount?: number;
  malformedLineCount?: number;
}

export interface SqliteThreadCandidate {
  id: string;
  updatedAt?: string;
  updatedAtMs?: number;
  rolloutPath?: string;
  cwd?: string;
  source?: string;
  modelProvider?: string;
  model?: string;
  cliVersion?: string;
  sandboxPolicy?: string;
  approvalMode?: string;
  tokensUsed?: number;
  archived?: boolean;
}

export interface ActiveThread extends SqliteThreadCandidate {
  staleness: "active" | "stale" | "unknown";
  resolvedFrom: "sqlite_threads" | "session_index" | "session_file";
}

export interface ActiveThreadResolutionInput {
  sqliteThreads: SqliteThreadCandidate[];
  sessionIndexRows: SessionIndexRow[];
  sessionFiles: SessionFileCandidate[];
  staleAfterMs: number;
  nowMs: number;
}

export interface ActiveThreadResolution {
  activeThread: ActiveThread | null;
  warnings: string[];
}

export interface TelemetrySnapshot {
  observedAt: string;
  codexHome: string;
  sources: SourceObservation[];
  activeThread: ActiveThread | null;
  metrics: {
    sessionIndexRows: number;
    sessionJsonlFiles: number;
    sessionJsonlEvents: number;
    malformedJsonlLines: number;
    sqliteTables: Record<string, number>;
    sqliteRows: Record<string, number>;
  };
  warnings: string[];
}
