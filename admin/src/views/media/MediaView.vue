<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import type { Media } from '@/types';

const mediaList = ref<Media[]>([]);
const loading = ref(true);
const uploading = ref(false);
const dragOver = ref(false);

async function fetchMedia() {
  loading.value = true;
  try {
    const { data } = await api.get<{ data: Media[] }>('/admin/media');
    mediaList.value = data.data ?? data;
  } finally {
    loading.value = false;
  }
}

async function uploadFiles(files: FileList | File[]) {
  uploading.value = true;
  try {
    for (const file of files) {
      const fd = new FormData();
      fd.append('file', file);
      await api.post('/admin/media', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    await fetchMedia();
  } finally {
    uploading.value = false;
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
  if (!confirm('このファイルを削除しますか？')) return;
  await api.delete(`/admin/media/${id}`);
  await fetchMedia();
}

function copyUrl(url: string) {
  navigator.clipboard.writeText(url);
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
      <label class="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 cursor-pointer transition-colors">
        ファイルを選択
        <input type="file" multiple class="hidden" @change="handleFileInput" />
      </label>
      <p v-if="uploading" class="mt-2 text-sm text-blue-600">アップロード中...</p>
    </div>

    <!-- Media grid -->
    <div v-if="loading" class="text-gray-500">読み込み中...</div>
    <div v-else-if="mediaList.length === 0" class="text-center text-gray-500 py-8">メディアがありません。</div>
    <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      <div
        v-for="media in mediaList"
        :key="media.id"
        class="group relative bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
      >
        <img
          v-if="media.mime_type.startsWith('image/')"
          :src="media.url"
          :alt="media.filename"
          class="w-full h-32 object-cover"
        />
        <div v-else class="w-full h-32 flex items-center justify-center bg-gray-100">
          <span class="text-xs text-gray-400">{{ media.mime_type }}</span>
        </div>
        <div class="p-2">
          <p class="text-xs text-gray-700 truncate">{{ media.filename }}</p>
        </div>
        <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
