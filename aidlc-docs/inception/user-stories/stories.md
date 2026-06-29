# ユーザーストーリー: 執筆環境 / CMS 戦略

## Story Organization

- **分解方式**: 機能ベース
- **受け入れ条件の粒度**: 初回 MVP に必要な内容 + 将来拡張観点
- **対象ペルソナ**: 著者、サイト運用者 / 開発者、読者
- **移行方針**: microCMS 記事移行は独立エピックとして扱う
- **セキュリティ**: 関連ストーリーの受け入れ条件へ直接含める

## Epic A: Markdown / MDX コンテンツ基盤

### US-1: Markdown / MDX 記事ファイルを作成できる

As a 著者,  
I want 記事を Markdown / MDX ファイルとして作成できる,  
so that microCMS の UI に縛られず、慣れた外部エディタで執筆できる。

#### Acceptance Criteria

- [ ] Given 新規記事を書くとき, When 指定された記事ディレクトリに Markdown / MDX ファイルを追加する, Then 記事本文を外部エディタで編集できる。
- [ ] Given 記事ファイルを追加するとき, When frontmatter に title、description、category、eyecatch、draft、publishedAt を記述する, Then Astro 側の記事取得処理が記事メタデータとして扱える。
- [ ] Given MDX を使用するとき, When 本文に既存記事表示で許可された記法を書く, Then 本文表示が既存のブログ記事レイアウトで破綻しない。
- [ ] Given 将来画像管理方式を変更するとき, When eyecatch の保存先が microCMS、`public/`、外部サービスのいずれになっても, Then frontmatter の参照方式を拡張できる。

#### Notes

- Requirement references: FR-1, FR-3, FR-6, FR-7
- Security considerations: 記事ファイルに API キー、トークン、個人情報を含めない。
- INVEST: Independent, Valuable, Testable

### US-2: 記事 frontmatter を検証できる

As a サイト運用者 / 開発者,  
I want Markdown / MDX 記事の frontmatter を検証できる,  
so that 不正な記事データを公開前に検出できる。

#### Acceptance Criteria

- [ ] Given 記事ファイルが追加または更新されたとき, When 必須フィールドが欠けている, Then ビルドまたはテストで検出できる。
- [ ] Given draft / published 状態が不正な値のとき, When 記事取得処理が実行される, Then 公開記事として扱われない。
- [ ] Given category が既存表示で想定しない型のとき, When 記事一覧またはカテゴリページを生成する, Then バリデーションエラーとして検出できる。
- [ ] Given publishedAt / updatedAt が不正な日時形式のとき, When RSS または sitemap を生成する, Then 不正データを検出できる。
- [ ] Given frontmatter バリデーションでエラーが出たとき, When エラーメッセージを表示する, Then 秘密情報や内部トークンを出力しない。

#### Notes

- Requirement references: FR-1, FR-6, NFR-2, NFR-3, NFR-6
- Security considerations: SECURITY-05, SECURITY-15
- INVEST: Independent, Valuable, Estimable, Testable

## Epic B: プレビューと表示確認

### US-3: 外部エディタで書いた記事をプレビューできる

As a 著者,  
I want 外部エディタで書いた Markdown / MDX 記事を本番に近い表示で確認できる,  
so that 公開前に本文、コードブロック、リンク、アイキャッチの見た目を確認できる。

#### Acceptance Criteria

- [ ] Given ローカルで記事を書いているとき, When 開発サーバーまたはプレビュー環境を開く, Then 記事詳細ページに近い見た目で確認できる。
- [ ] Given Pull Request を作成したとき, When Vercel の Preview Deployment が作成される, Then PR 上で公開前表示を確認できる。
- [ ] Given draft 状態の記事を確認するとき, When 認可されていない読者が通常ルートへアクセスする, Then 下書き記事は表示されない。
- [ ] Given スマートフォンで確認するとき, When プレビュー URL を開く, Then 少なくとも本文、タイトル、カテゴリ、アイキャッチの崩れを確認できる。
- [ ] Given 将来管理 UI を追加するとき, When プレビュー導線を拡張する, Then Git 管理記事のプレビュー要件を再利用できる。

#### Notes

- Requirement references: FR-3, FR-4, NFR-1, NFR-3, NFR-5
- Security considerations: SECURITY-08, SECURITY-12
- INVEST: Valuable, Small, Testable

## Epic C: PR ベースの公開フロー

### US-4: Pull Request で記事を公開できる

As a 著者,  
I want 記事追加・更新を Pull Request でレビューしてから公開できる,  
so that Git 履歴とレビューを残しながら安全に記事を公開できる。

#### Acceptance Criteria

