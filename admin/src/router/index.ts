import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false, layout: 'auth' },
    },
    {
      path: '/',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    // 求人
    {
      path: '/jobs',
      name: 'jobs',
      component: () => import('@/views/jobs/JobListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/jobs/create',
      name: 'jobs-create',
      component: () => import('@/views/jobs/JobFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/jobs/:id/edit',
      name: 'jobs-edit',
      component: () => import('@/views/jobs/JobFormView.vue'),
      meta: { requiresAuth: true },
    },
    // 社員
    {
      path: '/members',
      name: 'members',
      component: () => import('@/views/members/MemberListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/members/create',
      name: 'members-create',
      component: () => import('@/views/members/MemberFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/members/:id/edit',
      name: 'members-edit',
      component: () => import('@/views/members/MemberFormView.vue'),
      meta: { requiresAuth: true },
    },
    // お知らせ
    {
      path: '/news',
      name: 'news',
      component: () => import('@/views/news/NewsListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/news/create',
      name: 'news-create',
      component: () => import('@/views/news/NewsFormView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/news/:id/edit',
      name: 'news-edit',
      component: () => import('@/views/news/NewsFormView.vue'),
      meta: { requiresAuth: true },
    },
    // 応募
    {
      path: '/applications',
      name: 'applications',
      component: () => import('@/views/applications/ApplicationListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/applications/:id',
      name: 'applications-show',
      component: () => import('@/views/applications/ApplicationDetailView.vue'),
      meta: { requiresAuth: true },
    },
    // 問い合わせ
    {
      path: '/inquiries',
      name: 'inquiries',
      component: () => import('@/views/inquiries/InquiryListView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/inquiries/:id',
      name: 'inquiries-show',
      component: () => import('@/views/inquiries/InquiryDetailView.vue'),
      meta: { requiresAuth: true },
    },
    // メディア
    {
      path: '/media',
      name: 'media',
      component: () => import('@/views/media/MediaView.vue'),
      meta: { requiresAuth: true },
    },
    // 設定
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/views/settings/SettingsView.vue'),
      meta: { requiresAuth: true },
    },
    // 404
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('@/views/NotFoundView.vue'),
    },
  ],
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth !== false && !authStore.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.name === 'login' && authStore.isAuthenticated) {
    return { name: 'dashboard' };
  }

  if (authStore.isAuthenticated && !authStore.user) {
    try {
      await authStore.fetchUser();
    } catch {
      authStore.clearAuth();
      return { name: 'login' };
    }
  }
});

export default router;
