# Application Design Plan

## Plan Overview
Zenn.dev インスパイアの UI/UX 全面改修に伴う、コンポーネント設計・サービスレイヤー設計・依存関係定義。

## Design Plan Steps

### Phase A: テーマシステム設計
- [x] A-1: テーマ切替コンポーネントの設計（ThemeToggle）
- [x] A-2: テーマ状態管理の方式決定
- [x] A-3: FOUC防止メカニズムの設計
- [x] A-4: Tailwind darkMode 設定と CSS 変数定義

### Phase B: レイアウト・ナビゲーション設計
- [x] B-1: BaseLayout の再設計（テーマ対応）
- [x] B-2: Header コンポーネントの再設計（テーマ切替ボタン追加）
- [x] B-3: Footer コンポーネントの再設計
- [x] B-4: タブナビゲーションコンポーネントの設計

### Phase C: 記事表示コンポーネント設計
- [x] C-1: ArticleCard の再設計（Zenn風コンパクトカード）
- [x] C-2: ホームページレイアウトの再設計
- [x] C-3: 記事詳細ページレイアウトの再設計
- [x] C-4: リアクション/エンゲージメントUIの再設計

### Phase D: 新機能コンポーネント設計
- [x] D-1: Bookmarks API エンドポイント設計
- [x] D-2: BookmarkButton コンポーネント設計
- [x] D-3: Bookmarks 一覧ページ設計

### Phase E: 成果物生成
- [x] E-1: components.md 生成
- [x] E-2: component-methods.md 生成
- [x] E-3: services.md 生成
- [x] E-4: component-dependency.md 生成
- [x] E-5: application-design.md（統合ドキュメント）生成
- [x] E-6: 設計の完全性・一貫性の検証

---

## Design Questions

以下の質問に `[Answer]:` タグの後に記号を記入してください。

---

### Question 1: テーマ切替UIの配置
テーマ切替トグルをどこに配置しますか？

A) ヘッダーの右端（Zennと同様、アイコンボタン）
B) ヘッダーのナビゲーション内
C) フッターに配置
D) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 2: デフォルトテーマ
初回訪問時のデフォルトテーマはどうしますか？

A) システム設定に従う（prefers-color-scheme を尊重）(Recommended)
B) ライトテーマをデフォルト（Zennと同様）
C) ダークテーマをデフォルト（現状維持）
D) Other (please describe after [Answer]: tag below)

[Answer]:A

---

### Question 3: ホームページの記事カード表示形式
Zenn風のカードデザインとして、どの形式を採用しますか？

A) 絵文字アイコン + タイトル + メタ情報のリスト形式（Zenn Trending 風）
B) 小サムネイル + タイトル + メタ情報のリスト形式
C) 現状のグリッド/リスト切替を維持しつつ、デザインをZenn風に簡素化
D) Other (please describe after [Answer]: tag below)

[Answer]:C

---

### Question 4: ヒーロースライドショーの扱い
現在のヒーロースライドショー（人気記事3件）はどうしますか？

A) 削除してZennのようにタブ（Trending/Latest）で代替
B) 簡素化して維持（小さめの推薦カード群に変更）
C) 現状維持
D) Other (please describe after [Answer]: tag below)

[Answer]:B

---

### Question 5: ブックマーク機能のユーザー認証
ブックマーク機能はどの認証方式で管理しますか？

A) 現在のセッションID方式（localStorage UUID、ログイン不要）(Recommended)
B) Firebase Authentication による匿名認証
C) Firebase Authentication によるソーシャルログイン（Google等）
D) Other (please describe after [Answer]: tag below)

[Answer]:A

---
