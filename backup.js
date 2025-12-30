// js/features/backup.js
// export/import（要件にはあるが、UIはまだ貼っていない）
// - ここは次の実装ポイントとして“スケルトン”だけ用意する
// - importは「強制上書き」か「マージ」か仕様固定が必要（今は未決）

export function exportJson(appData) {
  // TODO: JSON文字列を作り、Blobでダウンロードさせる
  // 例:
  // const blob = new Blob([JSON.stringify(appData, null, 2)], { type: "application/json" });
  // const url = URL.createObjectURL(blob);
  // ...
}

export function importJsonText(text) {
  // TODO: JSON.parse -> バリデーション -> migrateIfNeeded -> 反映
}
