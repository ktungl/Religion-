// A fictional team, built in the browser, so anyone (including judges) can try
// the team features alone. Nothing is sent to the server.
import { prayerTimes, ymd } from './calendar.js'
import { sharedView } from './sharedView.js'
import { profile } from './profile.js'
import { i18n } from '../i18n'

// Each person shares something different, to show how privacy works.
const PEOPLE = [
  { id: 'demo-adi', displayName: 'Adi', faiths: ['islam'], share: { faith: true, fasting: true, holidays: true, prayer: true } },
  { id: 'demo-siti', displayName: 'Siti', faiths: ['islam'], share: { faith: false, fasting: true, holidays: false, prayer: false } },
  { id: 'demo-maria', displayName: 'Maria', faiths: ['catholic'], share: { faith: true, fasting: false, holidays: true, prayer: false } },
  { id: 'demo-linh', displayName: 'Linh', faiths: ['buddhism'], share: { faith: true, fasting: true, holidays: true, prayer: false } },
  { id: 'demo-chen', displayName: '阿明', faiths: ['folk'], share: { faith: true, fasting: true, holidays: true, prayer: false } },
]

export function demoTeamView(today = new Date()) {
  const day = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const t = i18n.global.t
  const me = {
    id: 'demo-me',
    displayName: profile.displayName || t('demo.youName'),
    faiths: profile.faiths,
    share: profile.share,
    role: 'manager',
  }
  const members = [me, ...PEOPLE.map((p) => ({ ...p, role: 'member' }))].map((m) => sharedView(m, me.id, day))
  // Without a name, "Me" already says who it is; skip the extra "(you)".
  if (!profile.displayName) members[0].hideYou = true
  return {
    demo: true,
    team: { name: t('demo.teamName'), code: 'DEMO00' },
    me: { role: 'manager' },
    members,
    prayerTimes: members.some((m) => m.prayer)
      ? prayerTimes(day).map((p) => ({ key: p.key, time: p.time.toISOString() }))
      : [],
    today: ymd(day),
  }
}
