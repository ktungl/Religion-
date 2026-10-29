<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import TeamJoin from '../components/TeamJoin.vue'
import { profile } from '../lib/profile'

const { t } = useI18n()
const router = useRouter()
const join = ref()

function demo() {
  profile.demo = true
  finish('/team')
}

function finish(to = '/home') {
  profile.onboarded = true
  router.replace(to)
}
</script>

<template>
  <OnboardingShell :step="5" :total="5">
    <h1 class="pt-8 text-2xl font-semibold">{{ t('team.title') }}</h1>
    <p class="mt-1 text-muted">{{ t('team.desc') }}</p>

    <TeamJoin ref="join" class="mt-6" @done="finish('/team')" />

    <template #footer>
      <div class="flex flex-col gap-2">
        <button
          type="button"
          class="h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90 disabled:opacity-60"
          :disabled="join?.working"
          @click="join.submit()"
        >
          {{ join?.working ? t('team.working') : t('onboarding.next') }}
        </button>
        <div class="flex justify-center gap-5">
          <button type="button" class="h-11 text-base text-muted underline underline-offset-4" @click="demo">
            {{ t('demo.start') }}
          </button>
          <button type="button" class="h-11 text-base text-muted underline underline-offset-4" @click="finish()">
            {{ t('team.skip') }}
          </button>
        </div>
      </div>
    </template>
  </OnboardingShell>
</template>
