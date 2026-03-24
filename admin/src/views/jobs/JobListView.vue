<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import type { JobPosting, PaginatedResponse } from '@/types';

const router = useRouter();
const jobs = ref<JobPosting[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const loading = ref(true);

async function fetchJobs() {
  loading.value = true;
  try {
    const { data } = await api.get<PaginatedResponse<JobPosting>>('/admin/jobs', {
      params: { page: currentPage.value },
    });
    jobs.value = data.data;
    lastPage.value = data.last_page;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

async function deleteJob(id: number) {
  if (!confirm('この求人を削除しますか？')) return;
  await api.delete(`/admin/jobs/${id}`);
  await fetchJobs();
}

function statusBadge(status: string) {
  return status === 'published'
    ? { label: '公開中', color: 'green' as const }
    : { label: '下書き', color: 'gray' as const };
}

watch(currentPage, fetchJobs);
onMounted(fetchJobs);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">求人管理</h1>
      <button
        class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        @click="router.push({ name: 'jobs-create' })"
      >
        新規作成
      </button>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">読み込み中...</div>
      <div v-else-if="jobs.length === 0" class="p-8 text-center text-gray-500">求人がありません。</div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">タイトル</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">雇用形態</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">勤務地</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="job in jobs" :key="job.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ job.title }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ job.employment_type }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ job.location }}</td>
            <td class="px-4 py-3">
              <AppBadge v-bind="statusBadge(job.status)" />
            </td>
            <td class="px-4 py-3 text-right space-x-2">
              <button
                class="text-sm text-blue-600 hover:text-blue-800"
                @click="router.push({ name: 'jobs-edit', params: { id: job.id } })"
              >
                編集
              </button>
              <button
                class="text-sm text-red-600 hover:text-red-800"
                @click="deleteJob(job.id)"
              >
                削除
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
