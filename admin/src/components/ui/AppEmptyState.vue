<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
}>();

defineEmits<{ action: [] }>();
</script>

<template>
  <div class="flex flex-col items-center justify-center py-16 text-center">
    <span class="text-5xl" role="img" aria-hidden="true">{{ icon ?? '📭' }}</span>
    <h3 class="mt-4 text-lg font-semibold text-gray-900">{{ title }}</h3>
    <p v-if="description" class="mt-2 text-sm text-gray-500 max-w-sm">{{ description }}</p>
    <button
      v-if="actionLabel"
      class="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>
  </div>
</template>
