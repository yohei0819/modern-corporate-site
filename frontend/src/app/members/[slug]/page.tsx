import Link from 'next/link';
import Image from 'next/image';
import { getMember } from '@/lib/api';
import { sanitizeHtml } from '@/lib/sanitize';
import { SITE_URL } from '@/lib/constants';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getMember(slug);
    const title = `${res.data.name} - 社員紹介`;
    const description = res.data.catch_copy;
    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${SITE_URL}/members/${slug}`,
        ...(res.data.profile_image_url ? { images: [{ url: res.data.profile_image_url }] } : {}),
      },
      twitter: { title, description },
    };
  } catch {
    return { title: '社員が見つかりません' };
  }
}

export default async function MemberDetailPage({ params }: Props) {
  const { slug } = await params;
  let member;
  try {
    const res = await getMember(slug);
    member = res.data;
  } catch {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: '社員紹介', href: '/members' }, { label: member.name }]} />

      <div className="mt-6 sm:flex sm:gap-10">
        {/* Photo */}
        <div className="shrink-0">
          <div className="mx-auto sm:mx-0 h-56 w-56 overflow-hidden rounded-2xl bg-gray-200">
            {member.profile_image_url && (
              <Image
                src={member.profile_image_url}
                alt={member.name}
                width={224}
                height={224}
                sizes="224px"
                className="h-full w-full object-cover"
                priority
              />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 sm:mt-0">
          <p className="text-sm text-gray-500">
            {member.department} / {member.position}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">{member.name}</h1>
          <p className="mt-3 text-lg text-primary font-medium">{member.catch_copy}</p>
        </div>
      </div>

      {/* Message / Interview */}
      <section className="mt-12">
        <h2 className="text-xl font-bold text-gray-900 border-b pb-3">インタビュー</h2>
        <div
          className="mt-6 prose prose-gray max-w-none"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(member.message) }}
        />
      </section>

      {/* CTA */}
      <div className="mt-12 rounded-xl bg-primary/5 border border-primary/20 p-8 text-center">
        <h2 className="text-lg font-bold text-gray-900">一緒に働きませんか？</h2>
        <Link
          href="/entry"
          className="mt-4 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
        >
          エントリーする
        </Link>
      </div>

      <div className="mt-8">
        <Link href="/members" className="text-sm text-primary hover:underline">
          ← 社員紹介一覧に戻る
        </Link>
      </div>
    </div>
  );
}
