<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import AppNav from '../components/AppNav.vue'
import TeamJoin from '../components/TeamJoin.vue'
import { profile } from '../lib/profile'
import { loadTeam, leaveTeam } from '../lib/team'
import { demoTeamView } from '../lib/demoTeam'
import { groupForList, ymd } from '../lib/calendar'
import { faithStyle } from '../lib/faithStyle'
import DietSummary from '../components/DietSummary.vue'
import { hasDiet } from '../lib/diet'

const { t, locale } = useI18n()
const router = useRouter()

const data = ref(null)
const state = ref('idle') // idle | loading | error
const join = ref()
const copied = ref(false)
const todayKey = ymd(new Date())

const inTeam = computed(() => !!(profile.member || profile.demo))

async function refresh() {
  if (profile.demo && !profile.member) {
    data.value = demoTeamView()
    state.value = 'idle'
    return
  }
  if (!profile.member) return
  state.value = 'loading'
  try {
    data.value = await loadTeam()
    state.value = 'idle'
  } catch (e) {
    if (e.code === 'unauthorized' || e.code === 'not_found') {
      // Removed on the server: forget the team here too.
      profile.team = null
      profile.member = null
      state.value = 'idle'
    } else state.value = 'error'
  }
}
onMounted(refresh)

const isManager = computed(() => data.value?.me.role === 'manager')
const members = computed(() => data.value?.members || [])

// One row per date + event, listing everyone who shares it.
const teamEvents = computed(() => {
  const rows = new Map()
  for (const m of members.value) {
    for (const e of groupForList(m.events.filter((x) => x.date >= todayKey))) {
      const id = `${e.date}|${e.key}|${e.until || ''}`
      if (!rows.has(id)) rows.set(id, { ...e, people: [] })
      rows.get(id).people.push(m)
    }
  }
  return [...rows.values()].sort((a, b) => a.date.localeCompare(b.date))
})

// Manager notes are about the others on the team, so the viewer is left out.
const fastingToday = computed(
  () => members.value.filter((m) => !m.isMe && m.events.some((e) => e.date === todayKey && e.kind !== 'holiday')).length,
)
// Upcoming fasting periods and holidays others shared, soonest first.
const managerHints = computed(() =>
  teamEvents.value
    .filter((e) => e.kind !== 'vegetarian')
    .map((e) => ({ ...e, people: e.people.filter((p) => !p.isMe) }))
    .filter((e) => e.people.length)
    .slice(0, 4),
)
const praying = computed(() => members.value.filter((m) => m.prayer))
const eaters = computed(() => members.value.filter((m) => hasDiet(m.diet)))

function toDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}
const fmtDate = (key) => new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric', weekday: 'short' }).format(toDate(key))
const fmtShort = (key) => new Intl.DateTimeFormat(locale.value, { month: 'short', day: 'numeric' }).format(toDate(key))
const fmtTime = (iso) =>
  new Intl.DateTimeFormat(locale.value, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Taipei' }).format(new Date(iso))

const codeDisplay = computed(() => {
  const c = profile.team?.code || ''
  return c.length === 6 ? `${c.slice(0, 3)}-${c.slice(3)}` : c
})

async function copyCode() {
  try {
    await navigator.clipboard.writeText(codeDisplay.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    window.prompt(t('teamPage.copyCode'), codeDisplay.value)
  }
}

function startDemo() {
  profile.demo = true
  refresh()
}

function exitDemo() {
  profile.demo = false
  data.value = null
}

function joined() {
  profile.demo = false
  refresh()
}

async function leave() {
  if (!window.confirm(t('teamPage.leaveConfirm'))) return
  try {
    await leaveTeam()
    data.value = null
  } catch {
    state.value = 'error'
  }
}
</script>

<template>
  <div class="flex min-h-dvh flex-col">
    <div class="mx-auto w-full max-w-md flex-1 px-4 pt-[max(1.25rem,env(safe-area-inset-top))] pb-8 md:max-w-2xl md:px-6 md:pt-8 lg:max-w-3xl">
      <!-- Not in a team yet -->
      <template v-if="!inTeam">
        <h1 class="text-2xl font-semibold">{{ t('team.title') }}</h1>
        <p class="mt-1 text-muted">{{ t('team.desc') }}</p>
        <TeamJoin ref="join" class="mt-6" @done="joined" />
        <button
          type="button"
          class="mt-6 h-14 w-full rounded-2xl bg-brand text-lg font-semibold text-paper active:opacity-90 disabled:opacity-60"
          :disabled="join?.working"
          @click="join.submit()"
        >
          {{ join?.working ? t('team.working') : t('team.submit') }}
        </button>
        <div class="mt-8 rounded-2xl border border-dashed border-line p-4 text-center">
          <p class="text-sm text-muted">{{ t('demo.prompt') }}</p>
          <button type="button" class="mt-3 h-12 w-full rounded-xl border-2 border-brand font-semibold text-brand active:bg-brand-soft" @click="startDemo">
            {{ t('demo.start') }}
          </button>
        </div>
      </template>

      <!-- In a team -->
      <template v-else>
        <header class="flex items-start justify-between gap-3">
          <div>
            <p class="text-sm text-muted">{{ t('nav.team') }}</p>
            <h1 class="text-2xl font-semibold">{{ data?.team.name || profile.team?.name }}</h1>
          </div>
          <span v-if="isManager" class="mt-1 rounded-full bg-brand px-3 py-1 text-xs font-semibold text-paper">
            {{ t('teamPage.manager') }}
          </span>
        </header>

        <div v-if="data?.demo" class="mt-4 flex items-center justify-between gap-3 rounded-2xl border-2 border-dashed border-brand/40 bg-brand-soft px-4 py-3">
          <p class="text-sm">{{ t('demo.banner') }}</p>
          <button type="button" class="shrink-0 text-sm font-semibold underline underline-offset-4" @click="exitDemo">{{ t('demo.exit') }}</button>
        </div>

        <p v-if="state === 'loading' && !data" class="mt-8 text-center text-muted">{{ t('teamPage.loading') }}</p>
        <div v-else-if="state === 'error' && !data" class="mt-8 text-center">
          <p class="text-muted">{{ t('team.errors.network') }}</p>
          <button type="button" class="mt-3 h-11 rounded-xl border-2 border-line px-5" @click="refresh">{{ t('teamPage.retry') }}</button>
        </div>

        <template v-if="data">
          <!-- Manager notes -->
          <section v-if="isManager" class="mt-5 rounded-2xl bg-brand p-4 text-paper">
            <h2 class="text-sm font-semibold opacity-80">{{ t('teamPage.managerHint') }}</h2>
            <p class="mt-1 text-lg font-semibold">{{ fastingToday ? t('teamPage.fastingNow', { n: fastingToday }) : t('teamPage.fastingNone') }}</p>
            <ul v-if="managerHints.length" class="mt-2 flex flex-col gap-1.5 text-sm opacity-90">
              <li v-for="e in managerHints" :key="e.date + e.key" class="flex gap-2">
                <span class="mt-1.5 h-2 w-2 shrink-0 rounded-full" :class="faithStyle(e.faith).bar" aria-hidden="true" />
                <span>{{
                  t(e.kind === 'holiday' ? 'teamPage.leaveHint' : 'teamPage.fastHint', {
                    date: e.until ? `${fmtShort(e.date)}–${fmtShort(e.until)}` : fmtShort(e.date),
                    event: t(`events.${e.key}`),
                    n: e.people.length,
                  })
                }}</span>
              </li>
            </ul>
            <p v-else class="mt-2 text-sm opacity-80">{{ t('teamPage.noHints') }}</p>
          </section>

          <!-- Invite -->
          <section v-if="!data.demo" class="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-line bg-white p-4">
            <div>
              <p class="text-sm text-muted">{{ t('teamPage.invite') }}</p>
              <p class="font-mono text-2xl font-semibold tracking-[0.2em]">{{ codeDisplay }}</p>
            </div>
            <button type="button" class="h-11 shrink-0 rounded-xl border-2 border-line px-4 active:bg-brand-soft" @click="copyCode">
              {{ copied ? t('subscribe.copied') : t('teamPage.copyCode') }}
            </button>
          </section>

          <!-- Prayer times -->
          <section v-if="praying.length && data.prayerTimes.length" class="mt-5 rounded-2xl p-4" :class="faithStyle('islam').soft">
            <h2 class="text-sm font-semibold">{{ t('teamPage.prayerToday') }}</h2>
            <p class="mt-0.5 text-sm">{{ praying.map((m) => m.displayName).join('、') }}</p>
            <ol class="mt-2 grid grid-cols-5 gap-1.5 text-center">
              <li v-for="p in data.prayerTimes" :key="p.key" class="rounded-lg bg-white/70 py-1.5">
                <span class="block truncate text-xs opacity-80">{{ t(`prayers.${p.key}`) }}</span>
                <span class="block text-sm font-semibold tabular-nums">{{ fmtTime(p.time) }}</span>
              </li>
            </ol>
          </section>

          <!-- Team calendar -->
          <section class="mt-6">
            <h2 class="text-base font-semibold">{{ t('teamPage.calendar') }}</h2>
            <p v-if="!teamEvents.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
              {{ t('teamPage.empty') }}
            </p>
            <ul v-else class="mt-2 flex flex-col divide-y divide-line rounded-2xl border border-line bg-white">
              <li v-for="e in teamEvents" :key="e.date + e.key">
                <RouterLink :to="{ path: `/event/${e.key}`, query: { faith: e.faith, date: e.date, ...(e.until ? { until: e.until } : {}) } }" class="relative block py-3 pr-4 pl-5 active:bg-brand-soft">
                <span class="absolute top-3 bottom-3 left-0 w-1 rounded-r-full" :class="faithStyle(e.faith).bar" aria-hidden="true" />
                <div class="flex items-baseline justify-between gap-2">
                  <p class="font-semibold">{{ t(`events.${e.key}`) }}</p>
                  <p class="shrink-0 text-sm text-muted">{{ fmtDate(e.date) }}</p>
                </div>
                <p v-if="e.until" class="text-xs text-muted">{{ t('home.until', { date: fmtShort(e.until) }) }}</p>
                <div class="mt-1.5 flex flex-wrap gap-1.5">
                  <span v-for="p in e.people" :key="p.id" class="rounded-full px-2.5 py-0.5 text-xs" :class="faithStyle(e.faith).soft">
                    {{ p.displayName }}<template v-if="p.isMe && !p.hideYou"> ({{ t('teamPage.you') }})</template>
                  </span>
                </div>
                </RouterLink>
              </li>
            </ul>
          </section>

          <!-- Meal notes -->
          <section class="mt-6">
            <h2 class="text-base font-semibold">{{ t('teamPage.meals') }}</h2>
            <p class="text-sm text-muted">{{ t('teamPage.mealsDesc') }}</p>
            <p v-if="!eaters.length" class="mt-3 rounded-2xl border border-dashed border-line p-5 text-center text-muted">
              {{ t('teamPage.mealsEmpty') }}
            </p>
            <ul v-else class="mt-2 flex flex-col divide-y divide-line rounded-2xl border border-line bg-white">
              <li v-for="m in eaters" :key="m.id" class="px-4 py-3">
                <p class="font-semibold">
                  {{ m.displayName }}<span v-if="m.isMe && !m.hideYou" class="font-normal text-muted"> ({{ t('teamPage.you') }})</span>
                </p>
                <DietSummary :diet="m.diet" compact />
              </li>
            </ul>
          </section>

          <!-- Members -->
          <section class="mt-6">
            <h2 class="text-base font-semibold">{{ t('teamPage.members', { n: members.length }) }}</h2>
            <ul class="mt-2 flex flex-col divide-y divide-line rounded-2xl border border-line bg-white">
              <li v-for="m in members" :key="m.id" class="flex items-center gap-3 px-4 py-3">
                <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand" aria-hidden="true">
                  {{ m.displayName.slice(0, 1) }}
                </span>
                <div class="min-w-0 flex-1">
                  <p class="truncate font-semibold">
                    {{ m.displayName }}
                    <span v-if="m.isMe && !m.hideYou" class="font-normal text-muted">({{ t('teamPage.you') }})</span>
                    <span v-if="m.role === 'manager'" class="ml-1 rounded-full border border-line px-2 py-0.5 text-xs font-normal text-muted">{{ t('teamPage.manager') }}</span>
                  </p>
                  <div class="mt-1 flex flex-wrap gap-1">
                    <template v-if="m.faiths?.length">
                      <span v-for="f in m.faiths" :key="f" class="rounded-full px-2 py-0.5 text-xs" :class="faithStyle(f).soft">{{ t(`faiths.${f}`) }}</span>
                    </template>
                    <span v-else class="text-xs text-muted">{{ t('teamPage.notShared') }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </section>

          <div class="mt-6 flex flex-col gap-2">
            <button type="button" class="h-12 rounded-xl border-2 border-line bg-white" @click="router.push('/settings/share')">
              {{ t('teamPage.sharing') }}
            </button>
            <button v-if="data.demo" type="button" class="h-11 text-sm text-muted underline underline-offset-4" @click="exitDemo">
              {{ t('demo.exit') }}
            </button>
            <button v-else type="button" class="h-11 text-sm text-red-700 underline underline-offset-4" @click="leave">
              {{ t('teamPage.leave') }}
            </button>
          </div>
        </template>
      </template>
    </div>
    <AppNav />
  </div>
</template>
