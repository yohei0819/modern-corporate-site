<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isAxiosError } from 'axios';
import api from '@/services/api';
import { useToast } from '@/stores/toast';
import { useUnsavedChanges } from '@/composables/useUnsavedChanges';
import type { JobPosting, ApiValidationError } from '@/types';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const isEdit = computed(() => !!route.params.id);
const pageTitle = computed(() => isEdit.value ? '求人編集' : '求人作成');

const form = ref({
  title: '',
  slug: '',
  employment_type: 'full-time',
  location: '',
  salary_text: '',
  summary: '',
  description: '',
  requirements: '',
  status: 'draft',
  sort_order: 0,
  published_at: '',
});

const errors = ref<Record<string, string[]>>({});
const loading = ref(false);
const fetching = ref(false);

const { isDirty, takeSnapshot, markClean } = useUnsavedChanges(() => ({ ...form.value }));

function validateClient(): boolean {
  const e: Record<string, string[]> = {};
  if (!form.value.title.trim()) e.title = ['タイトルは必須です'];
  if (!form.value.slug.trim()) e.slug = ['スラッグは必須です'];
  if (!form.value.location.trim()) e.location = ['勤務地は必須です'];
  if (!form.value.description.trim()) e.description = ['仕事内容は必須です'];
  errors.value = e;
  return Object.keys(e).length === 0;
}

onMounted(async () => {
  if (isEdit.value) {
    fetching.value = true;
    try {
      const { data } = await api.get<{ data: JobPosting }>(`/admin/jobs/${route.params.id}`);
      const job = data.data;
      form.value = {
        title: job.title,
        slug: job.slug,
        employment_type: job.employment_type,
        location: job.location,
        salary_text: job.salary_text,
        summary: job.summary,
        description: job.description,
        requirements: job.requirements,
        status: job.status,
        sort_order: job.sort_order,
        published_at: job.published_at?.slice(0, 16) ?? '',
      };
    } catch {
      toast.error('求人情報の取得に失敗しました');
    } finally {
      fetching.value = false;
    }
  }
  await nextTick();
  takeSnapshot();
});

async function handleSubmit() {
  if (!validateClient()) return;
  errors.value = {};
  loading.value = true;
  try {
    const payload = {
      ...form.value,
      published_at: form.value.published_at || null,
    };
    if (isEdit.value) {
      await api.put(`/admin/jobs/${route.params.id}`, payload);
      toast.success('求人を更新しました');
    } else {
      await api.post('/admin/jobs', payload);
      toast.success('求人を作成しました');
    }
    markClean();
    router.push({ name: 'jobs' });
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 422) {
      errors.value = (e.response.data as ApiValidationError).errors;
      toast.error('入力内容にエラーがあります');
    } else {
      toast.error('保存に失敗しました');
    }
  } finally {
    loading.value = false;
  }
}

function fieldError(field: string): string {
  return errors.value[field]?.[0] ?? '';
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <h1 class="text-2xl font-bold text-gray-900">{{ pageTitle }}</h1>
        <span v-if="isDirty" class="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">未保存</span>
      </div>
      <button
        class="text-sm text-gray-500 hover:text-gray-700"
        @click="router.push({ name: 'jobs' })"
      >
        ← 一覧に戻る
      </button>
    </div>

    <div v-if="fetching" class="text-gray-500">読み込み中...</div>

    <form v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-5" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">タイトル</label>
          <input v-model="form.title" type="text" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('title')" class="mt-1 text-xs text-red-600">{{ fieldError('title') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">スラッグ</label>
          <input v-model="form.slug" type="text" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('slug')" class="mt-1 text-xs text-red-600">{{ fieldError('slug') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">雇用形態</label>
          <select v-model="form.employment_type" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
            <option value="full-time">正社員</option>
            <option value="contract">契約社員</option>
            <option value="part-time">パート・アルバイト</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">勤務地</label>
          <input v-model="form.location" type="text" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('location')" class="mt-1 text-xs text-red-600">{{ fieldError('location') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">給与</label>
          <input v-model="form.salary_text" type="text" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" placeholder="年収 400〜600 万円" />
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">概要</label>
          <textarea v-model="form.summary" rows="3" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('summary')" class="mt-1 text-xs text-red-600">{{ fieldError('summary') }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">仕事内容</label>
          <textarea v-model="form.description" rows="8" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('description')" class="mt-1 text-xs text-red-600">{{ fieldError('description') }}</p>
        </div>

        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">応募要件</label>
          <textarea v-model="form.requirements" rows="5" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('requirements')" class="mt-1 text-xs text-red-600">{{ fieldError('requirements') }}</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
          <select v-model="form.status" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
            <option value="draft">下書き</option>
            <option value="published">公開</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">表示順</label>
          <input v-model.number="form.sort_order" type="number" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">公開日時</label>
          <input v-model="form.published_at" type="datetime-local" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          @click="router.push({ name: 'jobs' })"
        >
          キャンセル
        </button>
        <button
          type="submit"
          :disabled="loading"
          class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {{ loading ? '保存中...' : (isEdit ? '更新する' : '作成する') }}
        </button>
      </div>
    </form>
  </div>
</template>
