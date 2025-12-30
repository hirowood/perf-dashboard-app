// js/ui/dom.js
// DOM ヘルパー群
export function createEl(tag, { className = '', textContent = '', attrs = {} } = {}) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent) el.textContent = textContent;
  Object.entries(attrs).forEach(([k,v]) => el.setAttribute(k, String(v)));
  return el;
}

export function mount(parent, child) {
  parent.appendChild(child);
  return child;
}

export function q(sel, root = document) {
  return root.querySelector(sel);
}
