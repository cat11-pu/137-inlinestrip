// app.js：渲染结果（每行只扫描一遍，cuts 与 cleaned 共用同一次扫描）
import { scanLine } from "./scan.js";
import { cutLine } from "./strip.js";

export function render(spec) {
  const lines = spec.lines || [];
  const mark = spec.mark || "#";
  const cuts = lines.map((line) => scanLine(line, mark).cut);
  const cleaned = lines.map((line, spot) => cutLine(line, cuts[spot]));
  let removed = 0;
  cleaned.forEach((line, spot) => { if (line !== lines[spot]) removed += 1; });
  return { cleaned: cleaned, removed: removed, count: cleaned.length,
           cuts: cuts,
           lengths: cleaned.map((line) => line.length),
           longest: cleaned.reduce((best, line) => Math.max(best, line.length), 0) };
}
