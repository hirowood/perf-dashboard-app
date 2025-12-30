// js/features/heatmap.js
// ヒートマップ（曜日×週）
// - performanceが低い、睡眠が少ないセルを強調する

import { $ } from "../ui/dom.js";
import { toWeekId, toISO } from "../core/utils.js";

export function renderHeatmap(state, weekCount = 8) {
  const container = $("#heatmap");
  container.innerHTML = "";

  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const trh = document.createElement("tr");

  ["Week", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].forEach((h) => {
    const th = document.createElement("th");
    th.textContent = h;
    trh.appendChild(th);
  });

  thead.appendChild(trh);
  table.appendChild(thead);

  const tbody = document.createElement("tbody");
  const rows = buildHeatmapRows(state, weekCount);

  rows.forEach((row) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.textContent = row.weekId;
    tr.appendChild(th);

    row.days.forEach((cell) => {
      const td = document.createElement("td");
      td.textContent = cell.label;

      if (cell.isLow) td.classList.add("is-low");
      if (cell.isSleepLow) td.classList.add("is-sleepLow");

      tr.appendChild(td);
    });

    tbody.appendChild(tr);
  });

  table.appendChild(tbody);
  container.appendChild(table);
}

// 指定週数ぶんの行データを作る
function buildHeatmapRows(state, weekCount) {
  const rows = [];
  const base = new Date(`${state.selectedDate}T00:00:00`);

  for (let w = 0; w < weekCount; w++) {
    const d = new Date(base);
    d.setDate(d.getDate() - w * 7);

    const weekId = toWeekId(toISO(d));

    // 週の起点：月曜始まりに寄せる（簡易）
    const monday = new Date(d);
    monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));

    const days = [];
    for (let i = 0; i < 7; i++) {
      const dd = new Date(monday);
      dd.setDate(dd.getDate() + i);

      const iso = toISO(dd);
      const entry = state.data.dailyEntries[iso];

      const perf = entry?.performance ?? null;
      const sleep = entry?.sleepHours ?? null;

      days.push({
        iso,
        label: perf ? String(perf) : "-",
        isLow: perf != null && perf <= 2,
        isSleepLow: sleep != null && sleep > 0 && sleep <= 5,
      });
    }

    rows.push({ weekId, days });
  }

  return rows.reverse();
}
