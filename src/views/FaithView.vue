<script setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'

const { t } = useI18n()
const router = useRouter()
</script>

<template>
  <OnboardingShell :step="2" :total="4">
    <h1 class="pt-8 text-2xl font-semibold">{{ t('faith.title') }}</h1>
    <p class="mt-4 text-muted">{{ t('onboarding.comingSoon') }}</p>

    <template #footer>
      <button
        type="button"
        class="h-14 w-full rounded-2xl border-2 border-line bg-white text-lg text-ink"
        @click="router.back()"
      >
        {{ t('onboarding.back') }}
      </button>
    </template>
  </OnboardingShell>
</template>
