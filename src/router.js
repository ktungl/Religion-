import { createRouter, createWebHistory } from 'vue-router'
import LanguageView from './views/LanguageView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/onboarding/language' },
    { path: '/onboarding/language', component: LanguageView },
    { path: '/onboarding/faith', component: () => import('./views/FaithView.vue') },
  ],
})
