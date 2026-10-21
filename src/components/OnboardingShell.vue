<script setup>
import { useI18n } from 'vue-i18n'

defineProps({
  step: { type: Number, required: true },
  total: { type: Number, required: true },
})
const { t } = useI18n()
</script>

<template>
  <div class="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4 pt-[max(1rem,env(safe-area-inset-top))]">
    <header class="flex items-center gap-3 pt-2">
      <div class="flex flex-1 gap-1.5" aria-hidden="true">
        <span
          v-for="n in total"
          :key="n"
          class="h-1.5 flex-1 rounded-full"
          :class="n <= step ? 'bg-brand' : 'bg-line'"
        />
      </div>
      <span class="text-xs text-muted">{{ t('onboarding.step', { n: step, total }) }}</span>
    </header>

    <main class="flex-1 pb-6">
      <slot />
    </main>

    <footer class="sticky bottom-0 bg-paper pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
      <slot name="footer" />
    </footer>
  </div>
</template>
