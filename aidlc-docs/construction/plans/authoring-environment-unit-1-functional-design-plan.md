# Functional Design Plan: Unit 1 - Markdown / MDX Article Foundation

## 対象 Unit

**Unit 1: Markdown / MDX Article Foundation**

ブログ記事の正規取得元を Git 管理 Markdown / MDX に移すため、Article Domain Model、frontmatter schema、Markdown / MDX article repository、draft / published 判定、stable article ID、validation unit tests の functional design を作成する。

## 入力成果物

- `aidlc-docs/inception/application-design/unit-of-work.md`
- `aidlc-docs/inception/application-design/unit-of-work-story-map.md`
- `aidlc-docs/inception/application-design/components.md`
- `aidlc-docs/inception/application-design/component-methods.md`
- `aidlc-docs/inception/application-design/services.md`
- `aidlc-docs/inception/requirements/authoring-environment-requirements.md`
- `aidlc-docs/inception/user-stories/stories.md`

## 設計ステップ

- [x] Unit 1 の責務と boundaries を確認する。
- [x] Unit 1 に割り当てられた stories を確認する。
- [x] functional design に影響する未確定事項を抽出する。
- [ ] 質問への回答を確認する。
- [ ] 回答の曖昧さや矛盾を確認する。
- [ ] `aidlc-docs/construction/authoring-environment-unit-1/functional-design/business-logic-model.md` を作成する。
- [ ] `aidlc-docs/construction/authoring-environment-unit-1/functional-design/business-rules.md` を作成する。
- [ ] `aidlc-docs/construction/authoring-environment-unit-1/functional-design/domain-entities.md` を作成する。
- [ ] Unit 1 には UI component が含まれないため、`frontend-components.md` は作成しない。
- [ ] Security Baseline の該当項目を確認する。
- [ ] `aidlc-state.md` と `audit.md` を更新する。

## 確認質問

以下の質問に、各 `[Answer]:` の後ろへ選択肢の記号を記入してください。該当しない場合は `X` を選び、同じ行に希望を書いてください。

## Question 1
記事 URL と Firebase 互換性のため、Markdown / MDX 記事の主 ID はどう扱いますか？

A) 既存 microCMS の `id` を `id` として保持し、URL も `/blog/{id}/` を維持する
B) 新規記事は `slug` を主 URL にし、移行記事だけ既存 `id` を互換 ID として保持する
C) `id` と `slug` を両方必須にし、URL は `slug`、Firebase は `id` を使う
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 2
記事ファイルの配置とファイル名は、どの方針にしますか？

A) `src/content/blog/{id-or-slug}.mdx` に集約する
B) `src/content/blog/{yyyy}/{id-or-slug}.mdx` のように年ごとに分ける
C) `src/articles/{id-or-slug}.mdx` のように Astro content collections から独立した専用ディレクトリに置く
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 3
初期 MVP の本文形式はどこまで許可しますか？

A) Markdown のみを必須対応にし、MDX component 埋め込みは後続に回す
B) Markdown と MDX の両方を許可し、既存記事表示で必要な HTML / code block 互換を優先する
C) MDX を主形式にし、Markdown は互換形式として扱う
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 4
`draft` と公開日の扱いはどうしますか？

A) `draft: true` は常に非公開、`draft: false` か未指定かつ `publishedAt` があるものだけ公開
B) `status: draft | published` を必須にし、`published` のみ公開
C) `draft` と `publishedAt` を両方必須にし、`draft: false` かつ `publishedAt` があるものだけ公開
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
カテゴリはどのように扱いますか？

A) `category` は `string[]` 必須。既存と同じく複数カテゴリを許可する
B) `category` は `string` 必須。MVP では単一カテゴリに絞る
C) `category` は `string[]` 必須だが、許可カテゴリの allowlist を持つ
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 6
frontmatter validation error は、どのタイミングで検出する設計にしますか？

A) build / test 時に失敗させる。開発中も同じ validation を使う
B) dev server では警告、production build では失敗にする
C) runtime で該当記事だけ除外し、build 自体は継続する
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
`eyecatch` の frontmatter は初期 MVP でどの表現にしますか？

A) URL 文字列だけを許可する
B) `{ url, width, height, alt }` の object を許可する
C) URL 文字列と object の両方を許可し、内部で共通形に正規化する
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## 質問が必要な理由

- `id` / `slug` は URL、Firebase stats、migration の全 unit に影響する。
- ファイル配置は Astro content collections を使うかどうかの前提になる。
- Markdown / MDX 対応範囲は rendering と validation の境界に影響する。
- draft 判定は SECURITY-11 / SECURITY-15 の中心になる。
- validation error の扱いは fail closed と authoring experience の両方に影響する。

## Completion Summary

- [x] Answers reviewed: Q1=A, Q2=A, Q3=C, Q4=A, Q5=A, Q6=A, Q7=A.
- [x] No blocking contradictions or unresolved ambiguities detected.
- [x] Created `aidlc-docs/construction/authoring-environment-unit-1/functional-design/business-logic-model.md`.
- [x] Created `aidlc-docs/construction/authoring-environment-unit-1/functional-design/business-rules.md`.
- [x] Created `aidlc-docs/construction/authoring-environment-unit-1/functional-design/domain-entities.md`.
- [x] Did not create `frontend-components.md` because Unit 1 has no UI component.
- [x] Security Baseline reviewed for SECURITY-05, SECURITY-11, SECURITY-13, and SECURITY-15.
- [x] `aidlc-state.md` and `audit.md` updated.

## Security Considerations

- SECURITY-05: frontmatter と file metadata の input validation を定義する。
- SECURITY-11: draft 判定を集中管理する。
- SECURITY-13: stable ID と migration integrity を守る。
- SECURITY-15: validation failure 時に公開へ fail open しない。
