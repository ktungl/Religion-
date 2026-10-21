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
    { path: '/home', component: () => import('./views/HomeView.vue') },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})
