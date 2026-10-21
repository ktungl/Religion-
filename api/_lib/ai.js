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

function parseJson(text) {
  const cleaned = String(text || '').replace(/^```(?:json)?\s*|\s*```$/g, '').trim()
  return JSON.parse(cleaned)
}

// Ask for a JSON object. `schema` is a JSON Schema describing it.
export async function generateJson({ system, prompt, schema, maxTokens = 900 }) {
  const provider = process.env.AI_PROVIDER
  const model = aiModelName()

  if (provider === 'gemini') {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
          // Newer Gemini models "think" first and that counts toward this limit,
          // so leave plenty of room beyond the answer itself.
          maxOutputTokens: maxTokens + 4000,
          responseMimeType: 'application/json',
          responseSchema: schema,
        },
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) throw new Error(`Gemini ${res.status}: ${data.error?.message || 'error'}`)
    const candidate = data.candidates?.[0]
    const text = (candidate?.content?.parts || [])
      .filter((p) => !p.thought)
      .map((p) => p.text || '')
      .join('')
    if (!text.trim()) {
      const why = candidate?.finishReason || data.promptFeedback?.blockReason || 'unknown'
      throw new Error(`Gemini returned no text (reason: ${why})`)
    }
    return parseJson(text)
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
