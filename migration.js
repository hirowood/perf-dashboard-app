// js/core/migration.js
// localStorageデータにスキーマ変更が入っても、画面が真っ白にならないようにする。
// - version を見て migrate する
// - 不足フィールドは defaults で埋める

import { CURRENT_VERSION } from "./constants.js";
import { deepClone } from "./utils.js";
import { AppError, ErrorCode } from "./errors.js";

export function defaultAppData() {
  return {
    version: CURRENT_VERSION,
    userSettings: {
      userName: "",
      wakeTargetTime: "07:00",
      allowableWakeDev: 30,
      correlationGates: { nMin: 14, rAbsMin: 0.35 },
      hypothesisGates: { nMin: 14, rAbsMin: 0.35 },
    },
    dailyEntries: {},
    weeklyReviews: {},
  };
}

export function migrateIfNeeded(rawData) {
  const d = deepClone(rawData ?? defaultAppData());

  try {
    if (typeof d.version !== "number") d.version = 0;

    // versionごとに分岐（ここが“壊れない”ポイント）
    switch (d.version) {
      case 0:
        return migrateV0toV1(d);
      case 1:
        return ensureV1Defaults(d);
      default:
        // 未来のversionでも落ちないように、最低限の整形だけする
        d.version = CURRENT_VERSION;
        return ensureV1Defaults(d);
    }
  } catch (e) {
    throw new AppError(ErrorCode.MIGRATION_FAILED, "マイグレーション失敗", { cause: String(e) });
  }
}

function migrateV0toV1(d) {
  d.version = 1;
  if (!d.userSettings) d.userSettings = {};
  if (!d.dailyEntries) d.dailyEntries = {};
  if (!d.weeklyReviews) d.weeklyReviews = {};
  return ensureV1Defaults(d);
}

function ensureV1Defaults(d) {
  const def = defaultAppData();

  d.userSettings = { ...def.userSettings, ...(d.userSettings || {}) };
  d.userSettings.correlationGates = { ...def.userSettings.correlationGates, ...(d.userSettings.correlationGates || {}) };
  d.userSettings.hypothesisGates = { ...def.userSettings.hypothesisGates, ...(d.userSettings.hypothesisGates || {}) };

  d.dailyEntries = d.dailyEntries || {};
  d.weeklyReviews = d.weeklyReviews || {};
  return d;
}
