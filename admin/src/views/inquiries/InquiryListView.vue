<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import type { Inquiry, PaginatedResponse } from '@/types';

const router = useRouter();
const inquiries = ref<Inquiry[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const loading = ref(true);

const statusMap: Record<string, { label: string; color: 'blue' | 'amber' | 'green' }> = {
  new: { label: '新規', color: 'blue' },
  in_progress: { label: '対応中', color: 'amber' },
  closed: { label: '完了', color: 'green' },
};

async function fetchInquiries() {
  loading.value = true;
  try {
    const { data } = await api.get<PaginatedResponse<Inquiry>>('/admin/inquiries', {
      params: { page: currentPage.value },
    });
    inquiries.value = data.data;
    lastPage.value = data.last_page;
    total.value = data.total;
  } finally {
    loading.value = false;
  }
}

watch(currentPage, fetchInquiries);
onMounted(fetchInquiries);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">問い合わせ管理</h1>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-8 text-center text-gray-500">読み込み中...</div>
      <div v-else-if="inquiries.length === 0" class="p-8 text-center text-gray-500">問い合わせがありません。</div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">氏名</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">カテゴリ</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">受付日</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200">
          <tr v-for="inquiry in inquiries" :key="inquiry.id" class="hover:bg-gray-50">
            <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ inquiry.name }}</td>
            <td class="px-4 py-3 text-sm text-gray-600">{{ inquiry.category }}</td>
            <td class="px-4 py-3">
              <AppBadge v-bind="statusMap[inquiry.status] ?? { label: inquiry.status, color: 'gray' }" />
            </td>
            <td class="px-4 py-3 text-sm text-gray-500">{{ new Date(inquiry.created_at).toLocaleDateString('ja-JP') }}</td>
            <td class="px-4 py-3 text-right">
              <button class="text-sm text-blue-600 hover:text-blue-800" @click="router.push({ name: 'inquiries-show', params: { id: inquiry.id } })">詳細</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <AppPagination v-model:current-page="currentPage" :last-page="lastPage" />
    <p class="mt-2 text-sm text-gray-500 text-center">全 {{ total }} 件</p>
  </div>
</template>
