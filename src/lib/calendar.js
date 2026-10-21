// Faith calendar engine: turns a list of faiths into dated events.
// All date rules live here so they can be reviewed in one place.
//
// Event shape: { date: 'YYYY-MM-DD', faith, key, kind }
//   key  -> i18n label under events.*
//   kind -> 'fast' | 'vegetarian' | 'holiday'
//
// Sources of truth:
//   - Chinese lunar dates: lunar-javascript
//   - Islamic dates: the browser's Umm al-Qura calendar (Intl). Real dates depend on
//     moon sighting and can differ by a day; the UI says so.
//   - Easter: Anonymous Gregorian computus.

import { Solar, Lunar } from 'lunar-javascript'
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan'

export const FAITHS = ['islam', 'catholic', 'protestant', 'buddhism', 'folk', 'none']

// Taipei by default; the place setting can come later.
export const DEFAULT_PLACE = { name: 'Taipei', lat: 25.033, lng: 121.5654, tz: 'Asia/Taipei' }

export function ymd(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${m}-${day}`
}

function addDays(d, n) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x
}

// ---------- Chinese lunar calendar (Buddhism, Taoism / folk religion) ----------

function lunarParts(d) {
  const l = Solar.fromYmd(d.getFullYear(), d.getMonth() + 1, d.getDate()).getLunar()
  // getMonth() is negative for a leap month; leap months carry no festivals here.
  return { month: l.getMonth(), day: l.getDay(), lunar: l }
}

const FOLK_LUNAR = {
  '1-1': 'lunarNewYear',
  '1-15': 'lantern',
  '3-23': 'mazu',
  '5-5': 'dragonBoat',
  '7-15': 'ghostFestival',
  '8-15': 'midAutumn',
}

const BUDDHIST_LUNAR = {
  '4-8': 'buddhaBirthday',
  '7-15': 'ullambana',
}

function lunarEvents(d, faiths) {
  const { month, day, lunar } = lunarParts(d)
  const date = ymd(d)
  const out = []
  const wantsFolk = faiths.includes('folk')
  const wantsBuddhism = faiths.includes('buddhism')
  if (!wantsFolk && !wantsBuddhism) return out

  // 初一、十五: common vegetarian days for both traditions; listed once.
  if (month > 0 && (day === 1 || day === 15)) {
    out.push({
      date,
      faith: wantsBuddhism ? 'buddhism' : 'folk',
      key: day === 1 ? 'lunarFirst' : 'lunarFifteenth',
      kind: 'vegetarian',
    })
  }

  if (wantsFolk) {
    const key = month > 0 ? FOLK_LUNAR[`${month}-${day}`] : null
    if (key) out.push({ date, faith: 'folk', key, kind: 'holiday' })
    // 除夕: the day before lunar new year.
    const tomorrow = lunarParts(addDays(d, 1))
    if (tomorrow.month === 1 && tomorrow.day === 1) {
      out.push({ date, faith: 'folk', key: 'lunarNewYearEve', kind: 'holiday' })
    }
    if (lunar.getJieQi() === '清明') {
      out.push({ date, faith: 'folk', key: 'qingming', kind: 'holiday' })
    }
  }

  if (wantsBuddhism) {
    const key = month > 0 ? BUDDHIST_LUNAR[`${month}-${day}`] : null
    if (key) out.push({ date, faith: 'buddhism', key, kind: 'holiday' })
  }
  return out
}

// ---------- Islamic calendar ----------

const hijriFormat = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
  day: 'numeric',
  month: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})

export function hijri(d) {
  const utc = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), 12))
  const parts = Object.fromEntries(hijriFormat.formatToParts(utc).map((p) => [p.type, p.value]))
  return { month: Number(parts.month), day: Number(parts.day) }
}

const ISLAMIC_HOLIDAYS = {
  '1-1': 'islamicNewYear',
  '3-12': 'mawlid',
  '9-1': 'ramadanStart',
  '10-1': 'eidFitr',
  '12-10': 'eidAdha',
}

function islamicEvents(d) {
  const { month, day } = hijri(d)
  const date = ymd(d)
  const out = []
  const key = ISLAMIC_HOLIDAYS[`${month}-${day}`]
  if (key) out.push({ date, faith: 'islam', key, kind: key === 'ramadanStart' ? 'fast' : 'holiday' })
  else if (month === 9) out.push({ date, faith: 'islam', key: 'ramadan', kind: 'fast' })
  return out
}

export function isRamadan(d = new Date()) {
  return hijri(d).month === 9
}

// ---------- Christian calendar ----------

export function easterSunday(year) {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31)
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month - 1, day)
}

function christianEventsForYear(year, faiths) {
  const catholic = faiths.includes('catholic')
  const protestant = faiths.includes('protestant')
  if (!catholic && !protestant) return []
  const faith = catholic ? 'catholic' : 'protestant'
  const easter = easterSunday(year)
  const out = [
    { date: ymd(addDays(easter, -2)), faith, key: 'goodFriday', kind: 'holiday' },
    { date: ymd(easter), faith, key: 'easter', kind: 'holiday' },
    { date: `${year}-12-24`, faith, key: 'christmasEve', kind: 'holiday' },
    { date: `${year}-12-25`, faith, key: 'christmas', kind: 'holiday' },
  ]
  if (catholic) {
    out.push({ date: ymd(addDays(easter, -46)), faith: 'catholic', key: 'ashWednesday', kind: 'fast' })
    out.push({ date: `${year}-11-01`, faith: 'catholic', key: 'allSaints', kind: 'holiday' })
  }
  return out
}

// ---------- Public API ----------

export function eventsBetween(start, days, faiths) {
  if (!faiths?.length || faiths.includes('none')) return []
  const out = []
  const from = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const end = addDays(from, days)
  const fromKey = ymd(from)
  const endKey = ymd(end)

  for (let d = new Date(from); d < end; d = addDays(d, 1)) {
    out.push(...lunarEvents(d, faiths))
    if (faiths.includes('islam')) out.push(...islamicEvents(d))
  }
  for (let y = from.getFullYear(); y <= end.getFullYear(); y++) {
    out.push(...christianEventsForYear(y, faiths).filter((e) => e.date >= fromKey && e.date < endKey))
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

// Collapse the daily Ramadan rows into a single row (first day, with an
// "until" date) so the list stays readable.
export function groupForList(events) {
  const ramadanDays = events.filter((e) => e.key === 'ramadan')
  const out = events.filter((e) => e.key !== 'ramadan').map((e) => ({ ...e }))
  if (!ramadanDays.length) return out
  const last = ramadanDays[ramadanDays.length - 1].date
  const start = out.find((e) => e.key === 'ramadanStart')
  if (start) start.until = last
  else out.push({ ...ramadanDays[0], until: last })
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

export function prayerTimes(date = new Date(), place = DEFAULT_PLACE) {
  // Singapore parameters (Fajr 20°, Isha 18°) are close to what Indonesian and
  // Malaysian communities use; mosques in Taiwan may differ by a few minutes.
  const params = CalculationMethod.Singapore()
  const t = new PrayerTimes(new Coordinates(place.lat, place.lng), date, params)
  return [
    { key: 'fajr', time: t.fajr },
    { key: 'dhuhr', time: t.dhuhr },
    { key: 'asr', time: t.asr },
    { key: 'maghrib', time: t.maghrib },
    { key: 'isha', time: t.isha },
  ]
}
