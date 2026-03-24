'use client';

import { useState } from 'react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FaqItem[] = [
  { category: '選考について', question: '選考フローを教えてください。', answer: '書類選考 → 一次面接（オンライン）→ 二次面接（対面 or オンライン）→ 最終面接 → 内定となります。所要期間は約2〜3週間です。' },
  { category: '選考について', question: '未経験でも応募できますか？', answer: 'ポジションによっては未経験者向けの募集もあります。各求人の応募条件をご確認ください。ポテンシャル採用も積極的に行っています。' },
  { category: '選考について', question: '過去に不合格になった場合、再応募は可能ですか？', answer: '半年以上経過していれば再応募可能です。ぜひ再度チャレンジしてください。' },
  { category: '働き方について', question: 'リモートワークは可能ですか？', answer: '週3日までリモートワーク可能です。チームやプロジェクトの状況に応じて柔軟に対応しています。フルリモートのポジションもあります。' },
  { category: '働き方について', question: '残業はどのくらいですか？', answer: '月平均15時間程度です。生産性を重視しており、必要のない残業は推奨していません。' },
  { category: '働き方について', question: '副業は可能ですか？', answer: '事前申告制で副業を認めています。本業に支障がない範囲であれば自由に活動いただけます。' },
  { category: '制度・福利厚生', question: '研修制度はありますか？', answer: '入社後3ヶ月のオンボーディングプログラムがあります。技術研修、ビジネス研修、メンター制度を通じて早期のキャッチアップを支援します。' },
  { category: '制度・福利厚生', question: '書籍補助はありますか？', answer: '月1万円まで業務関連書籍の購入費を補助しています。電子書籍も対象です。' },
  { category: '制度・福利厚生', question: '育児休暇の取得実績は？', answer: '男女ともに育休取得率100%です。復帰後の時短勤務制度も整備しています。' },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = [...new Set(faqData.map((f) => f.category))];

  const filtered = faqData.filter((f) => {
    const matchesCategory = !selectedCategory || f.category === selectedCategory;
    const matchesSearch = !search || f.question.includes(search) || f.answer.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="キーワードで検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              !selectedCategory ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            すべて
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                selectedCategory === cat ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion */}
      <div className="mt-8 divide-y divide-gray-200 rounded-xl border border-gray-200">
        {filtered.length > 0 ? (
          filtered.map((item, i) => (
            <div key={i}>
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="flex w-full items-center justify-between px-6 py-5 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-gray-900 pr-4">
                  <span className="text-primary font-bold mr-2">Q.</span>
                  {item.question}
                </span>
                <svg
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-600 leading-relaxed pl-6">
                    <span className="text-accent font-bold mr-2">A.</span>
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="px-6 py-10 text-center text-sm text-gray-500">
            該当するFAQが見つかりませんでした。
          </p>
        )}
      </div>
    </div>
  );
}
