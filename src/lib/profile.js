// The person's own settings, kept on the device. When they belong to a team,
// changes are also sent to the server (see lib/team.js).
import { reactive, watch } from 'vue'

const KEY = 'ft.profile'

const DEFAULTS = {
  displayName: '',
  faiths: [],
  diet: { avoid: [], when: 'always', note: '' },
  // Nothing is shared until the person turns it on.
  share: { faith: false, fasting: false, holidays: false, prayer: false, diet: false },
  onboarded: false,
  team: null, // { name, code }
  member: null, // { id, token, role }
  demo: false, // viewing the fictional demo team
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return structuredClone(DEFAULTS)
    const saved = JSON.parse(raw)
    return {
      ...structuredClone(DEFAULTS),
      ...saved,
      share: { ...DEFAULTS.share, ...saved.share },
      diet: { ...DEFAULTS.diet, ...saved.diet },
    }
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
