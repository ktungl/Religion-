// GET /api/explain?key=eidFitr&lang=id
// Explains one religious date for coworkers, in the reader's language.
// The AI may only rephrase the reviewed notes in eventFacts.js; it must not add
// religious claims of its own. Without an AI key, the notes are returned as-is.
// Answers are the same for everyone, so they are cached at Vercel's edge.

import { EVENT_FACTS } from './_lib/eventFacts.js'
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
    what: { type: 'string' },
    how: { type: 'string' },
    tips: { type: 'array', items: { type: 'string' } },
  },
  required: ['what', 'how', 'tips'],
}

const SYSTEM = `You help coworkers in a workplace in Taiwan understand each other's religious and cultural days.
Readers include migrant workers from Indonesia, Vietnam, Thailand and the Philippines, and Taiwanese staff and managers. Some read slowly in their own language.

Rules:
- Use only the facts in the notes you are given. Do not add new religious claims, rules, scripture, prayers or quotes.
- Do not judge which practice is correct, and do not tell anyone what their religion requires of them.
- Where the notes say practice varies, keep that.
- Respectful, warm and plain. Short sentences and everyday words.
- Write everything in the requested language. Keep greetings in their original language and add a short translation.`

const cache = new Map()

function prompt(key, facts, language) {
  return `Explain this day for a coworker. Write in ${language}.

Day: ${key}
Notes:
- What it is: ${facts.what}
- How people observe it: ${facts.how}
- Workplace tips:
${facts.tips.map((t) => `  - ${t}`).join('\n')}

Return JSON with:
- "what": 1–2 sentences on what this day is.
- "how": 2–3 sentences on how people observe it.
- "tips": the workplace tips, one short sentence each, at most 4.`
}

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const key = url.searchParams.get('key')
  const lang = LANGUAGES[url.searchParams.get('lang')] ? url.searchParams.get('lang') : 'en'
  const facts = EVENT_FACTS[key]

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  if (!facts) {
    res.statusCode = 404
    return res.end(JSON.stringify({ error: 'not_found' }))
  }

  const sample = { what: facts.what, how: facts.how, tips: facts.tips, source: 'notes', lang: 'en' }
  if (!aiEnabled()) {
    res.setHeader('Cache-Control', 'public, max-age=300')
    return res.end(JSON.stringify(sample))
  }

  const cacheKey = `${key}|${lang}|${aiModelName()}`
  try {
    if (!cache.has(cacheKey)) {
      const out = await generateJson({ system: SYSTEM, prompt: prompt(key, facts, LANGUAGES[lang]), schema: SCHEMA })
      if (typeof out.what !== 'string' || typeof out.how !== 'string' || !Array.isArray(out.tips)) throw new Error('Bad AI output')
      cache.set(cacheKey, { what: out.what, how: out.how, tips: out.tips.slice(0, 4).map(String), source: 'ai', lang })
    }
    // A day at the browser, a week at Vercel's edge: the notes rarely change.
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400')
    return res.end(JSON.stringify(cache.get(cacheKey)))
  } catch (e) {
    // If the AI is down or over quota, still show the reviewed notes.
    console.error(e)
    res.setHeader('Cache-Control', 'no-store')
    return res.end(JSON.stringify(sample))
  }
}
