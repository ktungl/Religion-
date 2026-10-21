// Shared helpers for the /api/team/* functions: validation, auth, and the
// privacy filter that decides what other members may see.
import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import { FAITHS, prayerTimes } from '../../src/lib/calendar.js'
import { getStore, StoreError } from './store.js'

const LOCALES = ['zh-TW', 'vi', 'id', 'th', 'en']
const SHARE_KEYS = ['faith', 'fasting', 'holidays', 'prayer']
// No 0/O, 1/I/L, so codes are easy to read aloud and type.
const CODE_ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'

export const hash = (token) => createHash('sha256').update(token).digest('hex')

export function newToken() {
  return randomBytes(24).toString('base64url')
}

export function newCode() {
  const bytes = randomBytes(6)
  return [...bytes].map((b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')
}

export function cleanCode(raw) {
  return String(raw || '').toUpperCase().replace(/[^A-Z0-9]/g, '')
}

function cleanText(raw, max) {
  const s = String(raw || '').replace(/\s+/g, ' ').trim()
  return s.length >= 1 && s.length <= max ? s : null
}

// Validates the member's own settings coming from the browser.
export function cleanProfile(input = {}) {
  const displayName = cleanText(input.displayName, 30)
  if (!displayName) throw new StoreError('invalid', 'displayName')
  const faiths = Array.isArray(input.faiths) ? input.faiths.filter((f) => FAITHS.includes(f)) : []
  const share = Object.fromEntries(SHARE_KEYS.map((k) => [k, input.share?.[k] === true]))
  const locale = LOCALES.includes(input.locale) ? input.locale : 'en'
  return { displayName, faiths: faiths.includes('none') ? ['none'] : faiths, share, locale }
}

export function cleanTeamName(raw) {
  const name = cleanText(raw, 40)
  if (!name) throw new StoreError('invalid', 'teamName')
  return name
}

export async function authenticate(store, body = {}) {
  const { memberId, token } = body
  if (typeof memberId !== 'string' || typeof token !== 'string') throw new StoreError('unauthorized')
  const member = await store.getMember(memberId)
  if (!member) throw new StoreError('unauthorized')
  const a = Buffer.from(hash(token))
  const b = Buffer.from(member.tokenHash || '')
  if (a.length !== b.length || !timingSafeEqual(a, b)) throw new StoreError('unauthorized')
  return member
}

// Today's date in Taipei as a plain Y-M-D date, matching what the app shows.
// FT_TODAY=YYYY-MM-DD pins the date for local testing and demo recordings.
export function taipeiToday() {
  const now = process.env.FT_TODAY ? new Date(`${process.env.FT_TODAY}T12:00:00+08:00`) : new Date()
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Taipei' }).format(now).split('-').map(Number)
  return new Date(y, m - 1, d)
}

export { sharedView } from '../../src/lib/sharedView.js'

export function teamPrayerTimes(today = taipeiToday()) {
  return prayerTimes(today).map((p) => ({ key: p.key, time: p.time.toISOString() }))
}

// Wraps a handler: POST only, JSON errors with stable codes.
export function handler(fn) {
  return async (req, res) => {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return res.status(405).json({ error: 'method_not_allowed' })
    }
    try {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {}
      const store = getStore()
      const out = await fn(body, store)
      res.setHeader('Cache-Control', 'no-store')
      return res.status(200).json(out)
    } catch (e) {
      const code = e instanceof StoreError ? e.code : 'server'
      const status = { invalid: 400, unauthorized: 401, not_found: 404, not_configured: 503 }[code] || 500
      if (status >= 500) console.error(e)
      return res.status(status).json({ error: code, field: code === 'invalid' ? e.message : undefined })
    }
  }
}

export { StoreError }
