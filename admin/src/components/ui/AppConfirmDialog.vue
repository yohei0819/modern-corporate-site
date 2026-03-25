<script setup lang="ts">
import { useConfirm } from '@/composables/useConfirm';

const { visible, options, handleConfirm, handleCancel } = useConfirm();

const variantClasses = {
  danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
  warning: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500',
  info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
};

const variantIcons = {
  danger: '⚠️',
  warning: '⚡',
  info: 'ℹ️',
};
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-[200] flex items-center justify-center p-4"
        @click.self="handleCancel"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50" />

        <!-- Dialog -->
        <div class="relative w-full max-w-md rounded-xl bg-white p-6 shadow-2xl">
          <div class="flex items-start gap-4">
            <span class="text-2xl" role="img" aria-hidden="true">
              {{ variantIcons[options.variant ?? 'danger'] }}
            </span>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-gray-900">{{ options.title }}</h3>
              <p class="mt-2 text-sm text-gray-600">{{ options.message }}</p>
            </div>
          </div>
          <div class="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              class="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-300"
              @click="handleCancel"
            >
              {{ options.cancelLabel }}
            </button>
            <button
              type="button"
              :class="[
                'rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
                variantClasses[options.variant ?? 'danger'],
              ]"
              @click="handleConfirm"
            >
              {{ options.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
