// js/core/state.js
// UI状態（どのタブを見ているか、選択日、プライバシーON/OFFなど）をまとめる。
// ※ AppData（永続データ）は state.data に保持する。

import { todayISO } from "./utils.js";

export function createState() {
  return {
    data: null,             // AppData（localStorageからロード）
    selectedDate: todayISO(),
    currentView: "day",     // "day" | "week" | "month" | "weekday"
    isPrivate: false,

    // autosaveを“連打保存”しないためのタイマー
    autosaveTimer: null,

    // 相関結果の簡易キャッシュ（編集時にnullに戻す）
    correlationCache: null,

    // 推移グラフ（B）のUI状態
    trend: {
      rangeDays: 7,
      metric: "performance",
    },
  };
}
