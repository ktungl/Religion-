<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { faithStyle } from '../lib/faithStyle'
import { mapLink, nextDate } from '../lib/places'
import { now } from '../lib/today'

const props = defineProps({ place: { type: Object, required: true } })
const { t, locale } = useI18n()

const MY_LANG = { vi: 'vi', id: 'id', en: 'en', 'zh-TW': 'zh' }
const myLang = computed(() => MY_LANG[locale.value])

// Weekday name from a 0-6 day number; 2023-01-01 was a Sunday.
const weekday = (day) => new Intl.DateTimeFormat(locale.value, { weekday: 'short' }).format(new Date(2023, 0, 1 + day))
const shortDate = (d) => new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric', weekday: 'short' }).format(d)

// Saturday evening masses count for Sunday, so Sunday is listed first.
const services = computed(() =>
  [...(props.place.services || [])].sort((a, b) => a.day - b.day || (a.time || '').localeCompare(b.time || '')),
)

// The soonest service in the person's own language, if the place has one.
const nextInMyLang = computed(() => {
  const mine = services.value.filter((s) => s.lang === myLang.value && s.lang !== 'zh')
  const dated = mine.map((s) => ({ s, d: nextDate(s, now.value) })).filter((x) => x.d)
  dated.sort((a, b) => a.d - b.d || (a.s.time || '').localeCompare(b.s.time || ''))
  return dated[0] || null
})

function when(s) {
  const parts = [weekday(s.day)]
  if (s.weeks) parts.unshift(t('places.weeks', { n: new Intl.ListFormat(locale.value, { style: 'narrow' }).format(s.weeks.map(String)) }))
  return parts.join(' ')
}
</script>

<template>
  <article class="rounded-2xl border border-line bg-white p-4">
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0">
        <h3 class="font-semibold">{{ place.name }}</h3>
        <p v-if="locale !== 'zh-TW' && place.en" class="text-sm text-muted">{{ place.en }}</p>
      </div>
      <span class="shrink-0 rounded-full px-2.5 py-1 text-xs" :class="faithStyle(place.faiths[0]).soft">
        {{ t(`places.types.${place.type}`) }}
      </span>
    </div>

    <p v-if="nextInMyLang" class="mt-2 rounded-xl px-3 py-2 text-sm font-semibold" :class="faithStyle(place.faiths[0]).soft">
      {{ t('places.next', { date: shortDate(nextInMyLang.d), time: nextInMyLang.s.time || t('places.timeTbc'), lang: t(`places.langs.${nextInMyLang.s.lang}`) }) }}
    </p>

    <ul v-if="services.length" class="mt-2 flex flex-col gap-0.5 text-sm">
      <li v-for="(s, i) in services" :key="i" class="flex gap-2" :class="s.lang === myLang ? 'font-semibold' : ''">
        <span class="w-28 shrink-0 text-muted">{{ when(s) }}</span>
        <span class="w-24 shrink-0 tabular-nums">{{ s.time || t('places.timeTbc') }}</span>
        <span>{{ t(`places.langs.${s.lang}`) }}</span>
      </li>
    </ul>
    <p v-if="place.friday" class="mt-2 text-sm">{{ t('places.friday') }}</p>
    <p v-if="place.hours" class="mt-1 text-sm text-muted">{{ t('places.hours', { h: place.hours }) }}</p>

    <p class="mt-2 text-sm">{{ place.address }}</p>
    <div class="mt-3 flex flex-wrap gap-2 text-sm">
      <a :href="mapLink(place)" target="_blank" rel="noopener" class="rounded-full border border-line px-3 py-1.5 font-semibold active:bg-brand-soft">
        {{ t('places.map') }}
      </a>
      <a v-if="place.phone" :href="`tel:${place.phone.split(' ')[0].replace(/-/g, '')}`" class="rounded-full border border-line px-3 py-1.5 font-semibold tabular-nums active:bg-brand-soft">
        {{ t('places.call') }} {{ place.phone }}
      </a>
    </div>
  </article>
</template>
