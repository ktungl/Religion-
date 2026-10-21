<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import { profile } from '../lib/profile'

const { t } = useI18n()
const router = useRouter()

function finish() {
  profile.onboarded = true
  router.replace('/home')
}
</script>

<template>
  <OnboardingShell :step="4" :total="4">
    <h1 class="pt-8 text-2xl font-semibold">{{ t('team.title') }}</h1>
    <p class="mt-2 text-muted">{{ t('team.desc') }}</p>

    <input
      type="text"
      inputmode="text"
      autocapitalize="characters"
      placeholder="ABC-123"
      disabled
      class="mt-6 h-16 w-full rounded-2xl border-2 border-line bg-white px-5 text-center text-2xl tracking-widest text-muted"
      :aria-label="t('team.title')"
    />

    <template #footer>
      <div class="flex gap-3">
        <button type="button" class="h-14 rounded-2xl border-2 border-line bg-white px-5 text-lg text-ink" @click="router.back()">
          {{ t('onboarding.back') }}
        </button>
        <button type="button" class="h-14 flex-1 rounded-2xl bg-pine text-lg font-semibold text-paper active:opacity-90" @click="finish">
          {{ t('team.skip') }}
        </button>
      </div>
    </template>
  </OnboardingShell>
</template>
