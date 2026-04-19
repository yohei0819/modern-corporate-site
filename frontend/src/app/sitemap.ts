import type { MetadataRoute } from 'next';
import { getJobs, getMembers, getNewsList } from '@/lib/api';
import { SITE_URL } from '@/lib/constants';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/business`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/culture`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    { url: `${SITE_URL}/jobs`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    {
      url: `${SITE_URL}/members`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    { url: `${SITE_URL}/news`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${SITE_URL}/faq`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    {
      url: `${SITE_URL}/entry`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const [jobsRes, membersRes, newsRes] = await Promise.all([
    getJobs().catch(() => ({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
    })),
    getMembers().catch(() => ({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
    })),
    getNewsList().catch(() => ({
      data: [],
      meta: { current_page: 1, last_page: 1, per_page: 12, total: 0 },
    })),
  ]);

  const jobPages: MetadataRoute.Sitemap = jobsRes.data.map((job) => ({
    url: `${SITE_URL}/jobs/${job.slug}`,
    lastModified: new Date(job.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const memberPages: MetadataRoute.Sitemap = membersRes.data.map((member) => ({
    url: `${SITE_URL}/members/${member.slug}`,
    lastModified: new Date(member.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  const newsPages: MetadataRoute.Sitemap = newsRes.data.map((news) => ({
    url: `${SITE_URL}/news/${news.slug}`,
    lastModified: new Date(news.updated_at),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...jobPages, ...memberPages, ...newsPages];
}
