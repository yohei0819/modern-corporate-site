import Link from 'next/link';
import { getJob } from '@/lib/api';
import { sanitizeHtml } from '@/lib/sanitize';
import { employmentTypeLabels } from '@/lib/constants';
import { jobPostingJsonLd } from '@/lib/json-ld';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getJob(slug);
    const title = res.data.title;
    const description = res.data.summary;
    return {
      title,
      description,
      openGraph: { title, description, url: `https://frontend-yohei0819.vercel.app/jobs/${slug}` },
      twitter: { title, description },
    };
  } catch {
    return { title: '求人が見つかりません' };
  }
}

export default async function JobDetailPage({ params }: Props) {
  const { slug } = await params;
  let job;
  try {
    const res = await getJob(slug);
    job = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd(job)) }}
      />
      <Breadcrumb
        items={[
          { label: '募集職種', href: '/jobs' },
          { label: job.title },
        ]}
      />

      <div className="mt-4">
        <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
          {employmentTypeLabels[job.employment_type] || job.employment_type}
        </span>
        <h1 className="mt-3 text-3xl font-bold text-gray-900 sm:text-4xl">{job.title}</h1>
        <p className="mt-3 text-lg text-gray-600">{job.summary}</p>
      </div>

      {/* 募集要項 */}
      <div className="mt-10 rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-gray-100">
              <th className="bg-gray-50 px-6 py-4 text-left font-medium text-gray-700 w-40">雇用形態</th>
              <td className="px-6 py-4">{employmentTypeLabels[job.employment_type] || job.employment_type}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="bg-gray-50 px-6 py-4 text-left font-medium text-gray-700">勤務地</th>
              <td className="px-6 py-4">{job.location}</td>
            </tr>
            <tr className="border-b border-gray-100">
              <th className="bg-gray-50 px-6 py-4 text-left font-medium text-gray-700">給与</th>
              <td className="px-6 py-4">{job.salary_text}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 仕事内容 */}
      {job.description && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">仕事内容</h2>
          <div
            className="mt-4 prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.description) }}
          />
        </section>
      )}

      {/* 応募条件 */}
      {job.requirements && (
        <section className="mt-10">
          <h2 className="text-xl font-bold text-gray-900 border-b pb-3">応募条件</h2>
          <div
            className="mt-4 prose prose-gray max-w-none"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(job.requirements) }}
          />
        </section>
      )}

      {/* CTA */}
      <div className="mt-12 rounded-xl bg-primary/5 border border-primary/20 p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900">この職種に応募する</h2>
        <p className="mt-2 text-sm text-gray-500">ご興味のある方はお気軽にご応募ください。</p>
        <Link
          href={`/entry?job=${job.id}`}
          className="mt-4 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
        >
          エントリーする
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/jobs" className="text-sm text-primary hover:underline">
          ← 募集職種一覧に戻る
        </Link>
      </div>
    </div>
  );
}
