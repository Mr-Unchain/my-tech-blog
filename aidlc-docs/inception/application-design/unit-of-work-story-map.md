# Unit of Work - Requirements Map

> **Note**: User Stories ステージはスキップされたため、本ドキュメントでは Requirements（FR/NFR/TR）を直接ユニットにマッピングします。

---

## Requirements → Unit Mapping

### Functional Requirements

| Requirement ID | Requirement | Unit | Coverage |
|---------------|-------------|------|----------|
| FR-1.1 | ライト/ダークテーマ切替 | **Unit 1** | Full |
| FR-1.2 | クリーンなレイアウト構成 | **Unit 2** | Full |
| FR-1.3 | ナビゲーション改善（タブナビ） | **Unit 2** | Full |
| FR-2.1 | Zenn風カードデザイン | **Unit 3** | Full |
| FR-2.2 | メタ情報の充実（統計表示） | **Unit 3** | Full |
| FR-3.1 | 記事本文の読みやすさ向上 | **Unit 4** | Full |
| FR-3.2 | 目次のUX改善 | **Unit 4** | Full |
| FR-3.3 | リアクション/エンゲージメントUI改善 | **Unit 4** | Full |
| FR-4.1 | ブックマークAPI実装 | **Unit 5** | Full |
| FR-4.2 | ブックマークUI | **Unit 5** | Full |
| FR-5.1 | 検索UXの改善 | **Unit 2** | Partial — TabNavigation でカテゴリフィルタリングを提供。全文インクリメンタルサーチは将来の拡張 |
| FR-6.1 | ヒーローセクションの再設計 | **Unit 3** | Full |

### Non-Functional Requirements

| Requirement ID | Requirement | Units | Coverage |
|---------------|-------------|-------|----------|
| NFR-1 | パフォーマンス（CWV, FOUC防止） | **Unit 1**, **Unit 3** | Full — Unit 1 で FOUC 防止、Unit 3 で getBulkArticleStats 最適化 |
| NFR-2 | アクセシビリティ（WCAG 2.1 AA） | **All Units** | Full — 各ユニットでコントラスト比・キーボードナビ確保 |
| NFR-3 | SEO | **Unit 2**, **Unit 3**, **Unit 4** | Full — レイアウト変更時に構造化データ・OGP 維持 |
| NFR-4 | レスポンシブデザイン | **All Units** | Full — 各ユニットでモバイルファースト設計 |
| NFR-5 | ブラウザ対応 | **All Units** | Full — 標準的な CSS/JS のみ使用 |

### Technical Requirements

| Requirement ID | Requirement | Unit | Coverage |
|---------------|-------------|------|----------|
| TR-1.1 | Firebase null チェック強化 | **Unit 6** | Full |
| TR-1.2 | Bookmarks API 完成 | **Unit 5** | Full |
| TR-1.3 | インラインスクリプト分離 | **Unit 6** | Full |
| TR-1.4 | Webhook署名検証必須化 | **Unit 6** | Full |
| TR-2 | Tailwind CSS ダークモード設定 | **Unit 1** | Full |
| TR-3 | テーマ管理ロジック | **Unit 1** | Full |

---

## Unit → Requirements Mapping (Reverse)

### Unit 1: テーマ基盤
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.1 | ライト/ダークテーマ切替 | **High** |
| TR-2 | Tailwind CSS ダークモード設定 | **High** |
| TR-3 | テーマ管理ロジック | **High** |
| NFR-1 | FOUC防止 | **High** |

### Unit 2: レイアウト・ナビゲーション
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-1.2 | クリーンなレイアウト構成 | **High** |
| FR-1.3 | ナビゲーション改善 | **Medium** |
| FR-5.1 | 検索UX改善（部分対応） | **Medium** |

### Unit 3: 記事カード・ホームページ
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-2.1 | Zenn風カードデザイン | **High** |
| FR-2.2 | メタ情報の充実 | **High** |
| FR-6.1 | ヒーローセクション再設計 | **Medium** |

### Unit 4: 記事詳細ページ
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-3.1 | 記事本文の読みやすさ向上 | **High** |
| FR-3.2 | 目次のUX改善 | **Low** |
| FR-3.3 | リアクション/エンゲージメントUI改善 | **Medium** |

### Unit 5: ブックマーク機能
| ID | Requirement | Priority |
|----|-------------|----------|
| FR-4.1 | ブックマークAPI実装 | **Medium** |
| FR-4.2 | ブックマークUI | **Medium** |
| TR-1.2 | Bookmarks API 完成 | **High** |

### Unit 6: 技術的負債解消
| ID | Requirement | Priority |
|----|-------------|----------|
| TR-1.1 | Firebase null チェック強化 | **High** |
| TR-1.3 | インラインスクリプト分離 | **High** |
| TR-1.4 | Webhook署名検証必須化 | **High** |

---

## Coverage Analysis

### Full Coverage (11/12 FR)
- FR-1.1, FR-1.2, FR-1.3, FR-2.1, FR-2.2, FR-3.1, FR-3.2, FR-3.3, FR-4.1, FR-4.2, FR-6.1

### Partial Coverage (1/12 FR)
- **FR-5.1 (検索UX改善)**: TabNavigation でカテゴリフィルタリングを提供するが、全文インクリメンタルサーチは今回のスコープ外。将来の拡張として検討。

### Full NFR/TR Coverage
- NFR-1〜5: 全ユニットにわたって対応
- TR-1.1〜1.4, TR-2, TR-3: 全て対応ユニットが特定済み

### Uncovered Requirements
- なし（FR-5.1 は部分対応、残りは将来の拡張として許容）
