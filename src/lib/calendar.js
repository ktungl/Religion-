// Faith calendar engine: turns a list of faiths into dated events.
// All date rules live here so they can be reviewed in one place.
//
// Event shape: { date: 'YYYY-MM-DD', faith, key, kind }
//   key  -> i18n label under events.*
//   kind -> 'fast' | 'vegetarian' | 'noMeat' | 'holiday' | 'holidayFast'
//   (holidayFast: a holy day that is also a fast day, e.g. Good Friday for Catholics)
//
// Sources of truth:
//   - Chinese lunar dates: lunar-javascript
//   - Islamic dates: the browser's Umm al-Qura calendar (Intl). Real dates depend on
//     moon sighting and can differ by a day; the UI says so.
//   - Easter: Anonymous Gregorian computus.
//   - Thai Buddhist holy days: published Thai dates (THAI_BUDDHIST below).
//
// Some dates depend on where the person comes from. The app language stands in
// for that (opts.locale):
//   - th + Buddhism: Thai (Theravada) holy days instead of the Chinese lunar ones
//   - vi + Buddhism: Buddha's Birthday on the 15th of the 4th lunar month (Phật Đản)

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
// The Vietnamese Buddhist Sangha keeps Phật Đản on the full moon of the 4th month.
const BUDDHIST_LUNAR_VI = {
  '4-15': 'buddhaBirthday',
  '7-15': 'ullambana',
}

// Festivals of the Chinese / Vietnamese calendar that many people keep as
// culture whatever their faith. Shown to folk religion, and also to Buddhists
// and Catholics who use the app in Chinese or Vietnamese (Thai Buddhists and
// Filipino Catholics usually don't keep them). Labelled as a traditional
// festival rather than as folk religion.
const CULTURE_LUNAR = new Set(['lunarNewYear', 'lantern', 'dragonBoat', 'midAutumn'])
const CULTURE_FAITHS = ['buddhism', 'catholic']
const CULTURE_LOCALES = ['zh-TW', 'vi']

// Thai Buddhist holy days (full-moon days of the Thai lunar calendar, which has
// its own leap-month rules, so the dates are listed rather than computed).
// Sources: Thai PBS calendar 2569 (2026); Thai public holiday lists for 2027 and
// 2028. Marked "derived" where no announcement was found yet: counted three
// Thai months (89 days) from the published full-moon day; check before use.
const THAI_BUDDHIST = {
  2026: { makhaBucha: '2026-03-03', visakhaBucha: '2026-05-31', asalhaBucha: '2026-07-29', khaoPhansa: '2026-07-30', okPhansa: '2026-10-26' },
  2027: { makhaBucha: '2027-02-21', visakhaBucha: '2027-05-20', asalhaBucha: '2027-07-18', khaoPhansa: '2027-07-19', okPhansa: '2027-10-15' /* derived */ },
  2028: { makhaBucha: '2028-02-10' /* derived */, visakhaBucha: '2028-05-08', asalhaBucha: '2028-07-06', khaoPhansa: '2028-07-07', okPhansa: '2028-10-03' /* derived */ },
}

function thaiBuddhistEvents(year) {
  return Object.entries(THAI_BUDDHIST[year] || {}).map(([key, date]) => ({ date, faith: 'buddhism', key, kind: 'holiday' }))
}

