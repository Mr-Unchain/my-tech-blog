# Code Summary - Unit 6: 技術的負債解消（Tech Debt Resolution）

## Generated/Modified Files

### New Files (4)
| File | Type | Description |
|------|------|-------------|
| `src/lib/view-toggle.ts` | Utility Module | グリッド/リスト表示切替ロジック（index.astro から分離） |
| `src/lib/search-history.ts` | Utility Module | 検索履歴サジェストロジック（index.astro から分離） |
| `src/lib/share-buttons.ts` | Utility Module | ソーシャルシェアボタンロジック（blog/[id].astro から分離） |
| `src/lib/reading-progress.ts` | Utility Module | 読了プログレスバーロジック（blog/[id].astro から分離） |

### Modified Files (3)
| File | Change |
|------|--------|
| `src/pages/index.astro` | Firebase `db` null チェック追加、インラインスクリプトを外部モジュール import に置換 |
| `src/pages/api/webhook/microcms-sync.ts` | 署名検証の必須化（本番: シークレット未設定時は500、シークレット設定時は署名必須で401） |
| `src/pages/blog/[id].astro` | 2つの `<script is:inline>` を通常の `<script>` + 外部モジュール import に置換 |

## Requirements Coverage
| Requirement | Status |
|-------------|--------|
| TR-1.1 (Firebase null チェック) | Implemented - `db` null ガード追加、フォールバック動作確保 |
| TR-1.3 (インラインスクリプト分離) | Implemented - 4モジュール分離、TypeScript 型安全化 |
| TR-1.4 (Webhook 署名検証) | Implemented - 本番環境での Fail-Closed パターン適用 |

## Notes for Next Units
- **Unit 2〜5**: 分離したモジュールは再利用可能。必要に応じて他ページからも import 可能
- シェアボタンの HTML 構造は変更なし。スクリプトのみモジュール化
- `<script is:inline>` → `<script>` への変更により、Vite バンドラーの最適化（tree-shaking、minify）が有効になる
