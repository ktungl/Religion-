import { createRouter, createWebHistory } from 'vue-router'
import LanguageView from './views/LanguageView.vue'
import { profile } from './lib/profile'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: () => (profile.onboarded ? '/home' : '/onboarding/language') },
    { path: '/onboarding/language', component: LanguageView },
    { path: '/onboarding/faith', component: () => import('./views/FaithView.vue') },
    { path: '/onboarding/share', component: () => import('./views/ShareView.vue') },
    { path: '/onboarding/team', component: () => import('./views/TeamView.vue') },
    { path: '/home', component: () => import('./views/HomeView.vue'), meta: { app: true } },
    { path: '/team', component: () => import('./views/TeamPage.vue'), meta: { app: true } },
    { path: '/event/:key', component: () => import('./views/EventView.vue') },
    { path: '/settings/share', component: () => import('./views/ShareView.vue'), meta: { app: true } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

// App screens need finished onboarding.
router.beforeEach((to) => {
  if (to.meta.app && !profile.onboarded) return '/onboarding/language'
})
