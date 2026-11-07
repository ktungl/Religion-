<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'

// First screen for someone new: what the app is for, before any setup.
// Text follows the phone's language (detected in i18n), so most people can read it.
const { t } = useI18n()
const router = useRouter()

// One dot per faith color, flying out from the middle to its place on the ring.
const dots = [
  { color: 'var(--color-islam)', x: 0, y: -90 },
  { color: 'var(--color-christian)', x: 90, y: 0 },
  { color: 'var(--color-buddhism)', x: 0, y: 90 },
  { color: 'var(--color-folk)', x: -90, y: 0 },
]

const points = [
  { key: 'calendar', icon: 'M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z' },
  { key: 'share', icon: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z' },
  { key: 'together', icon: 'M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17 11a3 3 0 1 0 0-6M2 21a7 7 0 0 1 14 0M17 14a5 5 0 0 1 5 7' },
]
</script>

<template>
  <OnboardingShell>
    <div class="flex flex-col items-center pt-10 text-center md:pt-16">
      <svg viewBox="0 0 512 512" class="logo h-32 w-32" aria-hidden="true">
        <rect width="512" height="512" rx="112" fill="var(--color-brand)" />
        <circle class="ring" cx="256" cy="256" r="148" fill="none" stroke="var(--color-paper)" stroke-width="18" opacity="0.9" />
        <circle
          v-for="(d, i) in dots"
          :key="i"
          class="dot"
          cx="256"
          cy="256"
          r="40"
          :fill="d.color"
          :style="{ '--x': `${d.x}px`, '--y': `${d.y}px`, '--delay': `${0.35 + i * 0.09}s` }"
        />
      </svg>

      <h1 class="rise mt-6 text-3xl font-semibold tracking-tight" style="--delay: 0.8s">Faith Together</h1>
      <p class="rise mt-1 text-2xl font-semibold text-muted" lang="zh-TW" style="--delay: 0.95s">共好日</p>
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
.logo {
  animation: logo-in 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.ring {
  stroke-dasharray: 930;
  animation: ring-draw 0.7s 0.15s ease-out both;
}
.dot {
  transform-box: view-box;
  transform-origin: 256px 256px;
  animation: dot-out 0.55s var(--delay) cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.rise {
  animation: rise 0.5s var(--delay, 0s) ease-out both;
}

@keyframes logo-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
}
@keyframes ring-draw {
  from {
    stroke-dashoffset: 930;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes dot-out {
  from {
    transform: translate(0, 0) scale(0);
  }
  to {
    transform: translate(var(--x), var(--y)) scale(1);
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo,
  .ring,
  .rise {
    animation: none;
  }
  .dot {
    animation: none;
    transform: translate(var(--x), var(--y));
  }
}
</style>
