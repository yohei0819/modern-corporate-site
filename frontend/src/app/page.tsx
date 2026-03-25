import Link from 'next/link';
import Image from 'next/image';
import { getJobs, getMembers, getNewsList } from '@/lib/api';
import { employmentTypeLabels } from '@/lib/constants';
import SectionTitle from '@/components/common/SectionTitle';
import Badge from '@/components/common/Badge';
import FadeIn from '@/components/common/FadeIn';

export default async function HomePage() {
  const [jobsRes, membersRes, newsRes] = await Promise.all([
    getJobs().catch(() => ({ data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } })),
    getMembers().catch(() => ({ data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } })),
    getNewsList().catch(() => ({ data: [], meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 } })),
  ]);

  const jobs = jobsRes.data.slice(0, 3);
  const members = membersRes.data.slice(0, 4);
  const news = newsRes.data.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-blue-700 to-primary-dark text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-200">
              Recruit
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-tight">
              テクノロジーで
              <br />
              未来を創る
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-blue-100">
              私たちは最先端の技術で社会課題を解決する企業です。
              一緒に未来を切り拓く仲間を募集しています。
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/entry"
                className="rounded-full bg-accent px-8 py-3 text-sm font-bold text-gray-900 hover:bg-accent-dark transition-colors"
              >
                エントリーする
              </Link>
              <Link
                href="/jobs"
                className="rounded-full border-2 border-white/50 px-8 py-3 text-sm font-bold hover:bg-white/10 transition-colors"
              >
                募集職種を見る
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionTitle title="募集職種" subtitle="Careers" />
          </FadeIn>
          {jobs.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {jobs.map((job, i) => (
                <FadeIn key={job.id} delay={i * 100}>
                <Link
                  href={`/jobs/${job.slug}`}
                  className="group block rounded-xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <span className="inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary">
                    {employmentTypeLabels[job.employment_type] || job.employment_type}
                  </span>
                  <h3 className="mt-3 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {job.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{job.summary}</p>
                  <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
                    <span>📍 {job.location}</span>
                    <span>{job.salary_text}</span>
                  </div>
                </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-gray-500">現在募集中の職種はありません。</p>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              すべての職種を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* Members */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionTitle title="社員紹介" subtitle="People" />
          </FadeIn>
          {members.length > 0 ? (
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {members.map((member, i) => (
                <FadeIn key={member.id} delay={i * 100}>
                <Link
                  href={`/members/${member.slug}`}
                  className="group block text-center"
                >
                  <div className="mx-auto h-48 w-48 overflow-hidden rounded-full bg-gray-200">
                    {member.profile_image && (
                      <Image
                        src={member.profile_image}
                        alt={member.name}
                        width={192}
                        height={192}
                        sizes="192px"
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <p className="mt-4 text-sm text-gray-500">{member.department}</p>
                  <h3 className="mt-1 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">{member.catch_copy}</p>
                </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-gray-500">社員紹介は準備中です。</p>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/members"
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              すべての社員を見る →
            </Link>
          </div>
        </div>
      </section>

      {/* News */}
      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <FadeIn>
            <SectionTitle title="お知らせ" subtitle="News" />
          </FadeIn>
          {news.length > 0 ? (
            <div className="mt-12 space-y-4 max-w-3xl mx-auto">
              {news.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.slug}`}
                  className="flex items-start gap-4 rounded-lg bg-white p-4 border border-gray-100 hover:shadow-sm transition-shadow"
                >
                  <time className="shrink-0 text-sm text-gray-400 mt-0.5">
                    {new Date(item.published_at || item.created_at).toLocaleDateString('ja-JP')}
                  </time>
                  <Badge category={item.category} />
                  <span className="text-sm font-medium text-gray-900 hover:text-primary">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p className="mt-12 text-center text-gray-500">お知らせはまだありません。</p>
          )}
          <div className="mt-10 text-center">
            <Link
              href="/news"
              className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
            >
              すべてのお知らせを見る →
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <FadeIn>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            一緒に未来を創りませんか？
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            あなたの力を、私たちに貸してください。
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/entry"
              className="rounded-full bg-accent px-10 py-3.5 text-sm font-bold text-gray-900 hover:bg-accent-dark transition-colors"
            >
              エントリーする
            </Link>
            <Link
              href="/contact"
              className="rounded-full border-2 border-white/50 px-10 py-3.5 text-sm font-bold text-white hover:bg-white/10 transition-colors"
            >
              お問い合わせ
            </Link>
          </div>
          </FadeIn>
        </div>
      </section>
    </>
  );
}
