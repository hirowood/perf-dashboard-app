// js/app.js
// エントリーポイント（モジュール）
import { STORAGE_KEY } from './core/constants.js';
import { loadState, saveState } from './core/storage.js';
import { migrateIfNeeded } from './core/migration.js';
import { createEl, mount } from './ui/dom.js';
import { showAlert } from './ui/alerts.js';
import { createTabs } from './ui/tabs.js';

import { initDaily } from './features/daily.js';
import { initHeatmap } from './features/heatmap.js';
import { initCorrelation } from './features/correlation.js';
import { initWeekly } from './features/weekly.js';
import { initWeekdayAvg } from './features/weekdayAvg.js';
import { initTrend } from './features/trend.js';

async function bootstrap() {
  try {
    // ストレージから状態を復元
    let state = loadState();
    state = migrateIfNeeded(state);
    // UI セットアップ
    const mountPoint = document.getElementById('pf-app');
    const headerControls = document.getElementById('pf-header-controls');

    const tabs = createTabs([
      { id: 'daily', label: 'Daily', init: initDaily },
      { id: 'heatmap', label: 'Heatmap', init: initHeatmap },
      { id: 'correlation', label: 'Correlation', init: initCorrelation },
      { id: 'weekly', label: 'Weekly', init: initWeekly },
      { id: 'weekdayAvg', label: 'Weekday Avg', init: initWeekdayAvg },
      { id: 'trend', label: 'Trend', init: initTrend },
    ], mountPoint, state);

    // 保存ハンドラ（簡易）
    window.addEventListener('beforeunload', () => {
      try { saveState(state); } catch (e) { /* ignore */ }
    });

    // 例のコントロール（任意）
    const refreshBtn = createEl('button', { className: 'pf-button' , textContent: 'Refresh' });
    refreshBtn.addEventListener('click', () => {
      showAlert('Refreshed', 'info');
    });
    headerControls.appendChild(refreshBtn);

  } catch (err) {
    console.error(err);
    showAlert('Failed to start application: ' + (err.message || err), 'error');
  }
}

document.addEventListener('DOMContentLoaded', bootstrap);
