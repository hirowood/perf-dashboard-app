// js/features/heatmap.js
// ヒートマップ表示（雛形）
export async function initHeatmap(container, state) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'pf-card';
  card.textContent = 'Heatmap visualization placeholder.';
  container.appendChild(card);
  // TODO: ヒートマップライブラリやキャンバス描画を統合
}
