<?php

namespace Database\Factories;

use App\Models\Member;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class MemberFactory extends Factory
{
    protected $model = Member::class;

    private const MEMBERS = [
        [
            'name' => '田中 太郎',
            'department' => 'エンジニアリング',
            'position' => 'CTO',
            'catch_copy' => '技術で事業をドライブする',
            'message' => "新卒で SI 企業に入社後、Web 系スタートアップを経て現職。「技術は手段であり、ユーザーへの価値提供がゴール」をモットーに、チーム全体の技術力向上と開発生産性の最大化に取り組んでいます。好きな技術は Rust と分散システム。",
        ],
        [
            'name' => '鈴木 花子',
            'department' => 'エンジニアリング',
            'position' => 'テックリード',
            'catch_copy' => 'コードで語る、チームで創る',
            'message' => "フロントエンドからバックエンドまで幅広く手がけるフルスタックエンジニア。特に React エコシステムが得意です。社内勉強会の主催やOSS コントリビュートにも積極的に取り組んでいます。",
        ],
        [
            'name' => '佐藤 健一',
            'department' => 'エンジニアリング',
            'position' => 'シニアエンジニア',
            'catch_copy' => 'インフラの安定が事業の礎',
            'message' => "インフラ・SRE 領域を専門としています。AWS 上のシステム設計から Terraform による IaC、監視体制の構築まで一貫して担当。\"Everything as Code\" の思想で、再現性と信頼性の高い基盤を作ることにやりがいを感じています。",
        ],
        [
            'name' => '山田 美咲',
            'department' => 'デザイン',
            'position' => 'デザインマネージャー',
            'catch_copy' => 'ユーザーの声をカタチにする',
            'message' => "UI/UX デザイナーとして 8 年のキャリア。ユーザーリサーチからビジュアルデザインまでを一気通貫で担当してきました。「使いやすさ」と「美しさ」の両立を目指し、デザインシステムの構築と運用に注力しています。",
        ],
        [
            'name' => '高橋 大輝',
            'department' => 'デザイン',
            'position' => 'シニアデザイナー',
            'catch_copy' => 'データとクリエイティブの融合',
            'message' => "広告代理店でのグラフィックデザイン経験を経て、プロダクトデザインの世界へ。A/B テストの設計・分析を通じてデータドリブンなデザイン改善を推進しています。",
        ],
        [
            'name' => '伊藤 あかり',
            'department' => 'マーケティング',
            'position' => 'マーケティングマネージャー',
            'catch_copy' => '数字で証明するマーケティング',
            'message' => "BtoB SaaS のマーケティングに 6 年間従事。SEO・コンテンツマーケティングを軸にリード獲得の仕組みを構築してきました。「再現性のある成長」を実現するために、データ分析と仮説検証を繰り返す日々です。",
        ],
        [
            'name' => '渡辺 翔太',
            'department' => '営業',
            'position' => '営業マネージャー',
            'catch_copy' => 'お客様の成功が、自分たちの成功',
            'message' => "エンタープライズ営業として大手企業向けの提案を 10 年以上経験。お客様の課題を深く理解し、プロダクトの力で解決する「ソリューション営業」を実践しています。チームメンバーの成長にも全力でコミットします。",
        ],
        [
            'name' => '中村 麻衣',
            'department' => '人事',
            'position' => '人事リーダー',
            'catch_copy' => '仲間集めのプロフェッショナル',
            'message' => "IT 企業での採用担当を経て現職。年間 50 名以上のエンジニア採用に携わってきた経験を活かし、「会社の未来を創る採用」を目指しています。Wantedly や Twitter を使った採用広報にも力を入れています。",
        ],
        [
            'name' => '小林 誠',
            'department' => '経営企画',
            'position' => 'CEO',
            'catch_copy' => 'テクノロジーで社会の「不」を解決する',
            'message' => '連続起業家として 3 社目の創業。前職では EdTech サービスを立ち上げ、累計ユーザー 50 万人を達成。「テクノロジーの力で、世の中に存在する "不" を一つずつ解消していく」というビジョンのもと、新たな挑戦を続けています。',
        ],
        [
            'name' => '松本 理沙',
            'department' => 'エンジニアリング',
            'position' => 'ジュニアエンジニア',
            'catch_copy' => '毎日が学びの連続',
            'message' => "プログラミングスクールを経て未経験から入社。先輩エンジニアの手厚いサポートのもと、日々スキルアップを実感しています。将来はフルスタックエンジニアとして、プロダクトの企画段階から関わることが目標です。",
        ],
    ];

    public function definition(): array
    {
        $member = fake()->randomElement(self::MEMBERS);

        return [
            'name' => $member['name'],
            'slug' => Str::slug($member['name']) . '-' . fake()->unique()->numberBetween(1, 9999),
            'department' => $member['department'],
            'position' => $member['position'],
            'catch_copy' => $member['catch_copy'],
            'message' => $member['message'],
            'profile_image' => null,
            'status' => fake()->randomElement(['draft', 'published']),
            'sort_order' => fake()->numberBetween(0, 100),
        ];
    }

    public function published(): static
    {
        return $this->state(fn () => [
            'status' => 'published',
        ]);
    }
}
