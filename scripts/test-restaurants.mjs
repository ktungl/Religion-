import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

// Node requires JSON import attributes; Vite handles the production import.
const source = (await readFile(new URL('../src/lib/restaurants.js', import.meta.url), 'utf8'))
  .replace("'./diet.js'", JSON.stringify(new URL('../src/lib/diet.js', import.meta.url).href))
  .replace("'./taipeiVegetarian.json'", JSON.stringify(new URL('../src/lib/taipeiVegetarian.json', import.meta.url).href) + " with { type: 'json' }")
const { RESTAURANTS, needsOf, fit, recommend } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
assert.equal(new Set(RESTAURANTS.map(r => r.id)).size, RESTAURANTS.length, 'Restaurant IDs must be unique')
const byId = (id) => RESTAURANTS.find(r => r.id === id)
const cases = { halal: 'halal', pork: 'noPork', beef: 'noBeef', meat: 'noMeat', seafood: 'noSeafood', egg: 'noEgg', dairy: 'noDairy', pungent: 'noPungent', alcohol: 'noAlcohol' }
for (const [avoid, need] of Object.entries(cases)) {
  const needs = needsOf({ avoid: [avoid] })
  assert.ok(needs.has(need), `${avoid} must affect matching`)
  assert.ok(recommend('taipei', needs).some(x => x.r.checked && x.fits[need] === 'yes'), `${avoid} must have a checked suitable choice`)
}
assert.equal(needsOf({ anything: true, avoid: [] }, ['islam']).size, 0, 'Explicit no restrictions must take precedence')
assert.equal(recommend('taipei', new Set())[0].r.id, 'G1', 'No restrictions should include a general restaurant first')
assert.equal(fit(byId('G1'), 'noPork'), 'ask', 'General restaurants must not be marked pork-free')
assert.equal(fit(byId('V6'), 'noAlcohol'), 'ask', 'Vegan must not imply alcohol-free')
assert.equal(fit(byId('V6'), 'halal'), 'ask', 'Vegan must not imply halal certification')
assert.equal(fit(byId('TV029'), 'vegan'), 'yes', 'Documented vegan options must be supported')
assert.ok(byId('TV029').phone && !byId('TV029').unverified, 'Upgrade the original record without duplicating it')
const veganNeeds = needsOf({ avoid: ['meat', 'seafood', 'egg', 'dairy'] })
assert.ok(veganNeeds.has('vegan'))
assert.ok(!recommend('taipei', veganNeeds).some(x => x.r.id === 'G1'))
assert.ok(recommend('taipei', veganNeeds, new Set(['vegan'])).some(x => x.r.id === 'G1'), 'Some-day needs may be relaxed with a warning')
for (const x of recommend('taipei', new Set(Object.values(cases)))) {
  assert.ok(!Object.values(x.fits).includes('no'), 'Any hard incompatibility must exclude the restaurant')
}
assert.equal(recommend('other', new Set()).length, 0, 'Never return restaurants from a different city')
for (const locale of ['en', 'zh-TW', 'vi', 'id', 'th']) {
  const messages = JSON.parse(await readFile(new URL(`../src/i18n/locales/${locale}.json`, import.meta.url), 'utf8'))
  for (const need of Object.values(cases)) assert.ok(messages.restaurants.needs[need])
  assert.ok(messages.restaurants.general && messages.restaurants.checkedSource)
}
console.log('Restaurant checks passed: all 9 diet options, no restrictions, combinations, sources, cities, and translations.')
