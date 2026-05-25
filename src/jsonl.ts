import type { JsonlParseResult, JsonRecord } from "./types.js";

export function parseJsonlText(text: string): JsonlParseResult {
  const records: JsonRecord[] = [];
  let malformedLineCount = 0;
  let lineCount = 0;

  for (const line of text.split(/\r?\n/)) {
    if (line.trim().length === 0) {
      continue;
    }

    lineCount += 1;
    try {
      const parsed: unknown = JSON.parse(line);
      if (isRecord(parsed)) {
        records.push(parsed);
      } else {
        malformedLineCount += 1;
      }
    } catch {
      malformedLineCount += 1;
    }
  }

  return { records, malformedLineCount, lineCount };
}

export function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function asString(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

export function asNumber(value: unknown): number | undefined {
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

export function asBoolean(value: unknown): boolean | undefined {
  return typeof value === "boolean" ? value : undefined;
}
