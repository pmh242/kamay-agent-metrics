import type { ServiceStatus } from "./service.js";
import type { TelemetrySnapshot } from "./types.js";

export const METRICS_CURRENT_CONTRACT_VERSION = "metrics.current.v1";

export interface MetricsCurrentResponse {
  contractVersion: typeof METRICS_CURRENT_CONTRACT_VERSION;
  service: {
    status: ServiceStatus;
    startedAt: string;
    lastUpdatedAt: string | null;
    pollingIntervalMs: number;
    lastError: string | null;
  };
  snapshot: TelemetrySnapshot | null;
  sourceHealth: {
    status: ServiceStatus;
    warnings: string[];
  };
}

export function isMetricsCurrentResponse(value: unknown): value is MetricsCurrentResponse {
  if (!isRecord(value)) {
    return false;
  }

  return (
    value.contractVersion === METRICS_CURRENT_CONTRACT_VERSION &&
    isServiceMetadata(value.service) &&
    isSourceHealth(value.sourceHealth) &&
    ("snapshot" in value) &&
    (value.snapshot === null || isRecord(value.snapshot))
  );
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isServiceMetadata(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isServiceStatus(value.status) &&
    typeof value.startedAt === "string" &&
    (typeof value.lastUpdatedAt === "string" || value.lastUpdatedAt === null) &&
    typeof value.pollingIntervalMs === "number" &&
    Number.isFinite(value.pollingIntervalMs) &&
    (typeof value.lastError === "string" || value.lastError === null)
  );
}

function isSourceHealth(value: unknown): boolean {
  if (!isRecord(value)) {
    return false;
  }

  return (
    isServiceStatus(value.status) &&
    Array.isArray(value.warnings) &&
    value.warnings.every((warning) => typeof warning === "string")
  );
}

function isServiceStatus(value: unknown): value is ServiceStatus {
  return value === "ok" || value === "degraded" || value === "offline";
}
