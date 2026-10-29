// Data access for teams and members.
// Production: Back4App (Parse REST API) with the master key, which stays on the server.
// Both classes are locked so browsers cannot read them directly; every read goes
// through our API, which only returns what each member chose to share.
// Local testing: set FT_MEMORY_STORE=1 to keep data in memory instead.

const PARSE_URL = 'https://parseapi.back4app.com'

const LOCKED = {
  find: {},
  get: {},
  count: {},
  create: {},
  update: {},
  delete: {},
  addField: {},
  protectedFields: {},
}

const SCHEMAS = {
  Team: { name: { type: 'String' }, code: { type: 'String' } },
  Member: {
    team: { type: 'Pointer', targetClass: 'Team' },
    displayName: { type: 'String' },
    role: { type: 'String' },
    tokenHash: { type: 'String' },
    locale: { type: 'String' },
    faiths: { type: 'Array' },
    share: { type: 'Object' },
    diet: { type: 'Object' },
  },
}

export class StoreError extends Error {
  constructor(code, message) {
    super(message || code)
    this.code = code
  }
}

// ---------- Parse (Back4App) ----------

function parseStore() {
  const appId = process.env.PARSE_APP_ID || process.env.VITE_PARSE_APP_ID
  const masterKey = process.env.PARSE_MASTER_KEY
  if (!appId || !masterKey) throw new StoreError('not_configured', 'PARSE_APP_ID / PARSE_MASTER_KEY missing')

  async function call(method, path, body) {
    const res = await fetch(PARSE_URL + path, {
      method,
      headers: {
        'X-Parse-Application-Id': appId,
        'X-Parse-Master-Key': masterKey,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const err = new StoreError('server', data.error || `Parse ${res.status}`)
      err.status = res.status
      throw err
    }
    return data
  }

  let schemaReady
  function ensureSchema() {
    schemaReady ||= (async () => {
      for (const [className, fields] of Object.entries(SCHEMAS)) {
        try {
          await call('GET', `/schemas/${className}`)
          await call('PUT', `/schemas/${className}`, { className, classLevelPermissions: LOCKED })
        } catch (e) {
          if (e.status !== 400 && e.status !== 404) throw e
          await call('POST', `/schemas/${className}`, { className, fields, classLevelPermissions: LOCKED })
        }
      }
    })().catch((e) => {
      schemaReady = null
      throw e
    })
    return schemaReady
  }

  const where = (w) => `where=${encodeURIComponent(JSON.stringify(w))}`
  const teamPointer = (id) => ({ __type: 'Pointer', className: 'Team', objectId: id })
  const toMember = (o) => ({ ...o, id: o.objectId, teamId: o.team?.objectId })
  const toTeam = (o) => ({ ...o, id: o.objectId })

  return {
    async createTeam({ name, code }) {
      await ensureSchema()
      const r = await call('POST', '/classes/Team', { name, code })
      return { id: r.objectId, name, code }
    },
    async findTeamByCode(code) {
      await ensureSchema()
      const r = await call('GET', `/classes/Team?${where({ code })}&limit=1`)
      return r.results[0] ? toTeam(r.results[0]) : null
    },
    async getTeam(id) {
      const r = await call('GET', `/classes/Team/${id}`).catch((e) => {
        if (e.status === 404) return null
        throw e
      })
      return r ? toTeam(r) : null
    },
    async createMember(m) {
      await ensureSchema()
      const { teamId, ...rest } = m
      const r = await call('POST', '/classes/Member', { ...rest, team: teamPointer(teamId) })
      return { ...m, id: r.objectId }
    },
    async getMember(id) {
      const r = await call('GET', `/classes/Member/${id}`).catch((e) => {
        if (e.status === 404) return null
        throw e
      })
      return r ? toMember(r) : null
    },
    async updateMember(id, patch) {
      await call('PUT', `/classes/Member/${id}`, patch)
    },
    async deleteMember(id) {
      await call('DELETE', `/classes/Member/${id}`)
    },
    async listMembers(teamId) {
      const r = await call('GET', `/classes/Member?${where({ team: teamPointer(teamId) })}&limit=200&order=createdAt`)
      return r.results.map(toMember)
    },
  }
}

// ---------- In-memory (local testing only) ----------

const memory = { teams: new Map(), members: new Map(), seq: 0 }

function memoryStore() {
  const id = () => `m${++memory.seq}`
  return {
    async createTeam(t) {
      const team = { ...t, id: id() }
      memory.teams.set(team.id, team)
      return team
    },
    async findTeamByCode(code) {
      return [...memory.teams.values()].find((t) => t.code === code) || null
    },
    async getTeam(teamId) {
      return memory.teams.get(teamId) || null
    },
    async createMember(m) {
      const member = { ...m, id: id(), createdAt: new Date().toISOString() }
      memory.members.set(member.id, member)
      return member
    },
    async getMember(memberId) {
      return memory.members.get(memberId) || null
    },
    async updateMember(memberId, patch) {
      Object.assign(memory.members.get(memberId), patch)
    },
    async deleteMember(memberId) {
      memory.members.delete(memberId)
    },
    async listMembers(teamId) {
      return [...memory.members.values()].filter((m) => m.teamId === teamId)
    },
  }
}

export function getStore() {
  return process.env.FT_MEMORY_STORE === '1' ? memoryStore() : parseStore()
}
