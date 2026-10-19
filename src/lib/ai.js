// Front end never talks to the AI provider directly: it calls our own /api/ai,
// which keeps the API key on the server.
export async function askAI({ task, locale, input }) {
  const res = await fetch('/api/ai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ task, locale, input }),
  })
  if (!res.ok) throw new Error(`AI request failed: ${res.status}`)
  return res.json() // { reply, mock }
}
