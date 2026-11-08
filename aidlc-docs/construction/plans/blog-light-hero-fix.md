# ブログ一覧のライトテーマ背景修正

## 範囲と承認

ユーザーが原因説明後に「修正して別途PR作成しておいて」と明示的に依頼した修正。
既存の Markdown 移行 PR #32 と独立させ、main から分岐する。
小規模な既存 UI 修正のため、追加の設計・インフラ・依存関係変更は行わない。
既存の進行中ワークフローの状態は変更しない。

## 実行計画

- [x] 1. main と既存テーマ実装を確認し、独立した worktree を作成する。
- [x] 2. `src/pages/blog/index.astro` の暗い重ね背景をダークテーマ限定にする。ライトテーマの既存の薄い背景グラデーションは維持する。
- [x] 3. `e2e/blog-theme.spec.ts` にデスクトップ／モバイル、初期テーマ、切り替え、リロード後の維持の回帰テストを追加する。
- [x] 4. ブラウザ検証・Lint・既存テスト・本番ビルドを実行し、結果を記録する。
- [x] 5. 差分と機密情報を確認し、main 向けの別PR作成用の変更を確定する。PR #32 は変更しない。

## 検証手順

- `npm ci`（既存ロックファイルから導入）
- `npx playwright test e2e/blog-theme.spec.ts --project=chromium`（標準ポートは4321）
- `npm run lint`
- `npm run test -- --run`
- `npm run build`

既存サーバーと混在させないため、ローカル検証では Git 管理外の設定で専用ポート4322とインストール済みChromeを使用する。mainにはCMS設定なしでSidebarがnull参照になる既存問題があるため、元の作業ディレクトリにあるDevelopment設定をNodeのenv-fileパーサーで検証プロセスへ継承する。認証情報のファイルコピー・表示・コミットはしない。

## 検証結果（2026-11-08 JST）

- Chrome: PC 1440px／スマホ390px、初期ライト／ダークの4ケース成功。切り替えとリロード後のテーマ保持も確認。
- 修正後のライト／ダークの背景をスクリーンショットで目視確認。`../blog-light-hero/light.png`、`../blog-light-hero/dark.png`。
- ESLint、既存26件の単体テスト、本番ビルド成功。
- 追加の `npx tsc --noEmit` は既存の `src/pages/api/sync/firebase-cleanup.ts:48` の TS7006 で失敗。このファイルは origin/main と同一で今回の変更対象外。
- CMS未設定での初回検証は既存Sidebarのnull参照で失敗。既存Development設定を正しく読み込んだ最終実行では4ケースすべて成功。モバイルとPCで存在するテーマ切替ボタンは可視のものだけを操作する。
- PR #32 の head は `e1a921d02a9d59f05b4098017b7e9f88a2732a96` のまま。

## Security Compliance

- SECURITY-10: 依存追加・ロックファイル変更なし。
- SECURITY-13: mainとの差分を限定し、秘密情報・下書きは含めない。
- その他 SECURITY-01〜09、11〜12、14〜15: この変更ではストレージ・API・認証・ネットワーク・例外処理を変更しないため N/A。
