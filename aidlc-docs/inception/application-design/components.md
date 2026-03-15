# Components Design

## New Components

### ThemeToggle (React Island)
- **Type**: React (.tsx) - `client:load`
- **File**: `src/components/ThemeToggle.tsx`
- **Purpose**: ライト/ダークテーマの切替UIを提供
- **Responsibilities**:
  - 現在のテーマ状態を表示（太陽/月アイコン）
  - クリックでテーマをトグル
  - `<html>` 要素の `class="dark"` を切替
  - localStorage に選択を永続化
  - `prefers-color-scheme` 変更イベントを監視
- **Props**: なし（自己完結型）
- **Placement**: Header コンポーネントの右端

### ThemeScript (Inline Script)
- **Type**: Astro inline script
- **Location**: BaseLayout.astro の `<head>` 内
- **Purpose**: FOUC（Flash of Unstyled Content）防止
- **Responsibilities**:
  - ページ読み込み直後（DOM解析前）にテーマクラスを適用
  - localStorage → prefers-color-scheme → フォールバックの優先順で判定
  - `<html>` 要素に `class="dark"` を同期的に設定

### TabNavigation (Astro)
- **Type**: Astro (.astro)
- **File**: `src/components/TabNavigation.astro`
- **Purpose**: ホームページのコンテンツフィルタリングタブ
- **Responsibilities**:
  - タブ項目の表示（Latest / Popular / カテゴリ）
  - アクティブタブのハイライト
  - タブ切替時のURL更新（クエリパラメータ）
- **Props**: `activeTab: string`, `categories: string[]`

### BookmarkButton (React Island)
- **Type**: React (.tsx) - `client:load`
- **File**: `src/components/BookmarkButton.tsx`
- **Purpose**: 記事のブックマーク追加/削除
- **Responsibilities**:
  - ブックマーク状態の取得・表示
  - クリックでブックマークをトグル（API呼び出し）
  - ブックマーク済み状態の視覚フィードバック（塗りつぶしアイコン）
  - アニメーション付きフィードバック
- **Props**: `blogId: string`, `title?: string`

### BookmarksPage (Astro)
- **Type**: Astro (.astro)
- **File**: `src/pages/bookmarks.astro`
- **Purpose**: ブックマーク一覧ページ
- **Responsibilities**:
  - ユーザーのブックマーク済み記事一覧を表示
  - ブックマーク解除機能
  - 空状態の表示（ブックマークなし時）
- **Note**: クライアントサイドでFirebaseから取得（SSRではなくCSR）

---

## Modified Components

### BaseLayout.astro (Major Modification)
- **Changes**:
  - `<html>` タグに動的 `class` 属性（dark/light）
  - `<head>` 内に ThemeScript（FOUC防止）挿入
  - 全 Tailwind クラスに `dark:` バリアント追加
  - CSS変数によるテーマカラー定義
  - ライトテーマ用のカラーパレット追加

### Header.astro (Major Modification)
- **Changes**:
  - ThemeToggle コンポーネントの追加（右端）
  - ナビゲーションの Zenn 風簡素化
  - ライト/ダーク両テーマ対応のスタイル
  - モバイルメニューのテーマ対応

### Footer.astro (Moderate Modification)
- **Changes**:
  - Zenn 風の 4 セクションフッター構成
  - ライト/ダーク両テーマ対応

### ArticleCard.astro (Major Modification)
- **Changes**:
  - Zenn 風の簡素化されたデザイン
  - メタ情報の充実（リアクション数、閲覧数表示）
  - グリッド/リスト両表示モードの維持
  - ライト/ダーク両テーマ対応
  - 過度な装飾（グラデーション/グロー）の削減

### HeroSlideshowReact.tsx (Major Modification)
- **Changes**:
  - 簡素化：大きなスライドショー → コンパクトな推薦カード群
  - ライト/ダーク両テーマ対応
  - レスポンシブデザインの改善

### Sidebar.astro (Moderate Modification)
- **Changes**:
  - ライト/ダーク両テーマ対応
  - Zenn 風の簡素化

### ReactionButtons.tsx (Moderate Modification)
- **Changes**:
  - UIの簡素化
  - ライト/ダーク両テーマ対応
  - BookmarkButton との統合表示

### StickyReactionBar.tsx (Moderate Modification)
- **Changes**:
  - BookmarkButton の追加
  - テーマ対応

### TableOfContents.tsx (Minor Modification)
- **Changes**:
  - テーマ対応スタイル

### CategoryList.tsx (Minor Modification)
- **Changes**:
  - テーマ対応スタイル

### All other .astro components (Minor Modification)
- **Changes**:
  - ハードコードされたダークテーマカラーを `dark:` バリアントに置換
  - ライトテーマのベースカラー追加

---

## Unchanged Components
- **LinkCard.astro** - 外部データ依存、テーマ対応のみ
- **KeyboardNavigation.astro** - ロジックのみ、スタイル変更なし
- **Comments.astro** - 外部サービス依存（テーマ対応のみ）
