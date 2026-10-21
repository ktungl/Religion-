// Runs the built app and the /api functions together on one local port,
// like Vercel does. Usage:
//   npm run build && npm run serve:local          (uses Back4App keys from .env.local)
//   FT_MEMORY_STORE=1 npm run serve:local         (keeps team data in memory)
import http from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const port = Number(process.env.PORT || 4174)

const envFile = path.join(root, '.env.local')
if (existsSync(envFile)) {
  for (const line of readFileSync(envFile, 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2]
  }
}

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
}

function withHelpers(res) {
  res.status = (code) => ((res.statusCode = code), res)
  res.json = (data) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.end(JSON.stringify(data))
  }
  return res
}

async function readBody(req) {
  const chunks = []
  for await (const c of req) chunks.push(c)
  const raw = Buffer.concat(chunks).toString('utf8')
  if (!raw) return {}
  try {
    return JSON.parse(raw)
  } catch {
    return raw
  }
}

http
  .createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    try {
      if (url.pathname.startsWith('/api/')) {
        const file = path.join(root, `${url.pathname}.js`)
        if (!file.startsWith(path.join(root, 'api')) || url.pathname.includes('/_') || !existsSync(file)) {
          res.statusCode = 404
          return res.end('Not found')
        }
        req.body = await readBody(req)
        const mod = await import(pathToFileURL(file).href)
        return await mod.default(req, withHelpers(res))
      }
      let file = path.join(dist, decodeURIComponent(url.pathname))
      if (!file.startsWith(dist) || !(await stat(file).catch(() => null))?.isFile()) file = path.join(dist, 'index.html')
      res.setHeader('Content-Type', TYPES[path.extname(file)] || 'application/octet-stream')
      res.end(await readFile(file))
    } catch (e) {
      console.error(e)
      res.statusCode = 500
      res.end('Server error')
    }
  })
  .listen(port, () => console.log(`App + API on http://localhost:${port}`))
