<script setup>
import { useI18n } from 'vue-i18n'
import { profile } from '../lib/profile'
import { syncState, syncProfile } from '../lib/team'

const { t } = useI18n()
</script>

<template>
  <div v-if="profile.member && syncState !== 'idle'" class="border-b border-line bg-paper px-4 py-2 text-sm" role="status" aria-live="polite">
    <div class="mx-auto flex max-w-3xl items-center justify-between gap-3" :class="syncState === 'error' ? 'text-red-700' : 'text-muted'">
      <span>{{ t(`sync.${syncState}`) }}</span>
      <button v-if="syncState === 'error'" type="button" class="min-h-11 shrink-0 px-2 font-semibold underline underline-offset-4" @click="syncProfile">
        {{ t('sync.retry') }}
      </button>
    </div>
  </div>
</template>
