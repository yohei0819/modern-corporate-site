import { describe, it, expect, vi, beforeEach } from 'vitest';

const API_URL = 'http://localhost:8000';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Import after mocking
const { getJobs, getJob, getMembers, getMember, getNewsList, getNewsDetail } = await import('@/lib/api');

beforeEach(() => {
  mockFetch.mockReset();
});

describe('API Client', () => {
  it('getJobs fetches from /api/jobs', async () => {
    const mockData = { data: [], meta: { current_page: 1, last_page: 1, per_page: 10, total: 0 } };
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve(mockData) });

    const result = await getJobs();
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/api/jobs`,
      expect.objectContaining({ headers: expect.objectContaining({ Accept: 'application/json' }) }),
    );
    expect(result).toEqual(mockData);
  });

  it('getJobs passes query params', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    await getJobs({ employment_type: 'full_time', page: 2 });
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('employment_type=full_time');
    expect(calledUrl).toContain('page=2');
  });

  it('getJob fetches by slug', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({ data: {} }) });

    await getJob('backend-engineer');
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/api/jobs/backend-engineer`,
      expect.any(Object),
    );
  });

  it('getMembers fetches from /api/members', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    await getMembers(3);
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('/api/members?page=3');
  });

  it('getMember fetches by slug', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    await getMember('tanaka-taro');
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/api/members/tanaka-taro`,
      expect.any(Object),
    );
  });

  it('getNewsList passes category filter', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    await getNewsList({ category: 'press', page: 1 });
    const calledUrl = mockFetch.mock.calls[0][0] as string;
    expect(calledUrl).toContain('category=press');
  });

  it('getNewsDetail fetches by slug', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) });

    await getNewsDetail('news-slug');
    expect(mockFetch).toHaveBeenCalledWith(
      `${API_URL}/api/news/news-slug`,
      expect.any(Object),
    );
  });

  it('throws on non-ok response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 404, statusText: 'Not Found' });

    await expect(getJob('nonexistent')).rejects.toThrow('API Error: 404 Not Found');
  });
});
