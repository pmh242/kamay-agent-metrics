import { pathToFileURL } from "node:url";

import { fetchMetricsCurrent } from "./consumer.js";
import { renderConsumerState } from "./consumerRender.js";

export interface ConsumerCliOptions {
  url: string;
  intervalMs: number;
  once: boolean;
}

const DEFAULT_URL = "http://127.0.0.1:8765/metrics/current";

async function main(): Promise<void> {
  const options = parseConsumerArgs(process.argv.slice(2));

  if (options.once) {
    await renderOnce(options.url);
    return;
  }

  await renderOnce(options.url, true);
  const timer = setInterval(() => {
    renderOnce(options.url, true).catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
    });
  }, options.intervalMs);

  process.on("SIGINT", () => {
    clearInterval(timer);
    process.exit(0);
  });
}

async function renderOnce(url: string, clear = false): Promise<void> {
  const state = await fetchMetricsCurrent(url);
  if (clear) {
    process.stdout.write("\x1Bc");
  }
  console.log(renderConsumerState(state));
}

export function parseConsumerArgs(args: string[]): ConsumerCliOptions {
  const options: ConsumerCliOptions = {
    url: DEFAULT_URL,
    intervalMs: 2000,
    once: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--") {
      continue;
    } else if (arg === "--once") {
      options.once = true;
    } else if (arg === "--url") {
      const value = args[index + 1];
      index += 1;
      if (value === undefined || value.length === 0) {
        throw new Error("--url requires a URL");
      }
      options.url = value;
    } else if (arg === "--interval-ms") {
      const value = args[index + 1];
      index += 1;
      options.intervalMs = parsePositiveInteger(value, "--interval-ms");
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function parsePositiveInteger(value: string | undefined, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${flag} must be a positive integer`);
  }
  return parsed;
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
