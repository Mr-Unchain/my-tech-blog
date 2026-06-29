# Components: 執筆環境 / CMS 戦略

## 設計方針

ブログ記事は Git 管理の Markdown / MDX を正とする。microCMS は初期 MVP では profile / projects の取得元として残す。公開ページ、RSS、sitemap、検索、関連記事、ブックマーク一覧は、ブログ記事の取得元を直接知らず、記事取得境界を通して扱う。

## Component C1: Article Domain Model

**目的**: microCMS 由来か Markdown / MDX 由来かに依存しない、サイト内共通の記事型を定義する。

**責務**

- `id`, `slug`, `title`, `description`, `content`, `category`, `eyecatch`, `draft`, `publishedAt`, `updatedAt` を共通表現にする。
- Firebase の reactions / views / bookmarks が参照する安定 ID を保持する。
- UI コンポーネントが期待する `Blog` 相当の shape へ変換できる状態を保つ。

**境界**

- 詳細な validation rule は Functional Design で定義する。
- Markdown / MDX の読み込み方法そのものは C3 が担当する。

## Component C2: Article Frontmatter Schema

**目的**: Markdown / MDX 記事の metadata を検証可能にする。

**責務**

- 必須 field と任意 field を定義する。
- 不正な `draft`, `category`, `publishedAt`, `updatedAt`, `eyecatch` を検出する。
- build / test 時に fail closed で検出できる構造にする。

**境界**

- エラーメッセージには token や secret を含めない。
- 実装で使う schema library は後続の NFR Requirements / Code Generation で確定する。

## Component C3: Markdown Article Repository

**目的**: Git 管理された Markdown / MDX ファイルから記事一覧と詳細を取得する。

**責務**

- 記事ファイルを読み込み、C2 で frontmatter を検証する。
- `draft` を含む記事と公開記事を明確に区別する。
- 一覧、詳細、カテゴリ、検索、RSS、sitemap が使う取得 API を提供する。
- 取得失敗や validation 失敗時は公開記事として返さない。

**境界**

- profile / projects は扱わない。
- migration 元の microCMS API 呼び出しは C8 が担当する。

## Component C4: Public Article Query Service

**目的**: 公開面に出せる記事だけを返す統一窓口にする。

**責務**

- 一覧、詳細、カテゴリ、検索、RSS、sitemap、関連記事用の query を提供する。
- `draft` と未公開記事を全公開面から除外する。
- sort, pagination, category filtering, text search を公開用途として扱う。

**境界**

- 認証付き preview の詳細は MVP では実装対象外。将来拡張点だけ残す。

## Component C5: Preview Article Query Service

**目的**: ローカル preview と Vercel Preview で、公開前記事を確認できる導線を支える。

**責務**

- ローカル開発環境では Markdown / MDX の未公開記事を確認できる。
- 本番公開面では未公開記事を返さない。
- 将来の管理 UI / GitHub OAuth preview に拡張できる境界を持つ。

**境界**

- 初期 MVP では公開 URL から draft を閲覧できる機構は追加しない。

## Component C6: Legacy microCMS Content Repository

**目的**: profile / projects の microCMS 取得を維持し、ブログ記事取得から分離する。

**責務**

- `getProfile` と `getProjects` 相当の責務を維持する。
- ブログ記事移行後も既存ページが必要とする profile / projects を取得する。
- microCMS blog 取得は migration support か fallback のみに閉じ込める。

**境界**

- 新しい公開ブログ記事取得の主経路にはしない。

## Component C7: Public Surface Integration

**目的**: 既存のページやコンポーネントを新しい記事取得境界へ接続する。

**責務**

- Home、blog index、blog detail、category、search、RSS、sitemap、portfolio recent articles、Sidebar、bookmarks list を統合する。
- ArticleCard、ArticleNavigation、recommend、reading time など既存 UI / utility 互換を保つ。
- 記事 ID を Firebase 連携へ渡す。

**境界**

- UI の大幅 redesign は扱わない。

## Component C8: microCMS Blog Migration Support

**目的**: 既存 microCMS ブログ記事を Markdown / MDX へ移行するための支援境界を定義する。

**責務**

- microCMS 記事の `id`, `title`, `description`, `content`, `category`, `eyecatch`, `publishedAt`, `updatedAt` を Markdown / MDX 用に対応付ける。
- ID / slug / Firebase stats 互換性を維持する。
- 不正データを公開記事として混入させない。

**境界**

- 初期 MVP で全自動移行を必須にしない。

## Component C9: Publishing Workflow Documentation

**目的**: Obsidian / VS Code から PR 公開までの作業を明文化する。

**責務**

- 記事追加、preview、PR 作成、review、merge、Vercel deploy の手順を定義する。
- frontmatter の書き方と draft の扱いを説明する。
- token や secret を記事ファイルに入れない注意点を含める。

**境界**

- GitHub 上の権限設定そのものは Infrastructure Design ではなく運用手順として扱う。

## Component C10: Security and Validation Boundary

**目的**: Security Baseline に関係する判断を各 component から参照できる形にする。

**責務**

- draft exclusion を fail closed にする。
- frontmatter と migration input を検証する。
- error message に内部詳細や secret を出さない。
- 将来の admin UI / GitHub OAuth 導入時の認証・認可境界を明示する。

**境界**

- 新規認証機能は初期 MVP の実装対象外。

