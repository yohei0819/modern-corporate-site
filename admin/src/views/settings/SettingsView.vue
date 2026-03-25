<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { useAuthStore } from '@/stores/auth';
import { useToast } from '@/stores/toast';
import type { ApiValidationError } from '@/types';
import { isAxiosError } from 'axios';

const authStore = useAuthStore();
const toast = useToast();

// プロフィール
const profileForm = ref({
  name: '',
  email: '',
});
const profileErrors = ref<Record<string, string[]>>({});
const profileSaving = ref(false);

// パスワード
const passwordForm = ref({
  current_password: '',
  password: '',
  password_confirmation: '',
});
const passwordErrors = ref<Record<string, string[]>>({});
const passwordSaving = ref(false);

onMounted(() => {
  if (authStore.user) {
    profileForm.value.name = authStore.user.name;
    profileForm.value.email = authStore.user.email;
  }
});

function profileFieldError(field: string): string | undefined {
  return profileErrors.value[field]?.[0];
}

function passwordFieldError(field: string): string | undefined {
  return passwordErrors.value[field]?.[0];
}

async function saveProfile() {
  profileErrors.value = {};
  profileSaving.value = true;
  try {
    const { data } = await api.put('/me/profile', profileForm.value);
    authStore.user = data.user;
    toast.success('プロフィールを更新しました');
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 422) {
      const body = err.response.data as ApiValidationError;
      profileErrors.value = body.errors;
    } else {
      toast.error('プロフィールの更新に失敗しました');
    }
  } finally {
    profileSaving.value = false;
  }
}

async function savePassword() {
  passwordErrors.value = {};
  passwordSaving.value = true;
  try {
    await api.put('/me/password', passwordForm.value);
    toast.success('パスワードを変更しました');
    passwordForm.value = {
      current_password: '',
      password: '',
      password_confirmation: '',
    };
  } catch (err) {
    if (isAxiosError(err) && err.response?.status === 422) {
      const body = err.response.data as ApiValidationError;
      passwordErrors.value = body.errors;
    } else {
      toast.error('パスワードの変更に失敗しました');
    }
  } finally {
    passwordSaving.value = false;
  }
}
</script>

<template>
  <div class="space-y-8">
    <h1 class="text-2xl font-bold text-gray-900">設定</h1>

    <!-- プロフィール設定 -->
    <div class="rounded-xl border border-gray-200 bg-white p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">プロフィール</h2>
      <form @submit.prevent="saveProfile" class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">名前</label>
          <input
            v-model="profileForm.name"
            type="text"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <p v-if="profileFieldError('name')" class="mt-1 text-sm text-red-500">
            {{ profileFieldError('name') }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">メールアドレス</label>
          <input
            v-model="profileForm.email"
            type="email"
            required
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <p v-if="profileFieldError('email')" class="mt-1 text-sm text-red-500">
            {{ profileFieldError('email') }}
          </p>
        </div>

        <div>
          <button
            type="submit"
            :disabled="profileSaving"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {{ profileSaving ? '保存中...' : 'プロフィールを保存' }}
          </button>
        </div>
      </form>
    </div>

    <!-- パスワード変更 -->
    <div class="rounded-xl border border-gray-200 bg-white p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">パスワード変更</h2>
      <form @submit.prevent="savePassword" class="space-y-4 max-w-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">現在のパスワード</label>
          <input
            v-model="passwordForm.current_password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <p v-if="passwordFieldError('current_password')" class="mt-1 text-sm text-red-500">
            {{ passwordFieldError('current_password') }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">新しいパスワード</label>
          <input
            v-model="passwordForm.password"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
          <p class="mt-1 text-xs text-gray-400">8文字以上</p>
          <p v-if="passwordFieldError('password')" class="mt-1 text-sm text-red-500">
            {{ passwordFieldError('password') }}
          </p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">新しいパスワード（確認）</label>
          <input
            v-model="passwordForm.password_confirmation"
            type="password"
            required
            minlength="8"
            autocomplete="new-password"
            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <button
            type="submit"
            :disabled="passwordSaving"
            class="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {{ passwordSaving ? '変更中...' : 'パスワードを変更' }}
          </button>
        </div>
      </form>
    </div>

    <!-- アカウント情報 -->
    <div class="rounded-xl border border-gray-200 bg-white p-6">
      <h2 class="text-lg font-semibold text-gray-900 mb-4">アカウント情報</h2>
      <dl class="grid grid-cols-1 gap-3 sm:grid-cols-2 text-sm">
        <div>
          <dt class="text-gray-500">ロール</dt>
          <dd class="font-medium text-gray-900">{{ authStore.user?.role === 'admin' ? '管理者' : '編集者' }}</dd>
        </div>
        <div>
          <dt class="text-gray-500">アカウント作成日</dt>
          <dd class="font-medium text-gray-900">
            {{ authStore.user?.created_at ? new Date(authStore.user.created_at).toLocaleDateString('ja-JP') : '-' }}
          </dd>
        </div>
      </dl>
    </div>
  </div>
</template>
