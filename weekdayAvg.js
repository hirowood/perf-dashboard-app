// js/features/weekdayAvg.js
// (A) 曜日別平均
// - 全データを曜日（Sun..Sat）に集計して平均を出す
// - 表として表示する（MVP）
// NOTE: 365日程度なら余裕。重くなったらview表示時のみ計算する（今回のリファクタで対応済）

import { $ } from "../ui/dom.js";
import { WEEKDAY_LABELS, weekdayIndex } from "../core/utils.js";
import { METRICS } from "../core/constants.js";

export function renderWeekdayAverages(state) {
  const el = $("#weekdayAvg");
  const { rows, metrics } = computeWeekdayAverages(state);

  const table = document.createElement("table");
  table.className = "w-full border-collapse";

  // header
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");

  ["Weekday", ...metrics].forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    th.className = "border border-slate-200 bg-slate-50 p-2 text-xs";
    trh.appendChild(th);
  });

  thead.appendChild(trh);
  table.appendChild(thead);

  // body
  const tbody = document.createElement("tbody");

  rows.forEach((r) => {
    const tr = document.createElement("tr");

    const td0 = document.createElement("td");
    td0.textContent = r.weekday;
    td0.className = "border border-slate-200 p-2 text-xs";
    tr.appendChild(td0);

    metrics.forEach((m) => {
      const td = document.createElement("td");
      td.textContent = r[m] == null ? "-" : String(r[m].toFixed(2));
      td.className = "border border-slate-200 p-2 text-center text-xs";
      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);

  el.innerHTML = "";
  el.appendChild(table);
}

// 集計（平均）
function computeWeekdayAverages(state) {
  const metrics = METRICS;

  // 7曜日ぶん
  const sum = Array.from({ length: 7 }, () => Object.fromEntries(metrics.map((m) => [m, 0])));
  const cnt = Array.from({ length: 7 }, () => Object.fromEntries(metrics.map((m) => [m, 0])));

  for (const [date, entry] of Object.entries(state.data.dailyEntries)) {
    const w = weekdayIndex(date);

    metrics.forEach((m) => {
      const v = entry[m];
      const n = Number(v);
      if (!Number.isFinite(n)) return;

      sum[w][m] += n;
      cnt[w][m] += 1;
    });
  }

  const rows = WEEKDAY_LABELS.map((label, w) => {
    const row = { weekday: label };
    metrics.forEach((m) => {
      row[m] = cnt[w][m] > 0 ? sum[w][m] / cnt[w][m] : null;
    });
    return row;
  });

  return { rows, metrics };
}
