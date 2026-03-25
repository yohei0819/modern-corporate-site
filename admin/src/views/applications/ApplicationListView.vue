<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import { useToast } from '@/stores/toast';
import type { Application, PaginatedResponse } from '@/types';

const router = useRouter();
const toast = useToast();
const applications = ref<Application[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const loading = ref(true);

const statusMap: Record<string, { label: string; color: 'blue' | 'amber' | 'purple' | 'green' | 'red' }> = {
  new: { label: '新規', color: 'blue' },
  reviewing: { label: '選考中', color: 'amber' },
  interviewed: { label: '面接済', color: 'purple' },
  accepted: { label: '採用', color: 'green' },
  rejected: { label: '不採用', color: 'red' },
};

async function fetchApplications() {
  loading.value = true;
  try {
    const { data } = await api.get<PaginatedResponse<Application>>('/admin/applications', {
      params: { page: currentPage.value },
    });
    applications.value = data.data;
    lastPage.value = data.last_page;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

async function exportCsv() {
  try {
    const { data } = await api.get('/admin/applications/export', { responseType: 'blob' });
    const url = URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'applications.csv';
    a.click();
    URL.revokeObjectURL(url);
  } catch {
    toast.error('CSVのエクスポートに失敗しました');
  }
}

watch(currentPage, fetchApplications);
onMounted(fetchApplications);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">応募管理</h1>
      <button
        class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        @click="exportCsv"
      >
        CSV エクスポート
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">読み込み中...</div>
      <div v-else-if="applications.length === 0" class="p-8 text-center text-gray-500">応募がありません。</div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">求人</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">応募日</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="app in applications" :key="app.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ app.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ app.job_posting?.title ?? '-' }}</td>
            <td class="px-4 py-3">
              <AppBadge v-bind="statusMap[app.status] ?? { label: app.status, color: 'gray' }" />
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(app.created_at).toLocaleDateString('ja-JP') }}</td>
            <td class="px-4 py-3 text-right">
              <button
                class="text-sm text-blue-600 hover:text-blue-800"
                @click="router.push({ name: 'applications-show', params: { id: app.id } })"
              >
                詳細
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppPagination v-model:current-page="currentPage" :last-page="lastPage" />
    <p class="mt-2 text-sm text-gray-500 text-center">全 {{ total }} 件</p>
  </div>
</template>
