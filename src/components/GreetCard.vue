<script setup>
// One coworker's upcoming day, with a button that asks the AI for a short
// greeting in that coworker's language. Only the day and the two languages are
// sent; the name is filled in here, in the browser.
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { faithStyle } from '../lib/faithStyle'
import { LANGUAGES } from '../i18n'

const props = defineProps({
  person: { type: Object, required: true },
  event: { type: Object, required: true },
  date: { type: String, required: true },
})
const { t, locale } = useI18n()

const open = ref(false)
const state = ref('idle') // idle | loading | error
const result = ref(null)
const index = ref(0)
const copied = ref(false)

const toLang = computed(() => props.person.lang || 'en')
const sameLang = computed(() => toLang.value === locale.value)
const langName = computed(() => LANGUAGES.find((l) => l.code === toLang.value)?.native || toLang.value)
const fill = (s) => s.replaceAll('{name}', props.person.displayName)
const option = computed(() => result.value?.options[index.value])

async function load() {
  open.value = true
  if (result.value) return
  state.value = 'loading'
  try {
    const q = new URLSearchParams({ key: props.event.key, to: toLang.value, from: locale.value })
    const res = await fetch(`/api/greet?${q}`)
    if (!res.ok) throw new Error(res.status)
    result.value = await res.json()
    state.value = 'idle'
  } catch {
    state.value = 'error'
  }
}

function another() {
  index.value = (index.value + 1) % result.value.options.length
  copied.value = false
}

async function send() {
  const text = fill(option.value.message)
  // Phones: open the share sheet (LINE, WhatsApp, Messenger...). Elsewhere: copy.
  if (navigator.share) {
    try {
      await navigator.share({ text })
      return
    } catch (e) {
      if (e?.name === 'AbortError') return
    }
  }
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.prompt(t('greet.copy'), text)
  }
}
</script>

<template>
  <li class="px-4 py-3">
    <div class="flex items-center justify-between gap-3">
      <div class="min-w-0">
        <p class="font-semibold">
          <span class="mr-1.5 inline-block h-2 w-2 rounded-full align-middle" :class="faithStyle(event.faith).bar" aria-hidden="true" />{{ person.displayName }}
        </p>
        <p class="text-sm text-muted">{{ t(`events.${event.key}`) }} · {{ date }}</p>
      </div>
      <button
        v-if="!open"
        type="button"
        class="h-10 shrink-0 rounded-xl border-2 border-brand px-3 text-sm font-semibold text-brand active:bg-brand-soft"
        @click="load"
      >
        {{ t('greet.write') }}
      </button>
    </div>

    <div v-if="open" class="mt-3 rounded-xl p-3" :class="faithStyle(event.faith).soft">
      <p v-if="state === 'loading'" class="text-sm">{{ t('greet.loading') }}</p>
      <div v-else-if="state === 'error'" class="flex items-center justify-between gap-2 text-sm">
        <span>{{ t('team.errors.network') }}</span>
        <button type="button" class="underline underline-offset-4" @click="(result = null), load()">{{ t('teamPage.retry') }}</button>
      </div>
      <template v-else-if="option">
        <p class="text-xs opacity-80">{{ t('greet.inLang', { lang: langName }) }}</p>
        <p class="mt-1 text-base leading-relaxed" :lang="toLang">{{ fill(option.message) }}</p>
        <p v-if="!sameLang && result.source === 'ai'" class="mt-2 border-t border-black/10 pt-2 text-sm opacity-80">
          <span class="text-xs">{{ t('greet.meaning') }}</span><br />{{ fill(option.translation) }}
        </p>
        <div class="mt-3 flex gap-2">
          <button type="button" class="h-10 flex-1 rounded-xl bg-brand text-sm font-semibold text-paper active:opacity-90" @click="send">
            {{ copied ? t('subscribe.copied') : t('greet.send') }}
          </button>
          <button
            v-if="result.options.length > 1"
            type="button"
            class="h-10 rounded-xl border-2 border-black/15 bg-white/70 px-3 text-sm"
            @click="another"
          >
            {{ t('greet.another') }} ({{ index + 1 }}/{{ result.options.length }})
          </button>
        </div>
        <p class="mt-2 text-xs opacity-70">{{ result.source === 'ai' ? t('greet.aiNote') : t('greet.sampleNote') }}</p>
      </template>
    </div>
  </li>
</template>
