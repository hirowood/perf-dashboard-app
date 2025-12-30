# perf-dashboard-tailwind (Vanilla + Tailwind CDN)

## 起動（重要）
ES Modulesを使っているので `file://` 直開きだと動かないことがあります。
ローカルサーバで開いてください。

### Python
```bash
cd perf-dashboard-tailwind
python -m http.server 5173
```
ブラウザで `http://localhost:5173` を開く。

### Node (任意)
```bash
npx serve .
```

## 仕様メモ
- データは localStorage に保存
- スキーマバージョン + migrateIfNeeded で白画面を回避
- (A) 曜日別平均：weekdayタブ
- (B) 推移グラフ：dayタブ（Canvas）
- 相関：ゲート(n, |r|)を満たすもののみ表示
