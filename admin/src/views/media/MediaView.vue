<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useToast } from '@/stores/toast';
import { useConfirm } from '@/composables/useConfirm';
import type { Media } from '@/types';

const toast = useToast();
const { confirm } = useConfirm();
const mediaList = ref<Media[]>([]);
const loading = ref(true);
const uploading = ref(false);
const uploadProgress = ref(0);
const dragOver = ref(false);

async function fetchMedia() {
  loading.value = true;
  try {
    const { data } = await api.get<{ data: Media[] }>('/admin/media');
    mediaList.value = data.data ?? data;
  } catch {
    toast.error('メディアの読み込みに失敗しました');
  } finally {
    loading.value = false;
  }
}

async function uploadFiles(files: FileList | File[]) {
  uploading.value = true;
  uploadProgress.value = 0;
  const totalFiles = files.length;
  let completed = 0;
  try {
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      await api.post('/admin/media', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (e) => {
          const fileProgress = e.total ? e.loaded / e.total : 0;
          uploadProgress.value = Math.round(((completed + fileProgress) / totalFiles) * 100);
        },
      });
      completed++;
      uploadProgress.value = Math.round((completed / totalFiles) * 100);
    }
    toast.success(`${totalFiles} ファイルをアップロードしました`);
    await fetchMedia();
  } catch {
    toast.error('アップロードに失敗しました');
  } finally {
    uploading.value = false;
    uploadProgress.value = 0;
  }
}

function handleFileInput(e: Event) {
  const files = (e.target as HTMLInputElement).files;
  if (files) uploadFiles(files);
}

function handleDrop(e: DragEvent) {
  dragOver.value = false;
  const files = e.dataTransfer?.files;
  if (files) uploadFiles(files);
}

async function deleteMedia(id: number) {
  const ok = await confirm({
    title: 'ファイルを削除',
    message: 'このファイルを削除しますか？この操作は取り消せません。',
    confirmLabel: '削除する',
    variant: 'danger',
  });
  if (!ok) return;
  try {
    await api.delete(`/admin/media/${id}`);
    toast.success('ファイルを削除しました');
    await fetchMedia();
  } catch {
    toast.error('削除に失敗しました');
  }
}

async function copyUrl(url: string) {
  try {
    await navigator.clipboard.writeText(url);
    toast.info('URL をコピーしました');
  } catch {
    toast.error('URL のコピーに失敗しました');
  }
}

onMounted(fetchMedia);
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">メディア管理</h1>

    <!-- Upload area -->
    <div
      :class="[
        'border-2 border-dashed rounded-xl p-8 text-center transition-colors mb-6',
        dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-white',
      ]"
      @dragover.prevent="dragOver = true"
      @dragleave="dragOver = false"
      @drop.prevent="handleDrop"
    >
      <p class="text-gray-500 mb-2">ファイルをドラッグ＆ドロップ、または</p>
      <label
        class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer transition-colors"
      >
        ファイルを選択
        <input type="file" multiple class="hidden" @change="handleFileInput" />
      </label>
      <!-- Upload progress -->
      <div v-if="uploading" class="mt-4 max-w-xs mx-auto">
        <div class="flex items-center justify-between text-sm text-blue-600 mb-1">
          <span>アップロード中...</span>
          <span>{{ uploadProgress }}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div
            class="bg-blue-600 h-2 rounded-full upload-progress-bar"
            :style="{ width: `${uploadProgress}%` }"
          />
        </div>
      </div>
    </div>

    <!-- Media grid -->
    <div v-if="loading" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div v-for="i in 10" :key="i" class="rounded-lg border border-gray-200 overflow-hidden">
        <div class="skeleton h-32 w-full rounded-none" />
        <div class="p-2"><div class="skeleton h-3 w-3/4" /></div>
      </div>
    </div>
    <div v-else-if="mediaList.length === 0" class="text-center text-gray-500 py-8">
      メディアがありません。
    </div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="media in mediaList"
        :key="media.id"
        class="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
      >
        <img
          v-if="media.mime_type.startsWith('image/')"
          :src="media.url"
          :alt="media.file_name"
          class="w-full h-32 object-cover"
        />
        <div v-else class="w-full h-32 flex items-center justify-center bg-gray-100">
          <span class="text-xs text-gray-400">{{ media.mime_type }}</span>
        </div>
        <div class="p-2">
          <p class="text-xs text-gray-700 truncate">{{ media.file_name }}</p>
        </div>
        <div
          class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
        >
          <button
            class="rounded bg-white px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-100"
            @click="copyUrl(media.url)"
          >
            URL コピー
          </button>
          <button
            class="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700"
            @click="deleteMedia(media.id)"
          >
            削除
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
