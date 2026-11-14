<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { profile, resetProfile } from '../lib/profile'
import { faithStyle } from '../lib/faithStyle'
import SubscribeCard from '../components/SubscribeCard.vue'
import AppNav from '../components/AppNav.vue'
import DietSummary from '../components/DietSummary.vue'
import NearbyRestaurants from '../components/NearbyRestaurants.vue'
import { hasDiet } from '../lib/diet'
import MonthGrid from '../components/MonthGrid.vue'
import PlaceCard from '../components/PlaceCard.vue'
import MapSearch from '../components/MapSearch.vue'
import { placesFor } from '../lib/places'
import { today } from '../lib/today'
import { leaveTeam } from '../lib/team'
import { eventsBetween, groupForList, prayerTimes, isRamadan, ymd, DEFAULT_PLACE } from '../lib/calendar'

const { t, locale } = useI18n()
const router = useRouter()

const todayKey = computed(() => ymd(today.value))
const hasIslam = computed(() => profile.faiths.includes('islam'))

const todayLabel = computed(() =>
  new Intl.DateTimeFormat(locale.value, { weekday: 'long', month: 'long', day: 'numeric' }).format(today.value),
)

const allEvents = computed(() => eventsBetween(today.value, 90, profile.faiths, { locale: locale.value }))
const todayEvents = computed(() => allEvents.value.filter((e) => e.date === todayKey.value))
const upcoming = computed(() => groupForList(allEvents.value.filter((e) => e.date > todayKey.value)))

const places = computed(() => placesFor(profile.city, profile.faiths, locale.value))
const HOME_PLACES = 2

const prayers = computed(() => (hasIslam.value ? prayerTimes(today.value) : []))
const iftar = computed(() => (hasIslam.value && isRamadan(today.value) ? prayers.value.find((p) => p.key === 'maghrib') : null))

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
  const days = Math.round((toDate(key) - today.value) / 86400000)
  if (days > 7) return ''
  return new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' }).format(days, 'day')
}

function eventLink(e) {
  const query = { faith: e.faith, date: e.date }
  if (e.until) query.until = e.until
  return { path: `/event/${e.key}`, query }
}

