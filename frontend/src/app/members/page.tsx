import Link from 'next/link';
import Image from 'next/image';
import { getMembers } from '@/lib/api';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Pagination from '@/components/common/Pagination';
import EmptyState from '@/components/common/EmptyState';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '社員紹介',
  description: 'CORP.で活躍する社員たちを紹介します。',
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;

  const res = await getMembers(page).catch(() => ({
    data: [],
    meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
  }));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: '社員紹介' }]} />

      <h1 className="text-3xl font-bold text-gray-900">社員紹介</h1>
      <p className="mt-2 text-gray-500">CORP.で活躍する仲間たちを紹介します。</p>

      {res.data.length > 0 ? (
        <>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {res.data.map((member) => (
              <Link
                key={member.id}
                href={`/members/${member.slug}`}
                className="group block rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow text-center"
              >
                <div className="mx-auto h-40 w-40 overflow-hidden rounded-full bg-gray-200">
                  {member.profile_image && (
                    <Image
                      src={member.profile_image}
                      alt={member.name}
                      width={160}
                      height={160}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  )}
                </div>
                <p className="mt-4 text-sm text-gray-500">{member.department} / {member.position}</p>
                <h2 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                  {member.name}
                </h2>
                <p className="mt-2 text-sm text-gray-500">{member.catch_copy}</p>
              </Link>
            ))}
          </div>
          <Pagination currentPage={res.meta.current_page} lastPage={res.meta.last_page} />
        </>
      ) : (
        <p className="mt-16 text-center text-gray-500">
          <EmptyState
            icon="👥"
            title="社員紹介は準備中です"
            description="現在コンテンツを準備しています。"
            actionLabel="トップに戻る"
            actionHref="/"
          />
        </p>
      )}
    </div>
  );
}
