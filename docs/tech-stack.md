# 技術選定

## 構成図

```
[ ブラウザ (公開サイト) ]  ←→  [ Next.js (App Router) ]  ←→  [ Laravel API ]  ←→  [ MySQL ]
[ ブラウザ (管理画面) ]    ←→  [ Vue 3 (Vite + SPA) ]   ←→       ↑
                                                              [ Storage ]
```

## 技術スタック

| レイヤー | 技術 | バージョン | 選定理由 |
|----------|------|------------|----------|
| 公開サイト | Next.js (App Router) | 15.x | file-based routing / layouts / SSR / SSG で公開サイト構造を整理しやすい。SEO にも有利 |
| 管理画面 | Vue 3 + Vite | 3.5.x | Composition API + SFC でコンポーネント分割が明快。管理画面の CRUD UI に向いている |
| 状態管理 | Pinia | 2.x | Vue 公式推奨。TypeScript 親和性が高く、ストアの型推論がそのまま効く |
| API / 認証 | Laravel + Sanctum | 11.x | routing / validation / file storage / mail を公式で備えている。Sanctum で Cookie ベース SPA 認証が簡潔 |
| DB | MySQL | 8.x | Laravel との相性。本番想定。開発時は SQLite で代替可 |
| CSS | Tailwind CSS | 4.x | ユーティリティファースト。公開側・管理側ともに統一的にスタイリング |
| HTTP クライアント | Axios | 1.x | インターセプター / CSRFトークン自動付与で Sanctum と相性が良い |
| ルーティング (Vue) | Vue Router | 4.x | SPA 管理画面のルーティング / ナビゲーションガード |
| テスト | PHPUnit / Vitest | — | バックエンドは PHPUnit、フロントエンドは Vitest |
| コード品質 | ESLint + Prettier | — | フロントエンド統一フォーマット |

## ポート割り当て（開発環境）

| アプリ | ポート |
|--------|--------|
| Next.js | 3000 |
| Vue (Vite) | 5173 |
| Laravel | 8000 |
| MySQL | 3306 |

## なぜフロントを2つに分けたか

- **公開サイトは SSR / SEO が重要** → Next.js の App Router がサーバーレンダリングを前提としている
- **管理画面は SPA で十分** → SEO 不要。Vue の Composition API + SFC がフォーム・テーブル中心の CRUD に適している
- **Laravel は API に専念** → フロントを持たずに JSON を返すだけにすることで関心を分離

## 認証方式

Laravel Sanctum の SPA 認証（Cookie ベース）を採用。

1. フロントから `GET /sanctum/csrf-cookie` を叩いて XSRF-TOKEN を取得
2. `POST /api/login` で認証
3. 以降のリクエストは Cookie が自動送信される
4. Axios の `withCredentials: true` を設定するだけ

JWT を使わない理由: SPA + 同一ドメイン（開発時は CORS 設定）なら Cookie のほうがシンプルで安全。トークン管理が不要。
