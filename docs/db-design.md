# DB 設計書

RDBMS: MySQL 8.x（開発時は SQLite でも可）

---

## ER 概要

```
users ──< (管理者)
jobs ──< applications
members
news
inquiries
media
```

---

## テーブル定義

### users

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | NOT NULL | 管理者名 |
| email | VARCHAR(255) | NOT NULL, UNIQUE | ログインメール |
| password | VARCHAR(255) | NOT NULL | bcrypt ハッシュ |
| role | ENUM('admin','editor') | NOT NULL, DEFAULT 'admin' | 権限（拡張用） |
| remember_token | VARCHAR(100) | NULLABLE | |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

### jobs

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| title | VARCHAR(200) | NOT NULL | 求人タイトル |
| slug | VARCHAR(200) | NOT NULL, UNIQUE | URL スラッグ |
| employment_type | VARCHAR(50) | NOT NULL | 正社員 / 契約 / パート 等 |
| location | VARCHAR(100) | NOT NULL | 勤務地 |
| salary_text | VARCHAR(200) | NULLABLE | 給与テキスト |
| summary | TEXT | NOT NULL | 一覧用の要約 |
| description | TEXT | NOT NULL | 詳細説明 |
| requirements | TEXT | NULLABLE | 応募要件 |
| status | ENUM('draft','published') | NOT NULL, DEFAULT 'draft' | 公開状態 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 表示順 |
| published_at | TIMESTAMP | NULLABLE | 公開日時 |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

**INDEX**: `idx_jobs_status_sort` (status, sort_order)

### members

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | NOT NULL | 社員名 |
| slug | VARCHAR(100) | NOT NULL, UNIQUE | URL スラッグ |
| department | VARCHAR(100) | NOT NULL | 部署 |
| position | VARCHAR(100) | NOT NULL | 役職 |
| catch_copy | VARCHAR(200) | NOT NULL | キャッチコピー |
| message | TEXT | NOT NULL | インタビュー本文 |
| profile_image | VARCHAR(500) | NULLABLE | 顔写真パス |
| status | ENUM('draft','published') | NOT NULL, DEFAULT 'draft' | 公開状態 |
| sort_order | INT | NOT NULL, DEFAULT 0 | 表示順 |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

### news

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| title | VARCHAR(200) | NOT NULL | タイトル |
| slug | VARCHAR(200) | NOT NULL, UNIQUE | URL スラッグ |
| category | VARCHAR(50) | NOT NULL | info / press / event 等 |
| excerpt | VARCHAR(500) | NULLABLE | 抜粋 |
| body | TEXT | NOT NULL | 本文（HTML） |
| thumbnail | VARCHAR(500) | NULLABLE | サムネイル画像パス |
| status | ENUM('draft','published') | NOT NULL, DEFAULT 'draft' | 公開状態 |
| published_at | TIMESTAMP | NULLABLE | 公開日時 |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

**INDEX**: `idx_news_status_published` (status, published_at)

### applications

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| job_id | BIGINT | FK → jobs.id, NOT NULL | 応募先求人 |
| name | VARCHAR(100) | NOT NULL | 応募者名 |
| email | VARCHAR(255) | NOT NULL | メールアドレス |
| phone | VARCHAR(20) | NOT NULL | 電話番号 |
| age | TINYINT UNSIGNED | NULLABLE | 年齢 |
| message | TEXT | NULLABLE | 自由記述 |
| resume_path | VARCHAR(500) | NULLABLE | 履歴書ファイルパス |
| portfolio_url | VARCHAR(500) | NULLABLE | ポートフォリオURL |
| status | ENUM('unread','reviewing','interviewing','rejected','accepted') | NOT NULL, DEFAULT 'unread' | 選考ステータス |
| admin_note | TEXT | NULLABLE | 管理者メモ |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

**INDEX**: `idx_applications_status` (status)
**FK**: `job_id` → `jobs(id)` ON DELETE CASCADE

### inquiries

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| name | VARCHAR(100) | NOT NULL | 名前 |
| email | VARCHAR(255) | NOT NULL | メールアドレス |
| company | VARCHAR(200) | NULLABLE | 会社名 |
| message | TEXT | NOT NULL | 問い合わせ内容 |
| status | ENUM('unread','replied') | NOT NULL, DEFAULT 'unread' | 対応状態 |
| admin_note | TEXT | NULLABLE | 管理者メモ |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |

### media

| カラム | 型 | 制約 | 説明 |
|--------|------|------|------|
| id | BIGINT | PK, AUTO_INCREMENT | |
| file_name | VARCHAR(255) | NOT NULL | 元ファイル名 |
| file_path | VARCHAR(500) | NOT NULL | 保存先パス |
| mime_type | VARCHAR(100) | NOT NULL | MIME タイプ |
| size | INT UNSIGNED | NOT NULL | ファイルサイズ (bytes) |
| created_at | TIMESTAMP | | |
| updated_at | TIMESTAMP | | |