- [ ] Given 記事ファイルを追加したとき, When Pull Request を作成する, Then 記事差分と frontmatter 差分をレビューできる。
- [ ] Given Pull Request が作成されたとき, When Vercel Preview Deployment が成功する, Then 公開前の記事表示を確認できる。
- [ ] Given Pull Request が merge されたとき, When Vercel 本番デプロイが走る, Then 手動デプロイ操作なしで記事が公開される。
- [ ] Given Pull Request に秘密情報が含まれる可能性があるとき, When レビューまたはチェックを行う, Then トークンや API キーが記事ファイルに含まれていないことを確認できる。
- [ ] Given PR ベース公開を使うとき, When GitHub の権限を設定する, Then 記事変更権限は必要最小限のユーザーに限定できる。

#### Notes

- Requirement references: FR-5, NFR-4
- Security considerations: SECURITY-06, SECURITY-10, SECURITY-13
- INVEST: Valuable, Testable

### US-5: 下書き記事を公開面から除外できる

As a 読者,  
I want 公開済み記事だけを閲覧できる,  
so that 未完成の下書きや非公開記事に誤ってアクセスしない。

#### Acceptance Criteria

- [ ] Given draft 状態の記事が存在するとき, When ブログ一覧を表示する, Then 下書き記事は表示されない。
- [ ] Given draft 状態の記事が存在するとき, When RSS、sitemap、検索対象を生成する, Then 下書き記事は含まれない。
- [ ] Given draft 状態の記事の URL を推測してアクセスしたとき, When 認可されていないアクセスである, Then 記事本文は表示されない。
- [ ] Given 公開状態の判定でエラーが起きたとき, When 記事取得処理が失敗する, Then fail closed として公開扱いにしない。
- [ ] Given 将来プレビュー認証を導入するとき, When 認証済み著者がアクセスする, Then 下書きプレビューだけが許可される。

#### Notes

- Requirement references: FR-4, NFR-3, NFR-4
- Security considerations: SECURITY-08, SECURITY-15
- INVEST: Independent, Valuable, Testable

## Epic D: microCMS 記事移行

### US-6: 既存 microCMS 記事を Markdown / MDX へ移行できる

As a サイト運用者 / 開発者,  
I want 既存 microCMS のブログ記事を Markdown / MDX へ移行できる,  
so that ブログ記事を Git 管理へ移しつつ既存記事の価値を保てる。

#### Acceptance Criteria

- [ ] Given microCMS の既存ブログ記事があるとき, When 移行処理または手順を実行する, Then title、description、content、category、eyecatch、publishedAt、updatedAt を Markdown / MDX 側へ移せる。
- [ ] Given 既存記事 ID があるとき, When Markdown / MDX 記事へ移行する, Then Firebase のリアクション、閲覧数、ブックマークとの互換性を検討できる形で ID を保持できる。
- [ ] Given 既存 URL があるとき, When slug またはパスが変わる, Then リダイレクトまたは互換 slug を検討できる。
- [ ] Given 移行対象外のプロフィール・プロジェクトがあるとき, When 移行を行う, Then それらは microCMS 管理のまま維持される。
- [ ] Given 移行中に不正データが見つかったとき, When 変換処理が失敗する, Then エラー内容を記録し、公開記事として誤投入しない。

#### Notes

- Requirement references: FR-2, NFR-2, NFR-3
- Security considerations: SECURITY-05, SECURITY-13, SECURITY-15
- INVEST: Negotiable, Valuable, Estimable, Testable

## Epic E: 既存機能との共存

### US-7: microCMS と Git 管理記事を責務分離して共存できる

As a サイト運用者 / 開発者,  
I want ブログ記事とプロフィール / プロジェクトの取得責務を分離できる,  
so that ブログ記事だけを Git 管理へ移行しても既存コンテンツを維持できる。

#### Acceptance Criteria

- [ ] Given ブログ記事取得処理を追加するとき, When プロフィールやプロジェクトを取得する, Then 既存の microCMS 取得処理を維持できる。
- [ ] Given 記事取得層を変更するとき, When ブログ一覧、記事詳細、カテゴリ、検索、RSS、sitemap を生成する, Then 新しい記事取得層を一貫して利用できる。
- [ ] Given 移行期間中であるとき, When microCMS と Markdown / MDX の両方に記事が存在する, Then 重複公開を防ぐ方針を定義できる。
- [ ] Given 将来 microCMS を完全撤退する場合, When 記事以外のコンテンツ移行を検討する, Then 現在の分離設計を拡張できる。

#### Notes

- Requirement references: FR-1, FR-2, NFR-2
- Security considerations: SECURITY-11
- INVEST: Independent, Valuable, Estimable

### US-8: 将来の画像管理方式を妨げずにアイキャッチを扱える

As a 著者,  
I want 初回 MVP では画像管理を固定しすぎずにアイキャッチを扱える,  
so that 本文執筆体験を先に改善し、画像管理は後から選べる。

#### Acceptance Criteria

