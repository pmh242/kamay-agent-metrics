import { collectTelemetrySnapshot } from "./snapshot.js";

interface CliOptions {
  intervalMs: number;
  once: boolean;
  codexHome?: string;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.once) {
    await printSnapshot(options);
    return;
  }

  await printSnapshot(options);
  const timer = setInterval(() => {
    printSnapshot(options).catch((error: unknown) => {
      console.error(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }));
    });
  }, options.intervalMs);

  process.on("SIGINT", () => {
    clearInterval(timer);
    process.exit(0);
  });
}

async function printSnapshot(options: CliOptions): Promise<void> {
  const snapshotOptions = options.codexHome === undefined ? {} : { codexHome: options.codexHome };
  const snapshot = await collectTelemetrySnapshot(snapshotOptions);
  console.log(JSON.stringify(snapshot, null, 2));
}

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    intervalMs: 2000,
    once: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--once") {
      options.once = true;
    } else if (arg === "--interval-ms") {
      const value = args[index + 1];
      index += 1;
      const parsed = Number(value);
      if (!Number.isFinite(parsed) || parsed <= 0) {
        throw new Error("--interval-ms must be a positive number");
      }
      options.intervalMs = parsed;
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

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
