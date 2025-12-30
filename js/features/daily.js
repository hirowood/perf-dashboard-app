// js/features/daily.js
// 日次表示用の簡易モジュール
export async function initDaily(container, state) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'pf-card';
  card.textContent = 'Daily metrics will be shown here.';
  container.appendChild(card);
  // TODO: 実際のデータフェッチとレンダリングを実装
}
