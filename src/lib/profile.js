// The person's own settings. Kept on the device for now; syncing the shared
// parts to Back4App comes with the team feature.
import { reactive, watch } from 'vue'

const KEY = 'ft.profile'

const DEFAULTS = {
  faiths: [],
  // Nothing is shared until the person turns it on.
  share: { faith: false, fasting: false, holidays: false, prayer: false },
  onboarded: false,
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULTS)
    const saved = JSON.parse(raw)
    return { ...structuredClone(DEFAULTS), ...saved, share: { ...DEFAULTS.share, ...saved.share } }
  } catch {
    return structuredClone(DEFAULTS)
  }
}

export const profile = reactive(load())

watch(
  profile,
  (value) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(value))
    } catch {
      /* storage unavailable: settings last for this visit only */
    }
  },
  { deep: true },
)

export function resetProfile() {
  Object.assign(profile, structuredClone(DEFAULTS))
}
