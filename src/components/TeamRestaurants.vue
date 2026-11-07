<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NEEDS, needsOf, recommend, restaurantsIn } from '../lib/restaurants'
import { profile } from '../lib/profile'
import RestaurantCard from './RestaurantCard.vue'

// Restaurants the whole team can eat at, from the food needs (or faiths) people
// chose to share. A restaurant that rules out anyone's need is left out.
// Cities aren't shared, so the viewer's own city is used.
const props = defineProps({ members: { type: Array, required: true } })
const { t } = useI18n()
const FIRST = 4
const showAll = ref(false)

// need -> who has it, in the order of NEEDS.
const needs = computed(() => {
  const who = new Map()
  for (const m of props.members) {
    for (const n of needsOf(m.diet, m.faiths || [])) {
      if (!who.has(n)) who.set(n, [])
      who.get(n).push(m)
    }
  }
  return NEEDS.filter((n) => who.has(n)).map((n) => ({ need: n, people: who.get(n) }))
})

// A need only counts as a must when someone has it every day.
const soft = computed(() => new Set(needs.value.filter((x) => x.people.every(someDays)).map((x) => x.need)))
const picks = computed(() => recommend(profile.city, new Set(needs.value.map((x) => x.need)), soft.value))
const hasData = computed(() => restaurantsIn(profile.city).length > 0)
const shown = computed(() => (showAll.value ? picks.value : picks.value.slice(0, FIRST)))

function someDays(m) {
  return m.diet?.when === 'someDays'
}
const name = (m) => (m.isMe && !m.hideYou ? `${m.displayName} (${t('teamPage.you')})` : m.displayName)
</script>

<template>
  <section>
    <div class="flex items-center justify-between gap-3">
      <h2 class="text-base font-semibold">{{ t('restaurants.team.title') }}</h2>
      <RouterLink to="/settings/city" class="shrink-0 text-sm text-muted underline underline-offset-4">
        {{ profile.city ? `${t(`city.names.${profile.city}`)} · ${t('places.change')}` : t('places.pickCity') }}
      </RouterLink>
    </div>
    <p class="text-sm text-muted">{{ t('restaurants.team.desc') }}</p>

    <p v-if="!needs.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
      {{ t('restaurants.team.none') }}
    </p>
    <template v-else>
      <ul class="mt-2 flex flex-col gap-1 rounded-2xl border border-line bg-white px-4 py-3 text-sm">
        <li v-for="x in needs" :key="x.need" class="flex gap-2">
          <span class="w-20 shrink-0 font-semibold">{{ t(`restaurants.needs.${x.need}`) }}</span>
          <span class="text-muted">
            <template v-for="(m, i) in x.people" :key="m.id"
              >{{ i ? '、' : '' }}{{ name(m) }}<template v-if="someDays(m)">{{ t('restaurants.team.someDays') }}</template></template
            >
          </span>
        </li>
      </ul>

      <p v-if="!hasData" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
        {{ t(profile.city ? 'restaurants.noCityData' : 'restaurants.noCity') }}
      </p>
      <p v-else-if="!picks.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
        {{ t('restaurants.team.noMatch') }}
      </p>
      <template v-else>
        <p class="mt-3 text-xs text-muted">{{ t('restaurants.team.legend') }}</p>
        <ul class="mt-2 grid gap-2 md:grid-cols-2">
          <RestaurantCard v-for="x in shown" :key="x.r.id" :place="x.r" :fits="x.fits" :some-days="soft" />
        </ul>
        <button
          v-if="picks.length > FIRST"
          type="button"
          class="mt-3 h-11 w-full rounded-xl border-2 border-line bg-white text-sm active:bg-brand-soft"
          @click="showAll = !showAll"
        >
          {{ showAll ? t('restaurants.team.less') : t('restaurants.team.more', { n: picks.length }) }}
        </button>
      </template>
    </template>
  </section>
</template>
