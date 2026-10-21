<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import { FAITHS } from '../lib/calendar'
import { profile } from '../lib/profile'

const { t } = useI18n()
const router = useRouter()
const error = ref(false)

function toggle(faith) {
  error.value = false
  const current = profile.faiths
  if (faith === 'none') {
    profile.faiths = current.includes('none') ? [] : ['none']
    return
  }
  const withoutNone = current.filter((f) => f !== 'none')
  profile.faiths = withoutNone.includes(faith)
    ? withoutNone.filter((f) => f !== faith)
    : [...withoutNone, faith]
}

function next() {
  if (!profile.faiths.length) {
    error.value = true
    return
  }
  // Nothing to share without a faith, so skip the sharing step.
  router.push(profile.faiths.includes('none') ? '/onboarding/team' : '/onboarding/share')
}
</script>

<template>
  <OnboardingShell :step="2" :total="4">
    <h1 class="pt-8 text-2xl font-semibold">{{ t('faith.title') }}</h1>
    <p class="mt-1 text-muted">{{ t('faith.multi') }}</p>

    <ul class="mt-6 flex flex-col gap-3" role="group" :aria-label="t('faith.title')">
      <li v-for="faith in FAITHS" :key="faith">
        <button
          type="button"
          role="checkbox"
          :aria-checked="profile.faiths.includes(faith)"
          class="flex min-h-16 w-full items-center justify-between rounded-2xl border-2 px-5 text-left text-lg transition-colors"
          :class="[
            profile.faiths.includes(faith)
              ? 'border-pine bg-pine-soft text-pine font-semibold'
              : 'border-line bg-white text-ink active:bg-pine-soft',
            faith === 'none' ? 'mt-2' : '',
          ]"
          @click="toggle(faith)"
        >
          <span>{{ t(`faiths.${faith}`) }}</span>
          <span
            class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-2 text-base"
            :class="profile.faiths.includes(faith) ? 'border-pine bg-pine text-paper' : 'border-line'"
            aria-hidden="true"
            >{{ profile.faiths.includes(faith) ? '✓' : '' }}</span
          >
        </button>
      </li>
    </ul>

    <p class="mt-5 flex items-start gap-2 text-sm text-muted">
      <svg viewBox="0 0 24 24" class="mt-0.5 h-4 w-4 shrink-0" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
      </svg>
      {{ t('faith.privacy') }}
    </p>

    <template #footer>
      <p v-if="error" class="mb-2 text-center text-sm text-red-700" role="alert">{{ t('onboarding.required') }}</p>
      <div class="flex gap-3">
        <button type="button" class="h-14 rounded-2xl border-2 border-line bg-white px-5 text-lg text-ink" @click="router.back()">
          {{ t('onboarding.back') }}
        </button>
        <button type="button" class="h-14 flex-1 rounded-2xl bg-pine text-lg font-semibold text-paper active:opacity-90" @click="next">
          {{ t('onboarding.next') }}
        </button>
      </div>
    </template>
  </OnboardingShell>
</template>
