// scan.js：逐行扫描，单遍走过整行，找出引号外第一个注释符的下标。
// 单双引号都算引号，引号里的注释符不生效；反斜杠转义下一个字符。
// 引号没闭合就抛带 code 的错误。
export function scanLine(line, mark) {
  let quote = null;
  for (let spot = 0; spot < line.length; spot += 1) {
    const ch = line[spot];
    if (quote !== null) {
      if (ch === "\\") { spot += 1; continue; }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === "'" || ch === '"') { quote = ch; continue; }
    if (ch === mark) return { cut: spot, quoted: 0 };
  }
  if (quote !== null) {
    const error = new Error("unclosed quote: " + quote);
    error.code = "E_UNCLOSED_QUOTE";
    throw error;
  }
  return { cut: -1, quoted: 0 };
}
