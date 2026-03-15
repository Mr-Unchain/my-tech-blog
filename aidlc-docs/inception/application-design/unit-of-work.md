# Unit of Work Definitions

## Overview

Monologger（技術ブログ）の Zenn.dev インスパイア UI/UX 全面改修を、6つのユニットに分割して段階的に実装する。各ユニットはモノリスアプリケーション内の論理的な作業グループとして定義される。

---

## Unit 1: テーマ基盤（Theme Foundation）

### Purpose
ライト/ダークテーマ切替の基盤システムを構築する。全ユニットが依存する横断的基盤。

### Scope

#### New Files
| File | Type | Description |
|------|------|-------------|
| `src/lib/theme.ts` | Service | テーマ管理ロジック（getTheme, setTheme, toggleTheme, watchSystemTheme） |
| `src/components/ThemeToggle.tsx` | React Island | テーマ切替UIコンポーネント |

#### Modified Files
| File | Change |
|------|--------|
| `tailwind.config.mjs` | `darkMode: 'class'` 設定確認・調整 |
| `src/layouts/BaseLayout.astro` | ThemeScript（FOUC防止インラインスクリプト）追加、`<html>` に動的 class |
| `src/styles/main.scss` | CSS変数によるテーマカラー定義、ライトテーマベースカラー追加 |

### Completion Criteria
- [ ] `theme.ts` が localStorage / prefers-color-scheme / フォールバックの優先順でテーマ判定
- [ ] ThemeToggle がテーマをトグルし、アイコン（太陽/月）が切り替わる
- [ ] FOUC が発生しない（ThemeScript がDOM解析前にクラスを適用）
- [ ] Tailwind `dark:` バリアントが正常に動作する
- [ ] CSS変数でライト/ダーク両テーマのカラーパレットが定義されている

---

## Unit 2: レイアウト・ナビゲーション（Layout & Navigation）

### Purpose
Zenn風のクリーンなレイアウトとナビゲーションを実装する。

### Scope

#### New Files
| File | Type | Description |
|------|------|-------------|
| `src/components/TabNavigation.astro` | Astro Component | ホームページのタブナビゲーション（Latest / Popular / カテゴリ） |

#### Modified Files
| File | Change |
|------|--------|
| `src/components/Header.astro` | ThemeToggle 追加（右端）、ナビ簡素化、テーマ対応スタイル |
| `src/components/Footer.astro` | Zenn風4セクション構成、テーマ対応 |
| `src/layouts/BaseLayout.astro` | 全体レイアウト調整（センター配置、max-width） |

### Completion Criteria
- [ ] Header に ThemeToggle が配置され、テーマ切替が動作する
- [ ] ナビゲーションが簡素化されている（ホーム、ブログ、カテゴリ、プロフィール）
- [ ] TabNavigation がタブ切替でクエリパラメータを更新する
- [ ] Footer が Zenn 風の構成になっている
- [ ] ライト/ダーク両テーマでレイアウトが正しく表示される
- [ ] モバイルレスポンシブが維持されている

---

## Unit 3: 記事カード・ホームページ（Article Cards & Home）

### Purpose
ホームページのデザインを Zenn 風に刷新する。記事カードの再設計とヒーローセクションの簡素化。

### Scope

#### Modified Files
| File | Change |
|------|--------|
| `src/components/ArticleCard.astro` | Zenn風コンパクトデザイン、メタ情報追加（viewCount, reactionCount, bookmarkCount）、テーマ対応 |
| `src/components/HeroSlideshowReact.tsx` | HeroRecommendations.tsx にリネーム＆簡素化（スライドショー→静的推薦カード群） |
| `src/pages/index.astro` | レイアウト再設計、TabNavigation 統合、getBulkArticleStats 呼び出し、ヒーロー簡素化 |
| `src/components/Sidebar.astro` | テーマ対応、Zenn風簡素化 |
| `src/components/CategoryList.tsx` | テーマ対応スタイル |

#### New/Enhanced Service
| Service | Change |
|---------|--------|
| `getBulkArticleStats()` | 複数記事の統計一括取得（新規関数、firebase.ts または専用モジュール） |

### Completion Criteria
- [ ] ArticleCard がコンパクトで情報密度の高いデザインになっている
- [ ] カードにリアクション数・閲覧数が表示される
- [ ] HeroRecommendations が静的な推薦カード群として表示される
- [ ] タブナビゲーションで Latest / Popular / カテゴリのフィルタリングが動作する
- [ ] グリッド/リスト表示切替が維持されている
- [ ] ライト/ダーク両テーマで正しく表示される

