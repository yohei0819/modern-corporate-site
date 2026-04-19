import type { JobPosting, News } from '@/types';
import { SITE_URL } from '@/lib/constants';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'CORP.',
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.ico`,
    description: 'テクノロジーで未来を創る。CORP.の採用情報サイトです。',
    sameAs: [],
  };
}

export function webSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CORP. 採用サイト',
    url: SITE_URL,
    description: '募集職種、社員紹介、働く環境など採用に関する情報をお届けします。',
  };
}

export function jobPostingJsonLd(job: JobPosting) {
  const employmentTypeMap: Record<string, string> = {
    'full-time': 'FULL_TIME',
    contract: 'CONTRACTOR',
    'part-time': 'PART_TIME',
    intern: 'INTERN',
  };

  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: job.summary,
    datePosted: job.published_at || job.created_at,
    employmentType: employmentTypeMap[job.employment_type] || 'FULL_TIME',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressLocality: job.location,
        addressCountry: 'JP',
      },
    },
    hiringOrganization: {
      '@type': 'Organization',
      name: 'CORP.',
      sameAs: SITE_URL,
    },
    ...(job.salary_text
      ? {
          baseSalary: {
            '@type': 'MonetaryAmount',
            currency: 'JPY',
            value: { '@type': 'QuantitativeValue', value: job.salary_text },
          },
        }
      : {}),
  };
}

export function articleJsonLd(article: News) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt || article.title,
    datePublished: article.published_at || article.created_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Organization',
      name: 'CORP.',
    },
    publisher: {
      '@type': 'Organization',
      name: 'CORP.',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.ico`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/news/${article.slug}`,
    },
    ...(article.thumbnail_url ? { image: article.thumbnail_url } : {}),
  };
}
