# Integration Test Instructions

## Purpose
ユニット間の統合が正常に動作することを検証する。6ユニットの変更が相互に影響せずに機能することを確認。

## Test Scenarios

### Scenario 1: テーマ切替 → 全コンポーネント連動 (Unit 1 ↔ Unit 2/3/4/5)
- **Description**: テーマトグルでライト/ダーク切替時に、全コンポーネントのスタイルが CSS 変数経由で正しく切り替わる
- **Setup**: `npm run dev` でローカルサーバー起動
- **Test Steps**:
  1. ホームページ (`/`) にアクセス
  2. Header の ThemeToggle をクリックしてダークモードに切替
  3. 以下のコンポーネントが正しくダークテーマになることを確認:
     - Header, Footer (Unit 2)
     - ArticleCard, Sidebar, CategoryList (Unit 3)
     - 記事ページ: 本文, TOC, Breadcrumb, AuthorCard, Comments/Giscus (Unit 4)
     - BookmarkButton, ブックマーク一覧ページ (Unit 5)
  4. ライトモードに戻し、全コンポーネントが復元されることを確認
- **Expected Results**: 全コンポーネントが CSS 変数ベースでシームレスに切り替わる

### Scenario 2: 記事ページ → ブックマーク機能 (Unit 4 ↔ Unit 5)
- **Description**: 記事詳細ページでブックマークを追加し、一覧ページに反映される
- **Test Steps**:
  1. `/blog/{任意の記事ID}` にアクセス
  2. BookmarkButton をクリックしてブックマークを追加
  3. アイコンが filled に切り替わることを確認
  4. StickyReactionBar の compact BookmarkButton も同期されることを確認
  5. `/bookmarks` に移動
  6. ブックマークした記事が表示されることを確認
  7. 解除ボタンをクリックして記事が消えることを確認
- **Expected Results**: ブックマーク追加→一覧表示→解除の全フローが正常動作

### Scenario 3: Header ナビゲーション → 各ページ遷移 (Unit 2 ↔ Unit 3/4/5)
- **Description**: Header のナビゲーションから各ページへの遷移が正常に機能する
- **Test Steps**:
  1. デスクトップ: Header のブログ、ポートフォリオ、プロフィール、ブックマーク、検索リンクを順にクリック
  2. モバイル: ハンバーガーメニューを開き、各リンクをクリック
  3. 各ページが正しくレンダリングされることを確認
- **Expected Results**: 全ナビゲーションリンクが正常動作

### Scenario 4: Giscus テーマ連動 (Unit 1 ↔ Unit 4)
- **Description**: テーマ切替時に Giscus コメント iframe のテーマが連動する
- **Test Steps**:
  1. 記事ページにアクセスし、Giscus iframe がロードされるまで待機
  2. ThemeToggle でダークモードに切替
  3. Giscus iframe が `transparent_dark` テーマに切り替わることを確認
  4. ライトモードに戻し、`light` テーマに復元されることを確認
- **Expected Results**: MutationObserver + postMessage で Giscus テーマがリアルタイム同期

### Scenario 5: モバイルメニュー → ブックマークリンク (Unit 2 ↔ Unit 5)
- **Description**: モバイルメニューのブックマークリンクから一覧ページに遷移できる
- **Test Steps**:
  1. モバイルビューポートに設定
  2. ハンバーガーメニューを開く
  3. 「ブックマーク」リンクをタップ
  4. `/bookmarks` ページが表示されることを確認
- **Expected Results**: モバイルメニューからのブックマーク遷移が正常動作

## Setup Integration Test Environment

### 1. Start Local Dev Server
```bash
npm run dev
# http://localhost:4321 で起動
```

### 2. Required Environment
- `.env.local` に microCMS と Firebase の環境変数が設定されていること
- Firebase Firestore にアクセス可能なネットワーク環境

## Run Integration Tests (Manual)

現時点では手動テストで検証。将来的に Playwright E2E テストに自動化推奨。

### Playwright E2E テスト実行（既存テストがある場合）
```bash
npm run e2e
```

### Playwright UI モード（デバッグ用）
```bash
npm run e2e:ui
```

## Cleanup
```bash
# Dev サーバー停止: Ctrl+C
# テスト環境のクリーンアップは不要（Firestore はクラウド上で永続）
```
