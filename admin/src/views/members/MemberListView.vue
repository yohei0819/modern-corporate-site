<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '@/services/api';
import AppBadge from '@/components/ui/AppBadge.vue';
import AppPagination from '@/components/ui/AppPagination.vue';
import { useToast } from '@/stores/toast';
import { useConfirm } from '@/composables/useConfirm';
import type { Member, PaginatedResponse } from '@/types';

const router = useRouter();
const toast = useToast();
const { confirm } = useConfirm();
const members = ref<Member[]>([]);
const currentPage = ref(1);
const lastPage = ref(1);
const total = ref(0);
const loading = ref(true);
const selectedIds = ref<Set<number>>(new Set());

async function fetchMembers() {
  loading.value = true;
  try {
    const { data } = await api.get<PaginatedResponse<Member>>('/admin/members', {
      params: { page: currentPage.value },
    });
    members.value = data.data;
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
  if (selectedIds.value.size === members.value.length) selectedIds.value.clear();
  else selectedIds.value = new Set(members.value.map((m) => m.id));
}

async function deleteMember(id: number) {
  const ok = await confirm({
    title: '社員を削除',
    message: 'この社員を削除しますか？この操作は取り消せません。',
    confirmLabel: '削除する',
    variant: 'danger',
  });
  if (!ok) return;
  try {
    await api.delete(`/admin/members/${id}`);
    toast.success('社員を削除しました');
    await fetchMembers();
  } catch {
    toast.error('削除に失敗しました');
  }
}

async function bulkDelete() {
  if (selectedIds.value.size === 0) return;
  const ok = await confirm({
    title: '一括削除',
    message: `選択した ${selectedIds.value.size} 件の社員を削除しますか？`,
    confirmLabel: '一括削除',
    variant: 'danger',
  });
  if (!ok) return;
  try {
    const results = await Promise.allSettled([...selectedIds.value].map((id) => api.delete(`/admin/members/${id}`)));
    const succeeded = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;
    if (succeeded > 0) toast.success(`${succeeded} 件の社員を削除しました`);
    if (failed > 0) toast.error(`${failed} 件の削除に失敗しました`);
    await fetchMembers();
  } catch {
    toast.error('一括削除に失敗しました');
  }
}

watch(currentPage, fetchMembers);
onMounted(fetchMembers);
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">社員管理</h1>
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
          @click="router.push({ name: 'members-create' })"
        >
          新規作成
        </button>
      </div>
    </div>

    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div v-if="loading" class="p-6 space-y-4">
        <div v-for="i in 5" :key="i" class="flex items-center gap-4">
          <div class="skeleton h-4 w-1/4" />
          <div class="skeleton h-4 w-20" />
          <div class="skeleton h-4 w-16" />
          <div class="skeleton h-5 w-14 rounded-full" />
          <div class="flex-1" />
          <div class="skeleton h-4 w-16" />
        </div>
      </div>
      <div v-else-if="members.length === 0" class="p-8 text-center text-gray-500">社員がありません。</div>
      <div v-else class="table-responsive">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th class="px-4 py-3 text-left">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" :checked="selectedIds.size === members.length && members.length > 0" @change="toggleSelectAll" />
              </th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">名前</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">部署</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase hidden md:table-cell">役職</th>
              <th class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ステータス</th>
              <th class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">操作</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200">
            <tr v-for="member in members" :key="member.id" class="hover:bg-gray-50">
              <td class="px-4 py-3">
                <input type="checkbox" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" :checked="selectedIds.has(member.id)" @change="toggleSelect(member.id)" />
              </td>
              <td class="px-4 py-3 text-sm font-medium text-gray-900">{{ member.name }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{{ member.department }}</td>
              <td class="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{{ member.position }}</td>
              <td class="px-4 py-3">
                <AppBadge
                  :label="member.status === 'published' ? '公開中' : '下書き'"
                  :color="member.status === 'published' ? 'green' : 'gray'"
                />
              </td>
              <td class="px-4 py-3 text-right space-x-2">
                <button class="text-sm text-blue-600 hover:text-blue-800" @click="router.push({ name: 'members-edit', params: { id: member.id } })">編集</button>
                <button class="text-sm text-red-600 hover:text-red-800" @click="deleteMember(member.id)">削除</button>
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
