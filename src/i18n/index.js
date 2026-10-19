import { createI18n } from 'vue-i18n'
import zhTW from './locales/zh-TW.json'
import vi from './locales/vi.json'
import id from './locales/id.json'
import th from './locales/th.json'
import en from './locales/en.json'

// Order shown on the language screen. Each name is written in its own language.
export const LANGUAGES = [
  { code: 'vi', native: 'Tiếng Việt', speech: 'vi-VN' },
  { code: 'id', native: 'Bahasa Indonesia', speech: 'id-ID' },
  { code: 'th', native: 'ภาษาไทย', speech: 'th-TH' },
  { code: 'en', native: 'English', speech: 'en-US' },
  { code: 'zh-TW', native: '繁體中文', speech: 'zh-TW' },
]

const STORAGE_KEY = 'ft.locale'

export function savedLocale() {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveLocale(code) {
  try {
    localStorage.setItem(STORAGE_KEY, code)
  } catch {
    /* storage unavailable: the choice lasts for this visit only */
  }
}

// Guess from the phone's system language, e.g. "vi-VN" -> "vi", "zh-Hant-TW" -> "zh-TW".
export function detectLocale() {
  const langs = navigator.languages?.length ? navigator.languages : [navigator.language || 'en']
  for (const raw of langs) {
    const l = raw.toLowerCase()
    if (l.startsWith('zh')) return 'zh-TW'
    const match = LANGUAGES.find((x) => l.startsWith(x.code))
    if (match) return match.code
  }
  return 'en'
}

export const i18n = createI18n({
  legacy: false,
  locale: savedLocale() || detectLocale(),
  fallbackLocale: 'en',
  messages: { 'zh-TW': zhTW, vi, id, th, en },
})

export function setLocale(code) {
  i18n.global.locale.value = code
  document.documentElement.lang = code
  saveLocale(code)
}
