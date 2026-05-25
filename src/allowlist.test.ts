import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { normalizeSessionEvent } from "./allowlist.js";

describe("normalizeSessionEvent", () => {
  it("drops raw content, text, output, and encrypted fields", () => {
    const normalized = normalizeSessionEvent({
      timestamp: "2026-05-25T00:00:00Z",
      type: "response_item",
      payload: {
        type: "function_call_output",
        turn_id: "turn-1",
        model: "gpt-test",
        content: "secret prompt",
        text: "secret text",
        output: "secret output",
        encrypted_content: "ciphertext",
        duration_ms: 42
      }
    });

    assert.deepEqual(normalized, {
      timestamp: "2026-05-25T00:00:00Z",
      type: "response_item",
      payload: {
        type: "function_call_output",
        turn_id: "turn-1",
        model: "gpt-test",
        duration_ms: 42
      }
    });
  });
});
