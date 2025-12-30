// js/ui/tabs.js
// タブ切替
// - state.currentView を更新
// - ボタンの active 表示を更新
// - view panel の表示を更新

import { $all } from "./dom.js";

export function bindTabs(state, renderByView) {
  const tabs = $all(".tab");
  const panels = $all("[data-view-panel]");

  tabs.forEach((btn) => {
    btn.addEventListener("click", () => {
      const view = btn.getAttribute("data-view");
      if (!view) return;

      state.currentView = view;

      // 見た目
      tabs.forEach((b) => b.classList.toggle("is-active", b.getAttribute("data-view") === view));
      panels.forEach((p) => p.classList.toggle("is-active", p.getAttribute("data-view-panel") === view));

      // 重要：描画を“viewごと”にする（リファクタ）
      renderByView();
    });
  });
}
