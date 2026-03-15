# Component Methods

## ThemeToggle.tsx

### Methods
```typescript
// テーマの初期状態を取得
getInitialTheme(): 'light' | 'dark'
// → localStorage → prefers-color-scheme → 'light' の順で判定

// テーマを切り替え
toggleTheme(): void
// → html.classList.toggle('dark')
// → localStorage.setItem('theme', newTheme)
// → state更新

// システムテーマ変更の監視
useSystemThemeListener(): void
// → matchMedia('(prefers-color-scheme: dark)').addEventListener
// → localStorage に手動選択がない場合のみ自動追従
```

### Props
```typescript
// なし（自己完結型コンポーネント）
```

---

## ThemeScript (BaseLayout.astro inline)

### Logic
```typescript
// FOUC防止：DOM解析前に同期実行
(function() {
  const stored = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = stored || (prefersDark ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', theme === 'dark');
})();
```

---

## TabNavigation.astro

### Props
```typescript
interface Props {
  activeTab: string;       // 現在アクティブなタブ ('latest' | 'popular' | category名)
  categories: string[];    // 利用可能なカテゴリ一覧
}
```

### Rendering Logic
- activeTab に基づいてハイライト表示
- カテゴリタブはドロップダウンまたは横スクロールで表示
- タブクリックで `?tab={value}` クエリパラメータ更新

---

## BookmarkButton.tsx

### Methods
```typescript
// ブックマーク状態を取得
fetchBookmarkStatus(blogId: string, userId: string): Promise<boolean>
// → GET /api/bookmarks/{blogId}?userId={userId}

// ブックマークをトグル
toggleBookmark(blogId: string, userId: string): Promise<{ success: boolean, action: string }>
// → POST /api/bookmarks/{blogId} { userId, action: 'toggle' }

// ブックマークアニメーション
animateBookmark(isBookmarked: boolean): void
// → アイコンの塗りつぶし + スケールアニメーション
```

### Props
```typescript
interface BookmarkButtonProps {
  blogId: string;
  title?: string;  // ブックマーク保存時のメタデータ用
}
```

---

## Bookmarks API (src/pages/api/bookmarks/[blogId].ts)

### GET Handler
```typescript
// ブックマーク状態取得
GET({ params, url }): Promise<Response>
// Input: blogId (path), userId (query)
// Output: { isBookmarked: boolean, bookmarkCount: number }
```

### POST Handler
```typescript
// ブックマーク追加/削除
POST({ request, params }): Promise<Response>
// Input: blogId (path), { userId, action: 'toggle' | 'add' | 'remove' } (body)
// Output: { success: boolean, action: 'added' | 'removed', bookmarkCount: number }
// Logic: リアクションAPIと同パターン（重複チェック + トランザクション）
```

---

## ArticleCard.astro (Modified)

### Props (Updated)
```typescript
interface Props {
  id: string;
  title: string;
  description: string;
  date: string;
  imageUrl: string;
  imageUrlList?: string;
  category: string[];
  content?: string;
  showReadingTime?: boolean;
  // 新規追加
  reactionCount?: number;    // 総リアクション数
  viewCount?: number;        // 閲覧数
  bookmarkCount?: number;    // ブックマーク数
}
```

---

## HeroSlideshowReact.tsx (Modified → HeroRecommendations.tsx)

### Renamed/Simplified
```typescript
interface HeroRecommendationsProps {
  posts: Blog[];  // 人気記事（最大3件）
}

// 簡素化：自動スライドショー → 静的カード群
// 小さめの推薦カード（サムネイル + タイトル + カテゴリ）
// テーマ対応スタイル
```

---

## Header.astro (Modified)

### Updated Structure
```
+--------------------------------------------------+
| Logo        Nav Links           ThemeToggle  Menu |
+--------------------------------------------------+
```
- ThemeToggle: React Island (`client:load`)
- Nav Links: 簡素化（ホーム、ブログ、カテゴリ、プロフィール）
- Menu: モバイルハンバーガーメニュー（テーマ対応）
