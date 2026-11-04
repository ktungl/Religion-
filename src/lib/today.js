// The current time and date, kept fresh while the app stays open (an installed
// app can sit in the background for days). `now` moves every minute; `today`
// changes only when the date does, so day-based lists don't recompute each minute.
import { ref } from 'vue'
import { ymd } from './calendar.js'

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate())

export const now = ref(new Date())
export const today = ref(startOfDay(now.value))

function tick() {
  const d = new Date()
  now.value = d
  if (ymd(d) !== ymd(today.value)) today.value = startOfDay(d)
}

if (typeof window !== 'undefined') {
  // Timers are paused in the background, so also check when the app comes back.
  setInterval(tick, 60_000)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) tick()
  })
}
