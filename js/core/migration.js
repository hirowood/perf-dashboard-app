// js/core/migration.js
// ストレージのバージョン差分を吸収するための簡易マイグレーター
import { defaultState } from './state.js';
import { MigrationError } from './errors.js';

export function migrateIfNeeded(stored = null) {
  if (!stored) return defaultState;
  if (stored.version === undefined) {
    // 古いフォーマットからの変換例
    try {
      const migrated = Object.assign({}, defaultState, stored);
      migrated.version = 1;
      return migrated;
    } catch (e) {
      throw new MigrationError('Failed to migrate state', { cause: e });
    }
  }
  // 将来的なマイグレーションポイント
  return stored;
}
