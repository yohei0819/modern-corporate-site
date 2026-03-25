<?php

namespace Database\Seeders;

use App\Models\Member;
use Illuminate\Database\Seeder;

class MemberSeeder extends Seeder
{
    public function run(): void
    {
        // 固定データ: 組織構成が見えるメンバー
        $featured = [
            [
                'name' => '小林 誠',
                'slug' => 'makoto-kobayashi',
                'department' => '経営企画',
                'position' => 'CEO',
                'catch_copy' => 'テクノロジーで社会の「不」を解決する',
                'message' => "連続起業家として 3 社目の創業。前職では EdTech サービスを立ち上げ、累計ユーザー 50 万人を達成しました。\n\n「テクノロジーの力で、世の中に存在する『不』を一つずつ解消していく」というビジョンのもと、プロダクト開発に全力を注いでいます。私たちが大切にしているのは、ユーザーの声に真摯に耳を傾け、本質的な課題を解決すること。一緒にその挑戦をしてくれる仲間を探しています。",
                'status' => 'published',
                'sort_order' => 1,
            ],
            [
                'name' => '田中 太郎',
                'slug' => 'taro-tanaka',
                'department' => 'エンジニアリング',
                'position' => 'CTO',
                'catch_copy' => '技術で事業をドライブする',
                'message' => "新卒で SI 企業に入社後、Web 系スタートアップ 2 社を経て現職。15 年間一貫してソフトウェア開発に携わってきました。\n\n「技術は手段であり、ユーザーへの価値提供がゴール」をモットーに、チーム全体の技術力向上と開発生産性の最大化に取り組んでいます。コードレビューでは「なぜそう実装したか」の背景を大切にし、メンバーの成長をサポートしています。",
                'status' => 'published',
                'sort_order' => 2,
            ],
            [
                'name' => '鈴木 花子',
                'slug' => 'hanako-suzuki',
                'department' => 'エンジニアリング',
                'position' => 'テックリード',
                'catch_copy' => 'コードで語る、チームで創る',
                'message' => "フロントエンドからバックエンドまで幅広く手がけるフルスタックエンジニアです。特に React エコシステムと TypeScript が得意分野。\n\n社内勉強会の主催や OSS コントリビュートにも積極的に取り組んでいます。チームでは「心理的安全性」を大切にし、誰もが気軽に質問・提案できる雰囲気づくりを心がけています。",
                'status' => 'published',
                'sort_order' => 3,
            ],
            [
                'name' => '佐藤 健一',
                'slug' => 'kenichi-sato',
                'department' => 'エンジニアリング',
                'position' => 'シニアエンジニア (SRE)',
                'catch_copy' => 'インフラの安定が事業の礎',
                'message' => "インフラ・SRE 領域を専門としています。AWS 上のシステム設計から Terraform による IaC、監視体制の構築まで一貫して担当。\n\n\"Everything as Code\" の思想で、再現性と信頼性の高い基盤を作ることにやりがいを感じています。障害ゼロを目指しつつも、発生時に迅速に復旧できる体制づくりに注力しています。",
                'status' => 'published',
                'sort_order' => 4,
            ],
            [
                'name' => '山田 美咲',
                'slug' => 'misaki-yamada',
                'department' => 'デザイン',
                'position' => 'デザインマネージャー',
                'catch_copy' => 'ユーザーの声をカタチにする',
                'message' => "UI/UX デザイナーとして 8 年のキャリア。大手 Web 企業を経て現職に参画しました。\n\nユーザーリサーチからビジュアルデザインまでを一気通貫で担当。「使いやすさ」と「美しさ」の両立を目指し、デザインシステムの構築と運用に注力しています。月に 1 回はユーザーインタビューを実施し、リアルな声をプロダクトに反映しています。",
                'status' => 'published',
                'sort_order' => 5,
            ],
            [
                'name' => '伊藤 あかり',
                'slug' => 'akari-ito',
                'department' => 'マーケティング',
                'position' => 'マーケティングマネージャー',
                'catch_copy' => '数字で証明するマーケティング',
                'message' => "BtoB SaaS のマーケティングに 6 年間従事。SEO・コンテンツマーケティングを軸にリード獲得の仕組みを構築してきました。\n\n「再現性のある成長」を実現するために、データ分析と仮説検証を繰り返す日々です。マーケティングの面白さは、数字で成果が見えること。仮説を立て、施策を実行し、結果を分析するサイクルが大好きです。",
                'status' => 'published',
                'sort_order' => 6,
            ],
            [
                'name' => '中村 麻衣',
                'slug' => 'mai-nakamura',
                'department' => '人事',
                'position' => '人事リーダー',
                'catch_copy' => '仲間集めのプロフェッショナル',
                'message' => "IT 企業での採用担当を経て現職。年間 50 名以上のエンジニア採用に携わってきた経験を活かし、「会社の未来を創る採用」を目指しています。\n\nWantedly や Twitter を使った採用広報にも力を入れており、候補者にとって「この会社で働きたい」と思えるような情報発信を心がけています。面談ではカルチャーフィットを最も重視しています。",
                'status' => 'published',
                'sort_order' => 7,
            ],
            [
                'name' => '松本 理沙',
                'slug' => 'risa-matsumoto',
                'department' => 'エンジニアリング',
                'position' => 'ジュニアエンジニア',
                'catch_copy' => '毎日が学びの連続',
                'message' => "プログラミングスクールを経て未経験から入社しました。先輩エンジニアの手厚いサポートのもと、日々スキルアップを実感しています。\n\n入社 3 ヶ月で初めてのプルリクエストを本番リリースできた時の感動は忘れられません。将来はフルスタックエンジニアとして、プロダクトの企画段階から関わることが目標です。未経験からのキャリアチェンジを考えている方、ぜひ一緒に頑張りましょう！",
                'status' => 'published',
                'sort_order' => 8,
            ],
        ];

        foreach ($featured as $data) {
            Member::create($data);
        }

        // 下書きメンバー
        Member::factory(2)->create(['status' => 'draft']);
    }
}
