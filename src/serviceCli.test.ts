import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { parseServiceArgs } from "./serviceCli.js";

describe("parseServiceArgs", () => {
  it("accepts the separator passed by pnpm service --", () => {
    assert.deepEqual(parseServiceArgs(["--", "--port", "8765", "--interval-ms", "1000"]), {
      port: 8765,
      intervalMs: 1000
    });
  });
});
