<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tabs = [
  { to: '/home', key: 'nav.me', icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0' },
  { to: '/team', key: 'nav.team', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11a3 3 0 1 0 0-6M2 21a7 7 0 0 1 14 0M17 14a5 5 0 0 1 5 7' },
]
</script>

<template>
  <nav class="sticky bottom-0 z-10 border-t border-line bg-paper/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
    <ul class="mx-auto grid max-w-md grid-cols-2">
      <li v-for="tab in tabs" :key="tab.to">
        <RouterLink
          :to="tab.to"
          class="flex h-16 flex-col items-center justify-center gap-0.5 text-xs text-muted"
          active-class="!text-ink font-semibold"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="tab.icon" />
          </svg>
          {{ t(tab.key) }}
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>
