import { ref, watch, onBeforeUnmount } from 'vue';
import { onBeforeRouteLeave } from 'vue-router';

export function useUnsavedChanges<T extends Record<string, unknown>>(formData: () => T) {
  const isDirty = ref(false);
  let initialSnapshot = '';

  function takeSnapshot() {
    initialSnapshot = JSON.stringify(formData());
    isDirty.value = false;
  }

  function markClean() {
    isDirty.value = false;
  }

  watch(formData, (val) => {
    if (!initialSnapshot) return;
    isDirty.value = JSON.stringify(val) !== initialSnapshot;
  }, { deep: true });

  function beforeUnloadHandler(e: BeforeUnloadEvent) {
    if (isDirty.value) {
      e.preventDefault();
    }
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', beforeUnloadHandler);
  }

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnloadHandler);
  });

  onBeforeRouteLeave(() => {
    if (isDirty.value) {
      const answer = window.confirm('変更が保存されていません。このページを離れますか？');
      if (!answer) return false;
    }
  });

  return { isDirty, takeSnapshot, markClean };
}
