// POST /api/team/join  { code, profile } -> { team, member }
import { handler, cleanProfile, cleanCode, newToken, hash, StoreError } from '../_lib/team.js'

export default handler(async (body, store) => {
  const code = cleanCode(body.code)
  if (code.length !== 6) throw new StoreError('invalid', 'code')
  const profile = cleanProfile(body.profile)

  const team = await store.findTeamByCode(code)
  if (!team) throw new StoreError('not_found')

  const token = newToken()
  const member = await store.createMember({ ...profile, teamId: team.id, role: 'member', tokenHash: hash(token) })
  return {
    team: { name: team.name, code: team.code },
    member: { id: member.id, token, role: 'member' },
  }
})
