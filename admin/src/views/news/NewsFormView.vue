<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { isAxiosError } from 'axios';
import api from '@/services/api';
import { useToast } from '@/stores/toast';
import { useUnsavedChanges } from '@/composables/useUnsavedChanges';
import type { News, ApiValidationError } from '@/types';

const router = useRouter();
const route = useRoute();
const toast = useToast();

const isEdit = computed(() => !!route.params.id);
const pageTitle = computed(() => isEdit.value ? 'お知らせ編集' : 'お知らせ作成');

const form = ref({
  title: '',
  slug: '',
  category: 'info',
  summary: '',
  body: '',
  status: 'draft',
  published_at: '',
});

const thumbnailFile = ref<File | null>(null);
const thumbnailPreview = ref<string | null>(null);
const uploadProgress = ref(0);
const errors = ref<Record<string, string[]>>({});
const loading = ref(false);
const fetching = ref(false);

const { isDirty, takeSnapshot, markClean } = useUnsavedChanges(() => ({ ...form.value }));

function validateClient(): boolean {
  const e: Record<string, string[]> = {};
  if (!form.value.title.trim()) e.title = ['タイトルは必須です'];
  if (!form.value.slug.trim()) e.slug = ['スラッグは必須です'];
  if (!form.value.body.trim()) e.body = ['本文は必須です'];
  errors.value = e;
  return Object.keys(e).length === 0;
}

onMounted(async () => {
  if (isEdit.value) {
    fetching.value = true;
    try {
      const { data } = await api.get<{ data: News }>(`/admin/news/${route.params.id}`);
      const n = data.data ?? data;
      form.value = {
        title: n.title,
        slug: n.slug,
        category: n.category,
        summary: n.summary,
        body: n.body,
        status: n.status,
        published_at: n.published_at?.slice(0, 16) ?? '',
      };
      if (n.thumbnail) thumbnailPreview.value = n.thumbnail;
    } finally {
      fetching.value = false;
    }
  }
  await nextTick();
  takeSnapshot();
});

function handleThumbnailChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file) return;
  thumbnailFile.value = file;
  thumbnailPreview.value = URL.createObjectURL(file);
}

async function handleSubmit() {
  if (!validateClient()) return;
  errors.value = {};
  loading.value = true;
  uploadProgress.value = 0;
  try {
    const fd = new FormData();
    Object.entries(form.value).forEach(([key, value]) => {
      fd.append(key, value || '');
    });
    if (!form.value.published_at) fd.delete('published_at');
    if (thumbnailFile.value) fd.append('thumbnail', thumbnailFile.value);
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e: ProgressEvent) => {
        uploadProgress.value = e.total ? Math.round((e.loaded / e.total) * 100) : 0;
      },
    };
    if (isEdit.value) {
      fd.append('_method', 'PUT');
      await api.post(`/admin/news/${route.params.id}`, fd, config);
      toast.success('お知らせを更新しました');
    } else {
      await api.post('/admin/news', fd, config);
      toast.success('お知らせを作成しました');
    }
    markClean();
    router.push({ name: 'news' });
  } catch (e) {
    if (isAxiosError(e) && e.response?.status === 422) {
      errors.value = (e.response.data as ApiValidationError).errors;
      toast.error('入力内容にエラーがあります');
    } else {
      toast.error('保存に失敗しました');
    }
  } finally {
    loading.value = false;
    uploadProgress.value = 0;
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
      <button class="text-sm text-gray-500 hover:text-gray-700" @click="router.push({ name: 'news' })">← 一覧に戻る</button>
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
          <label class="block text-sm font-medium text-gray-700 mb-1">カテゴリ</label>
          <select v-model="form.category" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
            <option value="info">お知らせ</option>
            <option value="press">プレス</option>
            <option value="event">イベント</option>
          </select>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">概要</label>
          <textarea v-model="form.summary" rows="2" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('summary')" class="mt-1 text-xs text-red-600">{{ fieldError('summary') }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">本文</label>
          <textarea v-model="form.body" rows="10" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
          <p v-if="fieldError('body')" class="mt-1 text-xs text-red-600">{{ fieldError('body') }}</p>
        </div>
        <div class="md:col-span-2">
          <label class="block text-sm font-medium text-gray-700 mb-1">サムネイル</label>
          <input type="file" accept="image/jpeg,image/png,image/webp" @change="handleThumbnailChange" class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
          <div v-if="uploadProgress > 0 && loading" class="mt-2 w-full max-w-xs">
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="bg-blue-600 h-1.5 rounded-full upload-progress-bar" :style="{ width: `${uploadProgress}%` }" />
            </div>
          </div>
          <img v-if="thumbnailPreview" :src="thumbnailPreview" class="mt-2 h-24 object-cover rounded-lg border border-gray-200" />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">ステータス</label>
          <select v-model="form.status" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none">
            <option value="draft">下書き</option>
            <option value="published">公開</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">公開日時</label>
          <input v-model="form.published_at" type="datetime-local" class="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" />
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
        <button type="button" class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50" @click="router.push({ name: 'news' })">キャンセル</button>
        <button type="submit" :disabled="loading" class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 transition-colors">
          {{ loading ? '保存中...' : (isEdit ? '更新する' : '作成する') }}
        </button>
      </div>
    </form>
  </div>
</template>
