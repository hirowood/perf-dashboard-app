// js/features/weekly.js
// 週次表示（雛形）
export async function initWeekly(container, state) {
  container.innerHTML = '';
  const card = document.createElement('div');
  card.className = 'pf-card';
  card.textContent = 'Weekly metrics placeholder.';
  container.appendChild(card);
}
