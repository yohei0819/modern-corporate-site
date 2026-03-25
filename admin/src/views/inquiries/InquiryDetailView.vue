<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import api from '@/services/api';
import AppBadge from '@/components/ui/AppBadge.vue';
import { useToast } from '@/stores/toast';
import type { Inquiry } from '@/types';

const router = useRouter();
const route = useRoute();
const toast = useToast();
const inquiry = ref<Inquiry | null>(null);
const loading = ref(true);
const updating = ref(false);

const statuses = [
  { value: 'new', label: '新規', color: 'blue' as const },
  { value: 'in_progress', label: '対応中', color: 'amber' as const },
  { value: 'closed', label: '完了', color: 'green' as const },
];

onMounted(async () => {
  try {
    const { data } = await api.get<{ data: Inquiry }>(`/admin/inquiries/${route.params.id}`);
    inquiry.value = data.data;
  } catch {
    toast.error('問い合わせ情報の取得に失敗しました');
  } finally {
    loading.value = false;
  }
});

async function updateStatus(status: string) {
  if (!inquiry.value) return;
  updating.value = true;
  try {
    await api.put(`/admin/inquiries/${inquiry.value.id}`, { status });
    inquiry.value.status = status as Inquiry['status'];
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
      <h1 class="text-2xl font-bold text-gray-900">問い合わせ詳細</h1>
      <button class="text-sm text-gray-500 hover:text-gray-700" @click="router.push({ name: 'inquiries' })">← 一覧に戻る</button>
    </div>

    <div v-if="loading" class="text-gray-500">読み込み中...</div>

    <template v-else-if="inquiry">
      <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p class="text-xs text-gray-500 mb-1">氏名</p>
            <p class="font-medium text-gray-900">{{ inquiry.name }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">メール</p>
            <p class="text-gray-900">{{ inquiry.email }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">電話番号</p>
            <p class="text-gray-900">{{ inquiry.phone ?? 'なし' }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">カテゴリ</p>
            <p class="text-gray-900">{{ inquiry.category }}</p>
          </div>
          <div class="sm:col-span-2">
            <p class="text-xs text-gray-500 mb-1">内容</p>
            <p class="text-gray-900 whitespace-pre-wrap">{{ inquiry.body }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">受付日</p>
            <p class="text-gray-900">{{ new Date(inquiry.created_at).toLocaleString('ja-JP') }}</p>
          </div>
          <div>
            <p class="text-xs text-gray-500 mb-1">現在のステータス</p>
            <AppBadge
              :label="statuses.find(s => s.value === inquiry!.status)?.label ?? inquiry!.status"
              :color="statuses.find(s => s.value === inquiry!.status)?.color ?? 'gray'"
            />
          </div>
        </div>

        <div class="border-t border-gray-200 pt-4">
          <p class="text-sm font-medium text-gray-700 mb-3">ステータス変更</p>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="s in statuses"
              :key="s.value"
              :disabled="updating || inquiry.status === s.value"
              :class="[
                'rounded-lg px-3 py-1.5 text-sm font-medium border transition-colors',
                inquiry.status === s.value
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
