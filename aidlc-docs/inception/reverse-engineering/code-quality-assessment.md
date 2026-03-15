# Code Quality Assessment

## Test Coverage
- **Overall**: Fair（テスト基盤はあるが網羅性は不明）
- **Unit Tests**: 設定済み（Vitest + Testing Library）。tests/ ディレクトリにテストファイル存在
- **Integration Tests**: 未構築（APIエンドポイント用のテストなし）
- **E2E Tests**: 設定済み（Playwright）。e2e/ ディレクトリにテストファイル存在

## Code Quality Indicators

### Linting
- **Configured**: Yes（ESLint v9 + eslint-plugin-astro + eslint-plugin-react + typescript-eslint）
- **Scope**: src/ ディレクトリ全体

### Code Formatting
- **Configured**: Yes（Prettier + prettier-plugin-astro）
- **Scope**: src/ ディレクトリ全体

### Code Style
- **Consistent**: 概ね一貫性あり
- **Note**: 日本語コメントが豊富（学習・備忘録目的のプロジェクトと整合）

### Documentation
- **Inline Comments**: Good（日本語で丁寧に記述）
- **JSDoc**: 一部あり（utils.ts）
- **README**: 存在（docs/ディレクトリ内にも文書あり）

### Type Safety
- **TypeScript Strict Mode**: Yes（Astro の strict 設定を継承）
- **Type Coverage**: High（microCMS型、Firebase型、API型すべて定義済み）

## Technical Debt

### 1. Firebase null-safety の一貫性不足
- **Location**: src/pages/index.astro:12-18
- **Issue**: `db` が null の可能性があるのに null チェックなしで直接使用。一方 API routes では適切にチェックしている
- **Impact**: Firebase 未設定時に index.astro がクラッシュする可能性

### 2. Bookmarks API が未完成
- **Location**: src/pages/api/bookmarks/[blogId].ts, src/lib/firebase-collections.ts
- **Issue**: 型定義とコレクション名は存在するが、API実装がプレースホルダー状態
- **Impact**: Low（ユーザーに公開されていない機能）

### 3. deepCopy の JSON.parse/stringify 制約
- **Location**: src/lib/utils.ts:40-42
- **Issue**: Date、undefined、関数、循環参照を含むオブジェクトでは不正確な結果
- **Impact**: Low（現在の用途では問題ないが、データ型が変わると顕在化する可能性）

### 4. microCMS SDK の参照共有問題への対症療法
- **Location**: src/lib/microcms.ts
- **Issue**: SDK のバグ or 仕様に対する deepCopy による回避策。根本解決ではない
- **Impact**: Medium（パフォーマンスへの影響は軽微だが、SDK更新で不要になる可能性）

### 5. インラインスクリプトの肥大化
- **Location**: src/pages/index.astro, src/pages/blog/[id].astro
- **Issue**: `<script>` タグ内に大量のクライアントサイドロジック（ビュー切替、シェア、プログレスバー等）
- **Impact**: Medium（保守性・テスタビリティの低下）

### 6. Webhookの署名検証が任意
- **Location**: src/pages/api/webhook/microcms-sync.ts:46
- **Issue**: `webhookSecret && signature` の条件で、シークレット未設定時は署名検証をスキップ
- **Impact**: Medium（本番環境でシークレットが未設定の場合、不正リクエストを処理してしまう）

## Patterns and Anti-patterns

### Good Patterns
1. **Islands Architecture**: React コンポーネントは `client:load` / `client:idle` で適切にハイドレーション制御
2. **Null-safe Firebase**: firebase.ts で設定検証 → 条件付き初期化 → nullable export
3. **Atomic Transactions**: リアクション統計更新に Firestore Transaction を使用
4. **SEO Best Practices**: 構造化データ（Schema.org）、OGP、canonical URL、sitemap、RSS すべて対応
5. **Progressive Enhancement**: コアコンテンツは SSR で配信、JS は追加機能のみ
6. **Data Normalization**: カテゴリを常に配列に正規化する一貫したパターン
7. **Critical CSS**: Critters による自動インライン化でFCPを最適化
8. **Image Optimization**: Sharp + LQIP + lazy loading の多層最適化

### Anti-patterns
1. **God Page**: index.astro と blog/[id].astro が大量のロジック・テンプレート・スクリプトを含む（300+行）
2. **Inconsistent Error Handling**: API routes では丁寧にエラー処理、ページでは一部チェック漏れ
3. **Magic Strings**: リアクションタイプやコレクション名が一部ハードコードされている箇所あり（ただし COLLECTIONS 定数もある）
4. **Client-side State in localStorage**: セッションID、ビューモード、検索履歴がすべて localStorage に分散
