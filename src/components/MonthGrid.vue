<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { profile } from '../lib/profile'
import { faithStyle } from '../lib/faithStyle'
import { eventsBetween, ymd } from '../lib/calendar'
import { placesFor } from '../lib/places'
import { today } from '../lib/today'

// Month view for wide screens; phones keep the lists on the home and team pages.
const MAX_PER_DAY = 2

const props = defineProps({
  // Events to show, each optionally with the people who share it. Left out, the
  // person's own events (and nearby services in their language) are shown.
  events: { type: Array, default: null },
  // How many months from this one can be shown (0 = no limit).
  months: { type: Number, default: 0 },
})

const { t, locale } = useI18n()

const todayKey = computed(() => ymd(today.value))
const month = ref(new Date(today.value.getFullYear(), today.value.getMonth(), 1))
const openDay = ref(null)
// If the date rolls into a new month while this month is shown, follow it.
watch(today, (d, prev) => {
  if (month.value.getFullYear() === prev.getFullYear() && month.value.getMonth() === prev.getMonth()) {
    month.value = new Date(d.getFullYear(), d.getMonth(), 1)
  }
})

// 0 = Sunday. Browsers without Intl.Locale week info fall back to Sunday.
const weekStart = computed(() => {
  try {
    const loc = new Intl.Locale(locale.value)
    const info = loc.getWeekInfo?.() ?? loc.weekInfo
    return info ? info.firstDay % 7 : 0
  } catch {
    return 0
  }
})

// Regular services near the person in their own language (Mandarin ones are everywhere, so left out).
const MY_LANG = { vi: 'vi', id: 'id', en: 'en' }
const myServices = computed(() => {
  const lang = MY_LANG[locale.value]
  if (!lang || props.events) return []
  return placesFor(profile.city, profile.faiths, locale.value).flatMap((place) =>
    (place.services || []).filter((s) => s.lang === lang).map((s) => ({ place, s })),
  ).sort((a, b) => (a.s.time || '').localeCompare(b.s.time || ''))
})

const gridStart = computed(() => {
  const first = month.value
  const offset = (first.getDay() - weekStart.value + 7) % 7
  return new Date(first.getFullYear(), first.getMonth(), 1 - offset)
})

// Always six weeks so the grid doesn't jump in height between months.
const days = computed(() => {
  const start = gridStart.value
  const byDate = {}
  for (const e of props.events || eventsBetween(start, 42, profile.faiths, { locale: locale.value })) (byDate[e.date] ||= []).push(e)
  return Array.from({ length: 42 }, (_, i) => {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    const key = ymd(d)
    const services = myServices.value.filter(
      ({ s }) => s.day === d.getDay() && (!s.weeks || s.weeks.includes(Math.ceil(d.getDate() / 7))),
    )
    return { key, day: d.getDate(), inMonth: d.getMonth() === month.value.getMonth(), events: byDate[key] || [], services }
  })
})

const weekdays = computed(() => {
  const fmt = new Intl.DateTimeFormat(locale.value, { weekday: 'short' })
  // 2023-01-01 was a Sunday.
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2023, 0, 1 + ((weekStart.value + i) % 7))))
})

const title = computed(() => new Intl.DateTimeFormat(locale.value, { year: 'numeric', month: 'long' }).format(month.value))

const isThisMonth = computed(
  () => month.value.getFullYear() === today.value.getFullYear() && month.value.getMonth() === today.value.getMonth(),
)

const legend = computed(() => {
  const seen = new Set()
  const faiths = props.events ? [...new Set(props.events.map((e) => e.faith))] : profile.faiths
  return faiths.filter((f) => {
    const style = faithStyle(f)
    if (f === 'none' || seen.has(style)) return false
    seen.add(style)
    return true
  })
})

const monthIndex = computed(
  () => (month.value.getFullYear() - today.value.getFullYear()) * 12 + month.value.getMonth() - today.value.getMonth(),
)
const canPrev = computed(() => !props.months || monthIndex.value > 0)
const canNext = computed(() => !props.months || monthIndex.value < props.months - 1)

