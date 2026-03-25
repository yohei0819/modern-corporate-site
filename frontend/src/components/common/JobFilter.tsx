'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

const employmentTypes = [
  { value: '', label: 'すべて' },
  { value: 'full-time', label: '正社員' },
  { value: 'contract', label: '契約社員' },
  { value: 'part-time', label: 'パートタイム' },
  { value: 'intern', label: 'インターン' },
];

export default function JobFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentType = searchParams.get('employment_type') ?? '';
  const currentKeyword = searchParams.get('keyword') ?? '';

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete('page');
      router.push(`/jobs?${params.toString()}`);
    },
    [router, searchParams],
  );

  return (
    <div className="mt-6 flex flex-col sm:flex-row gap-3">
      <div className="flex flex-wrap gap-2">
        {employmentTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => updateParams('employment_type', type.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              currentType === type.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>
      <div className="relative sm:ml-auto">
        <input
          type="text"
          placeholder="キーワードで検索..."
          defaultValue={currentKeyword}
          onChange={(e) => {
            const value = e.target.value;
            if (value.length === 0 || value.length >= 2) {
              updateParams('keyword', value);
            }
          }}
          className="w-full sm:w-64 rounded-lg border border-gray-300 px-4 py-2 text-sm placeholder-gray-400 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
          🔍
        </span>
      </div>
    </div>
  );
}
