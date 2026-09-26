// app.js：渲染结果
import { scanLine } from "./scan.js";
import { stripComments } from "./strip.js";

export function render(spec) {
  const lines = spec.lines || [];
  const mark = spec.mark || "#";
  const cleaned = stripComments(lines, mark);
  let removed = 0;
  cleaned.forEach((line, spot) => { if (line !== lines[spot]) removed += 1; });
  return { cleaned: cleaned, removed: removed, count: cleaned.length,
           cuts: lines.map((line) => scanLine(line, mark).cut),
           lengths: cleaned.map((line) => line.length),
           longest: cleaned.reduce((best, line) => Math.max(best, line.length), 0) };
}
