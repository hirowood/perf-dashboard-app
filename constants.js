// js/core/constants.js
// このアプリ全体で参照する定数を集約する。
// - localStorageのキー
// - スキーマの現在バージョン
// - 指標名一覧（曜日別平均 / 推移グラフ / 相関で再利用）

export const STORAGE_KEY = "perf_dashboard_appdata";
export const CURRENT_VERSION = 1;

// localStorageはブラウザ実装で多少差があるが、目安として 5MB を仮定して警告する
export const STORAGE_WARN_RATIO = 0.8;
export const STORAGE_ASSUME_LIMIT_BYTES = 5 * 1024 * 1024;

export const METRICS = [
  "mood",
  "sleepHours",
  "wakeDevAbs",
  "sleepQuality",
  "physical",
  "mental",
  "focus",
  "performance",
];
