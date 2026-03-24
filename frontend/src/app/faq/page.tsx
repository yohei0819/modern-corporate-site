import Breadcrumb from '@/components/layout/Breadcrumb';
import FaqAccordion from '@/components/forms/FaqAccordion';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ',
  description: 'CORP.の採用に関するよくある質問と回答をまとめました。',
};

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'FAQ' }]} />

      <h1 className="text-3xl font-bold text-gray-900">よくある質問</h1>
      <p className="mt-2 text-gray-500">採用に関するよくある質問をまとめました。</p>

      <div className="mt-8">
        <FaqAccordion />
      </div>
    </div>
  );
}
