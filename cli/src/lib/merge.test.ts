import assert from "node:assert/strict";
import { test } from "node:test";
import { threeWayMerge } from "./merge.js";

test("no change → returns ours, no conflict", () => {
  const r = threeWayMerge("a\nb\n", "a\nb\n", "a\nb\n");
  assert.equal(r.conflict, false);
  assert.equal(r.merged, "a\nb\n");
});

test("only upstream changed → fast-forward to theirs", () => {
  const r = threeWayMerge("a\nb\n", "a\nb\n", "a\nB\n");
  assert.equal(r.conflict, false);
  assert.equal(r.merged, "a\nB\n");
});

test("only local changed → keep ours", () => {
  const r = threeWayMerge("a\nLOCAL\n", "a\nb\n", "a\nb\n");
  assert.equal(r.conflict, false);
  assert.equal(r.merged, "a\nLOCAL\n");
});

test("both changed, non-overlapping → clean merge keeps both edits", () => {
  const base = "line1\nline2\nline3\nline4\nline5\n";
  const ours = "LOCAL\nline2\nline3\nline4\nline5\n"; // edited top
  const theirs = "line1\nline2\nline3\nline4\nUP\n"; // edited bottom
  const r = threeWayMerge(ours, base, theirs);
  assert.equal(r.conflict, false, "non-overlapping edits should merge cleanly");
  assert.ok(r.merged.includes("LOCAL"), "local edit preserved");
  assert.ok(r.merged.includes("UP"), "upstream edit preserved");
});

test("both changed same line → conflict with markers, no data loss", () => {
  const r = threeWayMerge("a\nLOCAL\nc\n", "a\nb\nc\n", "a\nUPSTREAM\nc\n");
  assert.equal(r.conflict, true);
  assert.ok(r.merged.includes("LOCAL"), "local side preserved in conflict");
  assert.ok(r.merged.includes("UPSTREAM"), "upstream side preserved in conflict");
  assert.ok(/<{7}/.test(r.merged), "conflict markers present");
});
