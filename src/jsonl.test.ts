import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { parseJsonlText } from "./jsonl.js";

describe("parseJsonlText", () => {
  it("counts malformed lines and keeps valid records", () => {
    const result = parseJsonlText('{"id":"a"}\nnot-json\n\n{"id":"b"}\n');

    assert.equal(result.records.length, 2);
    assert.equal(result.malformedLineCount, 1);
    assert.deepEqual(result.records.map((record) => record.id), ["a", "b"]);
  });
});
