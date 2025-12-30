// js/features/weekly.js
// 週次レビュー
// - 先週のデータを集計しドラフトを生成
// - ユーザーが編集して保存

import { $ } from "../ui/dom.js";
import { toWeekId, parseCSV } from "../core/utils.js";
import { getCorrelationResults } from "./correlation.js";

export function bindWeekReview(state, requestSave) {
  $("#generateWeeklyReview").addEventListener("click", () => {
    const summary = generateWeeklyReviewSummary(state);

    $("#weeklyLowDay").textContent = summary.lowDayText;
    $("#weeklyBestPractice").textContent = summary.bestPracticeText;
    $("#weeklyReviewText").value = summary.reviewDraft;
    $("#weeklyGeneratedHypothesis").value = summary.hypothesisDraft;
    $("#weeklyTargetMetrics").value = summary.targetMetrics.join(", ");
  });

  $("#saveWeeklyReview").addEventListener("click", () => {
    const weekId = toWeekId(state.selectedDate);

    state.data.weeklyReviews[weekId] = {
      reviewText: $("#weeklyReviewText").value || "",
      generatedHypothesis: $("#weeklyGeneratedHypothesis").value || "",
      targetMetrics: parseCSV($("#weeklyTargetMetrics").value),
    };

    requestSave(true);
  });
}

function generateWeeklyReviewSummary(state) {
  // 直近7日（selectedDateを終点とし、そこから7日）
  const end = new Date(`${state.selectedDate}T00:00:00`);
  const start = new Date(end);
  start.setDate(start.getDate() - 7);

  const entries = collectBetween(state, start, end);

  let low = null;
  let best = null;

  // 最低/最高 performance を探す
  for (const it of entries) {
    const p = it.entry.performance ?? null;
    if (p == null) continue;

    if (!low || p < (low.entry.performance ?? 999)) low = it;
    if (!best || p > (best.entry.performance ?? -1)) best = it;
  }

  const lowDayText = low ? `${low.date} (performance=${low.entry.performance})` : "データ不足";
  const bestPracticeText = best
    ? `${best.date} が最も良かった（睡眠=${best.entry.sleepHours ?? "-"}h / 気分=${best.entry.mood ?? "-"})`
    : "データ不足";

  // 週次でも相関を“参考”として使う（厳密な因果ではない）
  const corrs = getCorrelationResults(state);
  const hypothesisDraft = corrs[0]
    ? `来週の実験：${corrs[0].a}を改善すると${corrs[0].b}が上がるか？`
    : "来週の実験：まず1個だけ変える（睡眠・運動・朝ルーティン等）";

  const reviewDraft =
    `【Low Performance】${lowDayText}\n` +
    `【Best Practice】${bestPracticeText}\n` +
    `【Next Action】${hypothesisDraft}\n`;

  return {
    lowDayText,
    bestPracticeText,
    hypothesisDraft,
    reviewDraft,
    targetMetrics: ["sleepHours", "performance", "mood"],
  };
}

function collectBetween(state, start, end) {
  const out = [];

  for (const [date, entry] of Object.entries(state.data.dailyEntries)) {
    const d = new Date(`${date}T00:00:00`);
    if (d >= start && d < end) out.push({ date, entry });
  }

  out.sort((a, b) => (a.date < b.date ? -1 : 1));
  return out;
}
