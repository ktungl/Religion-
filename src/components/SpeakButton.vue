<script setup>
// Plays a short text aloud with the device's own voice (no network needed).
// Hidden on devices without speech support.
import { ref } from 'vue'

const props = defineProps({
  text: { type: String, required: true },
  lang: { type: String, default: 'zh-TW' },
  label: { type: String, required: true },
  size: { type: String, default: 'md' }, // md | sm
})

const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window
const speaking = ref(false)

function speak() {
  window.speechSynthesis.cancel()
  const u = new SpeechSynthesisUtterance(props.text)
  u.lang = props.lang
  u.rate = 0.85
  speaking.value = true
  u.onend = u.onerror = () => (speaking.value = false)
  window.speechSynthesis.speak(u)
}
</script>

<template>
  <button
    v-if="canSpeak"
    type="button"
    class="flex shrink-0 items-center justify-center rounded-full border-2 bg-white active:bg-brand-soft"
    :class="[size === 'sm' ? 'h-8 w-8' : 'h-10 w-10', speaking ? 'border-brand text-brand' : 'border-line text-muted']"
    :aria-label="label"
    @click="speak"
  >
    <svg viewBox="0 0 24 24" :class="size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a10 10 0 0 1 0 14" />
    </svg>
  </button>
</template>
