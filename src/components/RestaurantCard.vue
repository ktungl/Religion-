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
</script>

<template>
  <li class="flex flex-col rounded-2xl border border-line bg-white p-4">
    <p class="font-semibold">{{ zh ? place.name : place.nameEn }}</p>
    <p class="text-sm text-muted" :lang="zh ? 'en' : 'zh-Hant'">{{ zh ? place.nameEn : place.name }}</p>
    <div class="mt-2 flex flex-wrap gap-1.5 text-xs">
      <span class="rounded-full px-2 py-0.5" :class="faithStyle(veg ? 'buddhism' : 'islam').soft">{{ t(`restaurants.cuisines.${place.cuisine}`) }}</span>
      <span class="rounded-full border border-line px-2 py-0.5 text-muted">{{ t(`restaurants.districts.${place.district}`) }}</span>
      <span v-if="veg" class="rounded-full border border-line px-2 py-0.5 text-muted">{{ t(`restaurants.veg.${place.veg}`) }}</span>
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
    <p class="mt-2 flex-1 text-sm" :lang="zh ? 'zh-Hant' : 'en'">{{ zh ? place.address : place.addressEn }}</p>
    <div class="mt-3 grid grid-cols-2 gap-2">
      <a :href="telLink(place)" class="flex h-11 items-center justify-center rounded-xl border-2 border-line text-sm active:bg-brand-soft">
        {{ t('restaurants.call') }}
      </a>
      <a :href="mapLink(place)" target="_blank" rel="noopener" class="flex h-11 items-center justify-center rounded-xl border-2 border-line text-sm active:bg-brand-soft">
        {{ t('restaurants.map') }}
      </a>
    </div>
  </li>
</template>
