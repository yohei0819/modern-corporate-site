import { Suspense } from 'react';
import Link from 'next/link';
import { getJobs } from '@/lib/api';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import JobFilter from '@/components/common/JobFilter';
import { defineMetadata } from '@/lib/metadata';
import { employmentTypeLabels } from '@/lib/constants';

export const revalidate = 60;

export const metadata = defineMetadata(
  '募集職種',
  'CORP.の募集職種一覧です。エンジニア、デザイナーなど多様なポジションで採用を行っています。',
  '/jobs',
);

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const employment_type = typeof params.employment_type === 'string' ? params.employment_type : undefined;
  const location = typeof params.location === 'string' ? params.location : undefined;

  const res = await getJobs({ page, employment_type, location }).catch((e) => {
    console.error('[Jobs] API fetch failed:', e);
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } } as const;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: '募集職種' }]} />

      <h1 className="text-3xl font-bold text-gray-900">募集職種</h1>
      <p className="mt-2 text-gray-500">あなたに合ったポジションを見つけてください。</p>

      <Suspense fallback={null}>
        <JobFilter />
      </Suspense>

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
        <EmptyState
          icon="💼"
          title="現在募集中の職種はありません"
          description="新しい募集が開始された際にこちらに掲載されます。"
          actionLabel="トップに戻る"
          actionHref="/"
        />
      )}
    </div>
  );
}
