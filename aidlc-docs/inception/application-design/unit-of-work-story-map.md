# Unit of Work Story Map: 執筆環境 / CMS 戦略

## Story Coverage Summary

| Story | Primary Unit | Supporting Units |
|---|---|---|
| US-1: Markdown / MDX 記事ファイルを作成できる | Unit 1 | Unit 3, Unit 5 |
| US-2: 記事 frontmatter を検証できる | Unit 1 | Unit 5 |
| US-3: 外部エディタで書いた記事をプレビューできる | Unit 3 | Unit 1, Unit 2 |
| US-4: Pull Request で記事を公開できる | Unit 3 | Unit 5 |
| US-5: 下書き記事を公開面から除外できる | Unit 2 | Unit 1, Unit 5 |
| US-6: 既存 microCMS 記事を Markdown / MDX へ移行できる | Unit 4 | Unit 1, Unit 5 |
| US-7: microCMS と Git 管理記事を責務分離して共存できる | Unit 2 | Unit 4 |
| US-8: 将来の画像管理方式を妨げずにアイキャッチを扱える | Unit 4 | Unit 1, Unit 2 |
| US-9: 記事 ID と既存動的データの互換性を維持できる | Unit 1 | Unit 2, Unit 4 |
| US-10: 認証・シークレット管理・セキュリティ条件を満たせる | Unit 5 | Unit 3, Unit 4 |

## Unit 1 Story Detail

### Primary Stories

- US-1: Markdown / MDX 記事ファイルを作成できる
- US-2: 記事 frontmatter を検証できる
- US-9: 記事 ID と既存動的データの互換性を維持できる

### Acceptance Criteria Covered

- Markdown / MDX ファイルが記事として扱える。
- frontmatter の必須項目が検証される。
- category が配列として扱える。
- draft / published が判定される。
- ID の重複や欠落を検出できる。

### Handoff to Other Units

- Unit 2 は Unit 1 の public article queryable data を使う。
- Unit 4 は Unit 1 の schema に合わせて migration output を作る。
- Unit 5 は Unit 1 の validation behavior をテストする。

## Unit 2 Story Detail

### Primary Stories

- US-5: 下書き記事を公開面から除外できる
- US-7: microCMS と Git 管理記事を責務分離して共存できる

### Supporting Stories

- US-3: preview 表示の最終 surface
- US-9: Firebase-compatible article ID を page integration へ渡す

### Acceptance Criteria Covered

- `/`, `/blog`, `/blog/[id]`, `/category`, `/search`, RSS, sitemap に draft が出ない。
- profile / projects は microCMS のまま維持される。
- blog article runtime path は Markdown / MDX source を使う。
- bookmark list API が published article summaries を返せる。

### Handoff to Other Units

- Unit 3 は preview / PR docs で Unit 2 の実際の表示面を参照する。
- Unit 5 は public surface tests を作る。

## Unit 3 Story Detail

### Primary Stories

- US-3: 外部エディタで書いた記事をプレビューできる
- US-4: Pull Request で記事を公開できる

### Supporting Stories

- US-10: secret / auth / PR history の安全性

### Acceptance Criteria Covered

- local dev server で記事表示を確認できる。
- Vercel Preview で PR 表示を確認できる。
- PR review で frontmatter、draft、secret 混入を確認できる。
- merge 後に Vercel deploy で公開される flow が明確である。

### Handoff to Other Units

- Unit 5 は docs と checklist を最終化する。

## Unit 4 Story Detail

### Primary Stories

- US-6: 既存 microCMS 記事を Markdown / MDX へ移行できる
- US-8: 将来の画像管理方式を妨げずにアイキャッチを扱える

### Supporting Stories

- US-7: microCMS と Markdown / MDX の責務分離
- US-9: ID compatibility

### Acceptance Criteria Covered

- legacy blog fields を Markdown / MDX へ mapping できる。
- ID / slug / dates / category / eyecatch を維持する。
- profile / projects は migration 対象外にできる。
- invalid migration data を検出できる。

### Handoff to Other Units

- Unit 5 は migration validation tests と migration guide を作る。

## Unit 5 Story Detail

### Primary Stories

- US-10: 認証・シークレット管理・セキュリティ条件を満たせる

### Supporting Stories

- US-2: frontmatter validation tests
- US-4: PR workflow checklist
- US-5: draft exclusion tests

### Acceptance Criteria Covered

- draft leak が公開面で起きないことを検証できる。
- secret が記事ファイルに混入しないための checklist がある。
- build / test / authoring guide が揃う。
- Security Baseline の該当項目が確認される。

## Persona Coverage

| Persona | Covered By Units |
|---|---|
| 著者 | Unit 1, Unit 3, Unit 5 |
| サイト運用者 / 開発者 | Unit 1, Unit 2, Unit 4, Unit 5 |
| 読者 | Unit 2, Unit 5 |

## Coverage Validation

| Validation Item | Result |
|---|---|
| Every story has a primary unit | Pass |
| Every story has acceptance coverage | Pass |
| Every persona is covered | Pass |
| Security story mapped to a unit | Pass |
| Migration story separated from runtime public path | Pass |

