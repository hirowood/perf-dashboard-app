// js/ui/privacy.js
// プライバシーモードの切り替え（雛形）
export function createPrivacyToggle(container, state = {}, onChange = () => {}) {
  const wrapper = document.createElement('div');
  wrapper.className = 'pf-privacy-toggle';

  const label = document.createElement('label');
  label.textContent = 'Privacy mode: ';
  const input = document.createElement('input');
  input.type = 'checkbox';
  input.checked = !!(state.settings && state.settings.privacyMode);

  input.addEventListener('change', () => {
    const v = input.checked;
    onChange(v);
    // 見た目反映などは呼び出し側で
  });

  label.appendChild(input);
  wrapper.appendChild(label);
  container.appendChild(wrapper);
  return wrapper;
}
