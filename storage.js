// js/core/storage.js
// localStorageへの入出力を集約する。
// ここを一箇所に寄せると、将来IndexedDBへ移行する時も変更点が少なくなる。

import { STORAGE_KEY, STORAGE_ASSUME_LIMIT_BYTES } from "./constants.js";
import { safeJsonParse } from "./utils.js";
import { AppError, ErrorCode } from "./errors.js";

export function storageAvailable() {
  try {
    const k = "__t__";
    localStorage.setItem(k, "1");
    localStorage.removeItem(k);
    return true;
  } catch {
    return false;
  }
}

export function loadAppDataSafe(fallbackData) {
  if (!storageAvailable()) return fallbackData;

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return fallbackData;

  return safeJsonParse(raw);
}

export function saveAppDataSafe(data) {
  if (!storageAvailable()) {
    // ここは黙って無視すると「保存できてるつもり」になるので、呼び出し側で警告してもよい
    throw new AppError(ErrorCode.STORAGE_UNAVAILABLE, "localStorageが利用できません");
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    throw new AppError(ErrorCode.STORAGE_QUOTA, "保存に失敗（容量不足の可能性）", { error: String(e) });
  }
}

export function estimateStorageUsageBytes() {
  if (!storageAvailable()) return { bytes: 0, ratio: 0 };

  const raw = localStorage.getItem(STORAGE_KEY) || "";
  const bytes = new Blob([raw]).size;
  const ratio = bytes / STORAGE_ASSUME_LIMIT_BYTES;
  return { bytes, ratio };
}
