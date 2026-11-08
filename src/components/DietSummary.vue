<script setup>
// Shows someone's food needs: what they don't eat (in the reader's language)
// plus the Taiwanese term to use when ordering in Taiwan.
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { DIET_ITEMS, impliedBy, orderPhrase, taiwanLabel } from '../lib/diet'
import SpeakButton from './SpeakButton.vue'

const props = defineProps({
  diet: { type: Object, required: true },
  compact: { type: Boolean, default: false },
})
const { t, locale } = useI18n()

const avoid = computed(() => props.diet.avoid || [])
const halal = computed(() => avoid.value.includes('halal'))
// List only what isn't already covered by a broader choice
// (e.g. "all meat" covers pork; "halal" covers pork and alcohol).
const items = computed(() => {
  const covered = impliedBy(avoid.value)
  return DIET_ITEMS.filter((x) => x !== 'halal' && avoid.value.includes(x) && !covered.has(x))
})
const label = computed(() => taiwanLabel(avoid.value))
const phrase = computed(() => orderPhrase(label.value))
// Taiwanese readers don't need the pinyin.
const showPinyin = computed(() => locale.value !== 'zh-TW')
</script>

<template>
  <div>
    <p v-if="diet.anything" :class="compact ? 'text-sm' : ''">{{ t('diet.anything') }}</p>
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
    <div v-if="phrase" class="mt-1.5 text-sm">
      <p class="text-muted">{{ t('diet.inTaiwan') }}</p>
      <div class="mt-1 flex items-center gap-2">
        <span class="rounded-md bg-brand-soft px-2 py-0.5 text-base font-semibold" lang="zh-TW">{{ phrase.term }}</span>
        <span v-if="showPinyin" class="text-muted" lang="zh-Latn-pinyin">{{ phrase.termPinyin }}</span>
        <SpeakButton v-if="compact" class="ml-auto" size="sm" :text="phrase.text" :label="t('diet.listen')" />
      </div>
      <div v-if="!compact" class="mt-2 flex items-center gap-3 rounded-xl bg-paper px-3 py-2">
        <div class="min-w-0 flex-1">
          <p class="text-base font-semibold" lang="zh-TW">{{ phrase.text }}</p>
          <p v-if="showPinyin" class="text-muted" lang="zh-Latn-pinyin">{{ phrase.pinyin }}</p>
        </div>
        <SpeakButton :text="phrase.text" :label="t('diet.listen')" />
      </div>
    </div>
  </div>
</template>
