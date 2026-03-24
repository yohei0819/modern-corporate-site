<script setup lang="ts">
defineProps<{
  label: string;
  color?: 'gray' | 'green' | 'blue' | 'amber' | 'red' | 'purple';
}>();

const colorMap: Record<string, string> = {
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-green-100 text-green-700',
  blue: 'bg-blue-100 text-blue-700',
  amber: 'bg-amber-100 text-amber-700',
  red: 'bg-red-100 text-red-700',
  purple: 'bg-purple-100 text-purple-700',
};
</script>

<template>
  <span :class="['inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', colorMap[color ?? 'gray']]">
    {{ label }}
  </span>
</template>
