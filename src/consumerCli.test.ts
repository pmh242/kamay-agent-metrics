import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { parseConsumerArgs } from "./consumerCli.js";

describe("parseConsumerArgs", () => {
  it("parses url, interval, once, and pnpm separator", () => {
    assert.deepEqual(parseConsumerArgs([
      "--",
      "--url",
      "http://127.0.0.1:8765/metrics/current",
      "--interval-ms",
      "1000",
      "--once"
    ]), {
      url: "http://127.0.0.1:8765/metrics/current",
      intervalMs: 1000,
      once: true
    });
  });
});
