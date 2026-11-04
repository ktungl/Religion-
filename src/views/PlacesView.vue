<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { profile } from '../lib/profile'
import { placesFor } from '../lib/places'
import { goBack } from '../lib/nav'
import PlaceCard from '../components/PlaceCard.vue'
import AppNav from '../components/AppNav.vue'

const { t, locale } = useI18n()
const router = useRouter()
const places = computed(() => placesFor(profile.city, profile.faiths, locale.value))
</script>

<template>
  <div class="flex min-h-dvh flex-col">
  <div class="mx-auto w-full max-w-md flex-1 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-8 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-3xl">
    <button type="button" class="text-sm text-muted" @click="goBack(router)">‹ {{ t('onboarding.back') }}</button>
    <header class="mt-2 flex items-end justify-between gap-3">
      <h1 class="text-2xl font-semibold">{{ t('places.title') }}</h1>
      <RouterLink to="/settings/city" class="text-sm font-semibold underline underline-offset-4">
        {{ t(`city.names.${profile.city || 'other'}`) }} · {{ t('places.change') }}
      </RouterLink>
    </header>

    <p v-if="!places.length" class="mt-4 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
      {{ t('places.empty') }}
    </p>
    <div v-else class="mt-4 grid gap-3 md:grid-cols-2">
      <PlaceCard v-for="p in places" :key="p.id" :place="p" />
    </div>
    <p v-if="places.length" class="mt-4 text-xs text-muted">{{ t('places.check', { date: places[0].checked }) }}</p>
  </div>
  <AppNav />
  </div>
</template>
