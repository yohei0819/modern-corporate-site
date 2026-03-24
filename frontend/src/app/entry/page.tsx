import Breadcrumb from '@/components/layout/Breadcrumb';
import EntryForm from '@/components/forms/EntryForm';
import { Suspense } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'エントリー',
  description: 'CORP.の求人にエントリーする。必要事項をご入力ください。',
};

export default function EntryPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'エントリー' }]} />

      <h1 className="text-3xl font-bold text-gray-900">エントリー</h1>
      <p className="mt-2 text-gray-500">ご応募お待ちしております。下記フォームにご入力ください。</p>

      <div className="mt-8">
        <Suspense fallback={<div className="text-center py-10 text-gray-400">読み込み中...</div>}>
          <EntryForm />
        </Suspense>
      </div>
    </div>
  );
}
