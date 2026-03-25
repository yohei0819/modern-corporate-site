<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import api from '@/services/api';
import AppPagination from '@/components/ui/AppPagination.vue';
import type { ActivityLog, PaginatedResponse } from '@/types';

const logs = ref<ActivityLog[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const loading = ref(true);

const actionLabels: Record<string, { label: string; color: string }> = {
  create: { label: '作成', color: 'bg-green-100 text-green-800' },
  update: { label: '更新', color: 'bg-blue-100 text-blue-800' },
  delete: { label: '削除', color: 'bg-red-100 text-red-800' },
  status_change: { label: 'ステータス変更', color: 'bg-amber-100 text-amber-800' },
};

const targetLabels: Record<string, string> = {
  JobPosting: '求人',
  Member: '社員',
  News: 'お知らせ',
  Application: '応募',
  Inquiry: '問い合わせ',
};

async function fetchLogs() {
  loading.value = true;
  try {
    const { data } = await api.get<PaginatedResponse<ActivityLog>>('/admin/activity-logs', {
      params: { page: currentPage.value },
    });
    logs.value = data.data;
    lastPage.value = data.last_page;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

watch(currentPage, fetchLogs);
onMounted(fetchLogs);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">アクティビティログ</h1>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">読み込み中...</div>
      <div v-else-if="logs.length === 0" class="p-8 text-center text-gray-500">アクティビティがありません。</div>
      <div v-else class="divide-y divide-gray-200">
        <div v-for="log in logs" :key="log.id" class="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
          <div class="flex-shrink-0 mt-0.5">
            <span
              :class="[
                'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
                actionLabels[log.action]?.color ?? 'bg-gray-100 text-gray-800',
              ]"
            >
              {{ actionLabels[log.action]?.label ?? log.action }}
            </span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm text-gray-900">{{ log.description }}</p>
            <div class="mt-1 flex items-center gap-3 text-xs text-gray-500">
              <span v-if="log.user">{{ log.user.name }}</span>
              <span v-if="log.target_type">{{ targetLabels[log.target_type] ?? log.target_type }}</span>
              <span>{{ formatDate(log.created_at) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <AppPagination v-model:current-page="currentPage" :last-page="lastPage" />
    <p class="mt-2 text-sm text-gray-500 text-center">全 {{ total }} 件</p>
  </div>
</template>
