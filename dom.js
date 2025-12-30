// js/ui/dom.js
// DOM取得を一箇所にまとめると「idタイポ」を早期に発見できる。
// - $(selector) は見つからないと例外にする（静かに失敗しない）

export function $(sel) {
  const el = document.querySelector(sel);
  if (!el) throw new Error(`Element not found: ${sel}`);
  return el;
}

export function $all(sel) {
  return Array.from(document.querySelectorAll(sel));
}

export function clear(el) {
  el.innerHTML = "";
}
