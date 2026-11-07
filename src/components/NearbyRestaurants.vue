<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { DISTRICTS, needsOf, restaurantsIn, sourceFor } from '../lib/restaurants'
import { profile } from '../lib/profile'
import RestaurantCard from './RestaurantCard.vue'

const { t } = useI18n()

// Each faith gets the kind of restaurant it calls for: Islam -> halal; Buddhism and
// folk religion (vegetarian on set days) -> vegetarian. Food needs add to that.
// Faiths with no food rules, and no needs, show nothing here.
const tabs = computed(() => {
  const needs = needsOf(profile.diet, profile.faiths)
  const f = profile.faiths
  const out = []
  if (f.includes('islam') || needs.has('halal') || needs.has('noPork')) out.push('halal', 'friendly')
  if (f.includes('buddhism') || f.includes('folk') || needs.has('veg') || needs.has('vegan') || needs.has('noPungent')) out.push('vegetarian')
  return out
})

const type = ref(tabs.value[0] || 'halal')
const district = ref('')
watch(tabs, (list) => {
  if (!list.includes(type.value)) type.value = list[0] || 'halal'
})

// Only restaurants in the person's own city.
const inCity = computed(() => restaurantsIn(profile.city))
const shown = computed(() => inCity.value.filter((p) => p.type === type.value && (!district.value || p.district === district.value)))
const districts = computed(() => DISTRICTS.filter((d) => inCity.value.some((p) => p.type === type.value && p.district === d)))
const source = computed(() => (type.value === 'vegetarian' ? 'vegetarian' : 'halal'))
const sourceUrl = computed(() => sourceFor(type.value, profile.city))

function pickType(next) {
  type.value = next
  if (!districts.value.includes(district.value)) district.value = ''
}
</script>

<template>
  <section v-if="tabs.length">
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
      <div v-if="tabs.length > 1" class="mt-3 grid gap-1 rounded-2xl bg-brand-soft p-1" :style="{ gridTemplateColumns: `repeat(${tabs.length}, minmax(0, 1fr))` }" role="tablist">
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
      <p class="mt-2 text-xs text-muted">{{ t(`restaurants.${type}Hint`) }}</p>

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
        <RestaurantCard v-for="p in shown" :key="p.id" :place="p" />
      </ul>

      <p v-if="sourceUrl && shown.length" class="mt-3 text-xs text-muted">
        <a :href="sourceUrl" target="_blank" rel="noopener" class="underline underline-offset-4">{{ t(`restaurants.source.${source}`) }}</a>
      </p>
    </template>
  </section>
</template>
