// js/ui/alerts.js
// 軽量なアラート表示（トップに自動的に消える）
const ALERT_TIMEOUT = 4000;

export function showAlert(message, type = 'info') {
  const containerId = 'pf-alerts-container';
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement('div');
    container.id = containerId;
    container.style.position = 'fixed';
    container.style.top = '16px';
    container.style.right = '16px';
    container.style.zIndex = 9999;
    document.body.appendChild(container);
  }
  const el = document.createElement('div');
  el.className = `pf-alert ${type}`;
  el.textContent = message;
  container.appendChild(el);

  setTimeout(() => {
    el.style.transition = 'opacity 300ms';
    el.style.opacity = '0';
    setTimeout(() => container.removeChild(el), 400);
  }, ALERT_TIMEOUT);
}
