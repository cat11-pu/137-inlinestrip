// scan.js：逐行扫描
// 单/双引号外的注释符才算数；反斜杠转义下一个字符（转义引号不闭合）；
// 引号在一行内没有闭合则抛 E_UNCLOSED_QUOTE。
export function scanLine(line, mark) {
  const token = String(mark || "#");
  let quote = "";
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === "\\") { i += 1; continue; }
    if (quote) {
      if (ch === quote) { quote = ""; }
      continue;
    }
    if (ch === '"' || ch === "'") { quote = ch; continue; }
    if (ch === token[0]) { return { cut: i, quoted: 0 }; }
  }
  if (quote) {
    const error = new Error("引号没有闭合：" + JSON.stringify(line));
    error.code = "E_UNCLOSED_QUOTE";
    throw error;
  }
  return { cut: -1, quoted: 0 };
}

// cutLine：扫描一行并返回剥掉注释后的内容（不含右侧空白）。
export function cutLine(line, mark) {
  const cut = scanLine(line, mark).cut;
  return cut < 0 ? line : line.slice(0, cut).trimEnd();
}
