<?php

namespace Database\Factories;

use App\Models\Inquiry;
use Illuminate\Database\Eloquent\Factories\Factory;

class InquiryFactory extends Factory
{
    protected $model = Inquiry::class;

    private const COMPANIES = [
        '株式会社テックイノベーション',
        '株式会社グローバルソリューションズ',
        'スマートワークス株式会社',
        '合同会社デジタルクリエイト',
        '株式会社ネクストステージ',
        'フューチャーテック株式会社',
        '株式会社アジャイルデザイン',
        null,
        null,
        null,
    ];

    private const MESSAGES = [
        '御社のサービスに大変興味を持っております。導入を検討しておりますので、デモの実施は可能でしょうか。30名規模の部門での利用を想定しております。',
        'プロダクトの料金体系について詳しく伺いたいです。年間契約の場合の割引はございますか。',
        '既存システムとの API 連携について質問がございます。Salesforce との連携実績はありますでしょうか。',
        '取材のご依頼です。弊社メディアにてスタートアップ特集を企画しており、御社の事業についてインタビューさせていただけないでしょうか。',
        '業務提携のご提案です。弊社は HR Tech 領域でサービスを展開しており、御社プロダクトとの連携により、双方のユーザーに新しい価値を提供できると考えております。',
        'セキュリティに関する質問です。ISO 27001 の認証取得状況と、データの保管先リージョンについて教えてください。',
        'カスタマイズ対応について相談です。弊社の業務フローに合わせた機能カスタマイズは可能でしょうか。要件をまとめた資料がございます。',
        '御社のエンジニアブログを拝見しました。技術勉強会の共同開催について興味がございます。',
        'イベント協賛のお願いです。来月開催予定の開発者カンファレンスへのスポンサー参加をご検討いただけないでしょうか。',
        'サービスを利用中ですが、請求書の宛名変更をお願いしたいです。社名変更に伴う手続きについてご教示ください。',
    ];

    public function definition(): array
    {
        $status = fake()->randomElement(['unread', 'replied']);

        return [
            'name' => fake()->name(),
            'email' => fake()->safeEmail(),
            'company' => fake()->randomElement(self::COMPANIES),
            'message' => fake()->randomElement(self::MESSAGES),
            'status' => $status,
            'admin_note' => $status === 'replied'
                ? fake()->randomElement([
                    '回答済み。デモ日程を調整中。',
                    '担当営業へ引き継ぎ済み。',
                    '資料を送付して回答完了。',
                    'FAQページのリンクを案内済み。',
                ])
                : null,
        ];
    }
}
