# Requirements Document - Homepage Branding Improvement

## Intent Analysis Summary

- **User Request**: ホームページの「気づきメモ」見出しと副題をかっこよく改善したい
- **Request Type**: Enhancement（既存UI要素のブランディング改善）
- **Scope Estimate**: Single Component（ホームページのヒーローセクションのみ）
- **Complexity Estimate**: Simple〜Moderate（テキスト変更 + タイピングアニメーション実装）
- **Requirements Depth**: Minimal（スコープが限定的で方向性が明確）

## User Answers Summary

| Question | Answer | Detail |
|----------|--------|--------|
| Q1: h1 方向性 | A | 「Monologger」をh1にし、副題でコンセプトを伝える |
| Q2: 副題トーン | C | ミニマル・短い一言（例: 「Build. Learn. Share.」） |
| Q3: ビジュアル演出 | D | アニメーション付き（タイピングアニメーション、フェードイン等） |
| Q4: 全体雰囲気 | D | 個人ブランド重視 — 自分の名前/ブランドが前面に出るスタイル |

## Functional Requirements

### FR-1: h1 テキスト変更
- **現状**: `<h1>気づきメモ</h1>`
- **変更後**: `<h1>Monologger</h1>`
- **備考**: JSON-LD（structured data）は既に「Monologger」を使用しており整合性が向上する

### FR-2: 副題テキスト変更
- **現状**: 「ITに触れて生まれた日々の気づきや備忘録をゆるくまとめています。」
- **変更後**: ミニマルな一言キャッチコピー（英語または日英混合）
- **候補例**:
  - 「Build. Learn. Share.」
  - 「Code & Thoughts」
  - 「つくる人の記録」
  - その他、個人ブランドに合致するフレーズ
- **最終テキストは Code Generation 時にユーザーと確定する**

### FR-3: タイピングアニメーション
- h1「Monologger」または副題にタイピングエフェクトを適用
- ページ初回ロード時に1回再生（ループしない）
- アニメーション完了後は静的表示に遷移
- Swup ページ遷移時の再トリガー対応が必要

### FR-4: フェードイン/補助アニメーション
- ヒーローセクション全体にフェードインまたはスライドインの入場アニメーション
- パフォーマンスに影響しない軽量な CSS アニメーションで実装
- `prefers-reduced-motion` メディアクエリでアニメーション無効化に対応

### FR-5: 個人ブランド強調
- 「Monologger」ブランドが視覚的に目立つデザイン
- フォントサイズ、ウェイト、または装飾で差別化
- ダーク/ライトテーマ両対応（CSS変数使用）

## Non-Functional Requirements

### NFR-1: パフォーマンス
- アニメーションは CSS ベースまたは軽量 JS で実装
- Lighthouse スコアへの影響を最小限に抑える
- 外部ライブラリの追加なしで実装する（CSS animation / @keyframes）

### NFR-2: アクセシビリティ
- `prefers-reduced-motion: reduce` 時はアニメーションを無効化
- h1 のセマンティクスを維持（SEO への影響なし）
- スクリーンリーダーでの読み上げに影響しない実装

### NFR-3: テーマ互換性
- ダークテーマ・ライトテーマ両方で適切に表示
- 既存の CSS 変数体系（`--color-text-heading` 等）を活用

### NFR-4: ページ遷移互換性
- Swup によるクライアントサイド遷移後もアニメーションが正しく再生
- `swup:page:view` イベントでの再初期化対応

## Technical Requirements

### TR-1: 変更対象ファイル
- `src/pages/index.astro` — h1、副題テキスト、アニメーション用クラス/スタイル
- `src/styles/main.scss` — アニメーション用 @keyframes（必要に応じて）
- `pageTitle` プロパティも「Monologger」に合わせて更新

### TR-2: 実装アプローチ
- CSS `@keyframes` + `animation` プロパティでタイピングエフェクト実装
- JavaScript は Swup 再トリガー用の最小限のみ
- 新規コンポーネント作成は不要（index.astro 内で完結可能）

## Scope Boundaries

### In Scope
- ホームページのヒーローセクション（h1 + 副題）
- タイピング/フェードインアニメーション
- テーマ対応

### Out of Scope
- ヘッダー、フッター、ナビゲーションの変更
- 他ページへの影響
- ロゴやファビコンの変更
- SEO メタデータの大幅変更（pageTitle のみ調整）
