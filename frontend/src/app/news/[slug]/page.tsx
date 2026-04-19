import Link from 'next/link';
import Image from 'next/image';
import { getNewsDetail } from '@/lib/api';
import { sanitizeHtml } from '@/lib/sanitize';
import { articleJsonLd } from '@/lib/json-ld';
import { SITE_URL } from '@/lib/constants';
import Breadcrumb from '@/components/layout/Breadcrumb';
import Badge from '@/components/common/Badge';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getNewsDetail(slug);
    const title = res.data.title;
    const description = res.data.excerpt || res.data.title;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/news/${slug}`,
        ...(res.data.thumbnail_url ? { images: [{ url: res.data.thumbnail_url }] } : {}),
      },
      twitter: { title, description },
    };
  } catch {
    return { title: '記事が見つかりません' };
  }
}

export default async function NewsDetailPage({ params }: Props) {
  const { slug } = await params;
  let article;
  try {
    const res = await getNewsDetail(slug);
    article = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd(article)) }}
      />
      <Breadcrumb items={[{ label: 'お知らせ', href: '/news' }, { label: article.title }]} />

      <article className="mt-4">
        <div className="flex items-center gap-3">
          <time className="text-sm text-gray-400">
            {new Date(article.published_at || article.created_at).toLocaleDateString('ja-JP')}
          </time>
          <Badge category={article.category} />
        </div>

        <h1 className="mt-4 text-3xl font-bold text-gray-900 leading-tight">{article.title}</h1>

        {article.thumbnail_url && (
          <div className="mt-6 rounded-xl overflow-hidden">
            <Image
              src={article.thumbnail_url}
              alt={article.title}
              width={800}
              height={450}
              sizes="(max-width: 768px) 100vw, 800px"
              className="w-full h-auto"
              priority
            />
          </div>
        )}

        <div
          className="mt-8 prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.body) }}
        />
      </article>

      <div className="mt-12 border-t pt-6">
        <Link href="/news" className="text-sm text-primary hover:underline">
          ← お知らせ一覧に戻る
        </Link>
      </div>
    </div>
  );
}
