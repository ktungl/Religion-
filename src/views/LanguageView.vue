<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { LANGUAGES, i18n, setLocale } from '../i18n'
import OnboardingShell from '../components/OnboardingShell.vue'

const { t, locale } = useI18n()
const router = useRouter()

// Rotate "welcome" through every language so anyone sees their own first.
const welcomes = LANGUAGES.map((l) => ({
  code: l.code,
  text: i18n.global.getLocaleMessage(l.code).welcome,
}))
const welcomeIndex = ref(0)
let timer
onMounted(() => {
  const start = welcomes.findIndex((w) => w.code === locale.value)
  welcomeIndex.value = start >= 0 ? start : 0
  timer = setInterval(() => {
    welcomeIndex.value = (welcomeIndex.value + 1) % welcomes.length
  }, 2200)
})
onUnmounted(() => clearInterval(timer))

function choose(code) {
  setLocale(code)
}

const speakingCode = ref(null)
const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window

function speak(lang) {
  if (!canSpeak) return
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(lang.native)
  u.lang = lang.speech
  speakingCode.value = lang.code
  u.onend = u.onerror = () => (speakingCode.value = null)
  window.speechSynthesis.speak(u)
}

function next() {
  router.push('/onboarding/faith')
}
</script>

<template>
  <OnboardingShell :step="1" :total="4">
    <div class="pt-6 pb-8 text-center">
      <div class="relative h-12 overflow-hidden" aria-live="polite">
        <Transition name="welcome" mode="out-in">
          <p
            :key="welcomes[welcomeIndex].code"
            :lang="welcomes[welcomeIndex].code"
            class="text-4xl font-semibold text-brand"
          >
            {{ welcomes[welcomeIndex].text }}
          </p>
        </Transition>
      </div>
      <h1 class="mt-4 text-lg text-muted">{{ t('language.title') }}</h1>
    </div>

    <ul class="flex flex-col gap-3" role="radiogroup" :aria-label="t('language.title')">
      <li v-for="lang in LANGUAGES" :key="lang.code" class="flex items-stretch gap-2">
        <button
          type="button"
          role="radio"
          :aria-checked="locale === lang.code"
          :lang="lang.code"
          class="flex min-h-16 flex-1 items-center justify-between rounded-2xl border-2 px-5 text-left text-xl transition-colors"
          :class="
            locale === lang.code
              ? 'border-brand bg-brand-soft text-brand font-semibold'
              : 'border-line bg-white text-ink active:bg-brand-soft'
          "
          @click="choose(lang.code)"
        >
          <span>{{ lang.native }}</span>
          <span
            v-if="locale === lang.code"
            class="flex h-7 w-7 items-center justify-center rounded-full bg-brand text-base text-paper"
            aria-hidden="true"
            >✓</span
          >
        </button>
        <button
          v-if="canSpeak"
          type="button"
          class="flex w-14 items-center justify-center rounded-2xl border-2 border-line bg-white text-muted active:bg-brand-soft"
          :class="speakingCode === lang.code ? 'text-brand border-brand' : ''"
          :aria-label="`${t('language.listen')}: ${lang.native}`"
          @click="speak(lang)"
        >
          <svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M11 5 6 9H2v6h4l5 4V5z" />
            <path d="M15.5 8.5a5 5 0 0 1 0 7" />
            <path d="M19 5a10 10 0 0 1 0 14" />
          </svg>
        </button>
      </li>
    </ul>

    <p class="mt-5 text-center text-sm text-muted">{{ t('language.changeLater') }}</p>

    <template #footer>
      <button
        type="button"
        class="h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90"
        @click="next"
      >
        {{ t('onboarding.next') }}
      </button>
    </template>
  </OnboardingShell>
</template>

<style scoped>
.welcome-enter-active,
.welcome-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.welcome-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.welcome-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
@media (prefers-reduced-motion: reduce) {
  .welcome-enter-active,
  .welcome-leave-active {
    transition: none;
  }
}
</style>
