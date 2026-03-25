import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

// Mock the api service module before importing auth store
vi.mock('@/services/api', () => ({
  default: {
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    post: vi.fn(),
    get: vi.fn(),
  },
}));

vi.mock('@/router', () => ({
  default: { push: vi.fn() },
}));

const { useAuthStore } = await import('@/stores/auth');

beforeEach(() => {
  setActivePinia(createPinia());
  localStorage.clear();
});

describe('Auth Store', () => {
  it('initializes with no user and no token', () => {
    const store = useAuthStore();
    expect(store.user).toBeNull();
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });

  it('isAuthenticated is true when token exists', () => {
    localStorage.setItem('auth_token', 'test-token');
    const store = useAuthStore();
    // Re-read from localStorage
    store.token = 'test-token';
    expect(store.isAuthenticated).toBe(true);
  });

  it('clearAuth resets state', () => {
    const store = useAuthStore();
    store.token = 'test-token';
    store.user = { id: 1, name: 'Test', email: 'test@example.com', role: 'admin' } as typeof store.user;
    store.clearAuth();
    expect(store.token).toBeNull();
    expect(store.user).toBeNull();
    expect(store.isAuthenticated).toBe(false);
  });
});
