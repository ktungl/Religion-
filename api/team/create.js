// POST /api/team/create  { teamName, profile } -> { team, member }
// The person who creates the team becomes its manager.
import { handler, cleanProfile, cleanTeamName, newCode, newToken, hash } from '../_lib/team.js'

export default handler(async (body, store) => {
  const name = cleanTeamName(body.teamName)
  const profile = cleanProfile(body.profile)

  let code
  for (let i = 0; i < 5 && !code; i++) {
    const candidate = newCode()
    if (!(await store.findTeamByCode(candidate))) code = candidate
  }
  if (!code) throw new Error('Could not generate a unique team code')

  const team = await store.createTeam({ name, code })
  const token = newToken()
  const member = await store.createMember({ ...profile, teamId: team.id, role: 'manager', tokenHash: hash(token) })
  return {
    team: { name: team.name, code: team.code },
    member: { id: member.id, token, role: 'manager' },
  }
})
