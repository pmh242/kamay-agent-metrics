import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { resolveActiveThread } from "./resolver.js";

describe("resolveActiveThread", () => {
  it("returns null with a warning when no candidates exist", () => {
    const result = resolveActiveThread({
      sqliteThreads: [],
      sessionIndexRows: [],
      sessionFiles: [],
      staleAfterMs: 60_000,
      nowMs: Date.parse("2026-05-25T00:00:00Z")
    });

    assert.equal(result.activeThread, null);
    assert.ok(result.warnings.some((warning) => warning.includes("No active thread candidate")));
  });

  it("marks old candidates as stale without failing", () => {
    const result = resolveActiveThread({
      sqliteThreads: [
        {
          id: "thread-1",
          updatedAt: "2026-05-24T00:00:00.000Z",
          updatedAtMs: Date.parse("2026-05-24T00:00:00Z"),
          archived: false
        }
      ],
      sessionIndexRows: [],
      sessionFiles: [],
      staleAfterMs: 60_000,
      nowMs: Date.parse("2026-05-25T00:00:00Z")
    });

    assert.equal(result.activeThread?.id, "thread-1");
    assert.equal(result.activeThread?.staleness, "stale");
    assert.ok(result.warnings.some((warning) => warning.includes("stale")));
  });
});
