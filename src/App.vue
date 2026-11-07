<script setup>
import { ref } from 'vue'
import LaunchSplash from './components/LaunchSplash.vue'

// Play the brand intro once per app launch. It has no words to read, so it
// comes before the language step for new visitors too.
const splash = ref(true)
</script>

<template>
  <RouterView />
  <LaunchSplash v-if="splash" @done="splash = false" />
</template>
