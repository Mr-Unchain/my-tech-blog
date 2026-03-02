# ブログ記事ページ デザイン改善計画

Zenn のコンテンツ CSS（`zenn-content-css`）を参考に、本文の可読性・表・コードブロックの見やすさを大幅に向上させる。

---

## 現状の課題

### 1. 本文テイポグラフィ
- `line-height: 1.8〜2.0` は広すぎて段落の塊感が薄い（Zenn は `1.9` だが、段落間マージンとのバランスが良い）
- 段落間マージン（`p + p`）が Tailwind prose デフォルト任せで、明示的に制御されていない
- 見出し（h2/h3）のスタイルが色と太字のみで、Zenn のような `border-bottom` による区切り感がない
- 見出しのフォントサイズが明示的に設定されておらず、prose-lg デフォルト任せ

### 2. コードブロック
- `CodeBlockEnhancer` で既にコピーボタン・言語ラベルは実装済み（良い状態）
- インラインコードの `font-size: 0.95em` が大きすぎる（Zenn は `0.85em`）
- インラインコードの背景色がダークテーマで目立たない（`slate-700/50` → もう少し明度差が必要）
- コードブロック内の `font-family` に `JetBrains Mono` が未適用（Tailwind config で定義済みなのに活用されていない）

### 3. テーブル
- 最も改善が必要な箇所。現在は `prose-table:rounded-lg prose-table:border prose-table:border-slate-600` のみ
- ヘッダー行（`th`）の背景色が未設定で、本体（`td`）との区別がつかない
- セル内のパディングが未指定
- テーブルの `overflow-x: auto` が未設定（横スクロール対応がない）
- 行間の視認性が低い（ストライプや明確なボーダーがない）

### 4. ブロック引用
- 現在は `italic` + シアン色テキストで、やや主張が強すぎる
- Zenn のようなシンプルな左ボーダー + 控えめな色の方が読みやすい

### 5. リスト
- マーカー色が本文色と同じで、構造が把握しづらい
- Zenn のように `marker` 色を `subtle` にすると可読性が上がる

---

## 改善計画

### Phase 1: テーブルスタイルの刷新（最優先）

**対象ファイル**: `src/styles/main.scss`（`.article-content` 内）

Zenn の `_content.scss` のテーブルスタイルを参考に以下を実装:

```scss
// .article-content 内に追加
table {
  margin: 1.5rem 0;
  width: auto;
  border-collapse: collapse;
  font-size: 0.95em;
  line-height: 1.5;
  display: block;
  overflow-x: auto;        // 横長テーブルのスクロール対応
  -webkit-overflow-scrolling: touch;

  th,
  td {
    padding: 0.6rem 0.8rem;
    border: solid 1px #334155; // slate-700
  }

  th {
    font-weight: 700;
    background: rgba(30, 41, 59, 0.8); // slate-800/80 - ヘッダー背景
    color: #e2e8f0;                     // slate-200
    white-space: nowrap;
  }

  td {
    background: rgba(15, 23, 42, 0.4); // slate-900/40 - 本体背景
  }

  // ストライプ（偶数行）- 視認性向上
  tbody tr:nth-child(even) td {
    background: rgba(30, 41, 59, 0.3); // slate-800/30
  }
}
```

### Phase 2: 見出しスタイルの改善

**対象ファイル**: `src/styles/main.scss`（`.article-content` 内）

Zenn の見出しスタイルを参考に、`border-bottom` で区切り感を出す:

```scss
h2 {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: solid 1px #334155; // slate-700（控えめなボーダー）
  margin-top: 2.3em;
  margin-bottom: 1.1rem;
}

h3 {
  font-size: 1.3em;
  margin-top: 2.0em;
  margin-bottom: 0.8rem;
}

h4 {
  font-size: 1.1em;
  margin-top: 1.8em;
  margin-bottom: 0.6rem;
}
```

### Phase 3: インラインコード・コードブロックの調整

**対象ファイル**: `src/styles/main.scss`（`.article-content` 内）

