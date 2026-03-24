<script setup lang="ts">
defineProps<{
  currentPage: number;
  lastPage: number;
}>();

const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void;
}>();
</script>

<template>
  <nav v-if="lastPage > 1" class="flex items-center justify-center gap-1 mt-6">
    <button
      :disabled="currentPage <= 1"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('update:currentPage', currentPage - 1)"
    >
      前へ
    </button>
    <template v-for="page in lastPage" :key="page">
      <button
        v-if="page === 1 || page === lastPage || (page >= currentPage - 2 && page <= currentPage + 2)"
        :class="[
          'px-3 py-1.5 text-sm rounded-lg border',
          page === currentPage
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 hover:bg-gray-50',
        ]"
        @click="emit('update:currentPage', page)"
      >
        {{ page }}
      </button>
      <span
        v-else-if="page === currentPage - 3 || page === currentPage + 3"
        class="px-1 text-gray-400"
      >...</span>
    </template>
    <button
      :disabled="currentPage >= lastPage"
      class="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      @click="emit('update:currentPage', currentPage + 1)"
    >
      次へ
    </button>
  </nav>
</template>
