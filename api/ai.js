// Vercel serverless function: POST /api/ai
// While no AI key is configured it returns sample replies, so the UI can be
// built and demoed first. Real providers get wired in here later; switching
// provider only means changing AI_PROVIDER + its key in Vercel settings.

const MOCK_REPLIES = {
  advice: '下週起有同事進入齋戒月，白天不飲食。午餐會議可以改到上午，或改成不供餐的形式。',
  calm: '辛苦了。先慢慢吸一口氣，再慢慢吐出來。想跟我說說今天發生了什麼事嗎？',
  explain: '這是一則範例說明。接上 AI 之後，這裡會用使用者的語言解釋節日的由來和意義。',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { task = 'advice' } = req.body || {}
  const provider = process.env.AI_PROVIDER

  if (!provider) {
    return res.status(200).json({ reply: MOCK_REPLIES[task] || MOCK_REPLIES.advice, mock: true })
  }

  return res.status(501).json({ error: `AI provider "${provider}" not wired up yet` })
}
