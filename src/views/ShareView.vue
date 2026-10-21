<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import { profile } from '../lib/profile'

const { t } = useI18n()
const router = useRouter()
// Same screen is reused from the team page to change settings later.
const isSettings = useRoute().path.startsWith('/settings')

// Prayer times only make sense to share for faiths with set daily prayers.
const options = computed(() => {
  const list = ['faith', 'fasting', 'holidays']
  if (profile.faiths.includes('islam')) list.push('prayer')
  return list
})
</script>

<template>
  <OnboardingShell :step="isSettings ? 0 : 3" :total="isSettings ? 0 : 4">
    <h1 class="pt-8 text-2xl font-semibold">{{ t('share.title') }}</h1>
    <p class="mt-1 text-muted">{{ t('share.desc') }}</p>

    <ul class="mt-6 flex flex-col gap-3">
      <li v-for="key in options" :key="key">
        <label
          class="flex min-h-20 cursor-pointer items-center gap-4 rounded-2xl border-2 bg-white px-5 py-3 transition-colors"
          :class="profile.share[key] ? 'border-brand' : 'border-line'"
        >
          <span class="flex-1">
            <span class="block text-lg" :class="profile.share[key] ? 'font-semibold text-brand' : ''">{{ t(`share.${key}`) }}</span>
            <span class="mt-0.5 block text-sm text-muted">{{ t(`share.${key}Hint`) }}</span>
          </span>
          <span class="relative inline-flex h-8 w-14 shrink-0 items-center">
            <input v-model="profile.share[key]" type="checkbox" role="switch" class="peer absolute inset-0 h-full w-full cursor-pointer opacity-0" />
            <span class="h-8 w-14 rounded-full bg-line transition-colors peer-checked:bg-brand peer-focus-visible:ring-2 peer-focus-visible:ring-brand peer-focus-visible:ring-offset-2" aria-hidden="true" />
            <span class="pointer-events-none absolute left-1 h-6 w-6 rounded-full bg-white shadow transition-transform peer-checked:translate-x-6" aria-hidden="true" />
          </span>
        </label>
      </li>
    </ul>

    <template #footer>
      <button
        v-if="isSettings"
        type="button"
        class="h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90"
        @click="router.replace('/team')"
      >
        {{ t('onboarding.finish') }}
      </button>
      <div v-else class="flex gap-3">
        <button type="button" class="h-14 rounded-2xl border-2 border-line bg-white px-5 text-lg text-ink" @click="router.back()">
          {{ t('onboarding.back') }}
        </button>
        <button type="button" class="h-14 flex-1 rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90" @click="router.push('/onboarding/team')">
          {{ t('onboarding.next') }}
        </button>
      </div>
    </template>
  </OnboardingShell>
</template>
