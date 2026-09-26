// ui.js：操作面板与视图（原生 DOM，无弹窗）
import { render } from "./app.js";

export function mount(spec, parts) {
  let mark = spec.mark || "#";
  parts.log.textContent = "共 " + (spec.lines || []).length + " 行，注释符 " + mark + "。";

  function draw() {
    let view = null;
    try {
      view = render(Object.assign({}, spec, { mark: mark }));
    } catch (error) {
      parts.out.textContent = String(error && error.code ? error.code : error);
      parts.log.textContent = "跑不动：" + String(error && error.message ? error.message : error);
      return;
    }
    parts.out.textContent = JSON.stringify(view, null, 1);
    parts.stage.textContent = "";
    view.cleaned.forEach(function (line, spot) {
      const row = document.createElement("div");
      row.className = "row";
      const head = document.createElement("span");
      head.textContent = (spot + 1) + ".";
      row.appendChild(head);
      const mark2 = document.createElement("span");
      mark2.className = "chip ok";
      mark2.textContent = line === "" ? "空行" : line;
      row.appendChild(mark2);
      parts.stage.appendChild(row);
    });
    parts.legend.textContent = "剥掉注释 " + view.removed + " 处，行数 " + view.count;
    parts.log.textContent = "最长行 " + view.longest + " 个字符";
  }

  const runButton = document.createElement("button");
  runButton.className = "primary";
  runButton.textContent = "剥离注释";
  runButton.addEventListener("click", draw);
  parts.controls.appendChild(runButton);

  const nextButton = document.createElement("button");
  nextButton.textContent = "换个注释符";
  nextButton.addEventListener("click", function () {
    mark = mark === "#" ? ";" : "#";
    draw();
  });
  parts.controls.appendChild(nextButton);

  const label = document.createElement("label");
  label.textContent = "注释符";
  parts.controls.appendChild(label);

  const box = document.createElement("input");
  box.type = "text";
  box.value = mark;
  box.addEventListener("input", function () {
    if (box.value.length === 1) { mark = box.value; draw(); }
  });
  parts.controls.appendChild(box);

  const readButton = document.createElement("button");
  readButton.textContent = "只看剥掉几处";
  readButton.addEventListener("click", function () {
    const view = render(Object.assign({}, spec, { mark: mark }));
    parts.out.textContent = "剥掉 " + view.removed + " 处，剩 " + view.count + " 行";
  });
  parts.controls.appendChild(readButton);

  draw();
}
