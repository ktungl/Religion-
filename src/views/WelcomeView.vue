<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import BrandMark from '../components/BrandMark.vue'

// First screen for someone new: what the app is for, before any setup.
// Text follows the phone's language (detected in i18n), so most people can read it.
const { t } = useI18n()
const router = useRouter()

const points = [
  { key: 'calendar', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { key: 'share', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { key: 'together', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11a3 3 0 1 0 0-6M2 21a7 7 0 0 1 14 0M17 14a5 5 0 0 1 5 7' },
]
</script>

<template>
  <OnboardingShell>
    <div class="flex flex-col items-center pt-10 text-center md:pt-16">
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
      <button
        type="button"
        class="rise h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90"
        style="--delay: 1.8s"
        @click="router.push('/onboarding/language')"
      >
        {{ t('intro.start') }}
      </button>
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
