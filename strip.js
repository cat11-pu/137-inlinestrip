// strip.js：按扫描到的位置剥掉注释，再去掉右侧空白。
import { scanLine } from "./scan.js";

export function cutLine(line, cut) {
  if (cut < 0) return line;
  return line.slice(0, cut).replace(/\s+$/, "");
}

export function stripComments(lines, mark) {
  return lines.map((line) => cutLine(line, scanLine(line, mark).cut));
}
