// What one member lets the rest of the team see. Used by the server for real
// teams and by the browser for the demo team, so both follow the same rules.
import { eventsBetween } from './calendar.js'

export const TEAM_DAYS = 90

export function sharedView(member, viewerId, today, days = TEAM_DAYS) {
  const isMe = member.id === viewerId
  const share = member.share || {}
  const faiths = member.faiths || []
  const view = {
    id: member.id,
    displayName: member.displayName,
    role: member.role,
    isMe,
    faiths: isMe || share.faith ? faiths.filter((f) => f !== 'none') : null,
    events: [],
    prayer: false,
  }
  if (!share.fasting && !share.holidays && !share.prayer && !isMe) return view
  view.events = eventsBetween(today, days, faiths)
    .filter((e) => isMe || (e.kind === 'holiday' ? share.holidays : share.fasting) === true)
    .map(({ date, key, kind, faith }) => ({ date, key, kind, faith }))
  view.prayer = faiths.includes('islam') && (isMe || share.prayer === true)
  return view
}
