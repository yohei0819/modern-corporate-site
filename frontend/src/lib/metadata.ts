import type { Metadata } from 'next';

const BASE_URL = 'https://frontend-yohei0819.vercel.app';

export function defineMetadata(
  title: string,
  description: string,
  path: string,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
    },
    twitter: {
      title,
      description,
    },
  };
}
