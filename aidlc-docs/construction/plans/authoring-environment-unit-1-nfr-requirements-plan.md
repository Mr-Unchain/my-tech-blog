# NFR Requirements Plan: Unit 1 - Markdown / MDX Article Foundation

## 対象 Unit

**Unit 1: Markdown / MDX Article Foundation**

Git 管理の Markdown / MDX 記事を正規の記事ソースとして扱うため、frontmatter 検証、記事 ID、公開判定、エラー処理、テスト容易性、依存関係方針に関する非機能要件と技術選択を整理します。

## 入力成果物

- `aidlc-docs/construction/authoring-environment-unit-1/functional-design/business-logic-model.md`
- `aidlc-docs/construction/authoring-environment-unit-1/functional-design/business-rules.md`
- `aidlc-docs/construction/authoring-environment-unit-1/functional-design/domain-entities.md`
- `aidlc-docs/inception/application-design/unit-of-work.md`
- `aidlc-docs/inception/application-design/unit-of-work-story-map.md`
- `aidlc-docs/inception/requirements/authoring-environment-requirements.md`

## 計画ステップ

- [x] Unit 1 Functional Design の承認を確認する。
- [x] NFR Requirements ルールと Security Baseline を読み込む。
- [x] Unit 1 の NFR 上の未確定事項を抽出する。
- [ ] 質問への回答を確認する。
- [ ] 回答の曖昧さや矛盾を確認する。
- [ ] `aidlc-docs/construction/authoring-environment-unit-1/nfr-requirements/nfr-requirements.md` を作成する。
- [ ] `aidlc-docs/construction/authoring-environment-unit-1/nfr-requirements/tech-stack-decisions.md` を作成する。
- [ ] Security Baseline の該当項目を確認する。
- [ ] `aidlc-state.md` と `audit.md` を更新する。

## 確認質問

以下の質問に、各 `[Answer]:` の後ろへ選択肢の記号を記入してください。該当しない場合は `X` を選び、同じ行に希望を書いてください。

## Question 1
frontmatter 検証の主な実装方針はどれにしますか？

A) Astro Content Collections の schema を主軸にし、Astro 標準の検証に寄せる
B) アプリ内に独自の TypeScript validator を作り、新しい依存は追加しない
C) `zod` などの schema validation library を明示依存として追加し、Astro 外でも同じ schema を使えるようにする
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
記事ファイルの読み込みと一覧取得は、どの方針を優先しますか？

A) Astro Content Collections / `getCollection` を優先し、Astro の content pipeline に乗せる
B) `import.meta.glob` を使い、記事取得層をアプリ側で制御しやすくする
C) Node.js の file system 読み込みを使い、build/test 用 validator として独立させる
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3
検証エラーの出し方はどの粒度にしますか？

A) 1件でもエラーがあれば即失敗し、最初のエラーだけを表示する
B) すべての記事を検証して、全エラーをまとめて表示してから失敗する
C) 開発中は警告として複数表示し、本番 build / test だけ失敗させる
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4
Unit 1 の性能目標として、初期 MVP で想定する記事数はどれにしますか？

A) 100記事程度までを快適に扱えればよい
B) 1,000記事程度まで build / test が現実的な時間で終わることを目標にする
C) 10,000記事規模も見据え、初期から incremental / caching 方針を設計に含める
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 5
Unit 1 のセキュリティ検証範囲はどこまで含めますか？

A) frontmatter の型・形式・URL 安全性・draft fail closed までを Unit 1 に含め、secret scan は Unit 5 に回す
B) Unit 1 でも本文と frontmatter の secret-like pattern 検出まで含める
C) Unit 1 は型検証に絞り、URL 安全性や secret scan は Unit 5 に回す
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 6
Unit 1 のテスト方針はどれにしますか？

A) validator / domain mapper の unit test を中心にする
B) unit test に加えて、fixture の MDX 記事を使う repository integration test も含める
C) build が通ることを主な検証にし、詳細な unit test は Unit 5 でまとめる
X) Other (please describe after [Answer]: tag below)

[Answer]: 

## 質問が必要な理由

- frontmatter schema の実装方針は、依存追加、テスト容易性、Astro との統合方式に影響します。
- 記事読み込み方式は、今後の public query、preview、migration validation の境界に影響します。
- エラー集約方針は、著者体験と CI の失敗原因特定に影響します。
- 記事数の想定は、build performance と将来の caching 方針に影響します。
- セキュリティ検証範囲は、SECURITY-05、SECURITY-11、SECURITY-13、SECURITY-15 の実装境界に影響します。
- テスト方針は、Unit 1 と Unit 5 の責務分担に影響します。

## Security Considerations

- SECURITY-05: frontmatter と file metadata の input validation を具体化する。
- SECURITY-10: 新しい依存を追加する場合は lockfile と supply chain 影響を確認する。
- SECURITY-11: draft / published 判定を共通化し、個別ページに散らさない。
- SECURITY-13: stable ID と file integrity の検証を設計に含める。
- SECURITY-15: validation failure は fail closed とする。
