<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Bar, Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '@/services/api';
import { APPLICATION_STATUS_MAP } from '@/constants/status';
import type { Application } from '@/types';

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const stats = ref({ jobs: 0, applications: 0, newApplications: 0, inquiries: 0 });
const applications = ref<Application[]>([]);
const loading = ref(true);
const error = ref('');

onMounted(async () => {
  try {
    const [jobsRes, appsRes, inquiriesRes] = await Promise.all([
      api.get('/admin/jobs', { params: { per_page: 1 } }),
      api.get('/admin/applications', { params: { per_page: 100 } }),
      api.get('/admin/inquiries', { params: { per_page: 1 } }),
    ]);
    stats.value = {
      jobs: jobsRes.data.total ?? 0,
      applications: appsRes.data.total ?? 0,
      newApplications:
        appsRes.data.data?.filter((a: { status: string }) => a.status === 'unread').length ?? 0,
      inquiries: inquiriesRes.data.total ?? 0,
    };
    applications.value = appsRes.data.data ?? [];
  } catch {
    error.value = 'データの取得に失敗しました。';
  } finally {
    loading.value = false;
  }
});

const cards = [
  { label: '公開中求人', key: 'jobs' as const, color: 'bg-blue-500', icon: '💼', to: '/jobs' },
  {
    label: '応募件数',
    key: 'applications' as const,
    color: 'bg-green-500',
    icon: '📥',
    to: '/applications',
  },
  {
    label: '未対応応募',
    key: 'newApplications' as const,
    color: 'bg-amber-500',
    icon: '🔔',
    to: '/applications',
  },
  {
    label: '問い合わせ',
    key: 'inquiries' as const,
    color: 'bg-purple-500',
    icon: '✉️',
    to: '/inquiries',
  },
];

// Monthly application trend (last 6 months)
const monthlyChartData = computed(() => {
  const now = new Date();
  const months: string[] = [];
  const counts: number[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = `${d.getMonth() + 1}月`;
    months.push(label);

    const count = applications.value.filter((app) => {
      const created = new Date(app.created_at);
      return created.getFullYear() === d.getFullYear() && created.getMonth() === d.getMonth();
    }).length;
    counts.push(count);
  }

  return {
    labels: months,
    datasets: [
      {
        label: '応募数',
        data: counts,
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderRadius: 6,
      },
    ],
  };
});

// Application status distribution
const statusChartData = computed(() => {
  const entries = Object.entries(APPLICATION_STATUS_MAP);
  const labels = entries.map(([, v]) => v.label);
  const colors = entries.map(([, v]) => v.hex);
  const data = entries.map(
    ([key]) => applications.value.filter((app) => app.status === key).length,
  );

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderWidth: 0,
      },
    ],
  };
});

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } },
  scales: {
    y: { beginAtZero: true, ticks: { stepSize: 1 } },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' as const },
  },
};
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">ダッシュボード</h1>

    <!-- Error -->
    <div
      v-if="error"
      class="mb-6 rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700"
    >
      {{ error }}
    </div>

    <!-- Skeleton loading -->
    <div v-if="loading" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div v-for="i in 4" :key="i" class="rounded-xl bg-white border border-gray-200 p-6">
        <div class="flex items-center gap-4">
          <div class="skeleton w-12 h-12 rounded-lg" />
          <div class="flex-1">
            <div class="skeleton h-4 w-20 mb-2" />
            <div class="skeleton h-7 w-12" />
          </div>
        </div>
      </div>
    </div>

    <div v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <RouterLink
        v-for="card in cards"
        :key="card.key"
        :to="card.to"
        class="block rounded-xl bg-white border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow"
      >
        <div class="flex items-center gap-4">
          <div :class="[card.color, 'w-12 h-12 rounded-lg flex items-center justify-center']">
            <span class="text-xl">{{ card.icon }}</span>
          </div>
          <div>
            <p class="text-sm text-gray-500">{{ card.label }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stats[card.key] }}</p>
          </div>
        </div>
      </RouterLink>
    </div>

    <!-- Charts -->
    <div
      v-if="!loading && applications.length > 0"
      class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2"
    >
      <!-- Monthly Trend -->
      <div class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-700 mb-4">月別応募推移</h2>
        <div class="h-64">
          <Bar :data="monthlyChartData" :options="barOptions" />
        </div>
      </div>

      <!-- Status Distribution -->
      <div class="rounded-xl bg-white border border-gray-200 p-6 shadow-sm">
        <h2 class="text-sm font-semibold text-gray-700 mb-4">応募ステータス分布</h2>
        <div class="h-64">
          <Doughnut :data="statusChartData" :options="doughnutOptions" />
        </div>
      </div>
    </div>
  </div>
</template>
