import type { MetricsServiceState } from "./service.js";

export interface ConsumerFetchOk {
  reachable: true;
  url: string;
  receivedAt: string;
  data: MetricsServiceState;
}

export interface ConsumerFetchError {
  reachable: false;
  url: string;
  receivedAt: string;
  error: string;
}

export type ConsumerState = ConsumerFetchOk | ConsumerFetchError;

export type FetchLike = (url: string) => Promise<Response>;

export async function fetchMetricsCurrent(
  url: string,
  fetcher: FetchLike = fetch
): Promise<ConsumerState> {
  const receivedAt = new Date().toISOString();
  try {
    const response = await fetcher(url);
    if (!response.ok) {
      return {
        reachable: false,
        url,
        receivedAt,
        error: `Service returned HTTP ${response.status}`
      };
    }

    const parsed: unknown = await response.json();
    if (!isMetricsServiceState(parsed)) {
      return {
        reachable: false,
        url,
        receivedAt,
        error: "Service returned malformed metrics JSON"
      };
    }

    return {
      reachable: true,
      url,
      receivedAt,
      data: parsed
    };
  } catch (error) {
    return {
      reachable: false,
      url,
      receivedAt,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

function isMetricsServiceState(value: unknown): value is MetricsServiceState {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return "service" in record && "sourceHealth" in record && "snapshot" in record;
}
