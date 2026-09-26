// strip.js：剥离（基线：原样返回）
import { cutLine } from "./scan.js";

export function stripComments(lines, mark) {
  return lines.map((line) => cutLine(line, mark));
}
