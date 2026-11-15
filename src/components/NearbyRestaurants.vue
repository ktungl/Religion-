<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DISTRICTS, needsOf, recommend, restaurantsIn, sourceFor } from '../lib/restaurants'
import { profile } from '../lib/profile'
import RestaurantCard from './RestaurantCard.vue'

const { t } = useI18n()

const needs = computed(() => needsOf(profile.diet, profile.faiths))
const soft = computed(() => profile.diet.when === 'someDays' ? needs.value : new Set())
const picks = computed(() => recommend(profile.city, needs.value, soft.value))
// Include ordinary restaurants for people without restrictions, and apply every
// selected food need to the personal list as well as the team recommendations.
const tabs = computed(() => {
  return [...new Set(picks.value.map((x) => x.r.type))]
})

const type = ref(tabs.value[0] || 'halal')
const district = ref('')
watch(tabs, (list) => {
  if (!list.includes(type.value)) type.value = list[0] || 'halal'
})

// Only restaurants in the person's own city.
const inCity = computed(() => restaurantsIn(profile.city))
const shown = computed(() => picks.value.filter((x) => x.r.type === type.value && (!district.value || x.r.district === district.value)))
const districts = computed(() => DISTRICTS.filter((d) => picks.value.some((x) => x.r.type === type.value && x.r.district === d)))
const source = computed(() => (type.value === 'vegetarian' ? 'vegetarian' : 'halal'))
const sourceUrl = computed(() => type.value === 'general' ? null : sourceFor(type.value, profile.city))

// The Taipei vegetarian list is long, so it is shown a page at a time.
const PAGE = 12
const limit = ref(PAGE)
watch([type, district, () => profile.city], () => (limit.value = PAGE))
watch(districts, (list) => { if (!list.includes(district.value)) district.value = '' })
const visible = computed(() => shown.value.slice(0, limit.value))
const hasUnverified = computed(() => shown.value.some((x) => x.r.unverified))
const MORE_SOURCES = { gov: 'https://data.gov.tw/en/datasets/94139', osm: 'https://www.openstreetmap.org/copyright' }

function pickType(next) {
  type.value = next
  if (!districts.value.includes(district.value)) district.value = ''
}
</script>

<template>
  <section>
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-base font-semibold">{{ t('restaurants.title') }}</h2>
      <RouterLink to="/settings/city" class="shrink-0 text-sm text-muted underline underline-offset-4">
        {{ profile.city ? `${t(`city.names.${profile.city}`)} · ${t('places.change')}` : t('places.pickCity') }}
      </RouterLink>
    </div>
    <p class="mt-0.5 text-sm text-muted">{{ t('restaurants.desc') }}</p>

    <p v-if="!inCity.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
      {{ t(profile.city ? 'restaurants.noCityData' : 'restaurants.noCity') }}
    </p>
    <template v-else>
      <div v-if="tabs.length > 1" class="mt-3 flex flex-wrap gap-1 rounded-2xl bg-brand-soft p-1" role="tablist">
        <button
          v-for="k in tabs"
          :key="k"
          type="button"
          role="tab"
          :aria-selected="type === k"
          class="h-11 rounded-xl px-1 text-sm transition-colors sm:text-base"
          :class="type === k ? 'bg-white font-semibold text-ink shadow-sm' : 'text-muted'"
          @click="pickType(k)"
        >
          {{ t(`restaurants.${k}`) }}
        </button>
      </div>
      <p v-if="tabs.length" class="mt-2 text-xs text-muted">{{ t(`restaurants.${type}Hint`) }}</p>
      <p v-if="needs.size" class="mt-2 text-xs text-muted">{{ t('restaurants.team.legend') }}</p>

      <div class="mt-3 flex flex-wrap gap-1.5">
        <button
          v-for="d in ['', ...districts]"
          :key="d || 'all'"
          type="button"
          :aria-pressed="district === d"
          class="h-9 rounded-full border px-3 text-sm transition-colors"
          :class="district === d ? 'border-brand bg-brand text-paper' : 'border-line bg-white text-muted'"
          @click="district = d"
        >
          {{ d ? t(`restaurants.districts.${d}`) : t('restaurants.all') }}
        </button>
      </div>

      <p v-if="!shown.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">{{ t('restaurants.empty') }}</p>
      <ul v-else class="mt-3 grid gap-2 md:grid-cols-2">
        <RestaurantCard v-for="x in visible" :key="x.r.id" :place="x.r" :fits="needs.size ? x.fits : null" :some-days="soft" />
      </ul>
      <button
        v-if="shown.length > limit"
        type="button"
        class="mt-3 h-11 w-full rounded-xl border-2 border-line text-sm active:bg-brand-soft"
        @click="limit += PAGE"
      >
        {{ t('restaurants.showMore', { n: Math.min(PAGE, shown.length - limit) }) }}
      </button>

      <p v-if="hasUnverified" class="mt-3 text-xs text-muted">{{ t('restaurants.unverifiedHint') }}</p>
      <p v-if="sourceUrl && shown.length" class="mt-3 text-xs text-muted">
        <a :href="sourceUrl" target="_blank" rel="noopener" class="underline underline-offset-4">{{ t(`restaurants.source.${source}`) }}</a>
      </p>
      <p v-if="hasUnverified" class="mt-1 text-xs text-muted">
        {{ t('restaurants.source.more') }}
        <a :href="MORE_SOURCES.gov" target="_blank" rel="noopener" class="underline underline-offset-4">{{ t('restaurants.source.gov') }}</a>
        ·
        <a :href="MORE_SOURCES.osm" target="_blank" rel="noopener" class="underline underline-offset-4">{{ t('restaurants.source.osm') }}</a>
      </p>
    </template>
  </section>
</template>
