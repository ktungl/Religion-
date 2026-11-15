// Talks to /api/team/*. The token proves which member is calling; it never
// leaves this device except to our own API.
import { ref, watch } from 'vue'
import { profile } from './profile'
import { i18n } from '../i18n'

export class TeamError extends Error {
  constructor(code, field) {
    super(code)
    this.code = code
    this.field = field
  }
}

async function call(action, body) {
  let res
  try {
    res = await fetch(`/api/team/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new TeamError('network')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new TeamError(data.error || 'network', data.field)
  return data
}

function myProfile() {
  return {
    displayName: profile.displayName,
    faiths: profile.faiths,
    share: profile.share,
    diet: profile.diet,
    locale: i18n.global.locale.value,
  }
}

function auth() {
  return { memberId: profile.member?.id, token: profile.member?.token }
}

function remember({ team, member }) {
  profile.team = team
  profile.member = member
}

export async function createTeam(teamName) {
  remember(await call('create', { teamName, profile: myProfile() }))
}

export async function joinTeam(code) {
  remember(await call('join', { code, profile: myProfile() }))
}

export async function loadTeam() {
  const data = await call('view', auth())
  profile.team = data.team
  if (profile.member) profile.member.role = data.me.role
  return data
}

export async function leaveTeam() {
  if (profile.member) {
    await call('leave', auth()).catch((e) => {
      // Already gone on the server: still clear it here.
      if (e.code !== 'unauthorized') throw e
    })
  }
  profile.team = null
  profile.member = null
}

// The profile is persisted locally. Re-send it on every launch so a failed
// update survives closing the app, without persisting a second copy of secrets.
export const syncState = ref('idle') // idle | pending | syncing | synced | error
let timer
let running = false
let started = false
let revision = 0

function scheduleSync(delay = 800) {
  clearTimeout(timer)
  timer = setTimeout(syncProfile, delay)
}

export async function syncProfile() {
  clearTimeout(timer)
  if (!profile.member || running) return
  running = true
  const credentials = auth()
  const version = revision
  syncState.value = 'syncing'
  try {
    const res = await fetch('/api/team/me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...credentials, profile: myProfile() }),
      signal: AbortSignal.timeout(15000),
    })
    if (!res.ok) throw new Error('Sync failed')
    if (version === revision) syncState.value = 'synced'
  } catch {
    if (version === revision) {
      syncState.value = 'error'
      scheduleSync(15000)
    }
  } finally {
    running = false
    // Serialize updates: an older request must finish before sending newer
    // settings, otherwise it could overwrite a newly disabled sharing switch.
    if (version !== revision && profile.member) scheduleSync(0)
  }
}

export function startSync() {
  if (started) return
  started = true
  watch(
    () => [profile.member?.id, profile.member?.token, profile.displayName, profile.faiths, { ...profile.share }, JSON.stringify(profile.diet), i18n.global.locale.value],
    () => {
      revision++
      clearTimeout(timer)
      syncState.value = profile.member ? 'pending' : 'idle'
      if (profile.member) scheduleSync()
    },
    { deep: true, immediate: true, flush: 'sync' },
  )
  window.addEventListener('online', () => { if (profile.member) syncProfile() })
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden && profile.member) syncProfile()
  })
}
