# Code Generation Plan - Unit 5: ブックマーク機能（Bookmark Feature）

## Unit Context
- **Unit**: Unit 5 - ブックマーク機能
- **Dependencies**: Unit 1（テーマ基盤）, Unit 4（記事詳細）— すべて完了済み
- **Requirements**: FR-2.1, FR-2.2, FR-2.3, NFR-2
- **Workspace Root**: C:\Git\my-tech-blog

## Pre-existing Assets (Already Implemented)
| Asset | File | Status |
|-------|------|--------|
| API Endpoint (POST/GET) | `src/pages/api/bookmarks/[blogId].ts` | ✅ 完全実装 |
| Firestore Collections | `src/lib/firebase-collections.ts` | ✅ 型定義済み |
| useBookmarks Hook | `src/hooks/useBookmarks.ts` | ⚠️ getBookmarkCount が未実装（固定0） |
| SCSS Styles | `src/styles/main.scss` (.bookmark-btn) | ✅ テーマ対応済み (Unit 4) |

## Generation Steps

### Step 1: useBookmarks フックの改善
- [x] `getBookmarkCount` を API 経由で実装（`/api/bookmarks/{blogId}` の GET を使用）
- [x] `useBookmarks` の直接 Firestore 呼び出しを API 経由に変更（二重実装の解消）
- [x] bookmarkCount 状態の追加（トグル時にカウントをリアルタイム更新）
- [x] 要件: FR-2.1

### Step 2: BookmarkButton.tsx コンポーネント作成
- [x] `src/components/BookmarkButton.tsx` を新規作成
- [x] Props: `blogId: string`, `title?: string`, `compact?: boolean`
- [x] useBookmarks フックを使用してブックマーク状態管理
- [x] `.bookmark-btn` CSS クラスを使用（既存 SCSS スタイル活用）
- [x] ブックマーク済み/未済のアイコン切替（bookmark SVG）
- [x] カウント表示
- [x] compact モード（StickyReactionBar 用の小型表示）
- [x] 要件: FR-2.1, FR-2.2

### Step 3: blog/[id].astro にBookmarkButton統合
- [x] BookmarkButton をインポート
- [x] ReactionButtons の近くに配置（記事本文下部）
- [x] `client:load` で hydration
- [x] 要件: FR-2.1

### Step 4: StickyReactionBar にBookmarkButton追加
- [x] StickyReactionBar.tsx に BookmarkButton import 追加
- [x] リアクションセクションとシェアセクションの間にブックマークボタン配置
- [x] compact スタイルで表示（sticky-reaction-btn サイズに合わせる）
- [x] 要件: FR-2.1

### Step 5: ブックマーク一覧ページ作成
- [x] `src/pages/bookmarks.astro` を新規作成
- [x] BaseLayout を使用
- [x] クライアントサイドでブックマーク済み記事を取得・表示
- [x] BookmarkListClient.tsx（React Island）で記事一覧をレンダリング
- [x] `src/pages/api/bookmarks-list.ts` を新規作成（microCMS 記事一括取得 API）
- [x] 空状態（ブックマークなし）の表示
- [x] テーマ対応（CSS変数ベース）
- [x] 要件: FR-2.3

### Step 6: Header にブックマークページリンク追加
- [x] ナビゲーションにブックマークアイコン+リンクを追加
- [x] 要件: FR-2.3

### Step 7: コード生成サマリー作成
- [x] `aidlc-docs/construction/bookmark-feature/code/code-summary.md` を生成
- [x] 生成/変更したファイルの一覧
- [x] テスト方法・引き継ぎ事項

---

## File Operations Summary

### New Files (3)
| File | Type | Description |
|------|------|-------------|
| `src/components/BookmarkButton.tsx` | React Island | ブックマーク追加/削除 UI |
| `src/pages/bookmarks.astro` | Astro Page | ブックマーク一覧ページ |
| `src/components/BookmarkListClient.tsx` | React Island | ブックマーク一覧のクライアント側レンダリング |

### Modified Files (3)
| File | Change |
|------|--------|
| `src/hooks/useBookmarks.ts` | API 経由に変更、getBookmarkCount 実装 |
| `src/components/StickyReactionBar.tsx` | BookmarkButton 統合 |
| `src/pages/blog/[id].astro` | BookmarkButton 追加 |
| `src/components/Header.astro` | ブックマークページリンク追加 |

### Notes
- API エンドポイント (`/api/bookmarks/[blogId]`) は既存完全実装 → 変更不要
- firebase-collections.ts の型定義は既存 → 変更不要
- .bookmark-btn SCSS は Unit 4 でテーマ対応済み → 変更不要
