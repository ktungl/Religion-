<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import BrandMark from './BrandMark.vue'

// Brand intro each time the app opens; it fades out by itself, or on a tap.
const SHOW_MS = 2000
const emit = defineEmits(['done'])

const leaving = ref(false)
let timer

function close() {
  if (leaving.value) return
  leaving.value = true
  clearTimeout(timer)
}

onMounted(() => {
  const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  timer = setTimeout(close, reduced ? 600 : SHOW_MS)
})
onUnmounted(() => clearTimeout(timer))
</script>

<template>
  <Transition name="splash" appear @after-leave="emit('done')">
    <div
      v-if="!leaving"
      class="fixed inset-0 z-50 flex items-center justify-center bg-paper"
      role="presentation"
      @click="close"
    >
      <BrandMark />
    </div>
  </Transition>
</template>

<style scoped>
.splash-leave-active {
  transition: opacity 0.35s ease;
}
.splash-leave-to {
  opacity: 0;
}
</style>
