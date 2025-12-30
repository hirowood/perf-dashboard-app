// js/core/utils.js
export function createId(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9);
}

export function debounce(fn, wait = 200) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
