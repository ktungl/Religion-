<script setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { faithStyle } from '../lib/faithStyle'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const key = route.params.key
const faith = route.query.faith || 'none'
const date = route.query.date
const until = route.query.until

const info = ref(null)
const state = ref('loading') // loading | ready | error

async function load() {
  state.value = 'loading'
  try {
    const res = await fetch(`/api/explain?${new URLSearchParams({ key, lang: locale.value })}`)
    if (!res.ok) throw new Error(String(res.status))
    info.value = await res.json()
    state.value = 'ready'
  } catch {
    state.value = 'error'
  }
}
watch(locale, load, { immediate: true })

function fmt(d) {
  if (!d) return ''
  const [y, m, day] = d.split('-').map(Number)
  return new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' }).format(new Date(y, m - 1, day))
}

function back() {
  if (window.history.state?.back) router.back()
  else router.replace('/home')
}
</script>

<template>
  <div class="mx-auto min-h-dvh w-full max-w-md px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-10">
    <button type="button" class="-ml-2 flex h-11 items-center gap-1 px-2 text-muted" @click="back">
      <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 18l-6-6 6-6" /></svg>
      {{ t('onboarding.back') }}
    </button>

    <header class="mt-2 rounded-2xl p-5" :class="faithStyle(faith).solid">
      <p class="text-sm opacity-85">{{ t(`faiths.${faith}`) }}</p>
      <h1 class="mt-1 text-2xl font-semibold">{{ t(`events.${key}`) }}</h1>
      <p v-if="date" class="mt-2 text-sm opacity-90">
        {{ fmt(date) }}<template v-if="until"> – {{ fmt(until) }}</template>
      </p>
    </header>

    <div v-if="state === 'loading'" class="mt-6 flex flex-col gap-3" aria-busy="true">
      <p class="text-sm text-muted">{{ t('detail.loading') }}</p>
      <div v-for="n in 3" :key="n" class="h-20 animate-pulse rounded-2xl bg-brand-soft motion-reduce:animate-none" />
    </div>

    <div v-else-if="state === 'error'" class="mt-8 text-center">
      <p class="text-muted">{{ t('team.errors.network') }}</p>
      <button type="button" class="mt-3 h-11 rounded-xl border-2 border-line px-5" @click="load">{{ t('teamPage.retry') }}</button>
    </div>

    <template v-else>
      <section class="mt-6">
        <h2 class="text-sm font-semibold text-muted">{{ t('detail.what') }}</h2>
        <p class="mt-1 text-lg leading-relaxed" :lang="info.lang">{{ info.what }}</p>
      </section>
      <section class="mt-6">
        <h2 class="text-sm font-semibold text-muted">{{ t('detail.how') }}</h2>
        <p class="mt-1 text-lg leading-relaxed" :lang="info.lang">{{ info.how }}</p>
      </section>
      <section class="mt-6 rounded-2xl border border-line bg-white p-4">
        <h2 class="font-semibold">{{ t('detail.tips') }}</h2>
        <ul class="mt-2 flex flex-col gap-2">
          <li v-for="(tip, i) in info.tips" :key="i" class="flex gap-3" :lang="info.lang">
            <span class="mt-2 h-2 w-2 shrink-0 rounded-full" :class="faithStyle(faith).bar" aria-hidden="true" />
            <span class="leading-relaxed">{{ tip }}</span>
          </li>
        </ul>
      </section>

      <p class="mt-5 flex items-start gap-2 text-xs text-muted">
        <span class="shrink-0 rounded border border-line px-1.5 py-0.5 font-semibold">{{ info.source === 'ai' ? 'AI' : t('detail.notesBadge') }}</span>
        <span>{{ info.source === 'ai' ? t('detail.aiNote') : t('detail.sampleNote') }}</span>
      </p>
    </template>
  </div>
</template>
