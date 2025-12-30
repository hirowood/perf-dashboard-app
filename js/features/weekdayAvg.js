// js/features/weekdayAvg.js
// 曜日平均（雛形）
export async function initWeekdayAvg(container, state) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'pf-card';
  card.textContent = 'Weekday average placeholder.';
  container.appendChild(card);
}
