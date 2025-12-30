// js/features/trend.js
// (B) 推移グラフ（7日/30日）
// - Canvasで超軽量に描画（Chart.js等を入れる前のMVP）
// - 欠損値は線を切る（nullは描かない）

import { $ } from "../ui/dom.js";
import { getLastNDates } from "../core/utils.js";

export function bindTrendControls(state, renderTrend) {
  document.querySelectorAll("[data-trend-range]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const n = Number(btn.getAttribute("data-trend-range"));
      if (!Number.isFinite(n)) return;

      state.trend.rangeDays = n;
      renderTrend(state);
    });
  });

  $("#trendMetric").addEventListener("change", () => {
    state.trend.metric = $("#trendMetric").value;
    renderTrend(state);
  });
}

export function renderTrend(state) {
  const canvas = $("#trendCanvas");
  const ctx = canvas.getContext("2d");
  const hint = $("#trendHint");
  const noData = $("#trendNoData");

  noData.textContent = "";

  const dates = getLastNDates(state.selectedDate, state.trend.rangeDays);
  const metric = state.trend.metric;

  const points = dates.map((d) => {
    const e = state.data.dailyEntries[d];
    const v = e?.[metric];
    const n = Number(v);
    return Number.isFinite(n) ? { date: d, value: n } : { date: d, value: null };
  });

  const valid = points.filter((p) => p.value != null);

  hint.textContent = `範囲: ${state.trend.rangeDays}日 / 指標: ${metric}`;

  // 2点未満は線が引けない（表示を切る）
  if (valid.length < 2) {
    clearCanvas(ctx, canvas);
    noData.textContent = "データが足りないので推移を描画できません（2点以上必要）";
    return;
  }

  drawLineChart(ctx, canvas, points);
}

function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/**
 * 超軽量チャート（Canvas）
 * - nullは欠損として線を切る
 * - min/maxが同じ場合はスケールを1にして“水平線”になる
 */
function drawLineChart(ctx, canvas, points) {
  clearCanvas(ctx, canvas);

  const pad = 28;
  const W = canvas.width;
  const H = canvas.height;

  const vals = points.map((p) => p.value).filter((v) => v != null);
  const min = Math.min(...vals);
  const max = Math.max(...vals);

  const xStep = (W - pad * 2) / Math.max(1, points.length - 1);
  const yScale = (H - pad * 2) / (max - min || 1);

  // 軸
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(pad, pad);
  ctx.lineTo(pad, H - pad);
  ctx.lineTo(W - pad, H - pad);
  ctx.stroke();
  ctx.globalAlpha = 1;

  // 折れ線（欠損は切断）
  ctx.beginPath();
  let started = false;

  points.forEach((p, i) => {
    if (p.value == null) {
      started = false;
      return;
    }
    const x = pad + i * xStep;
    const y = (H - pad) - (p.value - min) * yScale;

    if (!started) {
      ctx.moveTo(x, y);
      started = true;
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // 点
  points.forEach((p, i) => {
    if (p.value == null) return;
    const x = pad + i * xStep;
    const y = (H - pad) - (p.value - min) * yScale;

    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // min/max
  ctx.fillText(`min:${min}`, pad, pad - 8);
  ctx.fillText(`max:${max}`, pad + 90, pad - 8);
}
