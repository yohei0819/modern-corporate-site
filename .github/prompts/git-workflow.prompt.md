---
description: "Use when: starting a new phase, creating a branch, making commits, or merging work. Git branching strategy and commit conventions for this project."
---

# Git ブランチ運用プロンプト

## ブランチ作成

新しい Phase に着手するとき:

```bash
git checkout main
git pull origin main
git checkout -b feature/phase{N}-{name}
```

Phase 内でサブブランチを切るとき:

```bash
git checkout feature/phase{N}-{name}
git checkout -b feature/phase{N}-{name}/{feature}
```

## Phase × ブランチ対応表

| Phase | ブランチ |
|-------|---------|
| 3 | `feature/phase3-laravel-base` |
| 4 | `feature/phase4-admin-vue` |
| 5 | `feature/phase5-frontend-next` |
| 6 | `feature/phase6-ui-polish` |
| 7 | `feature/phase7-testing` |
| 8 | `feature/phase8-portfolio` |

## コミットメッセージ規約

```
{prefix}: {簡潔な説明}
```

| プレフィックス | 用途 |
|---------------|------|
| `feat:` | 新機能追加 |
| `fix:` | バグ修正 |
| `docs:` | ドキュメント変更 |
| `style:` | コードフォーマット（機能変更なし） |
| `refactor:` | リファクタリング |
| `test:` | テスト追加・修正 |
| `chore:` | ビルド・設定変更 |

例:
- `feat: 求人CRUDのAPIを追加`
- `fix: 応募フォームのバリデーションエラー表示を修正`
- `docs: API仕様書を更新`

## マージ

Phase 完了時:

```bash
git checkout main
git merge --no-ff feature/phase{N}-{name}
git push origin main
```

または GitHub 上で PR を作成してマージする（推奨）。
PR にはそのPhaseで実装した内容をまとめて記載する。
