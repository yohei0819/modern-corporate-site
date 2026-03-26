<?php

namespace Database\Seeders;

use App\Models\JobPosting;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class JobPostingSeeder extends Seeder
{
    public function run(): void
    {
        if (JobPosting::count() > 0) {
            return;
        }

        // 固定データ: 確実にデモで見せたい求人
        $featured = [
            [
                'title' => 'フロントエンドエンジニア（React / Next.js）',
                'slug' => 'frontend-engineer-react',
                'employment_type' => 'full-time',
                'location' => '東京本社（渋谷区）+ リモート併用',
                'salary_text' => '年収 500〜800 万円',
                'summary' => 'React / Next.js を用いた自社プロダクトの UI 開発を担当。パフォーマンスとアクセシビリティにこだわったフロントエンド基盤を一緒に作りましょう。',
                'description' => "【チームについて】\nプロダクト開発チームは現在 8 名（エンジニア 5, デザイナー 2, PM 1）。2 週間スプリントのスクラム開発を行っています。\n\n【業務内容】\n・自社 SaaS プロダクトのフロントエンド設計・実装\n・デザイナーと連携した UI/UX 改善\n・パフォーマンスチューニングとアクセシビリティ対応\n・コードレビューと技術的意思決定への参加\n\n【開発環境】\nTypeScript / React 19 / Next.js 15 / Tailwind CSS / Storybook / Vitest / GitHub Actions\n\n【働き方】\n・フレックスタイム制（コアタイム 11:00-15:00）\n・リモートワーク週 3 日まで可\n・1on1 面談を毎週実施",
                'requirements' => "【必須スキル】\n・React を用いた SPA 開発経験 2 年以上\n・TypeScript の実務経験\n・Git を用いたチーム開発経験\n\n【歓迎スキル】\n・Next.js App Router の知見\n・デザインシステム構築経験\n・CI/CD パイプライン構築経験\n・OSS へのコントリビュート経験",
                'status' => 'published',
                'sort_order' => 1,
                'published_at' => now()->subDays(7),
            ],
            [
                'title' => 'バックエンドエンジニア（PHP / Laravel）',
                'slug' => 'backend-engineer-laravel',
                'employment_type' => 'full-time',
                'location' => '東京本社（渋谷区）+ リモート併用',
                'salary_text' => '年収 600〜900 万円',
                'summary' => 'Laravel を使った API 設計・開発をリードし、堅牢でスケーラブルなシステム基盤を構築していただきます。',
                'description' => "【チームについて】\nバックエンドチームは 4 名。マイクロサービス化を見据えたアーキテクチャ設計を進めています。\n\n【業務内容】\n・RESTful API の設計・実装・テスト\n・データベース設計とクエリ最適化\n・外部サービス連携（決済・メール配信・外部 API）\n・セキュリティ対策とパフォーマンス改善\n・テスト自動化と CI/CD パイプラインの整備\n\n【開発環境】\nPHP 8.3 / Laravel 11 / MySQL 8 / Redis / Docker / GitHub Actions / AWS (ECS)\n\n【福利厚生】\n・書籍購入費全額補助\n・カンファレンス参加費補助\n・技術ブログ執筆インセンティブ",
                'requirements' => "【必須スキル】\n・PHP (Laravel) での API 開発経験 2 年以上\n・RDB 設計の実務経験 (正規化, インデックス設計)\n・自動テスト (PHPUnit) の記述経験\n\n【歓迎スキル】\n・マイクロサービス設計の知見\n・AWS/GCP でのインフラ運用経験\n・Redis / キュー処理の実装経験\n・技術ブログや OSS 活動",
                'status' => 'published',
                'sort_order' => 2,
                'published_at' => now()->subDays(5),
            ],
            [
                'title' => 'UI/UXデザイナー',
                'slug' => 'ui-ux-designer',
                'employment_type' => 'full-time',
                'location' => 'フルリモート',
                'salary_text' => '年収 500〜800 万円',
                'summary' => 'ユーザーリサーチからプロトタイピング、デザインシステム構築まで、一貫したデザインプロセスを推進します。',
                'description' => "【チームについて】\nデザインチームは 3 名。エンジニアと密に連携しながら、プロダクトの UX 改善に取り組んでいます。\n\n【業務内容】\n・ユーザーリサーチとペルソナ設計\n・ワイヤーフレーム / プロトタイプ作成\n・デザインシステムの構築と運用\n・A/B テストの設計と効果検証\n・エンジニアとの協業による実装品質の担保\n\n【使用ツール】\nFigma / Adobe CC / Miro / Notion / Hotjar",
                'requirements' => "【必須スキル】\n・UI/UX デザインの実務経験 2 年以上\n・Figma を使ったデザイン・プロトタイピング\n・デザインシステムの構築経験\n\n【歓迎スキル】\n・HTML/CSS のコーディング知識\n・A/B テストの設計と分析経験\n・BtoB SaaS のデザイン経験",
                'status' => 'published',
                'sort_order' => 3,
                'published_at' => now()->subDays(10),
            ],
        ];

        foreach ($featured as $data) {
            JobPosting::create($data);
        }

        // ファクトリで追加データ生成
        JobPosting::factory(9)->published()->create();
        JobPosting::factory(3)->create(['status' => 'draft']);
    }
}
