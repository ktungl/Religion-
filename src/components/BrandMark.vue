<script setup>
// The animated logo and name, used on the welcome screen and the launch splash.
// The ring draws itself and one dot per faith color flies out to its place.
defineProps({ delay: { type: Number, default: 0 } })

const dots = [
  { color: 'var(--color-islam)', x: 0, y: -90 },
  { color: 'var(--color-christian)', x: 90, y: 0 },
  { color: 'var(--color-buddhism)', x: 0, y: 90 },
  { color: 'var(--color-folk)', x: -90, y: 0 },
]
</script>

<template>
  <div class="flex flex-col items-center text-center" :style="{ '--base': `${delay}s` }">
    <svg viewBox="0 0 512 512" class="logo h-32 w-32" aria-hidden="true">
      <rect width="512" height="512" rx="112" fill="var(--color-brand)" />
      <circle class="ring" cx="256" cy="256" r="148" fill="none" stroke="var(--color-paper)" stroke-width="18" opacity="0.9" />
      <circle
        v-for="(d, i) in dots"
        :key="i"
        class="dot"
        cx="256"
        cy="256"
        r="40"
        :fill="d.color"
        :style="{ '--x': `${d.x}px`, '--y': `${d.y}px`, '--delay': `${0.35 + i * 0.09}s` }"
      />
    </svg>
    <h1 class="rise mt-6 text-3xl font-semibold tracking-tight" style="--delay: 0.8s">Faith Together</h1>
    <p class="rise mt-1 text-2xl font-semibold text-muted" lang="zh-TW" style="--delay: 0.95s">共好日</p>
  </div>
</template>

<style scoped>
.logo {
  animation: logo-in 0.5s calc(var(--base)) cubic-bezier(0.2, 0.8, 0.2, 1) both;
}
.ring {
  stroke-dasharray: 930;
  animation: ring-draw 0.7s calc(var(--base) + 0.15s) ease-out both;
}
.dot {
  transform-box: view-box;
  transform-origin: 256px 256px;
  animation: dot-out 0.55s calc(var(--base) + var(--delay)) cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.rise {
  animation: rise 0.5s calc(var(--base) + var(--delay)) ease-out both;
}

@keyframes logo-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
}
@keyframes ring-draw {
  from {
    stroke-dashoffset: 930;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes dot-out {
  from {
    transform: translate(0, 0) scale(0);
  }
  to {
    transform: translate(var(--x), var(--y)) scale(1);
  }
}
@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .logo,
  .ring,
  .rise {
    animation: none;
  }
  .dot {
    animation: none;
    transform: translate(var(--x), var(--y));
  }
}
</style>
