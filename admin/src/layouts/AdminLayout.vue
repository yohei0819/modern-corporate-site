<script setup lang="ts">
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();
const sidebarOpen = ref(false);

const navigation = [
  { name: 'ダッシュボード', to: '/', icon: '🏠' },
  { name: '求人管理', to: '/jobs', icon: '💼' },
  { name: '応募管理', to: '/applications', icon: '📥' },
  { name: '社員管理', to: '/members', icon: '👥' },
  { name: 'お知らせ管理', to: '/news', icon: '📰' },
  { name: '問い合わせ', to: '/inquiries', icon: '✉️' },
  { name: 'メディア', to: '/media', icon: '🖼️' },
  { name: '設定', to: '/settings', icon: '⚙️' },
];

function isActive(path: string): boolean {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
}

async function handleLogout() {
  await authStore.logout();
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Mobile sidebar overlay -->
    <div
      v-if="sidebarOpen"
      class="fixed inset-0 z-40 bg-black/50 lg:hidden"
      @click="sidebarOpen = false"
    />

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
      ]"
    >
      <div class="flex items-center h-16 px-6 border-b border-gray-200">
        <h1 class="text-lg font-bold text-gray-900">管理画面</h1>
      </div>
      <nav class="p-4 space-y-1">
        <RouterLink
          v-for="item in navigation"
          :key="item.to"
          :to="item.to"
          :class="[
            'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
            isActive(item.to)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100',
          ]"
          @click="sidebarOpen = false"
        >
          <span class="text-base" aria-hidden="true">{{ item.icon }}</span>
          {{ item.name }}
        </RouterLink>
      </nav>
    </aside>

    <!-- Main content -->
    <div class="lg:pl-64">
      <!-- Top header -->
      <header class="sticky top-0 z-30 flex items-center justify-between h-16 px-4 bg-white border-b border-gray-200 sm:px-6">
        <button
          class="p-2 -ml-2 text-gray-500 lg:hidden hover:text-gray-700"
          @click="sidebarOpen = true"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div class="flex-1" />
        <div class="flex items-center gap-4">
          <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
          <button
            class="text-sm text-gray-500 hover:text-gray-700"
            @click="handleLogout"
          >
            ログアウト
          </button>
        </div>
      </header>

      <!-- Page content -->
      <main class="p-4 sm:p-6">
        <slot />
      </main>
    </div>
  </div>
</template>
