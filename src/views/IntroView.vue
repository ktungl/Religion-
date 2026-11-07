<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import BrandMark from '../components/BrandMark.vue'

// What the app is for, shown right after the language step so it's always
// in a language the person picked (a phone's own setting is often Chinese or English).
const { t } = useI18n()
const router = useRouter()

const points = [
  { key: 'calendar', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { key: 'share', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { key: 'together', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11a3 3 0 1 0 0-6M2 21a7 7 0 0 1 14 0M17 14a5 5 0 0 1 5 7' },
]
</script>

<template>
  <OnboardingShell :step="2" :total="7">
    <div class="flex flex-col items-center pt-8 text-center md:pt-12">
      <BrandMark />
      <p class="rise mt-5 max-w-xs text-lg" style="--delay: 1.15s">{{ t('intro.tagline') }}</p>
    </div>

    <ul class="mx-auto mt-8 flex max-w-sm flex-col gap-3">
      <li
        v-for="(p, i) in points"
        :key="p.key"
        class="rise flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3"
        :style="{ '--delay': `${1.35 + i * 0.12}s` }"
      >
        <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand" aria-hidden="true">
          <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path :d="p.icon" />
          </svg>
        </span>
        <span class="text-left">{{ t(`intro.${p.key}`) }}</span>
      </li>
    </ul>

    <template #footer>
      <div class="rise flex gap-3" style="--delay: 1.8s">
        <button type="button" class="h-14 rounded-2xl border-2 border-line bg-white px-5 text-lg text-ink" @click="router.back()">
          {{ t('onboarding.back') }}
        </button>
        <button type="button" class="h-14 flex-1 rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90" @click="router.push('/onboarding/faith')">
          {{ t('intro.start') }}
        </button>
      </div>
    </template>
  </OnboardingShell>
</template>

<style scoped>
.rise {
  animation: rise 0.5s var(--delay, 0s) ease-out both;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rise {
    animation: none;
  }
}
</style>
