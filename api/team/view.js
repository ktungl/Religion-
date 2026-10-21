// POST /api/team/view  { memberId, token } -> { team, members, prayerTimes }
// Returns the team as this member is allowed to see it: for everyone else,
// only what they chose to share.
import { handler, authenticate, sharedView, teamPrayerTimes, taipeiToday, StoreError } from '../_lib/team.js'

export default handler(async (body, store) => {
  const me = await authenticate(store, body)
  const team = await store.getTeam(me.teamId)
  if (!team) throw new StoreError('not_found')
  const today = taipeiToday()
  const members = (await store.listMembers(team.id)).map((m) => sharedView(m, me.id, today))
  return {
    team: { name: team.name, code: team.code },
    me: { role: me.role },
    members,
    prayerTimes: members.some((m) => m.prayer) ? teamPrayerTimes(today) : [],
  }
})
