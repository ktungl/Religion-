// Food needs. Vegetarian names differ by country (Taiwan's 五辛素 has no common
// equivalent elsewhere), so people tick what they don't eat, and the app derives
// the Taiwanese term to show when ordering food in Taiwan.

export const DIET_ITEMS = ['halal', 'pork', 'beef', 'meat', 'seafood', 'egg', 'dairy', 'pungent', 'alcohol']

// Ticking one item also covers these.
const IMPLIES = {
  halal: ['pork', 'alcohol'],
  meat: ['pork', 'beef'],
}

export const EMPTY_DIET = { avoid: [], when: 'always', note: '' }

export function impliedBy(avoid) {
  const out = new Set()
  for (const a of avoid) for (const x of IMPLIES[a] || []) out.add(x)
  return out
}

// Everything the person avoids, including what their ticks imply.
export function effectiveAvoid(avoid = []) {
  return [...new Set([...avoid, ...impliedBy(avoid)])].filter((x) => DIET_ITEMS.includes(x))
}

export function hasDiet(diet) {
  return !!(diet && (diet.avoid?.length || diet.note?.trim()))
}

// Taiwanese terms, following the categories used on food labels in Taiwan
// (全素／純素、蛋素、奶素、蛋奶素、植物五辛素). Returns null when no term fits.
export function taiwanLabel(avoid = []) {
  const a = new Set(effectiveAvoid(avoid))
  const vegetarian = a.has('meat') && a.has('seafood')
  if (!vegetarian) return a.has('halal') ? '清真' : null
  const noEgg = a.has('egg')
  const noDairy = a.has('dairy')
  if (a.has('pungent')) {
    if (noEgg && noDairy) return '全素'
    if (noEgg) return '奶素'
    if (noDairy) return '蛋素'
    return '蛋奶素'
  }
  if (noEgg && noDairy) return '植物五辛素'
  return '五辛素'
}

export function cleanDiet(input) {
  const avoid = Array.isArray(input?.avoid) ? [...new Set(input.avoid.filter((x) => DIET_ITEMS.includes(x)))] : []
  const when = input?.when === 'someDays' ? 'someDays' : 'always'
  const note = String(input?.note || '').replace(/\s+/g, ' ').trim().slice(0, 60)
  return { avoid, when, note }
}
