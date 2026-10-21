<script setup>
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { profile } from '../lib/profile'
import { createTeam, joinTeam } from '../lib/team'

const emit = defineEmits(['done'])
const { t } = useI18n()

const mode = ref('join')
const form = reactive({ name: profile.displayName, code: '', teamName: '' })
const errors = reactive({})
const working = ref(false)

function clearError(key) {
  delete errors[key]
  delete errors.form
}

function formatCode(e) {
  const raw = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6)
  form.code = raw.length > 3 ? `${raw.slice(0, 3)}-${raw.slice(3)}` : raw
  clearError('code')
}

async function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!form.name.trim()) errors.name = t('team.errors.name')
  if (mode.value === 'join' && form.code.replace('-', '').length !== 6) errors.code = t('team.errors.code')
  if (mode.value === 'create' && !form.teamName.trim()) errors.teamName = t('team.errors.teamName')
  if (Object.keys(errors).length) return

  working.value = true
  profile.displayName = form.name.trim()
  try {
    if (mode.value === 'join') await joinTeam(form.code)
    else await createTeam(form.teamName.trim())
    emit('done')
  } catch (e) {
    if (e.code === 'not_found') errors.code = t('team.errors.notFound')
    else if (e.code === 'invalid' && e.field) errors[e.field === 'displayName' ? 'name' : e.field] = t(`team.errors.${e.field === 'displayName' ? 'name' : e.field}`)
    else errors.form = t('team.errors.network')
  } finally {
    working.value = false
  }
}

defineExpose({ submit, working })
</script>

<template>
  <form novalidate @submit.prevent="submit">
    <div class="grid grid-cols-2 gap-1 rounded-2xl bg-brand-soft p-1" role="tablist">
      <button
        v-for="m in ['join', 'create']"
        :key="m"
        type="button"
        role="tab"
        :aria-selected="mode === m"
        class="h-11 rounded-xl text-base transition-colors"
        :class="mode === m ? 'bg-white font-semibold text-ink shadow-sm' : 'text-muted'"
        @click="(mode = m), Object.keys(errors).forEach((k) => delete errors[k])"
      >
        {{ t(m === 'join' ? 'team.joinTab' : 'team.createTab') }}
      </button>
    </div>

    <label class="mt-5 block">
      <span class="text-sm font-semibold">{{ t('team.name') }}</span>
      <input
        v-model="form.name"
        type="text"
        maxlength="30"
        autocomplete="nickname"
        class="mt-1 h-14 w-full rounded-2xl border-2 bg-white px-4 text-lg outline-none focus:border-brand"
        :class="errors.name ? 'border-red-600' : 'border-line'"
        :aria-invalid="!!errors.name"
        @input="clearError('name')"
      />
      <span v-if="errors.name" class="mt-1 block text-sm text-red-700">{{ errors.name }}</span>
      <span v-else class="mt-1 block text-sm text-muted">{{ t('team.nameHint') }}</span>
    </label>

    <label v-if="mode === 'join'" class="mt-4 block">
      <span class="text-sm font-semibold">{{ t('team.code') }}</span>
      <input
        :value="form.code"
        type="text"
        inputmode="text"
        autocapitalize="characters"
        autocomplete="off"
        placeholder="ABC-234"
        class="mt-1 h-16 w-full rounded-2xl border-2 bg-white px-4 text-center font-mono text-2xl tracking-[0.3em] outline-none focus:border-brand"
        :class="errors.code ? 'border-red-600' : 'border-line'"
        :aria-invalid="!!errors.code"
        @input="formatCode"
      />
      <span v-if="errors.code" class="mt-1 block text-sm text-red-700">{{ errors.code }}</span>
    </label>

    <label v-else class="mt-4 block">
      <span class="text-sm font-semibold">{{ t('team.teamName') }}</span>
      <input
        v-model="form.teamName"
        type="text"
        maxlength="40"
        :placeholder="t('team.teamNamePlaceholder')"
        class="mt-1 h-14 w-full rounded-2xl border-2 bg-white px-4 text-lg outline-none focus:border-brand"
        :class="errors.teamName ? 'border-red-600' : 'border-line'"
        :aria-invalid="!!errors.teamName"
        @input="clearError('teamName')"
      />
      <span v-if="errors.teamName" class="mt-1 block text-sm text-red-700">{{ errors.teamName }}</span>
      <span v-else class="mt-1 block text-sm text-muted">{{ t('team.createHint') }}</span>
    </label>

    <p v-if="errors.form" class="mt-4 text-sm text-red-700" role="alert">{{ errors.form }}</p>
    <button type="submit" class="hidden" />
  </form>
</template>
