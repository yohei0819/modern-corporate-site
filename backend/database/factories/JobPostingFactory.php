<?php

namespace Database\Factories;

use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class JobPostingFactory extends Factory
{
    protected $model = JobPosting::class;

    private const JOBS = [
        [
            'title' => 'フロントエンドエンジニア',
            'summary' => 'React/Next.js を用いた自社プロダクトの UI 開発を担当していただきます。',
            'description' => "【業務内容】\n・自社 SaaS プロダクトのフロントエンド設計・実装\n・デザイナーと連携した UI/UX 改善\n・パフォーマンスチューニングとアクセシビリティ対応\n・コードレビューと技術的意思決定への参加\n\n【開発環境】\nTypeScript / React 19 / Next.js 15 / Tailwind CSS / Storybook / Vitest",
            'requirements' => "【必須スキル】\n・React を用いた SPA 開発経験 2 年以上\n・TypeScript の実務経験\n・Git を用いたチーム開発経験\n\n【歓迎スキル】\n・Next.js App Router の知見\n・デザインシステム構築経験\n・CI/CD パイプライン構築経験",
        ],
        [
            'title' => 'バックエンドエンジニア',
            'summary' => 'Laravel を使った API 設計・開発をリードし、堅牢なシステム基盤を構築します。',
            'description' => "【業務内容】\n・RESTful API の設計・実装・テスト\n・データベース設計とクエリ最適化\n・外部サービス連携（決済・メール配信）\n・セキュリティ対策とパフォーマンス改善\n\n【開発環境】\nPHP 8.3 / Laravel 11 / MySQL 8 / Redis / Docker / GitHub Actions",
            'requirements' => "【必須スキル】\n・PHP (Laravel) での API 開発経験 2 年以上\n・RDB 設計の実務経験\n・自動テスト (PHPUnit) の記述経験\n\n【歓迎スキル】\n・マイクロサービス設計の知見\n・AWS/GCP でのインフラ運用経験\n・技術ブログやOSS 活動",
        ],
        [
            'title' => 'フルスタックエンジニア',
            'summary' => 'フロントからバックエンドまで一気通貫で開発できるエンジニアを募集します。',
            'description' => "【業務内容】\n・新機能の企画段階からの技術選定と実装\n・フロントエンド・バックエンド両面の設計と開発\n・インフラ構成の検討と CI/CD 整備\n・少人数チームでのアジャイル開発\n\n【開発環境】\nTypeScript / Vue 3 / Laravel / MySQL / Docker / Terraform",
            'requirements' => "【必須スキル】\n・Web アプリケーション開発経験 3 年以上\n・フロントエンド・バックエンド双方の実務経験\n\n【歓迎スキル】\n・スタートアップでの開発経験\n・プロダクトオーナーとの直接折衝経験",
        ],
        [
            'title' => 'UI/UXデザイナー',
            'summary' => 'ユーザー調査からプロトタイピングまで一貫したデザインプロセスを推進します。',
            'description' => "【業務内容】\n・ユーザーリサーチとペルソナ設計\n・ワイヤーフレーム / プロトタイプ作成\n・デザインシステムの構築と運用\n・エンジニアとの協業による実装品質の担保\n\n【使用ツール】\nFigma / Adobe CC / Miro / Notion",
            'requirements' => "【必須スキル】\n・UI/UX デザインの実務経験 2 年以上\n・Figma を使ったデザイン・プロトタイピング\n・デザインシステムの構築経験\n\n【歓迎スキル】\n・HTML/CSS のコーディング知識\n・A/B テストの設計と分析経験",
        ],
        [
            'title' => 'プロジェクトマネージャー',
            'summary' => '複数プロジェクトを横断的に管理し、チームの生産性を最大化します。',
            'description' => "【業務内容】\n・プロジェクト計画の策定とスケジュール管理\n・ステークホルダーとの折衝・調整\n・リスク管理と課題解決\n・チームビルディングとメンバー育成\n\n【プロジェクト規模】\n3〜10 名のチーム / 3〜6 ヶ月のスパン",
            'requirements' => "【必須スキル】\n・IT プロジェクトの PM 経験 3 年以上\n・アジャイル開発の知見\n・技術的なバックグラウンド\n\n【歓迎スキル】\n・PMP / Scrum Master 資格\n・エンジニアからの転身歓迎",
        ],
        [
            'title' => 'インフラエンジニア / SRE',
            'summary' => 'クラウドインフラの設計・運用と、サービスの信頼性向上をリードします。',
            'description' => "【業務内容】\n・AWS 上のインフラ設計と IaC (Terraform) による構築\n・CI/CD パイプラインの整備と運用\n・監視 / アラート体制の構築\n・障害対応とポストモーテム\n\n【技術スタック】\nAWS (ECS, RDS, CloudFront) / Terraform / Docker / Datadog / GitHub Actions",
            'requirements' => "【必須スキル】\n・AWS の実務運用経験 2 年以上\n・IaC ツール(Terraform / CloudFormation) の経験\n・Linux サーバー管理経験\n\n【歓迎スキル】\n・Kubernetes の運用経験\n・SLI/SLO 設計と運用",
        ],
        [
            'title' => 'QAエンジニア',
            'summary' => 'テスト戦略の策定から自動化まで、品質保証を幅広く担当していただきます。',
            'description' => "【業務内容】\n・テスト計画の策定とテストケース設計\n・E2E テスト自動化 (Playwright)\n・CI へのテスト自動化組み込み\n・品質メトリクスの可視化と改善提案\n\n【技術スタック】\nPlaywright / Vitest / PHPUnit / GitHub Actions",
            'requirements' => "【必須スキル】\n・QA の実務経験 2 年以上\n・自動テストフレームワークの使用経験\n・テスト設計技法の知識\n\n【歓迎スキル】\n・開発経験（フロントエンド or バックエンド）\n・JSTQB 資格",
        ],
        [
            'title' => 'データアナリスト',
            'summary' => 'データ分析基盤の構築と、事業成長を加速する意思決定支援を行います。',
            'description' => "【業務内容】\n・KPI の設計とダッシュボード構築\n・SQL を使ったアドホック分析\n・A/B テストの設計と効果検証\n・経営層向けのレポート作成\n\n【使用ツール】\nBigQuery / Looker / Python (pandas) / dbt",
            'requirements' => "【必須スキル】\n・データ分析の実務経験 2 年以上\n・SQL の高度な使用経験\n・BI ツールの運用経験\n\n【歓迎スキル】\n・Python / R を使った統計分析\n・機械学習モデルの実務適用経験",
        ],
        [
            'title' => 'マーケティング担当',
            'summary' => 'デジタルマーケティング戦略を企画・実行し、リード獲得を推進します。',
            'description' => "【業務内容】\n・SEO / コンテンツマーケティング戦略の立案\n・広告運用（Google Ads / SNS 広告）\n・LP の企画・改善と CVR 最適化\n・MAツールの運用とリードナーチャリング\n\n【使用ツール】\nGoogle Analytics / Search Console / HubSpot / Canva",
            'requirements' => "【必須スキル】\n・BtoB マーケティングの実務経験 2 年以上\n・デジタル広告の運用経験\n・データドリブンな施策立案\n\n【歓迎スキル】\n・HTML/CSS の基礎知識\n・動画コンテンツの企画・制作経験",
        ],
        [
            'title' => 'カスタマーサクセス',
            'summary' => '導入企業の活用促進と満足度向上を通じて、長期的な関係構築を目指します。',
            'description' => "【業務内容】\n・オンボーディング支援と活用促進\n・利用データ分析に基づくプロアクティブなフォロー\n・機能改善要望の社内フィードバック\n・ヘルプコンテンツの企画・執筆\n\n【担当範囲】\n中堅〜大手企業 10〜20 社を担当",
            'requirements' => "【必須スキル】\n・法人向けサービスの顧客対応経験 2 年以上\n・課題発見と解決提案力\n・基本的な IT リテラシー\n\n【歓迎スキル】\n・SaaS 業界での CS 経験\n・SQL / データ分析の基礎スキル",
        ],
        [
            'title' => '人事・採用担当',
            'summary' => 'エンジニア採用を中心に、採用戦略の立案から実行まで一貫して担当します。',
            'description' => "【業務内容】\n・採用計画の立案と母集団形成\n・スカウト送付とカジュアル面談の実施\n・選考プロセスの設計と改善\n・入社後のオンボーディング設計\n\n【採用媒体】\nWantedly / LAPRAS / Green / Twitter",
            'requirements' => "【必須スキル】\n・IT 企業での採用経験 2 年以上\n・エンジニア採用の知見\n・面接官としての実務経験\n\n【歓迎スキル】\n・採用広報・ブランディングの経験\n・組織開発やエンゲージメント施策の知見",
        ],
        [
            'title' => '営業マネージャー',
            'summary' => '法人営業チームを率いて、新規開拓から既存深耕まで売上目標の達成を牽引します。',
            'description' => "【業務内容】\n・営業戦略の策定と KPI 管理\n・チームマネジメント（5〜8 名）\n・大手企業向けの提案・プレゼンテーション\n・プロダクトチームとの連携によるフィードバック\n\n【対象市場】\nエンタープライズ企業（従業員 300 名以上）",
            'requirements' => "【必須スキル】\n・法人営業のマネジメント経験 3 年以上\n・SaaS / IT サービスの営業経験\n・予算策定と実績管理の経験\n\n【歓迎スキル】\n・CRM ツール（Salesforce 等）の運用経験\n・エンタープライズセールスメソドロジーの知見",
        ],
    ];

    private const LOCATIONS = [
        '東京本社（渋谷区）',
        '大阪オフィス（梅田）',
        '名古屋オフィス（栄）',
        '福岡オフィス（天神）',
        'フルリモート',
        '東京本社 + リモート併用',
    ];

    private const SALARY_RANGES = [
        '年収 400〜600 万円',
        '年収 500〜800 万円',
        '年収 600〜900 万円',
        '年収 700〜1,000 万円',
        '年収 800〜1,200 万円',
        '年収 450〜650 万円',
        '年収 350〜500 万円（時短・パート可）',
    ];

    public function definition(): array
    {
        $job = fake()->randomElement(self::JOBS);

        return [
            'title' => $job['title'],
            'slug' => Str::slug($job['title']) . '-' . fake()->unique()->numberBetween(1, 9999),
            'employment_type' => fake()->randomElement(['full-time', 'contract', 'part-time', 'internship']),
            'location' => fake()->randomElement(self::LOCATIONS),
            'salary_text' => fake()->randomElement(self::SALARY_RANGES),
            'summary' => $job['summary'],
            'description' => $job['description'],
            'requirements' => $job['requirements'],
            'status' => fake()->randomElement(['draft', 'published']),
            'sort_order' => fake()->numberBetween(0, 100),
            'published_at' => fake()->optional(0.7)->dateTimeBetween('-3 months', 'now'),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-3 months', 'now'),
        ]);
    }
}