function shift(n) {
  month.value = new Date(month.value.getFullYear(), month.value.getMonth() + n, 1)
  openDay.value = null
}

function goToday() {
  month.value = new Date(today.value.getFullYear(), today.value.getMonth(), 1)
  openDay.value = null
}

function shown(d) {
  return openDay.value === d.key ? d.events : d.events.slice(0, MAX_PER_DAY)
}

function names(e) {
  return e.people?.map((p) => (p.isMe && !p.hideYou ? `${p.displayName} (${t('teamPage.you')})` : p.displayName)).join('、') || ''
}

function eventLink(e) {
  return { path: `/event/${e.key}`, query: { faith: e.faith, date: e.date, ...(e.until ? { until: e.until } : {}) } }
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-xl font-semibold">{{ title }}</h2>
      <div class="flex items-center gap-1">
        <button
          v-if="!isThisMonth"
          type="button"
          class="mr-1 rounded-full border border-line px-3 py-1 text-sm hover:bg-brand-soft"
          @click="goToday"
        >
          {{ t('home.thisMonth') }}
        </button>
        <button type="button" class="grid h-8 w-8 place-items-center rounded-full hover:bg-brand-soft disabled:opacity-30 disabled:hover:bg-transparent" :disabled="!canPrev" :aria-label="t('home.prevMonth')" @click="shift(-1)">‹</button>
        <button type="button" class="grid h-8 w-8 place-items-center rounded-full hover:bg-brand-soft disabled:opacity-30 disabled:hover:bg-transparent" :disabled="!canNext" :aria-label="t('home.nextMonth')" @click="shift(1)">›</button>
      </div>
    </div>

    <ul v-if="legend.length" class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
      <li v-for="f in legend" :key="f" class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full" :class="faithStyle(f).bar" aria-hidden="true" />
        {{ t(`faiths.${f}`) }}
      </li>
    </ul>

    <div class="mt-3 grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-muted" aria-hidden="true">
      <span v-for="w in weekdays" :key="w">{{ w }}</span>
    </div>
    <ol class="mt-1 grid grid-cols-7 gap-1.5">
      <li
        v-for="d in days"
        :key="d.key"
        class="flex min-h-24 min-w-0 flex-col gap-1 rounded-xl border p-1.5"
        :class="[
          d.inMonth ? 'border-line bg-white' : 'border-transparent bg-white/50',
          d.key === todayKey && '!border-brand',
        ]"
      >
        <span
          class="text-xs font-semibold tabular-nums"
          :class="[!d.inMonth && 'text-muted/60', d.key === todayKey && 'text-brand']"
        >
          {{ d.day }}
        </span>
        <RouterLink
          v-for="e in shown(d)"
          :key="e.key + e.faith"
          :to="eventLink(e)"
          class="block rounded-md px-1.5 py-0.5 text-left text-xs hover:opacity-80"
          :class="faithStyle(e.faith).soft"
          :title="[t(`events.${e.key}`), t(`faiths.${e.faith}`), names(e)].filter(Boolean).join(' · ')"
        >
          <span class="block truncate">{{ t(`events.${e.key}`) }}</span>
          <span v-if="e.people" class="block truncate opacity-75">{{ names(e) }}</span>
        </RouterLink>
        <RouterLink
          v-for="{ place, s } in d.services"
          :key="place.id + s.time"
          to="/places"
          class="block truncate rounded-md border border-line px-1.5 py-0.5 text-left text-xs text-muted hover:text-ink"
          :title="`${s.time || ''} ${place.name}`"
        >
          <span class="tabular-nums">{{ s.time }}</span> {{ place.en || place.name }}
        </RouterLink>
        <button
          v-if="d.events.length > MAX_PER_DAY"
          type="button"
          class="text-left text-xs text-muted hover:text-ink"
          @click="openDay = openDay === d.key ? null : d.key"
        >
          {{ openDay === d.key ? t('home.less') : t('home.more', { n: d.events.length - MAX_PER_DAY }) }}
        </button>
      </li>
    </ol>
  </div>
</template>