- [ ] Given 記事 frontmatter に eyecatch を指定するとき, When 既存 microCMS アセット URL を使う, Then 記事カードと記事詳細で表示できる。
- [ ] Given 将来 `public/` 配下へ画像を移すとき, When eyecatch の参照形式を変更する, Then 記事データ構造を大きく壊さず対応できる。
- [ ] Given 外部画像サービスを採用するとき, When eyecatch の参照先が外部 URL になる, Then セキュリティとパフォーマンスの確認項目を追加できる。
- [ ] Given 画像管理方式が未確定のとき, When 初回 MVP を実装する, Then 本文執筆・プレビュー・公開フローの実装をブロックしない。

#### Notes

- Requirement references: FR-7, NFR-1, NFR-5
- Security considerations: SECURITY-09, SECURITY-13
- INVEST: Negotiable, Valuable, Small

### US-9: 記事 ID と既存動的データの互換性を維持できる

As a サイト運用者 / 開発者,  
I want Git 管理記事でも既存の記事 ID と動的データの対応を維持できる,  
so that リアクション、閲覧数、ブックマークが移行後も破綻しない。

#### Acceptance Criteria

- [ ] Given 既存 microCMS 記事を移行するとき, When Markdown / MDX frontmatter を作る, Then 既存 ID を保持または対応表で管理できる。
- [ ] Given 記事詳細ページを表示するとき, When リアクションや閲覧数を取得する, Then 既存 Firebase データと対応する記事 ID を使える。
- [ ] Given 新規記事を作成するとき, When ID または slug を決める, Then 将来の URL と Firebase データのキーとして安定した値を使える。
- [ ] Given ID 互換性に問題があるとき, When ビルドまたはテストを実行する, Then 重複 ID や欠落 ID を検出できる。

#### Notes

- Requirement references: FR-2, Technical Constraints, NFR-3, NFR-6
- Security considerations: SECURITY-13, SECURITY-15
- INVEST: Independent, Valuable, Testable

## Epic F: セキュリティと運用安全性

### US-10: 認証・シークレット管理のセキュリティ条件を満たせる

As a サイト運用者 / 開発者,  
I want 記事管理や将来の管理 UI に必要な認証・シークレット管理を安全に扱える,  
so that 執筆環境の改善がセキュリティリスクにならない。

#### Acceptance Criteria

- [ ] Given 管理 UI を将来追加するとき, When GitHub OAuth などの認証を使う, Then サーバー側でトークン検証と認可確認を行う設計にできる。
- [ ] Given GitHub / Vercel / 外部ストレージ連携を使うとき, When トークンを設定する, Then リポジトリにコミットせず、環境変数またはシークレット管理に限定できる。
- [ ] Given 記事変更操作を行うとき, When 認可されていないユーザーがアクセスする, Then 操作を拒否できる。
- [ ] Given 認証・認可エラーが発生したとき, When エラーを表示またはログ出力する, Then 秘密情報や内部詳細を露出しない。
- [ ] Given PR ベース公開を使うとき, When 記事変更がレビューされる, Then Git 履歴と PR 履歴で変更者と変更内容を追跡できる。

#### Notes

- Requirement references: NFR-4
- Security considerations: SECURITY-06, SECURITY-08, SECURITY-12, SECURITY-13, SECURITY-15
- INVEST: Valuable, Testable

## INVEST Review

| Story | Independent | Negotiable | Valuable | Estimable | Small | Testable | Notes |
|---|---|---|---|---|---|---|---|
| US-1 | Yes | Yes | Yes | Yes | Yes | Yes | Markdown / MDX 基盤の最小単位 |
| US-2 | Yes | Yes | Yes | Yes | Yes | Yes | バリデーション単体で検証可能 |
| US-3 | Yes | Yes | Yes | Yes | Yes | Yes | プレビュー導線として独立 |
| US-4 | Yes | Yes | Yes | Yes | Yes | Yes | PR 公開フローとして独立 |
| US-5 | Yes | Yes | Yes | Yes | Yes | Yes | 下書き除外は安全性の中核 |
| US-6 | Yes | Yes | Yes | Yes | Medium | Yes | 移行はやや大きいが独立エピック |
| US-7 | Yes | Yes | Yes | Yes | Yes | Yes | 取得層分離として検証可能 |
| US-8 | Yes | Yes | Yes | Yes | Yes | Partial | 画像管理の詳細は後続設計で補完 |
| US-9 | Yes | Yes | Yes | Yes | Yes | Yes | ID 互換性はテスト可能 |
| US-10 | Yes | Yes | Yes | Yes | Yes | Yes | セキュリティ条件として独立 |

## Persona Mapping

| Persona | Stories |
|---|---|
| 著者 | US-1, US-3, US-4, US-5, US-8 |
| サイト運用者 / 開発者 | US-2, US-4, US-5, US-6, US-7, US-9, US-10 |
| 読者 | US-3, US-5, US-6, US-9 |
