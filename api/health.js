// GET /api/health          -> which services are configured (never shows keys)
// GET /api/health?check=ai -> also makes one tiny AI call and reports the result
import { aiEnabled, aiModelName, generateJson } from './_lib/ai.js'

export default async function handler(req, res) {
  const url = new URL(req.url, 'http://localhost')
  const provider = process.env.AI_PROVIDER || null
  const out = {
    ai: {
      provider,
      keySet:
        provider === 'gemini' ? !!process.env.GEMINI_API_KEY : provider === 'anthropic' ? !!process.env.ANTHROPIC_API_KEY : false,
      geminiKeySet: !!process.env.GEMINI_API_KEY,
      model: aiModelName(),
      enabled: aiEnabled(),
    },
    database: {
      appIdSet: !!(process.env.PARSE_APP_ID || process.env.VITE_PARSE_APP_ID),
      masterKeySet: !!process.env.PARSE_MASTER_KEY,
    },
  }

  if (url.searchParams.get('check') === 'ai' && aiEnabled()) {
    try {
      const r = await generateJson({
        system: 'Reply with JSON only.',
        prompt: 'Return {"ok": true}.',
        schema: { type: 'object', properties: { ok: { type: 'boolean' } }, required: ['ok'] },
        maxTokens: 50,
      })
      out.ai.test = r?.ok === true ? 'ok' : 'unexpected reply'
    } catch (e) {
      out.ai.test = String(e.message || e).slice(0, 300)
    }
  }

  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(out, null, 2))
}
