// One small wrapper around the AI providers, so the app can switch provider by
// changing environment variables only:
//   AI_PROVIDER=gemini     GEMINI_API_KEY=...     (GEMINI_MODEL optional)
//   AI_PROVIDER=anthropic  ANTHROPIC_API_KEY=...  (ANTHROPIC_MODEL optional)
// With no provider set, callers fall back to their sample content.

export function aiEnabled() {
  const p = process.env.AI_PROVIDER
  if (p === 'gemini') return !!process.env.GEMINI_API_KEY
  if (p === 'anthropic') return !!process.env.ANTHROPIC_API_KEY
  return false
}

export function aiModelName() {
  if (process.env.AI_PROVIDER === 'gemini') return process.env.GEMINI_MODEL || 'gemini-3.6-flash'
  if (process.env.AI_PROVIDER === 'anthropic') return process.env.ANTHROPIC_MODEL || 'claude-haiku-5-5'
  return null
}

// Lighter models to try when the main one is busy. Unknown ids are skipped.
function geminiFallbacks() {
  return (process.env.GEMINI_FALLBACK_MODELS || 'gemini-3.5-flash-lite,gemini-3.1-flash-lite,gemini-2.5-flash')
    .split(',')
    .map((m) => m.trim())
    .filter(Boolean)
}

let lastModelUsed = null
export function lastModel() {
  return lastModelUsed
}

function parseJson(text) {
  const cleaned = String(text || '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
  return JSON.parse(cleaned)
}

// Ask for a JSON object. `schema` is a JSON Schema describing it.
export async function generateJson({ system, prompt, schema, maxTokens = 900 }) {
  const provider = process.env.AI_PROVIDER
  const model = aiModelName()

  if (provider === 'gemini') {
    async function call(modelId, withThinking) {
      const generationConfig = {
        temperature: 0.3,
        // Thinking counts toward this limit, so leave room beyond the answer.
        maxOutputTokens: maxTokens + 2000,
        responseMimeType: 'application/json',
        responseSchema: schema,
      }
      // Rewording needs little reasoning; low thinking keeps answers fast.
      if (withThinking) generationConfig.thinkingConfig = { thinkingLevel: process.env.GEMINI_THINKING || 'low' }
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: system }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig,
        }),
      })
      return { res, data: await res.json().catch(() => ({})) }
    }

    async function tryModel(modelId) {
      let { res, data } = await call(modelId, true)
      // Models that don't support thinking levels reject the field: retry without it.
      if (res.status === 400 && /thinking/i.test(data.error?.message || '')) ({ res, data } = await call(modelId, false))
      return { res, data }
    }

    // Free-tier models are sometimes busy (503/429). Retry once, then move on to
    // lighter models, so people still get an answer in their language.
    const models = [model, ...geminiFallbacks().filter((m) => m !== model)]
    let lastError = 'no model tried'
    for (const [i, modelId] of models.entries()) {
      let { res, data } = await tryModel(modelId)
      if ((res.status === 503 || res.status === 429) && i === 0) {
        await new Promise((r) => setTimeout(r, 1500))
        ;({ res, data } = await tryModel(modelId))
      }
      if (!res.ok) {
        lastError = `Gemini ${modelId} ${res.status}: ${data.error?.message || 'error'}`
        if ([429, 500, 503, 404].includes(res.status)) continue
        throw new Error(lastError)
      }
      const candidate = data.candidates?.[0]
      const text = (candidate?.content?.parts || [])
        .filter((p) => !p.thought)
        .map((p) => p.text || '')
        .join('')
      if (!text.trim()) {
        lastError = `Gemini ${modelId} returned no text (reason: ${candidate?.finishReason || data.promptFeedback?.blockReason || 'unknown'})`
        continue
      }
      lastModelUsed = modelId
      return parseJson(text)
    }
    throw new Error(lastError)
  }

  if (provider === 'anthropic') {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model,
        max_tokens: maxTokens,
        temperature: 0.3,
        system: `${system}\n\nReply with only a JSON object matching this JSON Schema, no other text:\n${JSON.stringify(schema)}`,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(`Anthropic ${res.status}: ${data.error?.message || 'error'}`)
    return parseJson(data.content?.map((c) => c.text || '').join(''))
  }

  throw new Error('AI provider not configured')
}
