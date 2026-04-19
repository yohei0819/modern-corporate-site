# API 仕様書

Base URL: `/api`

認証: Laravel Sanctum（Cookie ベース SPA 認証）

---

## 認証

| Method | Endpoint  | 認証 | 説明                     |
| ------ | --------- | ---- | ------------------------ |
| POST   | `/login`  | 不要 | ログイン                 |
| POST   | `/logout` | 必要 | ログアウト               |
| GET    | `/me`     | 必要 | ログインユーザー情報取得 |

### POST /login

```json
// Request
{
  "email": "admin@example.com",
  "password": "password"
}

// Response 200
{
  "user": {
    "id": 1,
    "name": "管理者",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

---

## 求人（Jobs）

| Method | Endpoint       | 認証 | 説明                                           |
| ------ | -------------- | ---- | ---------------------------------------------- |
| GET    | `/jobs`        | 不要 | 求人一覧（公開側 / ステータス=published のみ） |
| GET    | `/jobs/{slug}` | 不要 | 求人詳細（公開側 / slug で取得）               |
| POST   | `/jobs`        | 必要 | 求人作成                                       |
| PUT    | `/jobs/{id}`   | 必要 | 求人更新                                       |
| DELETE | `/jobs/{id}`   | 必要 | 求人削除                                       |

### GET /jobs

```
Query: ?employment_type=full-time&category=engineer&location=tokyo&page=1
```

```json
// Response 200
{
  "data": [
    {
      "id": 1,
      "title": "フロントエンドエンジニア",
      "slug": "frontend-engineer",
      "employment_type": "full-time",
      "location": "東京",
      "salary_text": "年収 400〜600 万円",
      "summary": "React / Next.js ...",
      "status": "published",
      "published_at": "2026-03-01T00:00:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 3,
    "per_page": 12,
    "total": 30
  }
}
```

### POST /jobs

```json
// Request
{
  "title": "フロントエンドエンジニア",
  "slug": "frontend-engineer",
  "employment_type": "full-time",
  "location": "東京",
  "salary_text": "年収 400〜600 万円",
  "summary": "概要テキスト",
  "description": "詳細テキスト",
  "requirements": "必須スキル",
  "status": "draft",
  "sort_order": 1,
  "published_at": null
}

// Response 201
{
  "data": { ... }
}
```

---

## 社員（Members）

| Method | Endpoint          | 認証 | 説明                                           |
| ------ | ----------------- | ---- | ---------------------------------------------- |
| GET    | `/members`        | 不要 | 社員一覧（公開側 / ステータス=published のみ） |
| GET    | `/members/{slug}` | 不要 | 社員詳細（公開側）                             |
| POST   | `/members`        | 必要 | 社員作成（multipart/form-data）                |
| PUT    | `/members/{id}`   | 必要 | 社員更新                                       |
| DELETE | `/members/{id}`   | 必要 | 社員削除                                       |

### POST /members

```
Content-Type: multipart/form-data

Fields:
  name: string (required)
  slug: string (required, unique)
  department: string (required)
  position: string (required)
  catch_copy: string (required)
  message: text (required)
  profile_image: file (required, max:2MB, mimes:jpg,png,webp)
  status: "draft" | "published"
  sort_order: integer
```

---

## お知らせ（News）

| Method | Endpoint       | 認証 | 説明                                                     |
| ------ | -------------- | ---- | -------------------------------------------------------- |
| GET    | `/news`        | 不要 | お知らせ一覧（公開側 / published + published_at <= now） |
| GET    | `/news/{slug}` | 不要 | お知らせ詳細（公開側）                                   |
| POST   | `/news`        | 必要 | お知らせ作成                                             |
| PUT    | `/news/{id}`   | 必要 | お知らせ更新                                             |
| DELETE | `/news/{id}`   | 必要 | お知らせ削除                                             |

### POST /news

```json
// Request
{
  "title": "新オフィス移転のお知らせ",
  "slug": "new-office-2026",
  "category": "info",
  "excerpt": "2026年4月より...",
  "body": "<p>本文HTML</p>",
  "thumbnail": null,
  "status": "draft",
  "published_at": "2026-04-01T00:00:00Z"
}
```

---

## 応募（Applications）

| Method | Endpoint                          | 認証 | 説明                           |
| ------ | --------------------------------- | ---- | ------------------------------ |
| POST   | `/applications`                   | 不要 | 応募送信（公開側 / multipart） |
| GET    | `/admin/applications`             | 必要 | 応募一覧（管理側）             |
| GET    | `/admin/applications/{id}`        | 必要 | 応募詳細（管理側）             |
| PUT    | `/admin/applications/{id}/status` | 必要 | ステータス変更                 |
| GET    | `/admin/applications/export`      | 必要 | CSV エクスポート               |

### POST /applications

```
Content-Type: multipart/form-data

Fields:
  job_posting_id: integer (required, exists:job_postings,id)
  name: string (required, max:100)
  email: email (required)
  phone: string (required)
  age: integer (nullable, min:18, max:65)
  message: text (nullable)
  resume: file (nullable, max:5MB, mimes:pdf,doc,docx)
  portfolio_url: url (nullable)
```

### PUT /admin/applications/{id}/status

```json
// Request
{
  "status": "interviewing",
  "admin_note": "4/10 一次面接予定"
}

// ステータス値: unread / reviewing / interviewing / rejected / accepted
```

---

## 問い合わせ（Inquiries）

| Method | Endpoint                | 認証 | 説明                     |
| ------ | ----------------------- | ---- | ------------------------ |
| POST   | `/inquiries`            | 不要 | 問い合わせ送信（公開側） |
| GET    | `/admin/inquiries`      | 必要 | 問い合わせ一覧（管理側） |
| GET    | `/admin/inquiries/{id}` | 必要 | 問い合わせ詳細（管理側） |
| PUT    | `/admin/inquiries/{id}` | 必要 | 対応済み切替 / メモ保存  |

### POST /inquiries

```json
// Request
{
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "company": "株式会社テスト",
  "message": "お問い合わせ内容"
}
```

---

## メディア（Media）

| Method | Endpoint            | 認証 | 説明                          |
| ------ | ------------------- | ---- | ----------------------------- |
| POST   | `/admin/media`      | 必要 | 画像アップロード（multipart） |
| GET    | `/admin/media`      | 必要 | 画像一覧                      |
| DELETE | `/admin/media/{id}` | 必要 | 画像削除                      |

### POST /admin/media

```
Content-Type: multipart/form-data

Fields:
  file: file (required, max:5MB, mimes:jpg,png,gif,webp,svg)
```

```json
// Response 201
{
  "data": {
    "id": 1,
    "file_name": "hero-image.jpg",
    "file_path": "/storage/media/hero-image.jpg",
    "mime_type": "image/jpeg",
    "size": 204800,
    "url": "http://localhost:8000/storage/media/hero-image.jpg",
    "created_at": "2026-03-24T10:00:00Z"
  }
}
```

---

## 共通レスポンス

### バリデーションエラー（422）

```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["メールアドレスは必須です。"],
    "name": ["名前は必須です。"]
  }
}
```

### 認証エラー（401）

```json
{
  "message": "Unauthenticated."
}
```

### 404

```json
{
  "message": "Not Found."
}
```
