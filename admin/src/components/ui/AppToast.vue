<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}>();

const emit = defineEmits<{ close: [] }>();
const visible = ref(true);

watch(
  () => props.message,
  () => {
    visible.value = true;
    setTimeout(() => {
      visible.value = false;
      emit('close');
    }, props.duration ?? 3000);
  },
  { immediate: true },
);

const typeClasses = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      :class="[
        'fixed top-4 right-4 z-[100] max-w-sm rounded-lg border px-4 py-3 shadow-lg text-sm font-medium',
        typeClasses[type ?? 'success'],
      ]"
      role="alert"
    >
      {{ message }}
    </div>
  </Transition>
</template>
