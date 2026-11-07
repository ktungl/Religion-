// GET /api/greet?key=eidFitr&to=id&from=zh-TW
// Writes three short greetings a coworker can send for someone's day, in the
// recipient's language, each with a translation in the sender's language.
// No names or personal data are sent to the AI: the greeting starts with a
// {name} placeholder that the browser fills in. That also means the answer is
// the same for everyone, so it is cached at Vercel's edge.

import { GREETINGS } from './_lib/greetings.js'
import { aiEnabled, aiModelName, generateJson } from './_lib/ai.js'

const LANGUAGES = {
  'zh-TW': 'Traditional Chinese as used in Taiwan',
  vi: 'Vietnamese',
  id: 'Indonesian',
  th: 'Thai',
  en: 'English',
}

const SCHEMA = {
  type: 'object',
  properties: {
    options: {
      type: 'array',
      items: {
        type: 'object',
        properties: { message: { type: 'string' }, translation: { type: 'string' } },
        required: ['message', 'translation'],
      },
    },
  },
  required: ['options'],
}

const SYSTEM = `You help coworkers in a workplace in Taiwan send each other short, kind greetings for their religious and cultural days.
Senders and recipients include migrant workers from Indonesia, Vietnam, Thailand and the Philippines, and Taiwanese staff and managers.

Rules:
- A greeting is 1–2 short sentences, like a message in a chat app. Warm, sincere, plain words.
- Follow the hint you are given. You may use the common greeting phrases listed, in their usual form.
- No scripture, prayers, quotes, blessings in God's name, or claims about what the religion teaches.
- Do not assume how the person observes the day, and do not mention fasting or food unless the hint does.
- Start every message with the exact placeholder {name} (for example "{name}, ..."), and do not invent any other names.
- No emoji except at most one simple one at the end.`

const cache = new Map()

function prompt(key, g, to, from) {
  const same = to === from
  return `Day: ${key}
Hint: ${g.hint}
Common greeting phrases: ${g.phrases.join(' | ')}

Write 3 different greetings in ${LANGUAGES[to]}:
1. very short and friendly,
2. warm and a little more personal,
3. suitable for a manager to send to a team member.
${same ? 'For "translation", repeat the message unchanged.' : `For "translation", translate each message into ${LANGUAGES[from]} so the sender understands what they are sending; keep the {name} placeholder.`}
Return JSON: {"options":[{"message":"...","translation":"..."}, ...]}`
}

// Shown when the AI is off or fails: the first common phrase, plainly.
function fallback(g) {
  const phrase = g.phrases.find((p) => !p.includes(':')) || g.phrases[0].split(': ')[1]
  return { options: [{ message: `{name}, ${phrase}!`, translation: `{name}, ${phrase}!` }], source: 'notes' }
}

const clean = (s) => String(s || '').trim().slice(0, 300)

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const key = url.searchParams.get('key')
  const pick = (p) => (Object.hasOwn(LANGUAGES, url.searchParams.get(p) || '') ? url.searchParams.get(p) : 'en')
  const to = pick('to')
  const from = pick('from')
  const g = Object.hasOwn(GREETINGS, key || '') ? GREETINGS[key] : null

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (!g) {
    res.statusCode = 404
    return res.end(JSON.stringify({ error: 'not_found' }))
  }
  if (!aiEnabled()) {
    res.setHeader('Cache-Control', 'public, max-age=300')
    return res.end(JSON.stringify(fallback(g)))
  }

  const cacheKey = `${key}|${to}|${from}|${aiModelName()}`
  try {
    if (!cache.has(cacheKey)) {
      const out = await generateJson({ system: SYSTEM, prompt: prompt(key, g, to, from), schema: SCHEMA })
      const options = (Array.isArray(out.options) ? out.options : [])
        .map((o) => ({ message: clean(o.message), translation: clean(o.translation) }))
        .filter((o) => o.message.includes('{name}'))
        .slice(0, 3)
      if (!options.length) throw new Error('Bad AI output')
      cache.set(cacheKey, { options, source: 'ai', to, from })
    }
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
    return res.end(JSON.stringify(cache.get(cacheKey)))
  } catch (e) {
    console.error(e)
    res.setHeader('Cache-Control', 'no-store')
    return res.end(JSON.stringify(fallback(g)))
  }
}
