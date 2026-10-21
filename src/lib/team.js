// Talks to /api/team/*. The token proves which member is calling; it never
// leaves this device except to our own API.
import { watch } from 'vue'
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

// Keep the server copy in step with changes made on this device.
let timer
export function startSync() {
  watch(
    () => [profile.displayName, profile.faiths, { ...profile.share }, i18n.global.locale.value],
    () => {
      if (!profile.member) return
      clearTimeout(timer)
      timer = setTimeout(() => call('me', { ...auth(), profile: myProfile() }).catch(() => {}), 800)
    },
    { deep: true },
  )
}
