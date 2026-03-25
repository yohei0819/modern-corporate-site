<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import AdminLayout from '@/layouts/AdminLayout.vue';
import AuthLayout from '@/layouts/AuthLayout.vue';
import AppToast from '@/components/ui/AppToast.vue';
import AppConfirmDialog from '@/components/ui/AppConfirmDialog.vue';

const route = useRoute();
const layout = computed(() => route.meta.layout === 'auth' ? 'auth' : 'admin');
</script>

<template>
  <AuthLayout v-if="layout === 'auth'">
    <RouterView />
  </AuthLayout>
  <AdminLayout v-else>
    <RouterView />
  </AdminLayout>
  <AppToast />
  <AppConfirmDialog />
</template>
