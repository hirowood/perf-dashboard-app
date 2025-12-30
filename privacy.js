// js/ui/privacy.js
// プライバシーモード（自由記述をぼかす）
// - bodyに is-private を付ける
// - CSS側で .privacy-hide を blur

import { $ } from "./dom.js";
import { showAlert } from "./alerts.js";

export function bindPrivacy(state) {
  $("#privacyToggle").addEventListener("click", () => {
    state.isPrivate = !state.isPrivate;
    document.body.classList.toggle("is-private", state.isPrivate);
    showAlert(state.isPrivate ? "プライバシーモード ON" : "プライバシーモード OFF", "ok");
  });
}
