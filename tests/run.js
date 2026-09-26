import assert from "node:assert";
import { scanLine } from "../scan.js";
import { stripComments } from "../strip.js";
import { render } from "../app.js";

let failed = 0;
function check(name, fn) {
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

console.log("5 cases, " + failed + " failed");
process.exit(failed === 0 ? 0 : 1);
