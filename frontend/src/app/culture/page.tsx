import Breadcrumb from '@/components/layout/Breadcrumb';
import SectionTitle from '@/components/common/SectionTitle';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '働く環境',
  description: 'CORP.の働く環境、制度、福利厚生についてご紹介します。',
};

const benefits = [
  { icon: '🏠', title: 'リモートワーク', desc: '週3日までリモート勤務可能。地方在住メンバーも活躍中。' },
  { icon: '⏰', title: 'フレックスタイム', desc: 'コアタイム10:00-15:00。朝型も夜型も自分のリズムで。' },
  { icon: '📚', title: '書籍・学習支援', desc: '月1万円まで書籍購入補助。Udemy等のオンライン学習も会社負担。' },
  { icon: '🏥', title: '健康サポート', desc: '人間ドック全額補助、メンタルヘルスケア、フィットネス補助。' },
  { icon: '👶', title: '育児・介護支援', desc: '育休取得率100%。時短勤務、看護休暇など充実の制度。' },
  { icon: '✈️', title: '有給休暇', desc: '年間有給20日＋リフレッシュ休暇5日。消化率85%超。' },
  { icon: '🎓', title: 'カンファレンス参加', desc: '国内外のカンファレンス参加費・渡航費を全額補助。' },
  { icon: '💰', title: '資格取得支援', desc: '業務関連の資格取得費用を全額負担。合格ボーナスあり。' },
];

export default function CulturePage() {
  return (
    <div>
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: '働く環境' }]} />
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">働く環境</h1>
          <p className="mt-3 text-lg text-gray-500">Culture & Benefits</p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <SectionTitle title="私たちが大切にしていること" subtitle="Values" />
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { title: 'チャレンジ', desc: '失敗を恐れず、新しいことに挑戦し続ける文化' },
              { title: 'オープン', desc: '情報をオープンに共有し、フラットにコミュニケーション' },
              { title: 'リスペクト', desc: '多様な価値観を尊重し、一人ひとりの強みを活かす' },
            ].map((v) => (
              <div key={v.title} className="rounded-xl bg-gray-50 p-6">
                <h3 className="text-lg font-bold text-gray-900">{v.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="制度・福利厚生" subtitle="Benefits" />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b) => (
              <div key={b.title} className="rounded-xl bg-white p-6 border border-gray-100">
                <div className="text-3xl">{b.icon}</div>
                <h3 className="mt-3 font-bold text-gray-900">{b.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* One Day */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <SectionTitle title="1日の流れ" subtitle="A Day at CORP." />
          <div className="mt-12 space-y-0">
            {[
              { time: '10:00', text: '出社 / リモート開始、Slack チェック' },
              { time: '10:15', text: 'チーム朝会（15分スタンドアップ）' },
              { time: '10:30', text: '集中開発タイム' },
              { time: '12:00', text: 'ランチ（チームで外食することも）' },
              { time: '13:00', text: 'コードレビュー / ペアプロ' },
              { time: '14:00', text: 'プロダクトミーティング' },
              { time: '15:00', text: '集中開発タイム' },
              { time: '18:00', text: '日報共有、退勤' },
            ].map((item, i, arr) => (
              <div key={i} className="flex gap-6 pb-6 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i < arr.length - 1 && <div className="w-px flex-1 bg-gray-200" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">{item.time}</p>
                  <p className="mt-0.5 text-gray-700">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
