<script setup>
// For faiths we have no listed places for in the person's city: a button that
// opens a Google Maps search, so the screen is never a dead end.
// The search words are in Chinese because that is how places in Taiwan are named.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import zh from '../i18n/locales/zh-TW.json'

const props = defineProps({
  city: { type: String, default: '' },
  faiths: { type: Array, required: true },
  places: { type: Array, required: true },
})
const { t } = useI18n()

const SEARCH = {
  islam: { type: 'mosque', words: '清真寺' },
  catholic: { type: 'church', words: '天主堂' },
  protestant: { type: 'church', words: '基督教會' },
  buddhism: { type: 'temple', words: '寺廟' },
  folk: { type: 'temple', words: '寺廟' },
}

const links = computed(() => {
  const cityWords = props.city && props.city !== 'other' ? zh.city.names[props.city] : ''
  const seen = new Set()
  return props.faiths
    .filter((f) => SEARCH[f] && !props.places.some((p) => p.faiths.includes(f)))
    .map((f) => SEARCH[f])
    .filter((s) => !seen.has(s.words) && seen.add(s.words))
    .map((s) => ({
      label: t('places.searchMaps', { type: t(`places.types.${s.type}`) }),
      words: s.words,
      href: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${cityWords} ${s.words}`.trim())}`,
    }))
})
</script>

<template>
  <div v-if="links.length" class="mt-3 flex flex-col gap-2">
    <a
      v-for="l in links"
      :key="l.href"
      :href="l.href"
      target="_blank"
      rel="noopener"
      class="flex min-h-12 items-center justify-between gap-3 rounded-2xl border-2 border-line bg-white px-4 py-2 font-semibold active:bg-brand-soft"
    >
      <span>{{ l.label }}</span>
      <span class="shrink-0 text-sm font-normal text-muted" lang="zh-TW">{{ l.words }} ↗</span>
    </a>
  </div>
</template>