function lunarEvents(d, faiths, locale) {
  const { month, day, lunar } = lunarParts(d)
  const date = ymd(d)
  const out = []
  const wantsFolk = faiths.includes('folk')
  const wantsBuddhism = faiths.includes('buddhism')
  const thaiBuddhist = wantsBuddhism && locale === 'th'
  const wantsCulture = !wantsFolk && CULTURE_LOCALES.includes(locale) && faiths.some((f) => CULTURE_FAITHS.includes(f))
  if (!wantsFolk && !wantsBuddhism && !wantsCulture) return out

  // 初一、十五: common vegetarian days for Chinese and Vietnamese Buddhists and
  // folk religion; listed once. Not a Thai Buddhist practice.
  if (month > 0 && (day === 1 || day === 15) && (wantsFolk || (wantsBuddhism && !thaiBuddhist))) {
    out.push({
      date,
      faith: wantsBuddhism && !thaiBuddhist ? 'buddhism' : 'folk',
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

  if (wantsCulture) {
    const key = month > 0 ? FOLK_LUNAR[`${month}-${day}`] : null
    if (CULTURE_LUNAR.has(key)) out.push({ date, faith: 'culture', key, kind: 'holiday' })
    const tomorrow = lunarParts(addDays(d, 1))
    if (tomorrow.month === 1 && tomorrow.day === 1) {
      out.push({ date, faith: 'culture', key: 'lunarNewYearEve', kind: 'holiday' })
    }
  }

  if (wantsBuddhism && !thaiBuddhist) {
    const table = locale === 'vi' ? BUDDHIST_LUNAR_VI : BUDDHIST_LUNAR
    const key = month > 0 ? table[`${month}-${day}`] : null
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
    // Catholics fast and do not eat meat on Good Friday; for Protestants it is a holy day only.
    { date: ymd(addDays(easter, -2)), faith, key: 'goodFriday', kind: catholic ? 'holidayFast' : 'holiday' },
    { date: ymd(easter), faith, key: 'easter', kind: 'holiday' },
    { date: `${year}-12-24`, faith, key: 'christmasEve', kind: 'holiday' },
    { date: `${year}-12-25`, faith, key: 'christmas', kind: 'holiday' },
  ]
  if (catholic) {
    out.push({ date: ymd(addDays(easter, -46)), faith: 'catholic', key: 'ashWednesday', kind: 'fast' })
    // Fridays of Lent (from the Friday after Ash Wednesday up to the week
    // before Good Friday): no meat, fish is fine.
    for (let d = addDays(easter, -44); d < addDays(easter, -2); d = addDays(d, 7)) {
      out.push({ date: ymd(d), faith: 'catholic', key: 'lentFriday', kind: 'noMeat' })
    }
    out.push({ date: `${year}-11-01`, faith: 'catholic', key: 'allSaints', kind: 'holiday' })
  }
  return out
}

// ---------- Public API ----------

export function eventsBetween(start, days, faiths, { locale } = {}) {
  if (!faiths?.length || faiths.includes('none')) return []
  const out = []
  const from = new Date(start.getFullYear(), start.getMonth(), start.getDate())
  const end = addDays(from, days)
  const fromKey = ymd(from)
  const endKey = ymd(end)

  for (let d = new Date(from); d < end; d = addDays(d, 1)) {
    out.push(...lunarEvents(d, faiths, locale))
    if (faiths.includes('islam')) out.push(...islamicEvents(d))
  }
  for (let y = from.getFullYear(); y <= end.getFullYear(); y++) {
    out.push(...christianEventsForYear(y, faiths).filter((e) => e.date >= fromKey && e.date < endKey))
    if (faiths.includes('buddhism') && locale === 'th') {
      out.push(...thaiBuddhistEvents(y).filter((e) => e.date >= fromKey && e.date < endKey))
    }
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

// Collapse the daily Ramadan rows into a single row (first day, with an
// "until" date) so the list stays readable.
export function groupForList(events) {
  const out = events.filter((e) => e.key !== 'ramadan').map((e) => ({ ...e }))
  // One row per Ramadan: a long window (the calendar feed) can hold several,
  // so the daily rows are split wherever there is a gap between days.
  const parse = (s) => {
    const [y, m, d] = s.split('-').map(Number)
    return new Date(y, m - 1, d)
  }
  const groups = []
  for (const e of events.filter((x) => x.key === 'ramadan')) {
    const prev = groups.at(-1)?.at(-1)
    if (prev && ymd(addDays(parse(prev.date), 1)) === e.date) groups.at(-1).push(e)
    else groups.push([e])
  }
  for (const days of groups) {
    // The window may stop mid-month, so find the real last day of Ramadan.
    let last = days.at(-1).date
    for (let x = addDays(parse(last), 1); hijri(x).month === 9; x = addDays(x, 1)) last = ymd(x)
    // Day 1 is listed as ramadanStart, the day before the first daily row.
    const start = out.find((e) => e.key === 'ramadanStart' && ymd(addDays(parse(e.date), 1)) === days[0].date)
    if (start) start.until = last
    else out.push({ ...days[0], until: last })
  }
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
