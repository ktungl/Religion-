<script setup>
// Shows someone's food needs: what they don't eat (in the reader's language)
// plus the Taiwanese term to use when ordering in Taiwan.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DIET_ITEMS, impliedBy, taiwanLabel } from '../lib/diet'

const props = defineProps({
  diet: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})
const { t } = useI18n()

const avoid = computed(() => props.diet.avoid || [])
const halal = computed(() => avoid.value.includes('halal'))
// List only what isn't already covered by a broader choice
// (e.g. "all meat" covers pork; "halal" covers pork and alcohol).
const items = computed(() => {
  const covered = impliedBy(avoid.value)
  return DIET_ITEMS.filter((x) => x !== 'halal' && avoid.value.includes(x) && !covered.has(x))
})
const label = computed(() => taiwanLabel(avoid.value))
</script>

<template>
  <div>
    <p v-if="halal" :class="compact ? 'text-sm' : ''">
      {{ t('diet.items.halal') }}
      <span v-if="!items.length && diet.when === 'someDays'" class="ml-1 rounded-full border border-line px-2 py-0.5 text-xs text-muted whitespace-nowrap">
        {{ t('diet.someDaysShort') }}
      </span>
    </p>
    <p v-if="items.length" :class="compact ? 'text-sm' : ''">
      <span class="text-muted">{{ t('diet.dontEatShort') }}</span>
      {{ items.map((x) => t(`diet.items.${x}`)).join('、') }}
      <span v-if="diet.when === 'someDays'" class="ml-1 rounded-full border border-line px-2 py-0.5 text-xs text-muted whitespace-nowrap">
        {{ t('diet.someDaysShort') }}
      </span>
    </p>
    <p v-if="diet.note" class="text-sm text-muted">{{ diet.note }}</p>
    <p v-if="label" class="mt-1 text-sm">
      <span class="text-muted">{{ t('diet.inTaiwan') }}</span>
      <span class="ml-1 rounded-md bg-brand-soft px-2 py-0.5 font-semibold" lang="zh-TW">{{ label }}</span>
    </p>
  </div>
</template>
