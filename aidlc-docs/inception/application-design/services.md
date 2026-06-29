# Services: 執筆環境 / CMS 戦略

## Service S1: Article Source Service

**役割**: Markdown Article Repository を中心に、ブログ記事の正規取得元を提供する。

**利用 component**

- C1 Article Domain Model
- C2 Article Frontmatter Schema
- C3 Markdown Article Repository
- C10 Security and Validation Boundary

**Orchestration**

1. Markdown / MDX ファイルを読み込む。
2. frontmatter を検証する。
3. Article Domain Model へ変換する。
4. query 用に sort / filter / pagination 可能な形へ渡す。

**Security**

- validation 失敗時は公開記事として返さない。
- error details は developer 向けに留め、公開面へ内部情報を出さない。

## Service S2: Public Article Service

**役割**: 公開ページ、RSS、sitemap、検索、関連記事の唯一の公開記事取得窓口にする。

**利用 component**

- C4 Public Article Query Service
- C7 Public Surface Integration
- C10 Security and Validation Boundary

**Orchestration**

1. S1 から記事を取得する。
2. `status === 'published'` かつ公開日が有効な記事だけに絞る。
3. 公開面ごとの view model に変換する。
4. draft 混入検査を通して返す。

**Security**

- fail closed を原則にする。
- draft 判定に失敗した記事は公開しない。

## Service S3: Preview Service

**役割**: ローカル開発と Vercel Preview に限定した確認導線を提供する。

**利用 component**

- C5 Preview Article Query Service
- C10 Security and Validation Boundary

**Orchestration**

1. preview context を判定する。
2. 許可された context のみ draft を含む記事取得を許可する。
3. 公開面とは別の noindex 前提で preview 表示を返す。

**Security**

- 初期 MVP では本番公開 URL で draft を閲覧可能にしない。
- 将来の GitHub OAuth 導入時は server-side token validation と authorization を必須にする。

## Service S4: Legacy CMS Service

**役割**: microCMS に残す profile / projects と、migration 用の blog 取得を分離する。

**利用 component**

- C6 Legacy microCMS Content Repository
- C8 microCMS Blog Migration Support

**Orchestration**

1. profile / projects は既存 microCMS API から取得する。
2. blog の microCMS 取得は migration support か一時 fallback に限定する。
3. 通常の公開ブログ記事取得は S2 へ委譲する。

**Security**

- microCMS API key は環境変数でのみ扱う。
- 記事ファイルや docs に secret を置かない。

## Service S5: Migration Service

**役割**: microCMS ブログ記事を Markdown / MDX へ移す作業を支援する。

**利用 component**

- C6 Legacy microCMS Content Repository
- C8 microCMS Blog Migration Support
- C10 Security and Validation Boundary

**Orchestration**

1. legacy blog を取得する。
2. Article Domain Model へ mapping する。
3. Markdown / MDX ファイル content を生成する。
4. ID / slug / date / category / eyecatch の互換性を検証する。
5. 不正データがある場合は公開可能な成果物として出さない。

**Security**

- migration error は safe message にする。
- partial failure で公開記事が混入しないようにする。

## Service S6: Publishing Workflow Service

**役割**: 執筆から PR、merge、Vercel deploy までの運用導線を定義する。

**利用 component**

- C9 Publishing Workflow Documentation
- C10 Security and Validation Boundary

**Orchestration**

1. Obsidian / VS Code で記事を書く。
2. local preview で表示を確認する。
3. PR を作る。
4. Vercel Preview と test / build を確認する。
5. merge 後に本番 deploy する。

**Security**

- PR review で secret 混入と draft 設定を確認する。
- GitHub / Vercel の権限は最小権限を推奨する。

