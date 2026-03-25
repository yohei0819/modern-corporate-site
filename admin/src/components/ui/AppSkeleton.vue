<script setup lang="ts">
defineProps<{
  rows?: number;
}>();
</script>

<template>
  <div class="space-y-3" aria-label="読み込み中">
    <div v-for="i in (rows ?? 5)" :key="i" class="flex items-center gap-4">
      <div class="skeleton h-4 rounded" :style="{ width: `${60 + Math.random() * 30}%` }" />
    </div>
  </div>
</template>
