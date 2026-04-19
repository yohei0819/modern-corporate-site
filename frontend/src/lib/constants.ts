export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://frontend-yohei0819.vercel.app';

export const PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const employmentTypeLabels: Record<string, string> = {
  'full-time': '正社員',
  contract: '契約社員',
  'part-time': 'パートタイム',
  internshipship: 'インターン',
};

export const newsCategoryLabels: Record<string, string> = {
  info: 'お知らせ',
  press: 'プレスリリース',
  event: 'イベント',
  blog: 'ブログ',
};

export const newsCategoryColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800',
  press: 'bg-purple-100 text-purple-800',
  event: 'bg-green-100 text-green-800',
  blog: 'bg-amber-100 text-amber-800',
};
