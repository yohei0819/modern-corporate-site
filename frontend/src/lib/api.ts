import type { JobPosting, Member, News, PaginatedResponse } from '@/types';

const API_URL = process.env.API_URL || 'http://localhost:8000';
const MAX_RETRIES = 2;
const RETRY_DELAY = 3000;

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'Accept': 'application/json',
          ...options?.headers,
        },
        next: { revalidate: 60 },
        ...options,
      });

      if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }

      return res.json();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)));
      }
    }
  }

  throw lastError!;
}

export async function getJobs(params?: {
  employment_type?: string;
  location?: string;
  page?: number;
}) {
  const query = new URLSearchParams();
  if (params?.employment_type) query.set('employment_type', params.employment_type);
  if (params?.location) query.set('location', params.location);
  if (params?.page) query.set('page', String(params.page));
  const qs = query.toString();
  return fetchApi<PaginatedResponse<JobPosting>>(`/jobs${qs ? `?${qs}` : ''}`);
}

export async function getJob(slug: string) {
  return fetchApi<{ data: JobPosting }>(`/jobs/${slug}`);
}

export async function getMembers(page?: number) {
  const qs = page ? `?page=${page}` : '';
  return fetchApi<PaginatedResponse<Member>>(`/members${qs}`);
}

export async function getMember(slug: string) {
  return fetchApi<{ data: Member }>(`/members/${slug}`);
}

export async function getNewsList(params?: { category?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.page) query.set('page', String(params.page));
  const qs = query.toString();
  return fetchApi<PaginatedResponse<News>>(`/news${qs ? `?${qs}` : ''}`);
}

export async function getNewsDetail(slug: string) {
  return fetchApi<{ data: News }>(`/news/${slug}`);
}


