import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/common/SectionTitle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '会社紹介',
  description: 'CORP.の企業理念、ビジョン、沿革をご紹介します。',
};

const stats = [
  { label: '設立', value: '2015年' },
  { label: '社員数', value: '120名' },
  { label: '平均年齢', value: '31.5歳' },
  { label: '拠点数', value: '3拠点' },
  { label: '有休消化率', value: '85%' },
  { label: '育休取得率', value: '100%' },
];

const history = [
  { year: '2015', text: '東京都渋谷区にて設立' },
  { year: '2017', text: 'シリーズAにて資金調達。社員数30名突破' },
  { year: '2019', text: '大阪オフィス開設。主力プロダクトリリース' },
  { year: '2021', text: '福岡オフィス開設。社員数80名突破' },
  { year: '2023', text: 'シリーズBにて資金調達。海外展開開始' },
  { year: '2025', text: '社員数120名。第2プロダクトリリース' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Header */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: '会社紹介' }]} />
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">会社紹介</h1>
          <p className="mt-3 text-lg text-gray-500">About Us</p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="企業理念" subtitle="Mission" />
          <p className="mt-8 text-xl leading-relaxed text-gray-700">
            テクノロジーの力で、すべての人が可能性を広げられる社会を実現する。
          </p>
          <p className="mt-6 text-gray-500 leading-relaxed">
            私たちは「テクノロジーで未来を創る」という信念のもと、
            革新的なプロダクトとサービスを提供し続けます。
            多様なバックグラウンドを持つ仲間とともに、
            社会課題の解決に取り組んでいます。
          </p>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-20 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold">数字で見る CORP.</h2>
          <div className="mt-12 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="mt-2 text-sm text-blue-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="沿革" subtitle="History" />
          <div className="mt-12 space-y-0">
            {history.map((item, i) => (
              <div key={i} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i < history.length - 1 && <div className="w-px flex-1 bg-gray-200" />}
                </div>
                <div className="pb-2">
                  <p className="text-sm font-bold text-primary">{item.year}</p>
                  <p className="mt-1 text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Company Info */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="会社概要" subtitle="Company" />
          <div className="mt-10 rounded-xl border border-gray-200 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['会社名', '株式会社CORP.'],
                  ['所在地', '〒150-0000 東京都渋谷区○○ 1-2-3 ○○ビル 10F'],
                  ['設立', '2015年4月'],
                  ['代表者', '代表取締役 山田 太郎'],
                  ['事業内容', 'ソフトウェア開発・SaaS事業・コンサルティング'],
                  ['資本金', '5億円'],
                  ['従業員数', '120名（2025年12月現在）'],
                ].map(([label, value]) => (
                  <tr key={label} className="border-b border-gray-100 last:border-0">
                    <th className="bg-gray-50 px-6 py-4 text-left font-medium text-gray-700 w-40">
                      {label}
                    </th>
                    <td className="px-6 py-4 text-gray-900">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
