// POST /api/team/leave  { memberId, token } -> { ok }
// Deletes the member and everything they shared.
import { handler, authenticate } from '../_lib/team.js'

export default handler(async (body, store) => {
  const member = await authenticate(store, body)
  await store.deleteMember(member.id)
  return { ok: true }
})
