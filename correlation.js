// js/features/correlation.js
// 相関計算（Pearson）
// - 欠損値はペアごと除外して n を数える
// - 分散0（全部同じ値）なら相関は“なし扱い”
// - ゲート（n, |r|）を満たすものだけ表示

import { $ } from "../ui/dom.js";
import { formatR } from "../core/utils.js";

// UI描画
export function renderCorrelation(state) {
  const list = $("#correlationList");
  list.innerHTML = "";

  const results = getCorrelationResults(state);

  if (results.length === 0) {
    list.innerHTML = `<div class="text-xs text-slate-500">ゲートを満たす相関はまだありません（データ不足 or 閾値が高い）</div>`;
    $("#generatedHypothesis").textContent = "";
    return;
  }

  results.forEach((r) => {
    const item = document.createElement("div");
    item.className = "rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm";
    item.innerHTML = `
      <div><b>${r.a}</b> × <b>${r.b}</b></div>
      <div class="text-xs text-slate-500">n=${r.n} / r=${formatR(r.r)}</div>
    `;
    list.appendChild(item);
  });

  // 仮説テンプレ（要件の文）
  const top = results[0];
  $("#generatedHypothesis").textContent =
    `「${top.a}」が高い日は「${top.b}」も高い傾向があります（相関: ${formatR(top.r)}）。\n` +
    `${top.a}を改善すると${top.b}も上がるかもしれません。`;
}

// 計算結果（キャッシュあり）
export function getCorrelationResults(state) {
  if (state.correlationCache) return state.correlationCache;

  const gates = state.data.userSettings.correlationGates;

  // MVP: よく見る組だけ（将来METRICSで全ペア生成してもよい）
  const pairs = [
    ["sleepHours", "performance"],
    ["sleepHours", "mood"],
    ["sleepQuality", "performance"],
    ["mental", "performance"],
    ["physical", "performance"],
    ["focus", "performance"],
    ["wakeDevAbs", "performance"],
  ];

  const results = [];

  for (const [a, b] of pairs) {
    const { n, r, ok } = pearsonForFields(state, a, b);
    if (!ok) continue;

    if (n >= gates.nMin && Math.abs(r) >= gates.rAbsMin) {
      results.push({ a, b, n, r });
    }
  }

  // 強い順
  results.sort((x, y) => Math.abs(y.r) - Math.abs(x.r));

  state.correlationCache = results;
  return results;
}

// フィールドA/Bの配列を作って相関
function pearsonForFields(state, fieldA, fieldB) {
  const xs = [];
  const ys = [];

  for (const entry of Object.values(state.data.dailyEntries)) {
    const x = entry[fieldA];
    const y = entry[fieldB];
    if (x == null || y == null) continue;

    const xn = Number(x);
    const yn = Number(y);
    if (!Number.isFinite(xn) || !Number.isFinite(yn)) continue;

    xs.push(xn);
    ys.push(yn);
  }

  const n = xs.length;
  if (n < 2) return { ok: false, n, r: 0 };

  const r = pearson(xs, ys);

  // 分散0などで計算不能 -> “相関なし”扱い
  if (r == null) return { ok: false, n, r: 0 };

  return { ok: true, n, r };
}

// Pearson相関（計算不能のとき null）
function pearson(xs, ys) {
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;

  let num = 0, sx = 0, sy = 0;

  for (let i = 0; i < n; i++) {
    const dx = xs[i] - meanX;
    const dy = ys[i] - meanY;
    num += dx * dy;
    sx += dx * dx;
    sy += dy * dy;
  }

  if (sx === 0 || sy === 0) return null; // 分散0
  return num / Math.sqrt(sx * sy);
}
