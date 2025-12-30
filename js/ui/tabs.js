// js/ui/tabs.js
// シンプルなタブ管理（各タブの init 関数を呼ぶ）
import { createEl } from './dom.js';

export function createTabs(tabsConfig = [], mountPoint, state = {}) {
  const tabsBar = createEl('div', { className: 'pf-tabs pf-card' });
  const contentRoot = createEl('div', { className: 'pf-card' });
  mountPoint.appendChild(tabsBar);
  mountPoint.appendChild(contentRoot);

  const tabsMap = new Map();
  tabsConfig.forEach(cfg => {
    const tabBtn = createEl('button', { className: 'pf-tab', textContent: cfg.label });
    tabBtn.addEventListener('click', () => activate(cfg.id));
    tabsBar.appendChild(tabBtn);
    tabsMap.set(cfg.id, { cfg, btn: tabBtn });
  });

  function clearContent() {
    contentRoot.innerHTML = '';
  }

  async function activate(id) {
    if (!tabsMap.has(id)) return;
    tabsMap.forEach(({ btn }) => btn.classList.remove('active'));
    tabsMap.get(id).btn.classList.add('active');
    clearContent();
    const { cfg } = tabsMap.get(id);
    if (typeof cfg.init === 'function') {
      await cfg.init(contentRoot, state);
    } else {
      contentRoot.textContent = `No content for ${id}`;
    }
  }

  // 初期タブ
  const initial = state.ui && state.ui.lastTab ? state.ui.lastTab : (tabsConfig[0] && tabsConfig[0].id);
  activate(initial);
  return { activate };
}
