import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/constants';

export function defineMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${path}`,
    },
    twitter: {
      title,
      description,
    },
  };
}
