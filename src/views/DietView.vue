<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import OnboardingShell from '../components/OnboardingShell.vue'
import DietSummary from '../components/DietSummary.vue'
import { profile } from '../lib/profile'
import { DIET_ITEMS, impliedBy } from '../lib/diet'

const { t } = useI18n()
const router = useRouter()
// Same screen in onboarding (step 3) and later from the home page.
const isSettings = useRoute().path.startsWith('/settings')

const implied = computed(() => impliedBy(profile.diet.avoid))
const checked = (item) => profile.diet.avoid.includes(item) || implied.value.has(item)

function toggle(item) {
  if (implied.value.has(item) && !profile.diet.avoid.includes(item)) return
  const avoid = profile.diet.avoid
  profile.diet.avoid = avoid.includes(item) ? avoid.filter((x) => x !== item) : [...avoid, item]
}

function next() {
  if (isSettings) router.back()
  else router.push('/onboarding/share')
}
</script>

<template>
  <OnboardingShell :step="isSettings ? 0 : 3" :total="isSettings ? 0 : 5">
    <h1 class="pt-8 text-2xl font-semibold">{{ t('diet.title') }}</h1>
    <p class="mt-1 text-muted">{{ t('diet.desc') }}</p>

    <h2 class="mt-6 text-sm font-semibold">{{ t('diet.dontEat') }}</h2>
    <ul class="mt-2 grid grid-cols-1 gap-2" role="group" :aria-label="t('diet.dontEat')">
      <li v-for="item in DIET_ITEMS" :key="item">
        <button
          type="button"
          role="checkbox"
          :aria-checked="checked(item)"
          :aria-disabled="implied.has(item) && !profile.diet.avoid.includes(item)"
          class="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border-2 px-4 py-2 text-left transition-colors"
          :class="checked(item) ? 'border-brand bg-brand-soft' : 'border-line bg-white active:bg-brand-soft'"
          @click="toggle(item)"
        >
          <span>
            <span class="block" :class="checked(item) ? 'font-semibold' : ''">{{ t(`diet.items.${item}`) }}</span>
            <span v-if="item === 'halal'" class="block text-xs text-muted">{{ t('diet.halalHint') }}</span>
            <span v-else-if="implied.has(item) && !profile.diet.avoid.includes(item)" class="block text-xs text-muted">{{ t('diet.included') }}</span>
          </span>
          <span
            class="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 text-sm"
            :class="checked(item) ? 'border-brand bg-brand text-paper' : 'border-line'"
            aria-hidden="true"
            >{{ checked(item) ? '✓' : '' }}</span
          >
        </button>
      </li>
    </ul>

    <h2 class="mt-6 text-sm font-semibold">{{ t('diet.whenTitle') }}</h2>
    <div class="mt-2 grid grid-cols-1 gap-2" role="radiogroup" :aria-label="t('diet.whenTitle')">
      <label
        v-for="w in ['always', 'someDays']"
        :key="w"
        class="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border-2 px-4"
        :class="profile.diet.when === w ? 'border-brand bg-brand-soft font-semibold' : 'border-line bg-white'"
      >
        <input v-model="profile.diet.when" type="radio" :value="w" class="h-4 w-4 accent-[var(--color-brand)]" />
        {{ t(`diet.when.${w}`) }}
      </label>
    </div>

    <label class="mt-6 block">
      <span class="text-sm font-semibold">{{ t('diet.note') }}</span>
      <input
        v-model="profile.diet.note"
        type="text"
        maxlength="60"
        :placeholder="t('diet.notePlaceholder')"
        class="mt-1 h-12 w-full rounded-2xl border-2 border-line bg-white px-4 outline-none focus:border-brand"
      />
    </label>

    <section v-if="profile.diet.avoid.length" class="mt-6 rounded-2xl border border-line bg-white p-4">
      <h2 class="text-sm font-semibold">{{ t('diet.preview') }}</h2>
      <DietSummary class="mt-1" :diet="profile.diet" />
    </section>

    <p class="mt-5 rounded-xl bg-brand-soft p-3 text-xs leading-relaxed text-muted">{{ t('diet.termNote') }}</p>

    <template #footer>
      <button
        v-if="isSettings"
        type="button"
        class="h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90"
        @click="next"
      >
        {{ t('onboarding.finish') }}
      </button>
      <div v-else class="flex gap-3">
        <button type="button" class="h-14 rounded-2xl border-2 border-line bg-white px-5 text-lg text-ink" @click="router.back()">
          {{ t('onboarding.back') }}
        </button>
        <button type="button" class="h-14 flex-1 rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90" @click="next">
          {{ profile.diet.avoid.length || profile.diet.note ? t('onboarding.next') : t('diet.skip') }}
        </button>
      </div>
    </template>
  </OnboardingShell>
</template>
