<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import { revalidateFrontend } from '@/services/api';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import { useToast } from '@/stores/toast';
import { useConfirm } from '@/composables/useConfirm';
import type { News, PaginatedResponse } from '@/types';

const router = useRouter();
const toast = useToast();
const { confirm } = useConfirm();
const newsList = ref<News[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const loading = ref(true);
const selectedIds = ref<Set<number>>(new Set());

const categoryMap: Record<string, { label: string; color: 'blue' | 'purple' | 'amber' }> = {
  info: { label: 'お知らせ', color: 'blue' },
  press: { label: 'プレス', color: 'purple' },
  event: { label: 'イベント', color: 'amber' },
};

async function fetchNews() {
  loading.value = true;
  try {
    const { data } = await api.get<PaginatedResponse<News>>('/admin/news', {
      params: { page: currentPage.value },
    });
    newsList.value = data.data;
    lastPage.value = data.last_page;
    total.value = data.total;
    selectedIds.value.clear();
  } finally {
    loading.value = false;
  }
}

function toggleSelect(id: number) {
  if (selectedIds.value.has(id)) selectedIds.value.delete(id);
  else selectedIds.value.add(id);
}

function toggleSelectAll() {
  if (selectedIds.value.size === newsList.value.length) selectedIds.value.clear();
  else selectedIds.value = new Set(newsList.value.map((n) => n.id));
}

async function deleteNews(id: number) {
  const ok = await confirm({
    title: 'お知らせを削除',
    message: 'このお知らせを削除しますか？この操作は取り消せません。',
    confirmLabel: '削除する',
    variant: 'danger',
  });
  if (!ok) return;
  try {
    await api.delete(`/admin/news/${id}`);
    toast.success('お知らせを削除しました');
    revalidateFrontend(['/', '/news']);
    await fetchNews();
  } catch {
    toast.error('削除に失敗しました');
  }
}

async function bulkDelete() {
  if (selectedIds.value.size === 0) return;
  const ok = await confirm({
    title: '一括削除',
    message: `選択した ${selectedIds.value.size} 件のお知らせを削除しますか？`,
    confirmLabel: '一括削除',
    variant: 'danger',
  });
  if (!ok) return;
  try {
    const results = await Promise.allSettled([...selectedIds.value].map((id) => api.delete(`/admin/news/${id}`)));
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    if (succeeded > 0) toast.success(`${succeeded} 件のお知らせを削除しました`);
    if (failed > 0) toast.error(`${failed} 件の削除に失敗しました`);
    revalidateFrontend(['/', '/news']);
    await fetchNews();
  } catch {
    toast.error('一括削除に失敗しました');
  }
}

watch(currentPage, fetchNews);
onMounted(fetchNews);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">お知らせ管理</h1>
      <div class="flex items-center gap-2">
        <button
          v-if="selectedIds.size > 0"
          class="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
          @click="bulkDelete"
        >
          {{ selectedIds.size }} 件を削除
        </button>
        <button
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
          @click="router.push({ name: 'news-create' })"
        >
          新規作成
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="skeleton h-4 w-1/3" />
          <div class="skeleton h-5 w-14 rounded-full" />
          <div class="skeleton h-5 w-14 rounded-full" />
          <div class="skeleton h-4 w-20" />
          <div class="flex-1" />
          <div class="skeleton h-4 w-16" />
        </div>
      </div>
      <div v-else-if="newsList.length === 0" class="p-8 text-center text-gray-500">お知らせがありません。</div>
      <div v-else class="table-responsive">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" :checked="selectedIds.size === newsList.length && newsList.length > 0" @change="toggleSelectAll" />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイトル</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">カテゴリ</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">公開日</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="news in newsList" :key="news.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" :checked="selectedIds.has(news.id)" @change="toggleSelect(news.id)" />
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ news.title }}</td>
              <td class="px-4 py-3 hidden sm:table-cell">
                <AppBadge v-bind="categoryMap[news.category] ?? { label: news.category, color: 'gray' }" />
              </td>
              <td class="px-4 py-3">
                <AppBadge
                  :label="news.status === 'published' ? '公開中' : '下書き'"
                  :color="news.status === 'published' ? 'green' : 'gray'"
                />
              </td>
              <td class="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{{ news.published_at ? new Date(news.published_at).toLocaleDateString('ja-JP') : '-' }}</td>
              <td class="px-4 py-3 text-right space-x-2">
                <button class="text-sm text-blue-600 hover:text-blue-800" @click="router.push({ name: 'news-edit', params: { id: news.id } })">編集</button>
                <button class="text-sm text-red-600 hover:text-red-800" @click="deleteNews(news.id)">削除</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <AppPagination v-model:current-page="currentPage" :last-page="lastPage" />
    <p class="mt-2 text-sm text-gray-500 text-center">全 {{ total }} 件</p>
  </div>
</template>
