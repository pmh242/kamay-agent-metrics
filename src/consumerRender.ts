import type { ConsumerState } from "./consumer.js";
import type { TelemetrySnapshot } from "./types.js";

export function renderConsumerState(state: ConsumerState): string {
  const lines: string[] = [
    "Kamay Agent Metrics Diagnostics",
    `Endpoint: ${state.url}`,
    `Received: ${state.receivedAt}`,
    `Reachability: ${state.reachable ? "online" : "offline"}`
  ];

  if (!state.reachable) {
    lines.push(`Error: ${state.error}`);
    return lines.join("\n");
  }

  const { service, sourceHealth, snapshot } = state.data;
  lines.push(`Service: ${service.status}`);
  lines.push(`Source health: ${sourceHealth.status}`);
  lines.push(`Polling: ${service.pollingIntervalMs}ms`);
  lines.push(`Last update: ${service.lastUpdatedAt ?? "never"}`);
  lines.push(`Last error: ${service.lastError ?? "none"}`);
  lines.push(`Warnings: ${sourceHealth.warnings.length}`);

  if (snapshot === null) {
    lines.push("Snapshot: unavailable");
    return lines.join("\n");
  }

  lines.push(...renderSnapshot(snapshot));
  return lines.join("\n");
}

function renderSnapshot(snapshot: TelemetrySnapshot): string[] {
  const activeThread = snapshot.activeThread;
  const provider = activeThread?.modelProvider ?? "unknown";
  const model = activeThread?.model ?? "unknown";
  const freshness = activeThread?.staleness ?? "unknown";
  const sourceCounts = countSources(snapshot);

  return [
    `Snapshot: ${snapshot.observedAt}`,
    `Provider: ${provider}`,
    `Model: ${model}`,
    `Active thread: ${activeThread?.id ?? "none"}`,
    `Freshness: ${freshness}`,
    `Sources: ${sourceCounts.discovered} discovered, ${sourceCounts.problem} problem`,
    `Session rows: ${snapshot.metrics.sessionIndexRows}`,
    `Session events: ${snapshot.metrics.sessionJsonlEvents}`,
    `Malformed lines: ${snapshot.metrics.malformedJsonlLines}`,
    `Snapshot warnings: ${snapshot.warnings.length}`
  ];
}

function countSources(snapshot: TelemetrySnapshot): { discovered: number; problem: number } {
  let discovered = 0;
  let problem = 0;

  for (const source of snapshot.sources) {
    if (source.status === "discovered") {
      discovered += 1;
    } else {
      problem += 1;
    }
  }

  return { discovered, problem };
}
