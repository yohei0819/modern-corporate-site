<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import AppBadge from '@/components/ui/AppBadge.vue';
import { useToast } from '@/stores/toast';
import type { Application } from '@/types';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const application = ref<Application | null>(null);
const loading = ref(true);
const updating = ref(false);

const statuses = [
  { value: 'new', label: '新規' },
  { value: 'reviewing', label: '選考中' },
  { value: 'interviewed', label: '面接済' },
  { value: 'accepted', label: '採用' },
  { value: 'rejected', label: '不採用' },
];

const statusColorMap: Record<string, 'blue' | 'amber' | 'purple' | 'green' | 'red'> = {
  new: 'blue',
  reviewing: 'amber',
  interviewed: 'purple',
  accepted: 'green',
  rejected: 'red',
};

onMounted(async () => {
  try {
    const { data } = await api.get<{ data: Application }>(`/admin/applications/${route.params.id}`);
    application.value = data.data;
  } finally {
    loading.value = false;
  }
});

async function updateStatus(status: string) {
  if (!application.value) return;
  updating.value = true;
  try {
    await api.put(`/admin/applications/${application.value.id}/status`, { status });
    application.value.status = status as Application['status'];
    const label = statuses.find((s) => s.value === status)?.label ?? status;
    toast.success(`ステータスを「${label}」に変更しました`);
  } catch {
    toast.error('ステータスの変更に失敗しました');
  } finally {
    updating.value = false;
  }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">応募詳細</h1>
      <button class="text-sm text-gray-500 hover:text-gray-700" @click="router.push({ name: 'applications' })">
        ← 一覧に戻る
      </button>
    </div>

    <div v-if="loading" class="text-gray-500">読み込み中...</div>

    <template v-else-if="application">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p class="text-xs text-gray-500 mb-1">氏名</p>
            <p class="font-medium text-gray-900">{{ application.name }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">メール</p>
            <p class="text-gray-900">{{ application.email }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">電話番号</p>
            <p class="text-gray-900">{{ application.phone }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">応募求人</p>
            <p class="text-gray-900">{{ application.job_posting?.title ?? '-' }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-xs text-gray-500 mb-1">メッセージ</p>
            <p class="text-gray-900 whitespace-pre-wrap">{{ application.message ?? 'なし' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">応募日</p>
            <p class="text-gray-900">{{ new Date(application.created_at).toLocaleString('ja-JP') }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">現在のステータス</p>
            <AppBadge
              :label="statuses.find(s => s.value === application!.status)?.label ?? application!.status"
              :color="statusColorMap[application!.status] ?? 'gray'"
            />
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <p class="text-sm font-medium text-gray-700 mb-3">ステータス変更</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in statuses"
              :key="s.value"
              :disabled="updating || application.status === s.value"
              :class="[
                'rounded-lg px-3 py-1.5 text-sm font-medium border transition-colors',
                application.status === s.value
                  ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-default'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50',
              ]"
              @click="updateStatus(s.value)"
            >
              {{ s.label }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