async function startOver() {
  // A manager leaving deletes the whole team, so ask first.
  if (profile.member?.role === 'manager' && !window.confirm(t('teamPage.leaveConfirmManager'))) return
  // Leaving the team deletes what was shared; if offline, the local copy is cleared anyway.
  await leaveTeam().catch(() => {})
  resetProfile()
  router.replace('/onboarding/language')
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
  <div class="mx-auto w-full max-w-md flex-1 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-8 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-3xl">
    <header>
      <p class="text-sm text-muted">{{ t('home.today') }}</p>
      <h1 class="text-2xl font-semibold">{{ todayLabel }}</h1>
    </header>

    <section v-if="todayEvents.length || iftar" class="mt-4 grid gap-2 md:grid-cols-2">
      <RouterLink
        v-for="e in todayEvents"
        :key="e.key"
        :to="eventLink(e)"
        class="flex items-center justify-between rounded-2xl p-4"
        :class="faithStyle(e.faith).solid"
      >
        <span>
          <span class="block text-lg font-semibold">{{ t(`events.${e.key}`) }}</span>
          <span class="block text-sm opacity-80">{{ t(`faiths.${e.faith}`) }} · {{ t(`kinds.${e.kind}`) }}</span>
        </span>
        <span class="text-sm opacity-90">{{ t('detail.open') }} ›</span>
      </RouterLink>
      <div v-if="iftar" class="rounded-2xl p-4" :class="faithStyle('islam').soft">
        <p class="text-sm">{{ t('home.iftar') }}</p>
        <p class="text-2xl font-semibold">{{ fmtTime(iftar.time) }}</p>
      </div>
    </section>

    <section v-if="hasIslam" class="mt-6">
      <h2 class="text-base font-semibold">{{ t('home.prayerTitle') }}</h2>
      <ol class="mt-2 grid grid-cols-5 gap-1.5">
        <li v-for="p in prayers" :key="p.key" class="rounded-xl px-1 py-2 text-center" :class="faithStyle('islam').soft">
          <span class="block truncate text-xs opacity-80">{{ t(`prayers.${p.key}`) }}</span>
          <span class="block text-sm font-semibold tabular-nums">{{ fmtTime(p.time) }}</span>
        </li>
      </ol>
    </section>

    <MonthGrid class="mt-6 hidden lg:block" />

    <section class="mt-6 lg:mt-3">
      <div class="lg:hidden">
        <h2 class="text-base font-semibold">{{ t('home.upcoming') }}</h2>
        <p v-if="!upcoming.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
          {{ t('home.empty') }}
        </p>
        <ul v-else class="mt-2 flex flex-col divide-y divide-line rounded-2xl border border-line bg-white">
          <li v-for="e in upcoming" :key="e.date + e.key">
            <RouterLink :to="eventLink(e)" class="relative flex items-center gap-3 py-3 pr-4 pl-5 active:bg-brand-soft">
            <span class="absolute top-3 bottom-3 left-0 w-1 rounded-r-full" :class="faithStyle(e.faith).bar" aria-hidden="true" />
            <div class="w-20 shrink-0">
              <p class="text-sm font-semibold whitespace-nowrap">{{ fmtDate(e.date) }}</p>
              <p class="text-xs text-muted whitespace-nowrap">{{ relative(e.date) || fmtWeekday(e.date) }}</p>
            </div>
            <div class="min-w-0 flex-1">
              <p class="truncate">{{ t(`events.${e.key}`) }}</p>
              <p class="truncate text-xs" :class="faithStyle(e.faith).text">
                {{ t(`faiths.${e.faith}`) }}<template v-if="e.until"> · {{ t('home.until', { date: fmtDate(e.until) }) }}</template>
              </p>
            </div>
            <span class="shrink-0 rounded-full border border-line px-2.5 py-1 text-xs text-muted">
              {{ t(`kinds.${e.kind}`) }}
            </span>
            </RouterLink>
          </li>
        </ul>
      </div>
      <p v-if="hasIslam" class="mt-3 text-xs text-muted">{{ t('home.islamicNote') }}</p>
    </section>

    <section v-if="!profile.faiths.includes('none')" class="mt-6">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-base font-semibold">{{ t('places.home') }}</h2>
        <RouterLink v-if="profile.city" to="/settings/city" class="text-sm text-muted underline underline-offset-4">
          {{ t(`city.names.${profile.city}`) }} · {{ t('places.change') }}
        </RouterLink>
      </div>
      <RouterLink v-if="!profile.city" to="/settings/city" class="mt-2 block rounded-2xl border border-dashed border-line p-5 text-center">
        <span class="block text-muted">{{ t('places.noCity') }}</span>
        <span class="mt-2 inline-block font-semibold underline underline-offset-4">{{ t('places.pickCity') }}</span>
      </RouterLink>
      <p v-else-if="!places.length" class="mt-2 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
        {{ t('places.empty') }}
      </p>
      <template v-else>
        <div class="mt-2 grid gap-3 md:grid-cols-2">
          <PlaceCard v-for="p in places.slice(0, HOME_PLACES)" :key="p.id" :place="p" />
        </div>
        <RouterLink to="/places" class="mt-3 block rounded-2xl border border-line bg-white py-3 text-center font-semibold active:bg-brand-soft">
          {{ places.length > HOME_PLACES ? t('places.seeAll', { n: places.length }) : t('places.details') }}
        </RouterLink>
      </template>
      <MapSearch v-if="profile.city" :city="profile.city" :faiths="profile.faiths" :places="places" />
    </section>

    <section class="mt-6 rounded-2xl border border-line bg-white p-4">
      <div class="flex items-center justify-between gap-3">
        <h2 class="text-base font-semibold">{{ t('diet.card') }}</h2>
        <RouterLink to="/settings/diet" class="text-sm font-semibold underline underline-offset-4">{{ t('diet.edit') }}</RouterLink>
      </div>
      <DietSummary v-if="hasDiet(profile.diet)" class="mt-2" :diet="profile.diet" />
      <p v-else class="mt-1 text-sm text-muted">{{ t('diet.notSet') }}</p>
    </section>

    <NearbyRestaurants class="mt-6" />

    <SubscribeCard v-if="!profile.faiths.includes('none')" class="mt-6" />

    <button type="button" class="mt-8 w-full text-center text-sm text-muted underline underline-offset-4" @click="startOver">
      {{ t('home.reset') }}
    </button>
  </div>
  <AppNav />
  </div>
</template>
