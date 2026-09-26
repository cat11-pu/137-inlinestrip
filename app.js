// app.js：渲染结果
import { scanLine } from "./scan.js";

export function render(spec) {
  const lines = spec.lines || [];
  const mark = spec.mark || "#";
  const cuts = lines.map((line) => scanLine(line, mark).cut);
  const cleaned = lines.map((line, spot) => {
    return cuts[spot] < 0 ? line : line.slice(0, cuts[spot]).trimEnd();
  });
  const removed = cuts.reduce((sum, cut) => sum + (cut >= 0 ? 1 : 0), 0);
  return { cleaned: cleaned, removed: removed, count: cleaned.length,
           cuts: cuts,
           lengths: cleaned.map((line) => line.length),
           longest: cleaned.reduce((best, line) => Math.max(best, line.length), 0) };
}
