<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import { profile } from '../lib/profile'
import { goBack } from '../lib/nav'
import { CITIES } from '../lib/places'

const { t } = useI18n()
const router = useRouter()
// Same screen in onboarding (step 3) and later from the home page.
const isSettings = useRoute().path.startsWith('/settings')
const error = ref(false)

function pick(city) {
  error.value = false
  profile.city = city
}

function next() {
  if (!profile.city) {
    error.value = true
    return
  }
  if (isSettings) goBack(router)
  else router.push('/onboarding/diet')
}
</script>

<template>
  <OnboardingShell :step="isSettings ? 0 : 3" :total="isSettings ? 0 : 6">
    <h1 class="pt-8 text-2xl font-semibold">{{ t('city.title') }}</h1>
    <p class="mt-1 text-muted">{{ t('city.desc') }}</p>

    <div class="mt-6 grid grid-cols-2 gap-2" role="radiogroup" :aria-label="t('city.title')">
      <label
        v-for="c in CITIES"
        :key="c"
        class="flex min-h-14 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4"
        :class="[profile.city === c ? 'border-brand bg-brand-soft font-semibold' : 'border-line bg-white', c === 'other' && 'col-span-2']"
      >
        <input :checked="profile.city === c" type="radio" name="city" :value="c" class="h-4 w-4 accent-[var(--color-brand)]" @change="pick(c)" />
        {{ t(`city.names.${c}`) }}
      </label>
    </div>

    <p class="mt-5 flex items-start gap-2 text-sm text-muted">
      <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      {{ t('city.privacy') }}
    </p>

    <template #footer>
      <p v-if="error" class="mb-2 text-center text-sm text-red-700" role="alert">{{ t('city.required') }}</p>
      <div class="flex gap-3">
        <button type="button" class="h-14 rounded-2xl border-2 border-line bg-white px-5 text-lg text-ink" @click="isSettings ? goBack(router) : router.back()">
          {{ t('onboarding.back') }}
        </button>
        <button type="button" class="h-14 flex-1 rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90" @click="next">
          {{ isSettings ? t('city.save') : t('onboarding.next') }}
        </button>
      </div>
    </template>
  </OnboardingShell>
</template>
