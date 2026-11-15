import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { reactive, ref } from 'vue'

// Exercise the real sync module with browser events and network responses,
// without loading browser-only profile/i18n initialization in Node.
globalThis.window = new EventTarget()
globalThis.document = new EventTarget()
document.hidden = false
const profile = reactive({ member: { id: 'one', token: 'token' }, displayName: 'Test', faiths: ['islam'], share: { faith: true }, diet: {} })
globalThis.__syncTest = { profile, i18n: { global: { locale: ref('en') } } }
const source = (await readFile(new URL('../src/lib/team.js', import.meta.url), 'utf8'))
  .replace("from 'vue'", `from '${import.meta.resolve('vue')}'`)
  .replace("import { profile } from './profile'", 'const { profile } = globalThis.__syncTest')
  .replace("import { i18n } from '../i18n'", 'const { i18n } = globalThis.__syncTest')
const { startSync, syncProfile, syncState } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
const requests = []
let respond
globalThis.fetch = (_url, options) => {
  requests.push(JSON.parse(options.body))
  return new Promise(resolve => { respond = resolve })
}

try {
  startSync()
  assert.equal(syncState.value, 'pending', 'Launch must queue persisted settings')
  const first = syncProfile()
  assert.equal(syncState.value, 'syncing')
  profile.share.faith = false
  await syncProfile()
  assert.equal(requests.length, 1, 'Updates must not run concurrently')
  respond({ ok: true })
  await first
  assert.equal(syncState.value, 'pending', 'Old success must not mark newer settings as synced')
  const second = syncProfile()
  assert.equal(requests[1].profile.share.faith, false)
  respond({ ok: false })
  await second
  assert.equal(syncState.value, 'error', 'Failed saves must be visible')
  window.dispatchEvent(new Event('online'))
  assert.equal(requests.length, 3, 'Reconnect must retry without another edit')
  respond({ ok: true })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(syncState.value, 'synced')

  document.dispatchEvent(new Event('visibilitychange'))
  assert.equal(requests.length, 4, 'Returning to the app must retry persisted settings')
  profile.member = null
  respond({ ok: true })
  await new Promise(resolve => setImmediate(resolve))
  assert.equal(syncState.value, 'idle', 'Old responses must not affect a departed member')
  console.log('Sync checks passed: launch, serialization, failure, reconnect, resume, stale response.')
} finally {
  profile.member = null
}
