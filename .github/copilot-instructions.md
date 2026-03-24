# Copilot ワークスペース共通指示

## プロジェクト概要

採用広報サイト + 応募管理ダッシュボードのポートフォリオ作品。
3 つのアプリで構成される:

- `frontend/` — Next.js (App Router) 公開サイト
- `admin/` — Vue 3 (Vite + SPA) 管理画面
- `backend/` — Laravel API サーバー

## 技術スタック

- Next.js 15.x (App Router / TypeScript)
- Vue 3.5.x + Vite + Pinia + Vue Router (TypeScript)
- Laravel 11.x + Sanctum
- MySQL 8.x
- Tailwind CSS 4.x
- Axios

## コーディング規約

### 全体

- 言語: TypeScript（フロントエンド） / PHP 8.3（バックエンド）
- インデント: スペース 2（TS / Vue / CSS） / スペース 4（PHP）
- 文字列: シングルクォート（TS / Vue）、シングルクォート（PHP）
- セミコロン: あり（TS）
- 末尾カンマ: あり
- 命名: camelCase（変数・関数）、PascalCase（コンポーネント・クラス）、snake_case（PHP 変数・DB カラム）

### ファイル命名

- React コンポーネント: `PascalCase.tsx`
- Vue コンポーネント: `PascalCase.vue`
- ユーティリティ / lib: `kebab-case.ts`
- Laravel Controller: `PascalCaseController.php`
- Laravel Model: `PascalCase.php`（単数形）
- migration: Laravel のデフォルト命名

### 型定義

- `any` 禁止。必ず型を定義する
- API レスポンスの型は `types/` ディレクトリに置く
- 共通で使う型はそれぞれの `types/index.ts` にまとめる

## Git ブランチ運用

- `main` ブランチは常にデプロイ可能な状態を保つ
- 各 Phase は専用ブランチで作業する:
  - `feature/phase3-laravel-base`
  - `feature/phase4-admin-vue`
  - `feature/phase5-frontend-next`
  - `feature/phase6-ui-polish`
  - `feature/phase7-testing`
  - `feature/phase8-portfolio`
- Phase 完了時は PR を作成して main にマージする
- Phase 内で機能が大きい場合はサブブランチを切る:
  - 例: `feature/phase3-laravel-base/auth`
  - 例: `feature/phase3-laravel-base/jobs-crud`
- コミットメッセージプレフィックス:
  - `feat:` 新機能
  - `fix:` バグ修正
  - `docs:` ドキュメント
  - `style:` コードフォーマット（機能変更なし）
  - `refactor:` リファクタリング
  - `test:` テスト追加・修正
  - `chore:` ビルド・設定変更

## 仕様書の参照先

コード生成時は以下のドキュメントを参照すること:

- `docs/sitemap.md` — サイトマップ
- `docs/screen-list.md` — 画面一覧
- `docs/api-spec.md` — API 仕様
- `docs/db-design.md` — DB 設計
- `docs/tech-stack.md` — 技術選定理由
- `docs/phase-plan.md` — 制作フェーズ計画 + ブランチ対応表

## セキュリティ

- ユーザー入力は必ずサーバー側でバリデーションする（Laravel FormRequest）
- SQL はEloquent ORM のみ。生 SQL は原則禁止
- ファイルアップロードは mime type / サイズ上限を検証する
- CORS は Laravel 側で明示的に設定する
- 認証が必要な API は Sanctum ミドルウェアで保護する
- 環境変数はコミットしない（`.env` は `.gitignore` に入れる）
