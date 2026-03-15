# Code Summary - Unit 5: ブックマーク機能（Bookmark Feature）

## 概要
ブックマーク機能の完全実装。既存の API エンドポイントと Firestore コレクションを活用し、フロントエンド側のフック改善・UI コンポーネント作成・ページ統合を実施。

## 生成/変更ファイル一覧

### 変更ファイル (4)

| File | Changes |
|------|---------|
| `src/hooks/useBookmarks.ts` | 直接 Firestore SDK 呼び出しを API 経由に変更。`getBookmarkCount` を実装（固定0→API取得）。`bookmarkCount` 状態追加、楽観的更新対応。クライアントバンドルサイズ削減。 |
| `src/pages/blog/[id].astro` | `BookmarkButton` をインポートし、ReactionButtons の横に `client:load` で配置。flex レイアウトで並列表示。 |
| `src/components/StickyReactionBar.tsx` | `BookmarkButton` を compact モードで統合。リアクションセクションとシェアセクションの間に divider 付きで配置。 |
| `src/components/Header.astro` | デスクトップナビに bookmark SVG アイコンリンク追加（検索アイコンの前）。モバイルサイドバーメニューにブックマーク項目追加（検索の前）。 |

### 新規ファイル (4)

| File | Type | Description |
|------|------|-------------|
| `src/components/BookmarkButton.tsx` | React Island | ブックマーク追加/削除ボタン。通常モード（`.bookmark-btn`）と compact モード（`.sticky-reaction-btn`）の2表示。SVG アイコン切替（filled/outline）+カウント表示。 |
| `src/components/BookmarkListClient.tsx` | React Island | ブックマーク一覧のクライアントサイドレンダリング。ローディング・空状態・記事カード表示。ブックマーク解除ボタン付き。CSS 変数でテーマ対応。 |
| `src/pages/bookmarks.astro` | Astro Page | ブックマーク一覧ページ。BaseLayout + Breadcrumb + BookmarkListClient Island。`noIndex=true` で検索エンジンインデックス除外。 |
| `src/pages/api/bookmarks-list.ts` | API Endpoint | microCMS から複数記事を一括取得する GET API。`ids` クエリパラメータで ID をカンマ区切り指定。`id[equals]xxx[or]id[equals]yyy` フィルタで取得。 |

### 未変更（既存活用）

| File | Reason |
|------|--------|
| `src/pages/api/bookmarks/[blogId].ts` | 既存完全実装 → 変更不要 |
| `src/lib/firebase-collections.ts` | 型定義済み → 変更不要 |
| `src/styles/main.scss` (`.bookmark-btn`) | Unit 4 でテーマ対応済み → 変更不要 |

## アーキテクチャ決定

1. **API-based Hook パターン**: `useBookmarks` から直接 Firestore SDK 呼び出しを排除し、`/api/bookmarks/{blogId}` 経由に統一。クライアントバンドルから Firebase SDK の重複を削減。
2. **楽観的更新**: `toggleBookmark` 実行時に即座に UI を更新し、API レスポンス後に確定。UX のレスポンス性を向上。
3. **LocalStorage フォールバック**: API 到達不可時はローカルストレージのブックマーク ID リストにフォールバック（カウントは 0）。
4. **CSR ブックマーク一覧**: ユーザー固有データのため SSR ではなく CSR（React Island）で実装。`BookmarkListClient` が `useBookmarks()` でブックマーク ID を取得後、`/api/bookmarks-list` で記事詳細を取得。

## 要件カバレッジ

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| FR-2.1 (ブックマーク追加/削除) | ✅ | BookmarkButton + useBookmarks hook |
| FR-2.2 (ブックマーク状態表示) | ✅ | filled/outline アイコン切替 + カウント表示 |
| FR-2.3 (ブックマーク一覧) | ✅ | bookmarks.astro + BookmarkListClient + Header リンク |
| NFR-2 (レスポンス性) | ✅ | 楽観的更新 + LocalStorage フォールバック |

## テスト方法

### 手動テスト手順
1. **記事ページでのブックマーク追加/削除**: `/blog/{id}` で BookmarkButton をクリック → アイコンが切り替わること、カウントが更新されること
2. **Sticky Bar でのブックマーク**: スクロールして StickyReactionBar 表示 → compact BookmarkButton が動作すること
3. **ブックマーク一覧**: `/bookmarks` でブックマーク済み記事が表示されること
4. **ブックマーク解除**: 一覧ページで解除ボタン → リストから除外されること
5. **空状態**: ブックマーク 0 件時に空メッセージが表示されること
6. **テーマ対応**: ライト/ダークモードでボタン・一覧ページが適切に表示されること
7. **Header リンク**: デスクトップ・モバイルナビからブックマーク一覧に遷移できること

### 自動テスト（将来追加推奨）
- `useBookmarks` フックのユニットテスト（API モック使用）
- BookmarkButton コンポーネントテスト
- `/api/bookmarks-list` エンドポイントテスト
