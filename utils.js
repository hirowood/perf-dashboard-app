// js/core/utils.js
// 雑多だが重要な“安全部品”を置く。
// - 日付（YYYY-MM-DD）
// - 週ID（簡易）
// - wakeDevAbs（起床ズレ）
// - 文字列のパース
// - Pearson相関の表示用フォーマット

import { AppError, ErrorCode } from "./errors.js";

export const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// 今日をISO日付にする
export function todayISO() {
  const d = new Date();
  return toISO(d);
}

// Date -> "YYYY-MM-DD"
export function toISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// ISO日付の最低限バリデーション（“正しい日付”かはDateで別途判断できるがMVPでは形式チェック）
export function assertISODate(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    throw new AppError(ErrorCode.INVALID_DATE, "不正な日付形式です", { iso });
  }
}

// 1..5のレーティングに丸める
export function clampRating(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 3;
  return Math.min(5, Math.max(1, Math.round(n)));
}

// JSON安全クローン（structuredCloneでも可だが互換を優先）
export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// JSON parse の失敗を AppError に変換
export function safeJsonParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    throw new AppError(ErrorCode.JSON_PARSE, "JSONパースに失敗しました");
  }
}

// rを見やすく（例: 0.123）
export function formatR(n) {
  const v = Math.round(n * 1000) / 1000;
  return (Object.is(v, -0) ? 0 : v).toFixed(3);
}

// "a,b,c" -> ["a","b","c"]
export function parseCSV(s) {
  return String(s || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

/**
 * 週ID（簡易）
 * NOTE: ISO週番号は“年跨ぎ”が難しいので、まずは雑に dayOfYear/7。
 * 次のリファクタで「ISO週番号」へ差し替えるのがオススメ。
 */
export function toWeekId(dateISO) {
  assertISODate(dateISO);
  const d = new Date(`${dateISO}T00:00:00`);
  const year = d.getFullYear();
  const start = new Date(year, 0, 1);
  const dayOfYear = Math.floor((d - start) / 86400000) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

// wakeTime と targetTime の差分（絶対値、分）
export function calcWakeDevAbs(wakeTime, targetTime) {
  if (!wakeTime || !targetTime) return 0;
  const [wh, wm] = wakeTime.split(":").map(Number);
  const [th, tm] = targetTime.split(":").map(Number);
  if (![wh, wm, th, tm].every(Number.isFinite)) return 0;
  return Math.abs((wh * 60 + wm) - (th * 60 + tm));
}

// 直近N日（endISO含む）の日付配列を作る
export function getLastNDates(endISO, nDays) {
  assertISODate(endISO);
  const end = new Date(`${endISO}T00:00:00`);
  const out = [];
  for (let i = nDays - 1; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    out.push(toISO(d));
  }
  return out;
}

// DateISO -> weekday index (0:Sun ... 6:Sat)
export function weekdayIndex(dateISO) {
  const d = new Date(`${dateISO}T00:00:00`);
  return d.getDay();
}
