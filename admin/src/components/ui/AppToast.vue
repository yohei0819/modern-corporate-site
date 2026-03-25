<script setup lang="ts">
import { useToast } from '@/stores/toast';

const { toasts } = useToast();

const typeClasses = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const typeIcons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
};
</script>

<template>
  <Teleport to="body">
    <div class="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center gap-2 rounded-lg border px-4 py-3 shadow-lg text-sm font-medium',
            typeClasses[toast.type],
          ]"
          role="alert"
        >
          <span class="font-bold text-base leading-none" aria-hidden="true">{{ typeIcons[toast.type] }}</span>
          {{ toast.message }}
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>
