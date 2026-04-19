import Link from 'next/link';
import { getNewsList } from '@/lib/api';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Badge from '@/components/common/Badge';
import Pagination from '@/components/common/Pagination';
import { newsCategoryLabels } from '@/lib/constants';
import { defineMetadata } from '@/lib/metadata';

export const revalidate = 60;

export const metadata = defineMetadata(
  'お知らせ',
  'CORP.の最新のお知らせ、プレスリリース、イベント情報をお届けします。',
  '/news',
);

const categories = [
  { value: '', label: 'すべて' },
  ...Object.entries(newsCategoryLabels).map(([value, label]) => ({ value, label })),
];

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = typeof params.category === 'string' ? params.category : undefined;

  const res = await getNewsList({ page, category }).catch((e) => {
    console.error('[News] API fetch failed:', e);
    return { data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } } as const;
  });

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'お知らせ' }]} />

      <h1 className="text-3xl font-bold text-gray-900">お知らせ</h1>

      {/* Category filter */}
      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <Link
            key={cat.value}
            href={cat.value ? `/news?category=${cat.value}` : '/news'}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              (category || '') === cat.value
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat.label}
          </Link>
        ))}
      </div>

      {res.data.length > 0 ? (
        <>
          <div className="mt-8 divide-y divide-gray-100">
            {res.data.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="flex items-start gap-4 py-5 hover:bg-gray-50 -mx-4 px-4 rounded-lg transition-colors"
              >
                <time className="shrink-0 text-sm text-gray-400 mt-0.5 w-24">
                  {new Date(item.published_at || item.created_at).toLocaleDateString('ja-JP')}
                </time>
                <Badge category={item.category} />
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm font-medium text-gray-900">{item.title}</h2>
                  {item.excerpt && (
                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">{item.excerpt}</p>
                  )}
                </div>
              </Link>
            ))}
          </div>
          <Pagination currentPage={res.meta.current_page} lastPage={res.meta.last_page} />
        </>
      ) : (
        <p className="mt-16 text-center text-gray-500">お知らせはまだありません。</p>
      )}
    </div>
  );
}