```scss
// インラインコード
code:not(pre code) {
  padding: 0.2em 0.4em;
  margin: 0 0.1em;
  background: rgba(51, 65, 85, 0.6); // slate-700/60 - もう少し見やすく
  font-size: 0.85em;                  // Zenn と同じサイズ
  border-radius: 4px;
  font-family: theme('fontFamily.mono'); // JetBrains Mono を適用
  vertical-align: 0.08em;             // ベースライン微調整
}

// コードブロック
pre,
pre code {
  font-family: theme('fontFamily.mono'); // JetBrains Mono を適用
}
```

### Phase 4: ブロック引用の調整

**対象ファイル**: `src/styles/main.scss`（`.article-content` 内）

Zenn のようなシンプルで控えめなスタイルに変更:

```scss
blockquote {
  font-size: 0.97em;
  font-style: normal;      // italic を解除（日本語の italic は読みづらい）
  margin: 1.4rem 0;
  border-left: solid 3px #475569;  // slate-600 - 控えめなボーダー
  padding: 0.3em 0 0.3em 0.8em;
  color: #94a3b8;                   // slate-400 - subtle
  background: transparent;          // 背景色を削除してシンプルに
  border-radius: 0;                 // 角丸を削除
}
```

### Phase 5: 段落・リストの微調整

**対象ファイル**: `src/styles/main.scss`（`.article-content` 内）

```scss
// 段落間マージン
p + p {
  margin-top: 1.5em;
}

// リストのマーカー色を subtle に
ul > li::marker {
  color: #64748b; // slate-500
  font-size: 1.1em;
}

ol > li::marker {
  color: #64748b; // slate-500
  font-weight: 600;
}

// ネストリストの余白
ul ul,
ol ol,
ul ol,
ol ul {
  margin-top: 0.3rem;
  margin-bottom: 0.3rem;
}
```

### Phase 6: Tailwind prose オーバーライドの整理

**対象ファイル**: `src/styles/main.scss`

`.article-content` の `@apply` 行に含まれる prose ユーティリティのうち、Phase 1〜5 で SCSS で直接指定するものと重複するクラスを整理する。具体的には:

- `prose-blockquote:*` 関連 → Phase 4 の SCSS に置き換え
- `prose-table:*` 関連 → Phase 1 の SCSS に置き換え
- `prose-code:*` 関連 → Phase 3 の SCSS に置き換え

これにより `!important` の乱用を減らし、スタイルの管理を一元化する。

---

## 変更対象ファイル一覧

| ファイル | 変更内容 |
|---------|---------|
| `src/styles/main.scss` | `.article-content` ブロックの大幅改修（Phase 1〜6 すべて） |

※ HTML テンプレート（`[id].astro`）やコンポーネントの変更は不要。CSS のみの変更で完結する。

---

## 実装順序と理由

1. **Phase 1（テーブル）** → 現状最も見づらい要素。改善効果が大きい
2. **Phase 2（見出し）** → 記事の構造把握に直結。border-bottom の追加だけで大きく改善
3. **Phase 3（コード）** → 技術ブログとして重要。JetBrains Mono の適用でプロ感が出る
4. **Phase 4（引用）** → 日本語 italic の解消で即座に読みやすくなる
5. **Phase 5（段落・リスト）** → 細かい調整だが全体の印象を引き締める
6. **Phase 6（整理）** → リファクタリング。機能変更なし

---

## 設計方針

- **Zenn のスタイルを「参考」にするが、コピーではない**: ダークテーマに合わせた色調整、既存のシアンアクセントカラーとの調和を重視
- **CSS のみの変更**: HTML テンプレートやコンポーネントの変更は行わない
- **`!important` の削減**: Phase 6 で prose ユーティリティとの重複を整理し、保守性を向上
- **レスポンシブ対応**: テーブルの `overflow-x: auto` など、モバイルでの表示を考慮
- **既存の CodeBlockEnhancer との共存**: コピーボタン・言語ラベルの機能はそのまま維持
