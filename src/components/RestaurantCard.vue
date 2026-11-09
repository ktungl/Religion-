<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { mapLink, telLink } from '../lib/restaurants'
import { faithStyle } from '../lib/faithStyle'

const props = defineProps({
  place: { type: Object, required: true },
  // need -> 'yes' | 'ask' | 'no', shown as badges when the card is a team recommendation.
  fits: { type: Object, default: null },
  // Needs that only apply on some days; a 'no' for them is a warning, not a blocker.
  someDays: { type: Set, default: () => new Set() },
})
const { t, locale } = useI18n()

// Chinese readers get the Chinese name and address; everyone else gets English first,
// with the Chinese name kept below so it can be shown to a driver or staff.
const zh = computed(() => locale.value === 'zh-TW')
const veg = computed(() => props.place.type === 'vegetarian')
// Places from open data may lack an English name or address; the Chinese one is shown instead.
const title = computed(() => (zh.value ? props.place.name : props.place.nameEn || props.place.name))
const subtitle = computed(() => (zh.value ? props.place.nameEn : props.place.nameEn ? props.place.name : ''))
const address = computed(() => (zh.value ? props.place.address : props.place.addressEn || props.place.address))
</script>

<template>
  <li class="flex flex-col rounded-2xl border border-line bg-white p-4">
    <p class="font-semibold">{{ title }}</p>
    <p v-if="subtitle" class="text-sm text-muted" :lang="zh ? 'en' : 'zh-Hant'">{{ subtitle }}</p>
    <div class="mt-2 flex flex-wrap gap-1.5 text-xs">
      <span v-if="place.cuisine" class="rounded-full px-2 py-0.5" :class="faithStyle(veg ? 'buddhism' : 'islam').soft">{{ t(`restaurants.cuisines.${place.cuisine}`) }}</span>
      <span class="rounded-full border border-line px-2 py-0.5 text-muted">{{ t(`restaurants.districts.${place.district}`) }}</span>
      <span v-if="veg" class="rounded-full border border-line px-2 py-0.5 text-muted">{{ t(`restaurants.veg.${place.veg}`) }}</span>
      <span v-if="place.unverified" class="rounded-full border border-dashed border-muted px-2 py-0.5 text-muted">{{ t('restaurants.unverified') }}</span>
    </div>
    <p v-if="veg && !fits" class="mt-1.5 text-xs text-muted">{{ t(`restaurants.pungent.${place.pungent}`) }}</p>
    <ul v-if="fits" class="mt-2 flex flex-wrap gap-1.5 text-xs">
      <li
        v-for="(f, need) in fits"
        :key="need"
        class="rounded-full px-2 py-0.5"
        :class="{
          'bg-brand text-paper': f === 'yes',
          'border border-dashed border-muted text-muted': f === 'ask',
          'border border-red-700/40 text-red-800': f === 'no',
        }"
      >
        {{ { yes: '✓', ask: '△', no: '✕' }[f] }} {{ t(`restaurants.needs.${need}`) }}<template v-if="someDays.has(need)">{{ t('restaurants.team.someDays') }}</template>
      </li>
    </ul>
    <p v-if="address" class="mt-2 flex-1 text-sm" :lang="zh || !place.addressEn ? 'zh-Hant' : 'en'">{{ address }}</p>
    <p v-else class="mt-2 flex-1 text-sm text-muted">{{ t('restaurants.coordsOnly') }}</p>
    <div class="mt-3 grid gap-2" :class="place.phone ? 'grid-cols-2' : 'grid-cols-1'">
      <a v-if="place.phone" :href="telLink(place)" class="flex h-11 items-center justify-center rounded-xl border-2 border-line text-sm active:bg-brand-soft">
        {{ t('restaurants.call') }}
      </a>
      <a :href="mapLink(place)" target="_blank" rel="noopener" class="flex h-11 items-center justify-center rounded-xl border-2 border-line text-sm active:bg-brand-soft">
        {{ t('restaurants.map') }}
      </a>
    </div>
  </li>
</template>
