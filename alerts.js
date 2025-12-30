// js/ui/alerts.js
// 画面上に“軽い通知”を出す。
// エラーは console だけに出すと気づきにくいので、ユーザーにも見せる。

import { $ } from "./dom.js";

export function showAlert(message, kind = "ok") {
  const area = $("#alertArea");
  const div = document.createElement("div");
  div.className = `alert ${kind === "danger" ? "is-danger" : "is-ok"}`;
  div.textContent = message;
  area.appendChild(div);
  setTimeout(() => div.remove(), 4000);
}
