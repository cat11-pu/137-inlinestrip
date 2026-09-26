import assert from "node:assert";
import { scanLine } from "../scan.js";
import { stripComments } from "../strip.js";
import { render } from "../app.js";

let failed = 0;
let total = 0;
function check(name, fn) {
  total += 1;
  try { fn(); console.log("ok " + name); } catch (e) { failed += 1; console.log("FAIL " + name + " :: " + e.message); }
}

check("scanLine returns a cut position", () => {
  assert.strictEqual(typeof scanLine("a # b", "#").cut, "number");
});

check("stripComments returns a list", () => {
  assert.ok(Array.isArray(stripComments(["a"], "#")));
});

check("stripComments keeps count", () => {
  assert.strictEqual(stripComments(["a", "b"], "#").length, 2);
});

check("render counts lines", () => {
  assert.strictEqual(typeof render({ lines: ["a"], mark: "#" }).count, "number");
});

check("render exposes removed count", () => {
  assert.strictEqual(typeof render({ lines: ["a"], mark: "#" }).removed, "number");
});

check("hash inside double quotes is not a cut", () => {
  assert.strictEqual(scanLine('text = "a # b"', "#").cut, -1);
});

check("hash inside single quotes is not a cut", () => {
  assert.strictEqual(scanLine("x = 'a # b'", "#").cut, -1);
});

check("cut after a closed quote lands on first outer hash", () => {
  assert.strictEqual(scanLine("name = 'x'  # tail", "#").cut, 12);
});

check("escaped quote does not close the quote", () => {
  assert.strictEqual(scanLine('"a\\" # x"', "#").cut, -1);
});

check("backslash escapes the mark outside quotes", () => {
  assert.strictEqual(scanLine("a \\# b", "#").cut, -1);
});

check("strip trims right whitespace and drops whole comment lines", () => {
  assert.deepStrictEqual(stripComments(["value = 1  # note", "   # only", "plain = 2"], "#"),
    ["value = 1", "", "plain = 2"]);
});

check("lines without marks are preserved byte for byte", () => {
  const lines = ['keep "both" kinds  ', "  'x'  ", "#"];
  const out = stripComments(lines.slice(0, 2), "#");
  assert.deepStrictEqual(out, ["keep \"both\" kinds  ", "  'x'  "]);
});

check("unclosed quote throws E_UNCLOSED_QUOTE with a code field", () => {
  assert.throws(() => scanLine('a = "unclosed # tail', "#"), (error) => error.code === "E_UNCLOSED_QUOTE");
  assert.throws(() => stripComments(['a = "unclosed'], "#"), (error) => error.code === "E_UNCLOSED_QUOTE");
});

check("render keeps count, keys and removed-changed invariant", () => {
  const lines = ["value = 1  # note", 'text = "a # b"', "   # note", "plain = 2", ""];
  const view = render({ lines: lines, mark: "#" });
  assert.strictEqual(view.count, lines.length);
  assert.strictEqual(view.removed, 2);
  let changed = 0;
  view.cleaned.forEach((line, spot) => { if (line !== lines[spot]) changed += 1; });
  assert.strictEqual(changed, view.removed);
  ["cleaned", "removed", "count", "longest"].forEach((key) => assert.ok(key in view));
  view.cleaned.forEach((line, spot) => assert.ok(line.length <= lines[spot].length));
});

console.log(total + " cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
