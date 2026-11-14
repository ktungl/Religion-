// POST /api/team/leave  { memberId, token } -> { ok, teamDeleted }
// Deletes the member and everything they shared. When the manager leaves, the
// whole team goes with them: every member and what they shared is deleted.
import { handler, authenticate } from '../_lib/team.js'

export default handler(async (body, store) => {
  const member = await authenticate(store, body)
  if (member.role === 'manager') {
    await store.deleteTeam(member.teamId)
    return { ok: true, teamDeleted: true }
  }
  await store.deleteMember(member.id)
  return { ok: true, teamDeleted: false }
})
