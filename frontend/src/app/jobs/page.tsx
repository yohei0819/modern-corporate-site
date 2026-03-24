import Link from 'next/link';
import { getJobs } from '@/lib/api';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Pagination from '@/components/common/Pagination';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '募集職種',
  description: 'CORP.の募集職種一覧です。エンジニア、デザイナーなど多様なポジションで採用を行っています。',
};

const employmentTypeLabels: Record<string, string> = {
  'full-time': '正社員',
  'contract': '契約社員',
  'part-time': 'パートタイム',
  'intern': 'インターン',
};

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const employment_type = typeof params.employment_type === 'string' ? params.employment_type : undefined;
  const category = typeof params.category === 'string' ? params.category : undefined;
  const location = typeof params.location === 'string' ? params.location : undefined;

  const res = await getJobs({ page, employment_type, category, location }).catch(() => ({
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: '募集職種' }]} />

      <h1 className="text-3xl font-bold text-gray-900">募集職種</h1>
      <p className="mt-2 text-gray-500">あなたに合ったポジションを見つけてください。</p>

      {res.data.length > 0 ? (
        <>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {res.data.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="group block rounded-xl bg-white p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
              >
                <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
                  {employmentTypeLabels[job.employment_type] || job.employment_type}
                </span>
                <h2 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {job.title}
                </h2>
                <p className="mt-2 text-sm text-gray-500 line-clamp-2">{job.summary}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                  <span>📍 {job.location}</span>
                  <span>{job.salary_text}</span>
                </div>
              </Link>
            ))}
          </div>
          <Pagination currentPage={res.meta.current_page} lastPage={res.meta.last_page} />
        </>
      ) : (
        <div className="mt-16 text-center">
          <p className="text-gray-500">現在募集中の職種はありません。</p>
          <Link href="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            トップに戻る
          </Link>
        </div>
      )}
    </div>
  );
}
