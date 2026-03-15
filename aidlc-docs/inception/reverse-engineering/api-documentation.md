# API Documentation

## REST APIs

### Reactions API
#### GET /api/reactions/{blogId}
- **Method**: GET
- **Path**: /api/reactions/{blogId}
- **Purpose**: 記事のリアクション状態を取得
- **Request**:
  - Path: `blogId` (string, required) - 記事ID
  - Query: `userId` (string, optional) - ユーザーID（ユーザー固有のリアクション状態取得用）
- **Response** (200):
  ```json
  {
    "reactionCounts": {
      "like": 5,
      "helpful": 3,
      "insightful": 1,
      "inspiring": 2
    },
    "userReactions": ["like", "helpful"],
    "totalReactions": 11,
    "lastUpdated": "2026-03-13T00:00:00.000Z"
  }
  ```
- **Error Response** (400): `{ "error": "blogId is required" }`
- **Fallback** (Firebase未初期化時): カウント0で正常レスポンス返却

#### POST /api/reactions/{blogId}
- **Method**: POST
- **Path**: /api/reactions/{blogId}
- **Purpose**: リアクションの追加/削除/トグル
- **Request**:
  - Path: `blogId` (string, required)
  - Body:
    ```json
    {
      "userId": "session_xxx",
      "reactionType": "like",
      "action": "add|remove|toggle"
    }
    ```
  - `action` 省略時はトグル動作（デフォルト）
- **Response** (200):
  ```json
  {
    "success": true,
    "action": "added|removed|already_reacted|not_reacted",
    "reactionId": "docId",
    "reactionType": "like"
  }
  ```
- **Validation**: reactionType は "like", "helpful", "insightful", "inspiring" のみ

### Webhook API
#### POST /api/webhook/microcms-sync
- **Method**: POST
- **Path**: /api/webhook/microcms-sync
- **Purpose**: microCMS記事削除時のFirebaseデータクリーンアップ
- **Request**:
  - Headers:
    - `Content-Type`: application/json (required)
    - `x-microcms-signature`: HMAC-SHA256署名 (optional but recommended)
  - Body:
    ```json
    {
      "service": "service-name",
      "api": "blogs",
      "id": "article-id",
      "type": "delete",
      "contents": { "old": {} }
    }
    ```
- **Response** (200):
  ```json
  {
    "success": true,
    "message": "Successfully deleted Firebase document for article: xxx",
    "articleId": "xxx",
    "action": "deleted|not_found"
  }
  ```
- **Security**: HMAC-SHA256署名検証（MICROCMS_WEBHOOK_SECRET設定時）
- **Processing**: `api === "blogs"` かつ `type === "delete"` のみ処理

#### GET /api/webhook/microcms-sync
- **Method**: GET
- **Purpose**: エンドポイント動作確認用
- **Response** (200):
  ```json
  {
    "message": "microCMS Sync Webhook Endpoint",
    "status": "active",
    "timestamp": "2026-03-13T00:00:00.000Z",
    "firebase": "connected|not_connected"
  }
  ```

### Bookmarks API (プレースホルダー)
#### /api/bookmarks/{blogId}
- **Status**: 実装途中 / プレースホルダー

## Internal APIs

### microCMS Client (src/lib/microcms.ts)
- `getBlogs(queries?)` - ブログ一覧取得（deepCopy + カテゴリ正規化付き）
- `getBlogDetail(contentId, queries?)` - ブログ詳細取得
- `getProfile(queries?)` - プロフィール情報取得
- `getProjects(queries?)` - プロジェクト一覧取得（deepCopy + techStack正規化付き）

### Firebase Utilities (src/lib/utils.ts)
- `generateSessionId()` - セッションID生成（localStorage永続化、SSR安全）
- `normalizeToArray(value)` - 配列正規化ヘルパー
- `deepCopy(data)` - ディープコピー（JSON.parse/stringify）

### Utility Functions (src/utils/)
- `getRelatedPosts(currentPost, allPosts)` - 関連記事推薦
- `calculateReadingTime(content)` - 読了時間計算（日英対応）
- `getCategoryBadgeClasses(category)` - カテゴリバッジのTailwindクラス生成
- `getCategoryIconClass(category)` - カテゴリアイコンクラス生成

## Data Models

### Blog (microCMS)
- **Fields**: id, title, description, content (HTML), eyecatch (MicroCMSImage), category (string[])
- **Relationships**: Category (string array), Profile (author)
- **Validation**: カテゴリは常に配列に正規化

### Profile (microCMS)
- **Fields**: name, description, avatar, xUrl?, githubUrl?, portfolio_introduction?, skills?, work_history?, contact_email?
- **Relationships**: なし（シングルトン）

### Project (microCMS)
- **Fields**: id, title, summary?, role?, techStack (string[])?, achievements?, period?, link?, thumbnail?
- **Relationships**: なし

### BlogStats (Firestore)
- **Fields**: blogId, bookmarkCount, viewCount, reactionCounts ({like, helpful, insightful, inspiring}), lastUpdated
- **Relationships**: Blog (blogId)

### Reaction (Firestore)
- **Fields**: userId, blogId, reactionType ('like'|'helpful'|'insightful'|'inspiring'), createdAt
- **Relationships**: Blog (blogId), User (userId)

### Bookmark (Firestore)
- **Fields**: userId, blogId, createdAt, metadata? ({title, category[], eyecatch})
- **Relationships**: Blog (blogId), User (userId)
- **Status**: 型定義のみ。API実装途中
