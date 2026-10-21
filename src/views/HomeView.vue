<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { profile, resetProfile } from '../lib/profile'
import { eventsBetween, groupForList, prayerTimes, isRamadan, ymd, DEFAULT_PLACE } from '../lib/calendar'

const { t, locale } = useI18n()
const router = useRouter()

const now = new Date()
const todayKey = ymd(now)
const hasIslam = computed(() => profile.faiths.includes('islam'))

const todayLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value, { weekday: 'long', month: 'long', day: 'numeric' }).format(now),
)

const allEvents = computed(() => eventsBetween(now, 90, profile.faiths))
const todayEvents = computed(() => allEvents.value.filter((e) => e.date === todayKey))
const upcoming = computed(() => groupForList(allEvents.value.filter((e) => e.date > todayKey)))

const prayers = computed(() => (hasIslam.value ? prayerTimes(now) : []))
const iftar = computed(() => (hasIslam.value && isRamadan(now) ? prayers.value.find((p) => p.key === 'maghrib') : null))

function fmtTime(d) {
  return new Intl.DateTimeFormat(locale.value, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: DEFAULT_PLACE.tz }).format(d)
}

function toDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function fmtDate(key) {
  return new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric' }).format(toDate(key))
}

function fmtWeekday(key) {
  return new Intl.DateTimeFormat(locale.value, { weekday: 'short' }).format(toDate(key))
}

function relative(key) {
  const days = Math.round((toDate(key) - new Date(now.getFullYear(), now.getMonth(), now.getDate())) / 86400000)
  if (days > 7) return ''
  return new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }).format(days, 'day')
}

const KIND_STYLE = {
  fast: 'bg-saffron/20 text-amber-900',
  vegetarian: 'bg-pine-soft text-pine',
  holiday: 'bg-sky-100 text-sky-900',
}

function startOver() {
  resetProfile()
  router.replace('/onboarding/language')
}
</script>

<template>
  <div class="mx-auto min-h-dvh w-full max-w-md px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-10">
    <header>
      <p class="text-sm text-muted">{{ t('home.today') }}</p>
      <h1 class="text-2xl font-semibold">{{ todayLabel }}</h1>
    </header>

    <section v-if="todayEvents.length || iftar" class="mt-4 flex flex-col gap-2">
      <div v-for="e in todayEvents" :key="e.key" class="rounded-2xl bg-pine p-4 text-paper">
        <p class="text-lg font-semibold">{{ t(`events.${e.key}`) }}</p>
        <p class="text-sm opacity-80">{{ t(`faiths.${e.faith}`) }} · {{ t(`kinds.${e.kind}`) }}</p>
      </div>
      <div v-if="iftar" class="rounded-2xl bg-saffron/25 p-4">
        <p class="text-sm text-amber-900">{{ t('home.iftar') }}</p>
        <p class="text-2xl font-semibold text-amber-950">{{ fmtTime(iftar.time) }}</p>
      </div>
    </section>

    <section v-if="hasIslam" class="mt-6">
      <h2 class="text-base font-semibold">{{ t('home.prayerTitle') }}</h2>
      <ol class="mt-2 grid grid-cols-5 gap-1.5">
        <li v-for="p in prayers" :key="p.key" class="rounded-xl border border-line bg-white px-1 py-2 text-center">
          <span class="block truncate text-xs text-muted">{{ t(`prayers.${p.key}`) }}</span>
          <span class="block text-sm font-semibold tabular-nums">{{ fmtTime(p.time) }}</span>
        </li>
      </ol>
    </section>

    <section class="mt-6">
      <h2 class="text-base font-semibold">{{ t('home.upcoming') }}</h2>
      <p v-if="!upcoming.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
        {{ t('home.empty') }}
      </p>
      <ul v-else class="mt-2 flex flex-col divide-y divide-line rounded-2xl border border-line bg-white">
        <li v-for="e in upcoming" :key="e.date + e.key" class="flex items-center gap-3 px-4 py-3">
          <div class="w-20 shrink-0">
            <p class="text-sm font-semibold whitespace-nowrap">{{ fmtDate(e.date) }}</p>
            <p class="text-xs text-muted whitespace-nowrap">{{ relative(e.date) || fmtWeekday(e.date) }}</p>
          </div>
          <div class="min-w-0 flex-1">
            <p class="truncate">{{ t(`events.${e.key}`) }}</p>
            <p v-if="e.until" class="text-xs text-muted">{{ t('home.until', { date: fmtDate(e.until) }) }}</p>
          </div>
          <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold" :class="KIND_STYLE[e.kind]">
            {{ t(`kinds.${e.kind}`) }}
          </span>
        </li>
      </ul>
      <p v-if="hasIslam" class="mt-3 text-xs text-muted">{{ t('home.islamicNote') }}</p>
    </section>

    <button type="button" class="mt-8 w-full text-center text-sm text-muted underline underline-offset-4" @click="startOver">
      {{ t('home.reset') }}
    </button>
  </div>
</template>
