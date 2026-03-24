import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/common/SectionTitle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '事業紹介',
  description: 'CORP.の事業内容をご紹介します。SaaS、受託開発、コンサルティングの3つの事業を展開しています。',
};

const businesses = [
  {
    title: 'SaaS プロダクト事業',
    icon: '🚀',
    description:
      '自社開発の SaaS プロダクトを企業向けに提供。業務効率化、データ分析、コミュニケーション支援など、多様なニーズに対応するプロダクトを展開しています。',
    features: ['プロダクト企画・設計', 'フルスタック開発', 'カスタマーサクセス'],
  },
  {
    title: 'テクノロジーコンサルティング',
    icon: '💡',
    description:
      'DX推進を目指す企業に対して、技術戦略の策定からシステム設計・開発まで一貫して支援。業界知見と最新技術を組み合わせたソリューションを提供します。',
    features: ['DX戦略策定', 'アーキテクチャ設計', '技術デューデリジェンス'],
  },
  {
    title: '受託開発事業',
    icon: '⚙️',
    description:
      'Webアプリケーション、モバイルアプリ、基幹システムなどの開発プロジェクトを受託。高い技術力とプロジェクトマネジメント力で確実にデリバリーします。',
    features: ['Webアプリケーション開発', 'モバイルアプリ開発', 'API / マイクロサービス構築'],
  },
];

export default function BusinessPage() {
  return (
    <div>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: '事業紹介' }]} />
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">事業紹介</h1>
          <p className="mt-3 text-lg text-gray-500">Business</p>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            title="3つの事業で価値を創造"
            subtitle="テクノロジーを軸に多角的な事業を展開"
          />

          <div className="mt-16 grid gap-10 lg:grid-cols-3">
            {businesses.map((biz) => (
              <div
                key={biz.title}
                className="rounded-2xl border border-gray-200 bg-white p-8 hover:shadow-lg transition-shadow"
              >
                <div className="text-4xl">{biz.icon}</div>
                <h2 className="mt-4 text-xl font-bold text-gray-900">{biz.title}</h2>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed">{biz.description}</p>
                <ul className="mt-5 space-y-2">
                  {biz.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
