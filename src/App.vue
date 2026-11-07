<script setup>
import { ref } from 'vue'
import LaunchSplash from './components/LaunchSplash.vue'
import { profile } from './lib/profile'

// Play the brand intro once per app launch. People who haven't set up yet are
// sent to the welcome screen, which already opens with the same animation.
const splash = ref(profile.onboarded)
</script>

<template>
  <RouterView />
  <LaunchSplash v-if="splash" @done="splash = false" />
</template>