---

## Unit 4: 記事詳細ページ（Article Detail）

### Purpose
記事詳細ページの読みやすさとエンゲージメント UI を改善する。

### Scope

#### Modified Files
| File | Change |
|------|--------|
| `src/pages/blog/[id].astro` | タイポグラフィ改善（行間、余白）、テーマ対応、コードブロック視認性向上 |
| `src/components/TableOfContents.tsx` | テーマ対応、モバイル折りたたみ対応 |
| `src/components/ReactionButtons.tsx` | UI簡素化、テーマ対応、BookmarkButton との統合表示 |
| `src/components/StickyReactionBar.tsx` | BookmarkButton 追加、テーマ対応 |
| `src/components/ShareButtons.astro` | テーマ対応 |
| `src/components/Comments.astro` | テーマ対応 |
| `src/styles/main.scss` | 記事本文のタイポグラフィ（prose クラス）改善 |

### Completion Criteria
- [ ] 記事本文の行間が 1.8〜2.0 に最適化されている
- [ ] 見出し間の余白が適切に調整されている
- [ ] コードブロックがライト/ダーク両テーマで視認性が良い
- [ ] 目次がモバイルで折りたたみ可能
- [ ] リアクション UI が簡素化されている
- [ ] StickyReactionBar に BookmarkButton が統合されている
- [ ] ライト/ダーク両テーマで正しく表示される

---

## Unit 5: ブックマーク機能（Bookmark Feature）

### Purpose
未完成のブックマーク機能を完全実装する。

### Scope

#### New Files
| File | Type | Description |
|------|------|-------------|
| `src/pages/api/bookmarks/[blogId].ts` | API Endpoint | GET（状態取得）/ POST（追加・削除・トグル） |
| `src/components/BookmarkButton.tsx` | React Island | ブックマーク追加/削除のUIコンポーネント |
| `src/pages/bookmarks.astro` | Page | ブックマーク一覧ページ |

#### Modified Files
| File | Change |
|------|--------|
| `src/lib/firebase-collections.ts` | Bookmarks コレクション定数・型の確認・拡張 |
| `src/components/Header.astro` | ブックマークページへのナビリンク追加 |

### Completion Criteria
- [ ] GET /api/bookmarks/{blogId} がブックマーク状態と数を返す
- [ ] POST /api/bookmarks/{blogId} がトグル動作で追加/削除する
- [ ] Firestore トランザクションでアトミックに統計更新される
- [ ] BookmarkButton がブックマーク状態を視覚的に表示（塗りつぶしアイコン）
- [ ] /bookmarks ページでブックマーク済み記事一覧が表示される
- [ ] 空状態（ブックマークなし）の適切な表示
- [ ] セッション ID 方式で認証なしに動作する

---

## Unit 6: 技術的負債解消（Tech Debt Resolution）

### Purpose
コード品質評価で特定された技術的負債を解消する。

### Scope

#### Modified Files
| File | Change |
|------|--------|
| `src/pages/index.astro` | Firebase `db` の null チェック追加（TR-1.1） |
| `src/pages/api/webhook/microcms-sync.ts` | 本番環境での署名検証必須化（TR-1.4） |
| `src/pages/index.astro` | インラインスクリプトの外部モジュール分離（TR-1.3） |
| `src/pages/blog/[id].astro` | インラインスクリプトの外部モジュール分離（TR-1.3） |

### Completion Criteria
- [ ] `db` が null の場合、クラッシュせずに適切なフォールバックが実行される
- [ ] Webhook エンドポイントで署名検証が未設定の場合、エラーログ出力＋リクエスト拒否
- [ ] インラインスクリプトが独立モジュールに分離され、テスト可能になっている
- [ ] 既存の機能が壊れていない（回帰テスト）

---

## Execution Order

```
Phase 1 (並行): Unit 1 (テーマ基盤) + Unit 6 (Tech Debt)
Phase 2 (順次): Unit 2 (レイアウト・ナビ) ← Unit 1 に依存
Phase 3 (並行): Unit 3 (カード・ホーム) + Unit 4 (記事詳細) + Unit 5 (ブックマーク) ← Unit 2 に依存
Phase 4: Build & Test (全ユニット統合テスト)
```

### Critical Path
```
Unit 1 → Unit 2 → Unit 3/4/5 → Build & Test
```

### Total Estimated File Changes
- **New files**: 6
- **Modified files**: ~20
- **Deleted files**: 0 (HeroSlideshowReact.tsx はリネーム)
