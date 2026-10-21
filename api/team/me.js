// POST /api/team/me  { memberId, token, profile } -> { ok }
// Saves the member's own name, faiths, sharing switches and language.
import { handler, authenticate, cleanProfile } from '../_lib/team.js'

export default handler(async (body, store) => {
  const member = await authenticate(store, body)
  await store.updateMember(member.id, cleanProfile(body.profile))
  return { ok: true }
})
