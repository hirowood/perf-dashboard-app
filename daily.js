// js/features/daily.js
// 日次入力まわり
// - エントリの取得/生成（デフォルト値）
// - 日付移動
// - フォーム入力 -> state.data.dailyEntries を更新
// - スコアカード描画

import { $ } from "../ui/dom.js";
import { clampRating, assertISODate, calcWakeDevAbs } from "../core/utils.js";

// 指定日のエントリを必ず返す（なければ作る）
export function getOrCreateEntry(state, dateISO) {
  assertISODate(dateISO);
  const existing = state.data.dailyEntries[dateISO];
  if (existing) return existing;

  // デフォルト：3（普通）+ 空文字
  const entry = {
    mood: 3,
    sleepHours: 0,
    wakeTime: "07:00",
    sleepQuality: 3,
    physical: 3,
    mental: 3,
    focus: 3,
    performance: 3,
    report: "",
    hypothesis: "",
  };

  state.data.dailyEntries[dateISO] = entry;
  return entry;
}

// 日付移動（前日/翌日）
export function bindDateNav(state, renderByView) {
  const picker = $("#datePicker");
  picker.value = state.selectedDate;

  picker.addEventListener("change", () => {
    const v = picker.value;
    assertISODate(v);
    state.selectedDate = v;
    renderByView();
  });

  $("#prevDay").addEventListener("click", () => shift(-1));
  $("#nextDay").addEventListener("click", () => shift(1));

  function shift(delta) {
    const d = new Date(`${state.selectedDate}T00:00:00`);
    d.setDate(d.getDate() + delta);

    const iso = d.toISOString().slice(0, 10);
    state.selectedDate = iso;
    picker.value = iso;

    renderByView();
  }
}

// 日次フォーム（レーティング + 数値 + テキスト）を初期化してイベントバインド
export function bindDailyForm(state, requestSave, renderDailyForm) {
  // rating生成（各項目の5ボタン）
  document.querySelectorAll(".rating").forEach((wrap) => {
    const field = wrap.getAttribute("data-field");
    wrap.innerHTML = "";
    for (let i = 1; i <= 5; i++) {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = String(i);

      b.addEventListener("click", () => {
        updateField(state, field, i);

        // 表示だけ更新
        renderDailyForm(state);

        // 保存は遅延（連打での保存連発を避ける）
        requestSave(false);
      });

      wrap.appendChild(b);
    }
  });

  $("#sleepHours").addEventListener("input", () => {
    updateField(state, "sleepHours", $("#sleepHours").value);
    requestSave(false);
  });

  $("#wakeTime").addEventListener("input", () => {
    updateField(state, "wakeTime", $("#wakeTime").value);
    requestSave(false);
  });

  $("#report").addEventListener("input", () => {
    updateField(state, "report", $("#report").value);
    requestSave(false);
  });

  $("#hypothesis").addEventListener("input", () => {
    updateField(state, "hypothesis", $("#hypothesis").value);
    requestSave(false);
  });
}

// エントリ更新（switchでフィールドごとに処理を分岐）
function updateField(state, field, value) {
  const e = getOrCreateEntry(state, state.selectedDate);

  switch (field) {
    case "mood":
    case "sleepQuality":
    case "physical":
    case "mental":
    case "focus":
    case "performance":
      e[field] = clampRating(value);
      break;

    case "sleepHours":
      e.sleepHours = Number(value) || 0;
      break;

    case "wakeTime":
      e.wakeTime = String(value || "07:00");
      // 派生項目（起床ズレ）
      e.wakeDevAbs = calcWakeDevAbs(e.wakeTime, state.data.userSettings.wakeTargetTime);
      break;

    case "report":
      e.report = String(value || "");
      break;

    case "hypothesis":
      e.hypothesis = String(value || "");
      break;

    default:
      // 未知フィールドは無視（将来の拡張で落ちない）
      break;
  }

  // 編集したら相関キャッシュを捨てる（次回表示で再計算）
  state.correlationCache = null;
}

// フォーム表示（現在のstateをUIへ反映）
export function renderDailyForm(state) {
  const e = getOrCreateEntry(state, state.selectedDate);

  $("#sleepHours").value = String(e.sleepHours ?? 0);
  $("#wakeTime").value = e.wakeTime ?? "07:00";
  $("#report").value = e.report ?? "";
  $("#hypothesis").value = e.hypothesis ?? "";

  // レーティングの選択状態
  document.querySelectorAll(".rating").forEach((wrap) => {
    const field = wrap.getAttribute("data-field");
    const v = e[field];
    wrap.querySelectorAll("button").forEach((b) => {
      b.classList.toggle("is-selected", Number(b.textContent) === Number(v));
    });
  });
}

// スコアカード描画（5秒で良し悪しが分かる表示）
export function renderCards(state) {
  const e = getOrCreateEntry(state, state.selectedDate);

  $("#cardMood").textContent = String(e.mood ?? "-");
  $("#cardPerformance").textContent = String(e.performance ?? "-");
  $("#cardSleepHours").textContent = e.sleepHours ? `${e.sleepHours}h` : "-";

  const warn = $("#cardSleepWarn");
  warn.textContent = "";
  warn.classList.remove("text-red-600");

  if (Number(e.sleepHours) > 0 && Number(e.sleepHours) <= 5) {
    warn.textContent = "睡眠不足（<= 5h）";
    warn.classList.add("text-red-600");
  }
}
