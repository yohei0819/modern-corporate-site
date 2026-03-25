import { ref } from 'vue';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const visible = ref(false);
const options = ref<ConfirmOptions>({
  title: '',
  message: '',
  confirmLabel: '確認',
  cancelLabel: 'キャンセル',
  variant: 'danger',
});

let resolvePromise: ((value: boolean) => void) | null = null;

export function useConfirm() {
  function confirm(opts: ConfirmOptions): Promise<boolean> {
    options.value = {
      confirmLabel: '確認',
      cancelLabel: 'キャンセル',
      variant: 'danger',
      ...opts,
    };
    visible.value = true;
    return new Promise<boolean>((resolve) => {
      resolvePromise = resolve;
    });
  }

  function handleConfirm() {
    visible.value = false;
    resolvePromise?.(true);
    resolvePromise = null;
  }

  function handleCancel() {
    visible.value = false;
    resolvePromise?.(false);
    resolvePromise = null;
  }

  return { visible, options, confirm, handleConfirm, handleCancel };
}
