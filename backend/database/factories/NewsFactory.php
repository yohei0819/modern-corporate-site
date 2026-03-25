<?php

namespace Database\Factories;

use App\Models\News;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class NewsFactory extends Factory
{
    protected $model = News::class;

    private const NEWS_TEMPLATES = [
        // info
        ['category' => 'info', 'title' => '年末年始休業のお知らせ（12/28〜1/3）', 'excerpt' => '誠に勝手ながら、2025年12月28日（土）〜2026年1月3日（金）まで年末年始休業とさせていただきます。'],
        ['category' => 'info', 'title' => 'オフィス移転のお知らせ', 'excerpt' => '事業拡大に伴い、2026年4月より渋谷区の新オフィスへ移転いたします。'],
        ['category' => 'info', 'title' => 'サービス利用規約改定のお知らせ', 'excerpt' => '2026年3月1日付でサービス利用規約を改定いたします。主な変更点をご案内します。'],
        ['category' => 'info', 'title' => '新プラン「エンタープライズ」提供開始', 'excerpt' => '大手企業向けに、専任サポートと SLA を提供する新プランを開始しました。'],
        ['category' => 'info', 'title' => 'システムメンテナンスのお知らせ（3/15）', 'excerpt' => '2026年3月15日（日）2:00〜6:00 にシステムメンテナンスを実施いたします。'],
        // press
        ['category' => 'press', 'title' => 'シリーズ A ラウンドで 5 億円の資金調達を実施', 'excerpt' => '当社は、○○キャピタルをリードインベスターとして、シリーズ A ラウンドで総額 5 億円の資金調達を完了しました。'],
        ['category' => 'press', 'title' => '累計導入企業数 500 社を突破', 'excerpt' => '当社サービスの累計導入企業数が 500 社を突破しました。引き続きプロダクトの価値向上に努めてまいります。'],
        ['category' => 'press', 'title' => '○○株式会社との業務提携を開始', 'excerpt' => '○○株式会社と業務提携契約を締結し、サービス連携を開始しました。'],
        ['category' => 'press', 'title' => '「働きがいのある会社」ランキングに初選出', 'excerpt' => 'Great Place to Work® Institute Japan による「働きがいのある会社」に選出されました。'],
        ['category' => 'press', 'title' => 'CTO 田中が「Tech Conference 2026」に登壇', 'excerpt' => '2026年5月開催の Tech Conference にて、当社 CTO の田中がマイクロサービス設計について講演します。'],
        // event
        ['category' => 'event', 'title' => 'エンジニア向けカジュアル面談会を開催', 'excerpt' => '毎月第 2 水曜に、エンジニアと直接話せるカジュアル面談会をオンラインで開催しています。'],
        ['category' => 'event', 'title' => '社内ハッカソン「Hack Day 2026」開催レポート', 'excerpt' => '2026年2月に開催した社内ハッカソンの様子をレポート。3 チームが新機能プロトタイプを発表しました。'],
        ['category' => 'event', 'title' => '技術勉強会「Modern Web Meetup #12」開催', 'excerpt' => 'React 19 の新機能と Server Components の実践的活用について、社外ゲストを交えた勉強会を開催します。'],
        ['category' => 'event', 'title' => '新卒向け会社説明会（2027年度入社）', 'excerpt' => '2027年度の新卒採用に向けた会社説明会を 4 月から毎月開催いたします。'],
        ['category' => 'event', 'title' => 'エンジニアブログリレー企画スタート', 'excerpt' => '開発チームのメンバーが週替わりで技術記事を公開するブログリレー企画を開始しました。'],
    ];

    public function definition(): array
    {
        $news = fake()->randomElement(self::NEWS_TEMPLATES);

        return [
            'title' => $news['title'],
            'slug' => Str::slug($news['title']) . '-' . fake()->unique()->numberBetween(1, 9999),
            'category' => $news['category'],
            'excerpt' => $news['excerpt'],
            'body' => $this->generateBody($news),
            'thumbnail' => null,
            'status' => fake()->randomElement(['draft', 'published']),
            'published_at' => fake()->optional(0.7)->dateTimeBetween('-6 months', 'now'),
        ];
    }

    private function generateBody(array $news): string
    {
        $body = '<h2>' . $news['title'] . '</h2>';
        $body .= '<p>' . $news['excerpt'] . '</p>';
        $body .= '<h3>詳細</h3>';
        $body .= '<p>' . implode('</p><p>', fake()->paragraphs(3)) . '</p>';

        if ($news['category'] === 'event') {
            $body .= '<h3>開催概要</h3>';
            $body .= '<ul>';
            $body .= '<li>日時：2026年' . fake()->numberBetween(1, 12) . '月' . fake()->numberBetween(1, 28) . '日 19:00〜21:00</li>';
            $body .= '<li>場所：オンライン（Zoom）</li>';
            $body .= '<li>参加費：無料</li>';
            $body .= '<li>定員：50 名</li>';
            $body .= '</ul>';
        }

        return $body;
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
            'published_at' => fake()->dateTimeBetween('-6 months', 'now'),
        ]);
    }
}
