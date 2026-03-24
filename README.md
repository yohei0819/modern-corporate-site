# 採用広報サイト + 応募管理ダッシュボード

就活ポートフォリオ作品。公開サイト・管理画面・API の 3 層構成で、採用業務の一連の流れを実装。

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| 公開サイト | Next.js 15 (App Router) / TypeScript / Tailwind CSS 4 |
| 管理画面 | Vue 3 + Vite / Pinia / Vue Router / TypeScript / Tailwind CSS 4 |
| API サーバー | Laravel 11 / Sanctum / PHP 8.3 |
| DB | MySQL 8 |

## ディレクトリ構成

```
├─ docs/           # 仕様書（サイトマップ / 画面一覧 / API仕様 / DB設計 / 技術選定 / フェーズ計画）
├─ frontend/       # Next.js 公開サイト（ポート 3000）
├─ admin/          # Vue 3 管理画面（ポート 5173）
└─ backend/        # Laravel API（ポート 8000）
```

## 主要機能

### 公開サイト
- 会社紹介 / 事業紹介 / 働く環境
- 求人一覧・詳細（フィルタ付き）
- 社員紹介一覧・詳細
- お知らせ一覧・詳細
- FAQ（カテゴリ別 / アコーディオン / キーワード検索）
- 応募フォーム（入力 → 確認 → 完了 / ファイルアップロード / メール自動送信）
- 問い合わせフォーム

### 管理画面
- Sanctum 認証（ログイン / ログアウト）
- 求人・社員・お知らせの CRUD
- 応募管理（ステータス管理 / メモ / CSV エクスポート）
- 問い合わせ管理
- メディア管理（画像アップロード / URL コピー）
- ダッシュボード（集計表示）

## セットアップ

### バックエンド

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan storage:link
php artisan serve
```

### 公開サイト

```bash
cd frontend
npm install
npm run dev
```

### 管理画面

```bash
cd admin
npm install
npm run dev
```

## 仕様書

- [サイトマップ](docs/sitemap.md)
- [画面一覧](docs/screen-list.md)
- [API 仕様](docs/api-spec.md)
- [DB 設計](docs/db-design.md)
- [技術選定](docs/tech-stack.md)
- [フェーズ計画](docs/phase-plan.md)

## 開発ブランチ

| Phase | ブランチ |
|-------|---------|
| 3 Laravel 基盤 | `feature/phase3-laravel-base` |
| 4 Vue 管理画面 | `feature/phase4-admin-vue` |
| 5 Next.js 公開サイト | `feature/phase5-frontend-next` |
| 6 UI 仕上げ | `feature/phase6-ui-polish` |
| 7 テスト | `feature/phase7-testing` |
| 8 ポートフォリオ化 | `feature/phase8-portfolio` |
