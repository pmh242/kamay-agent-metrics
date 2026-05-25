import { pathToFileURL } from "node:url";

import { createMetricsHttpServer } from "./httpServer.js";
import { MetricsService } from "./service.js";

export interface ServiceCliOptions {
  port: number;
  intervalMs: number;
  codexHome?: string;
}

async function main(): Promise<void> {
  const options = parseServiceArgs(process.argv.slice(2));
  const serviceOptions = options.codexHome === undefined
    ? { pollingIntervalMs: options.intervalMs }
    : { pollingIntervalMs: options.intervalMs, codexHome: options.codexHome };
  const service = new MetricsService(serviceOptions);
  const server = createMetricsHttpServer(service);

  await service.start();
  const address = await server.listen(options.port);
  console.log(JSON.stringify({
    service: "kamay-agent-metrics",
    bind: address,
    endpoint: `http://${address.host}:${address.port}/metrics/current`
  }));

  const shutdown = async (): Promise<void> => {
    service.stop();
    await server.close();
    process.exit(0);
  };

  process.on("SIGINT", () => {
    shutdown().catch((error: unknown) => {
      console.error(error instanceof Error ? error.message : String(error));
      process.exit(1);
    });
  });
}

export function parseServiceArgs(args: string[]): ServiceCliOptions {
  const options: ServiceCliOptions = {
    port: 8765,
    intervalMs: 2000
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--") {
      continue;
    } else if (arg === "--port") {
      const value = args[index + 1];
      index += 1;
      options.port = parsePositiveInteger(value, "--port");
    } else if (arg === "--interval-ms") {
      const value = args[index + 1];
      index += 1;
      options.intervalMs = parsePositiveInteger(value, "--interval-ms");
    } else if (arg === "--codex-home") {
      const value = args[index + 1];
      index += 1;
      if (value === undefined || value.length === 0) {
        throw new Error("--codex-home requires a path");
      }
      options.codexHome = value;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  return options;
}

function parsePositiveInteger(value: string | undefined, flag: string): number {
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 65_535) {
    throw new Error(`${flag} must be a positive integer up to 65535`);
  }
  return parsed;
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  });
}
