# 制作フェーズ計画

## Phase × ブランチ対応表

| Phase | ブランチ名 | 内容 | 優先度 |
|-------|-----------|------|--------|
| 1 | `main` | 企画整理 — docs/ 作成 | — |
| 2 | `feature/phase2-wireframes` | 情報設計 — ワイヤー・API 仕様・フィールド定義 | — |
| 3 | `feature/phase3-laravel-base` | Laravel 基盤構築 | 最優先 |
| 4 | `feature/phase4-admin-vue` | 管理画面 Vue 構築 | 最優先 |
| 5 | `feature/phase5-frontend-next` | Next.js 公開サイト構築 | 最優先 |
| 6 | `feature/phase6-ui-polish` | UI 仕上げ | 次点 |
| 7 | `feature/phase7-testing` | テスト | 次点 |
| 8 | `feature/phase8-portfolio` | ポートフォリオ化 | 仕上げ |

## Git ブランチ運用ルール

- `main` は常にデプロイ可能な状態にする
- 各 Phase のブランチは `main` から作成する
- Phase 完了時に PR を作成 → main にマージする
- コミットメッセージは `feat:` / `fix:` / `docs:` / `style:` / `refactor:` のプレフィックスを付ける
- Phase 内で機能が大きい場合はサブブランチを切る
  - 例: `feature/phase3-laravel-base/auth`, `feature/phase3-laravel-base/jobs-crud`

---

## Phase 1: 企画整理

成果物:
- `docs/sitemap.md` ✅
- `docs/screen-list.md` ✅
- `docs/db-design.md` ✅
- `docs/api-spec.md` ✅
- `docs/tech-stack.md` ✅
- `docs/phase-plan.md` ✅（本ファイル）

---

## Phase 2: 情報設計

- [ ] 各ページのワイヤーフレーム作成（Figma / 手書き）
- [ ] CTA 位置決定
- [ ] コンテンツ優先順位決定
- [ ] フォーム項目の最終確定
- [ ] 管理画面の CRUD 項目確定

---

## Phase 3: Laravel 基盤構築

ブランチ: `feature/phase3-laravel-base`

### 最優先
- [x] Laravel プロジェクト作成 (`composer create-project`)
- [x] DB 作成 / `.env` 設定
- [x] migration 作成（全テーブル）
- [x] model 作成（リレーション含む）
- [x] seeder / factory 作成
- [x] Sanctum 認証実装（login / logout / me）
- [x] JobController CRUD API
- [x] ApplicationController（応募受付 + 管理側）
- [x] FormRequest バリデーション

### 次点
- [x] MemberController CRUD API
- [x] NewsController CRUD API
- [x] InquiryController API
- [x] MediaController（アップロード / 一覧 / 削除）
- [x] メール送信（ApplicationReceived / AdminNotification）
- [x] CSV エクスポート

---

## Phase 4: 管理画面 Vue 構築

ブランチ: `feature/phase4-admin-vue`

### 最優先
- [x] Vue + Vite プロジェクト初期化
- [x] Vue Router 設定
- [x] Pinia ストア設定
- [x] AdminLayout / AuthLayout 作成
- [x] ログイン画面 + 認証ガード
- [x] 求人 CRUD 画面（一覧 / 作成 / 編集）
- [x] 応募一覧 / 詳細 / ステータス変更

### 次点
- [x] 社員 CRUD 画面
- [x] お知らせ CRUD 画面
- [x] 問い合わせ一覧 / 詳細
- [x] メディア管理画面
- [x] ダッシュボード集計
- [ ] 設定画面

---

## Phase 5: Next.js 公開サイト構築

ブランチ: `feature/phase5-frontend-next`

### 最優先
- [x] Next.js App Router プロジェクト初期化
- [x] 共通レイアウト（Header / Footer）
- [x] トップページ
- [x] 求人一覧 / 詳細
- [x] お知らせ一覧 / 詳細
- [x] 応募フォーム（入力 / 確認 / 完了）

### 次点
- [x] 社員一覧 / 詳細
- [x] FAQ（アコーディオン / 検索）
- [x] 問い合わせフォーム
- [x] 会社紹介 / 事業紹介 / 働く環境
- [x] プライバシーポリシー
- [x] 404 ページ
- [x] メタ情報整備（OGP / title / description）

---

## Phase 6: UI 仕上げ

ブランチ: `feature/phase6-ui-polish`

- [x] レスポンシブ（SP / タブレット / PC）
- [x] スクロールアニメーション
- [x] ローディング状態
- [x] エラー表示
- [x] 空状態 UI
- [x] 画像最適化（next/image）
- [x] フォーカス表示 / キーボード操作
- [x] 500 エラーページ

---

## Phase 7: テスト

ブランチ: `feature/phase7-testing`

- [x] CRUD 一通り確認
- [x] フォーム送信確認
- [x] 添付ファイル確認
- [x] メール送信確認
- [x] ログイン / ログアウト確認
- [x] 権限ガード確認
- [ ] SP / PC / タブレットレスポンシブ確認
- [ ] Chrome / Safari / Firefox 確認

---

## Phase 8: ポートフォリオ化

ブランチ: `feature/phase8-portfolio`

- [ ] README にサービス概要を記載
- [ ] 技術選定理由を記載
- [ ] 画面キャプチャを撮り README に貼る
- [ ] ER 図を画像化して docs/ に追加
- [ ] ディレクトリ構成の説明を記載
- [ ] 苦労した点 / 工夫した点を記載
- [ ] 今後の拡張案を記載

---

## 実装優先度まとめ

### 🔴 最優先（ポートフォリオの中核）
- ログイン認証
- 求人 CRUD（API + 管理画面 + 公開側）
- 応募フォーム + 応募管理
- お知らせ一覧 / 詳細

### 🟡 次点（機能の幅を見せる）
- 社員紹介 CRUD
- FAQ
- 問い合わせ管理
- 画像管理
- CSV 出力

### 🟢 余力があれば（差別化要素）
- 下書きプレビュー
- 公開予約
- タグ検索
- ダッシュボードの集計グラフ
- 権限ロール分離
