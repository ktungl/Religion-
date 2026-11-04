<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { DISTRICTS, RESTAURANTS, RESTAURANTS_SOURCE, mapLink, telLink } from '../lib/restaurants'
import { faithStyle } from '../lib/faithStyle'

const { t, locale } = useI18n()
const type = ref('halal')
const district = ref('')

// Chinese readers get the Chinese name and address; everyone else gets English first,
// with the Chinese name kept below so it can be shown to a driver or staff.
const zh = computed(() => locale.value === 'zh-TW')
const shown = computed(() => RESTAURANTS.filter((p) => p.type === type.value && (!district.value || p.district === district.value)))
const districts = computed(() => DISTRICTS.filter((d) => RESTAURANTS.some((p) => p.type === type.value && p.district === d)))

function pickType(next) {
  type.value = next
  if (!districts.value.includes(district.value)) district.value = ''
}
</script>

<template>
  <section>
    <h2 class="text-base font-semibold">{{ t('restaurants.title') }}</h2>
    <p class="mt-0.5 text-sm text-muted">{{ t('restaurants.desc') }}</p>

    <div class="mt-3 grid grid-cols-2 gap-1 rounded-2xl bg-brand-soft p-1" role="tablist">
      <button
        v-for="k in ['halal', 'friendly']"
        :key="k"
        type="button"
        role="tab"
        :aria-selected="type === k"
        class="h-11 rounded-xl text-base transition-colors"
        :class="type === k ? 'bg-white font-semibold text-ink shadow-sm' : 'text-muted'"
        @click="pickType(k)"
      >
        {{ t(`restaurants.${k}`) }}
      </button>
    </div>
    <p class="mt-2 text-xs text-muted">{{ t(type === 'halal' ? 'restaurants.halalHint' : 'restaurants.friendlyHint') }}</p>

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
      <li v-for="p in shown" :key="p.id" class="flex flex-col rounded-2xl border border-line bg-white p-4">
        <p class="font-semibold">{{ zh ? p.name : p.nameEn }}</p>
        <p class="text-sm text-muted" :lang="zh ? 'en' : 'zh-Hant'">{{ zh ? p.nameEn : p.name }}</p>
        <div class="mt-2 flex flex-wrap gap-1.5 text-xs">
          <span class="rounded-full px-2 py-0.5" :class="faithStyle('islam').soft">{{ t(`restaurants.cuisines.${p.cuisine}`) }}</span>
          <span class="rounded-full border border-line px-2 py-0.5 text-muted">{{ t(`restaurants.districts.${p.district}`) }}</span>
        </div>
        <p class="mt-2 flex-1 text-sm" :lang="zh ? 'zh-Hant' : 'en'">{{ zh ? p.address : p.addressEn }}</p>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <a :href="telLink(p)" class="flex h-11 items-center justify-center rounded-xl border-2 border-line text-sm active:bg-brand-soft">
            {{ t('restaurants.call') }}
          </a>
          <a :href="mapLink(p)" target="_blank" rel="noopener" class="flex h-11 items-center justify-center rounded-xl border-2 border-line text-sm active:bg-brand-soft">
            {{ t('restaurants.map') }}
          </a>
        </div>
      </li>
    </ul>

    <p class="mt-3 text-xs text-muted">
      <a :href="RESTAURANTS_SOURCE" target="_blank" rel="noopener" class="underline underline-offset-4">{{ t('restaurants.source') }}</a>
    </p>
  </section>
</template>
