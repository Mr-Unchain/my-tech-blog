# Code Generation Plan - Unit 6: 技術的負債解消（Tech Debt Resolution）

## Unit Context
- **Unit**: Unit 6 - 技術的負債解消
- **Dependencies**: なし（独立実行）
- **Requirements**: TR-1.1, TR-1.3, TR-1.4
- **Workspace Root**: C:\Git\my-tech-blog

## Generation Steps

### Step 1: Firebase null チェック強化（index.astro）
- [x] `src/pages/index.astro` の `db` 使用箇所に null チェック追加
- [x] `db` が null の場合は空の heroPosts でフォールバック
- [x] 要件: TR-1.1

### Step 2: Webhook 署名検証の必須化（本番環境）
- [x] `src/pages/api/webhook/microcms-sync.ts` の署名検証ロジック修正
- [x] 本番環境（`import.meta.env.PROD`）で `MICROCMS_WEBHOOK_SECRET` 未設定時はエラーログ + リクエスト拒否
- [x] 開発環境では従来通り署名検証をスキップ可能
- [x] 要件: TR-1.4

### Step 3: インラインスクリプトの外部モジュール分離（index.astro）
- [x] `src/pages/index.astro` の View Toggle スクリプトを `src/lib/view-toggle.ts` に分離
- [x] 検索履歴サジェストスクリプトを `src/lib/search-history.ts` に分離
- [x] ページ内のインラインスクリプトを外部モジュールの import に置換
- [x] 要件: TR-1.3

### Step 4: インラインスクリプトの外部モジュール分離（blog/[id].astro）
- [x] シェアボタンスクリプトを `src/lib/share-buttons.ts` に分離
- [x] 読了プログレスバースクリプトを `src/lib/reading-progress.ts` に分離
- [x] ページ内のインラインスクリプトを外部モジュールの import に置換
- [x] 要件: TR-1.3

### Step 5: コード生成サマリー作成
- [x] `aidlc-docs/construction/tech-debt/code/code-summary.md` を生成
- [x] 生成/変更したファイルの一覧
- [x] 次ユニットへの引き継ぎ事項

---

## File Operations Summary

### New Files (4)
| File | Type |
|------|------|
| `src/lib/view-toggle.ts` | Utility Module |
| `src/lib/search-history.ts` | Utility Module |
| `src/lib/share-buttons.ts` | Utility Module |
| `src/lib/reading-progress.ts` | Utility Module |

### Modified Files (3)
| File | Change |
|------|--------|
| `src/pages/index.astro` | Firebase null チェック追加、インラインスクリプト分離 |
| `src/pages/api/webhook/microcms-sync.ts` | 署名検証必須化（本番環境） |
| `src/pages/blog/[id].astro` | インラインスクリプト分離 |
