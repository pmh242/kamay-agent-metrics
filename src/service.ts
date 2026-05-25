import { collectTelemetrySnapshot } from "./snapshot.js";
import { METRICS_CURRENT_CONTRACT_VERSION, type MetricsCurrentResponse } from "./contract.js";
import type { SourceObservation, TelemetrySnapshot } from "./types.js";

export type ServiceStatus = "ok" | "degraded" | "offline";

export type MetricsServiceState = MetricsCurrentResponse;

export interface MetricsServiceOptions {
  pollingIntervalMs: number;
  codexHome?: string;
  collectSnapshot?: () => Promise<TelemetrySnapshot>;
}

export class MetricsService {
  private readonly pollingIntervalMs: number;
  private readonly collectSnapshot: () => Promise<TelemetrySnapshot>;
  private readonly startedAt: string;
  private timer: NodeJS.Timeout | null = null;
  private snapshot: TelemetrySnapshot | null = null;
  private lastUpdatedAt: string | null = null;
  private lastError: string | null = null;

  constructor(options: MetricsServiceOptions) {
    this.pollingIntervalMs = options.pollingIntervalMs;
    this.startedAt = new Date().toISOString();
    if (options.collectSnapshot !== undefined) {
      this.collectSnapshot = options.collectSnapshot;
    } else {
      const snapshotOptions = options.codexHome === undefined ? {} : { codexHome: options.codexHome };
      this.collectSnapshot = () => collectTelemetrySnapshot(snapshotOptions);
    }
  }

  async start(): Promise<void> {
    if (this.timer !== null) {
      return;
    }

    await this.refresh();
    this.timer = setInterval(() => {
      this.refresh().catch(() => {
        // Refresh records failures in state; avoid crashing the process from a timer.
      });
    }, this.pollingIntervalMs);
  }

  stop(): void {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  async refresh(): Promise<void> {
    try {
      const nextSnapshot = await this.collectSnapshot();
      this.snapshot = nextSnapshot;
      this.lastUpdatedAt = new Date().toISOString();
      this.lastError = null;
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : String(error);
    }
  }

  getCurrent(): MetricsServiceState {
    const sourceHealth = deriveSourceHealth(this.snapshot, this.lastError);
    return {
      contractVersion: METRICS_CURRENT_CONTRACT_VERSION,
      service: {
        status: sourceHealth.status,
        startedAt: this.startedAt,
        lastUpdatedAt: this.lastUpdatedAt,
        pollingIntervalMs: this.pollingIntervalMs,
        lastError: this.lastError
      },
      snapshot: this.snapshot,
      sourceHealth
    };
  }
}

function deriveSourceHealth(
  snapshot: TelemetrySnapshot | null,
  lastError: string | null
): MetricsServiceState["sourceHealth"] {
  const warnings: string[] = [];
  if (lastError !== null) {
    warnings.push(lastError);
  }
  if (snapshot !== null) {
    warnings.push(...snapshot.warnings);
  }

  if (snapshot === null) {
    return {
      status: "offline",
      warnings
    };
  }

  if (isOfflineSnapshot(snapshot)) {
    return {
      status: "offline",
      warnings
    };
  }

  if (lastError !== null || warnings.length > 0 || snapshot.sources.some((source) => source.status !== "discovered")) {
    return {
      status: "degraded",
      warnings
    };
  }

  return {
    status: "ok",
    warnings
  };
}

function isOfflineSnapshot(snapshot: TelemetrySnapshot): boolean {
  if (snapshot.activeThread !== null) {
    return false;
  }

  const sourceStatuses = snapshot.sources.map((source: SourceObservation) => source.status);
  return sourceStatuses.length > 0 && sourceStatuses.every((status) => status === "missing" || status === "error");
}
