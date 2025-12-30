// js/core/errors.js
// エラーを“種類”で扱えるようにする（画面が真っ白になるのを防ぐ）。
// - code を持つ AppError を使う
// - switch / if で処理を分岐できる

export const ErrorCode = Object.freeze({
  STORAGE_UNAVAILABLE: "STORAGE_UNAVAILABLE",
  STORAGE_QUOTA: "STORAGE_QUOTA",
  JSON_PARSE: "JSON_PARSE",
  MIGRATION_FAILED: "MIGRATION_FAILED",
  INVALID_IMPORT: "INVALID_IMPORT",
  INVALID_DATE: "INVALID_DATE",
  UNKNOWN: "UNKNOWN",
});

export class AppError extends Error {
  constructor(code, message, meta = {}) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.meta = meta;
  }
}
