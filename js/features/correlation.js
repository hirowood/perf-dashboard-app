// js/features/correlation.js
// 相関分析表示（雛形）
export async function initCorrelation(container, state) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'pf-card';
  card.textContent = 'Correlation analysis placeholder.';
  container.appendChild(card);
  // TODO: 相関計算と表現を追加
}
