<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const stats = ref({ jobs: 0, applications: 0, newApplications: 0, inquiries: 0 });
const loading = ref(true);

onMounted(async () => {
  try {
    const [jobsRes, appsRes, inquiriesRes] = await Promise.all([
      api.get('/admin/jobs', { params: { per_page: 1 } }),
      api.get('/admin/applications', { params: { per_page: 1 } }),
      api.get('/admin/inquiries', { params: { per_page: 1 } }),
    ]);
    stats.value = {
      jobs: jobsRes.data.total ?? 0,
      applications: appsRes.data.total ?? 0,
      newApplications: appsRes.data.data?.filter((a: { status: string }) => a.status === 'new').length ?? 0,
      inquiries: inquiriesRes.data.total ?? 0,
    };
  } finally {
    loading.value = false;
  }
});

const cards = [
  { label: '公開中求人', key: 'jobs' as const, color: 'bg-blue-500', to: '/jobs' },
  { label: '応募件数', key: 'applications' as const, color: 'bg-green-500', to: '/applications' },
  { label: '未対応応募', key: 'newApplications' as const, color: 'bg-amber-500', to: '/applications' },
  { label: '問い合わせ', key: 'inquiries' as const, color: 'bg-purple-500', to: '/inquiries' },
];
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

    <div v-if="loading" class="text-gray-500">読み込み中...</div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <RouterLink
        v-for="card in cards"
        :key="card.key"
        :to="card.to"
        class="block rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-4">
          <div :class="[card.color, 'w-12 h-12 rounded-lg flex items-center justify-center']">
            <span class="text-white text-xl font-bold">{{ stats[card.key] }}</span>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ card.label }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats[card.key] }}</p>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>
