// Vercel serverless function: GET /api/calendar?f=islam,folk&lang=zh-TW
// Returns an iCalendar (.ics) feed that Google, Apple and Outlook calendars can subscribe to.
// The link carries only the chosen faiths and language; nothing personal is stored.

import { createRequire } from 'node:module'
import { eventsBetween, groupForList, FAITHS } from '../src/lib/calendar.js'

const require = createRequire(import.meta.url)
const MESSAGES = {
  'zh-TW': require('../src/i18n/locales/zh-TW.json'),
  vi: require('../src/i18n/locales/vi.json'),
  id: require('../src/i18n/locales/id.json'),
  th: require('../src/i18n/locales/th.json'),
  en: require('../src/i18n/locales/en.json'),
}

function escapeText(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n')
}

// Lines longer than 75 octets must be folded (RFC 5545).
function fold(line) {
  const bytes = Buffer.from(line, 'utf8')
  if (bytes.length <= 75) return line
  const parts = []
  let current = ''
  for (const ch of line) {
    if (Buffer.byteLength(current + ch, 'utf8') > (parts.length ? 74 : 75)) {
      parts.push(current)
      current = ch
    } else current += ch
  }
  parts.push(current)
  return parts.join('\r\n ')
}

const compact = (date) => date.replaceAll('-', '')

function nextDay(date) {
  const [y, m, d] = date.split('-').map(Number)
  const x = new Date(Date.UTC(y, m - 1, d + 1))
  return x.toISOString().slice(0, 10)
}

export function buildIcs(faiths, lang) {
  const msg = MESSAGES[lang] || MESSAGES.en
  const start = new Date()
  start.setDate(start.getDate() - 30)
  const events = groupForList(eventsBetween(start, 430, faiths))
  const stamp = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
  const faithNames = faiths.map((f) => msg.faiths[f]).join(' / ')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Faith Together//Faith calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${escapeText(`${msg.subscribe.calName} · ${faithNames}`)}`,
    'X-WR-TIMEZONE:Asia/Taipei',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
  ]

  for (const e of events) {
    const title = msg.events[e.key]
    const notes = [`${msg.faiths[e.faith]} · ${msg.kinds[e.kind]}`]
    if (e.faith === 'islam') notes.push(msg.home.islamicNote)
    lines.push(
      'BEGIN:VEVENT',
      `UID:${e.date}-${e.key}-${e.faith}@faith-together`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${compact(e.date)}`,
      `DTEND;VALUE=DATE:${compact(nextDay(e.until || e.date))}`,
      `SUMMARY:${escapeText(title)}`,
      `DESCRIPTION:${escapeText(notes.join('\n'))}`,
      'TRANSP:TRANSPARENT',
      'END:VEVENT',
    )
  }
  lines.push('END:VCALENDAR')
  return lines.map(fold).join('\r\n') + '\r\n'
}

export default function handler(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const faiths = (url.searchParams.get('f') || '')
    .split(',')
    .filter((f) => FAITHS.includes(f) && f !== 'none')
  const lang = url.searchParams.get('lang') || 'en'

  if (!faiths.length) {
    res.statusCode = 400
    return res.end('Missing faiths')
  }

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8')
  res.setHeader('Content-Disposition', 'inline; filename="faith-calendar.ics"')
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=43200')
  res.end(buildIcs(faiths, lang))
}
