const API_URL = process.env.API_URL || 'http://localhost:8000';

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const url = `${API_URL}/api${endpoint}`;
  const res = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API Error: ${res.status} ${res.statusText}`);
  }

  return res.json();
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
  return fetchApi<{
    data: import('@/types').JobPosting[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  }>(`/jobs${qs ? `?${qs}` : ''}`);
}

export async function getJob(slug: string) {
  return fetchApi<{ data: import('@/types').JobPosting }>(`/jobs/${slug}`);
}

export async function getMembers(page?: number) {
  const qs = page ? `?page=${page}` : '';
  return fetchApi<{
    data: import('@/types').Member[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  }>(`/members${qs}`);
}

export async function getMember(slug: string) {
  return fetchApi<{ data: import('@/types').Member }>(`/members/${slug}`);
}

export async function getNewsList(params?: { category?: string; page?: number }) {
  const query = new URLSearchParams();
  if (params?.category) query.set('category', params.category);
  if (params?.page) query.set('page', String(params.page));
  const qs = query.toString();
  return fetchApi<{
    data: import('@/types').News[];
    meta: { current_page: number; last_page: number; per_page: number; total: number };
  }>(`/news${qs ? `?${qs}` : ''}`);
}

export async function getNewsDetail(slug: string) {
  return fetchApi<{ data: import('@/types').News }>(`/news/${slug}`);
}

export async function submitApplication(formData: FormData) {
  const url = `${API_URL}/api/applications`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Accept': 'application/json' },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json();
    throw { status: res.status, ...body };
  }
  return res.json();
}

export async function submitInquiry(data: import('@/types').InquiryFormData) {
  const url = `${API_URL}/api/inquiries`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const body = await res.json();
    throw { status: res.status, ...body };
  }
  return res.json();
}
