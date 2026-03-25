<?php

namespace Database\Factories;

use App\Models\Application;
use App\Models\JobPosting;
use Illuminate\Database\Eloquent\Factories\Factory;

class ApplicationFactory extends Factory
{
    protected $model = Application::class;

    private const UNIVERSITIES = [
        '東京大学',
        '京都大学',
        '慶應義塾大学',
        '早稲田大学',
        '東京工業大学',
        '筑波大学',
        '大阪大学',
        '名古屋大学',
        '東北大学',
        '九州大学',
    ];

    public function definition(): array
    {
        $status = fake()->randomElement(['unread', 'reviewing', 'interviewing', 'rejected', 'accepted']);

        return [
            'job_posting_id' => JobPosting::factory(),
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'phone' => '0' . fake()->numberBetween(70, 90) . '-' . fake()->numerify('####-####'),
            'age' => fake()->numberBetween(22, 45),
            'message' => fake()->optional(0.6)->randomElement([
                '御社のプロダクトに大変興味があり、応募いたしました。前職では ' . fake()->randomElement(self::UNIVERSITIES) . ' 卒業後、Web 系企業でフロントエンド開発を 3 年間担当しておりました。',
                '採用ページを拝見し、技術へのこだわりとチームの雰囲気に共感しました。ぜひ貢献できればと思います。',
                'エンジニアブログの記事を読んで、技術力の高さに感銘を受けました。自身のスキルを活かして御社の成長に貢献したいです。',
                '現職ではバックエンド開発を担当しております。より幅広い技術領域に挑戦したいと考え、応募いたしました。',
                'カジュアル面談に参加させていただき、ビジョンに共感しました。選考に進めていただけますと幸いです。',
            ]),
            'resume_path' => null,
            'portfolio_url' => fake()->optional(0.4)->randomElement([
                'https://github.com/' . fake()->userName(),
                'https://portfolio-' . fake()->userName() . '.vercel.app',
                'https://zenn.dev/' . fake()->userName(),
            ]),
            'status' => $status,
            'admin_note' => $this->generateAdminNote($status),
        ];
    }

    private function generateAdminNote(string $status): ?string
    {
        return match ($status) {
            'reviewing' => fake()->randomElement([
                '書類確認中。技術スタックのマッチ度が高い。',
                '経歴は良好。コーディングテスト送付予定。',
                'ポートフォリオ確認中。React の実装が丁寧。',
            ]),
            'interviewing' => fake()->randomElement([
                '1次面接通過。技術力・コミュニケーション力ともに高評価。2次面接を調整中。',
                '技術面接実施済み。システム設計の回答が的確。最終面接へ進める。',
                'カルチャーフィットも良好。リファレンスチェック依頼中。',
            ]),
            'rejected' => fake()->randomElement([
                '経験年数は条件を満たすが、技術スタックのミスマッチ。丁寧にお見送りメール済み。',
                '面接実施。コミュニケーション面で懸念あり。',
            ]),
            'accepted' => fake()->randomElement([
                'オファー承諾。入社日: 来月1日。',
                '内定承諾済み。チームへの歓迎準備を開始。',
            ]),
            default => null,
        };
    }
}
