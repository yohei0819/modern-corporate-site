import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import api from '@/services/api';
import type { User, LoginResponse } from '@/types';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('admin_token'));

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string): Promise<void> {
    const { data } = await api.post<LoginResponse>('/login', { email, password });
    user.value = data.user;
    token.value = data.token;
    localStorage.setItem('admin_token', data.token);
  }

  async function fetchUser(): Promise<void> {
    const { data } = await api.get<{ user: User }>('/me');
    user.value = data.user;
  }

  async function logout(): Promise<void> {
    try {
      await api.post('/logout');
    } finally {
      clearAuth();
    }
  }

  function clearAuth(): void {
    user.value = null;
    token.value = null;
    localStorage.removeItem('admin_token');
  }

  return { user, token, isAuthenticated, login, fetchUser, logout, clearAuth };
});
