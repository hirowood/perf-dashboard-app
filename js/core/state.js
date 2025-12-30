// js/core/state.js
// 単純なアプリケーション状態管理（雛形）
export const defaultState = {
  version: 1,
  settings: {
    privacyMode: false,
    timezone: 'UTC',
  },
  ui: {
    lastTab: 'daily',
  },
  metrics: {}
};

export function mergeState(base = defaultState, patch = {}) {
  return Object.assign({}, base, patch);
}
