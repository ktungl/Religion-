<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { profile } from '../lib/profile'

const { t, locale } = useI18n()

const feedPath = computed(() => {
  const params = new URLSearchParams({ f: profile.faiths.join(','), lang: locale.value })
  return `${location.host}/api/calendar?${params}`
})
const httpsUrl = computed(() => `https://${feedPath.value}`)
const webcalUrl = computed(() => `webcal://${feedPath.value}`)
const googleUrl = computed(
  () => `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalUrl.value)}`,
)

const copied = ref(false)
async function copy() {
  try {
    await navigator.clipboard.writeText(httpsUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.prompt(t('subscribe.copy'), httpsUrl.value)
  }
}
</script>

<template>
  <section class="rounded-2xl border border-line bg-white p-4">
    <div class="flex items-start gap-3">
      <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand" aria-hidden="true">
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18M12 14v4M10 16h4" />
        </svg>
      </span>
      <div>
        <h2 class="text-base font-semibold">{{ t('subscribe.title') }}</h2>
        <p class="mt-0.5 text-sm text-muted">{{ t('subscribe.desc') }}</p>
      </div>
    </div>

    <div class="mt-4 flex flex-col gap-2">
      <a
        :href="googleUrl"
        target="_blank"
        rel="noopener"
        class="flex h-12 items-center justify-center rounded-xl bg-brand font-semibold text-paper active:opacity-90"
      >
        {{ t('subscribe.google') }}
      </a>
      <div class="flex gap-2">
        <a
          :href="webcalUrl"
          class="flex h-12 flex-1 items-center justify-center rounded-xl border-2 border-line text-ink active:bg-brand-soft"
        >
          {{ t('subscribe.apple') }}
        </a>
        <button
          type="button"
          class="h-12 rounded-xl border-2 border-line px-4 text-ink active:bg-brand-soft"
          @click="copy"
        >
          {{ copied ? t('subscribe.copied') : t('subscribe.copy') }}
        </button>
      </div>
    </div>
    <p class="mt-3 text-xs text-muted">{{ t('subscribe.note') }}</p>
  </section>
</template>
