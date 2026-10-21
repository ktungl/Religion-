// Tailwind needs full class names written out, so each faith's classes are listed here.
// Color is never the only signal: every colored item also shows the faith's name.
const STYLES = {
  islam: {
    solid: 'bg-islam text-white',
    soft: 'bg-islam-soft text-islam-ink',
    border: 'border-islam',
    bar: 'bg-islam',
    text: 'text-islam-ink',
  },
  christian: {
    solid: 'bg-christian text-white',
    soft: 'bg-christian-soft text-christian-ink',
    border: 'border-christian',
    bar: 'bg-christian',
    text: 'text-christian-ink',
  },
  buddhism: {
    solid: 'bg-buddhism text-white',
    soft: 'bg-buddhism-soft text-buddhism-ink',
    border: 'border-buddhism',
    bar: 'bg-buddhism',
    text: 'text-buddhism-ink',
  },
  folk: {
    solid: 'bg-folk text-white',
    soft: 'bg-folk-soft text-folk-ink',
    border: 'border-folk',
    bar: 'bg-folk',
    text: 'text-folk-ink',
  },
  none: {
    solid: 'bg-none text-white',
    soft: 'bg-none-soft text-none-ink',
    border: 'border-none',
    bar: 'bg-none',
    text: 'text-none-ink',
  },
}

export function faithStyle(faith) {
  if (faith === 'catholic' || faith === 'protestant') return STYLES.christian
  return STYLES[faith] || STYLES.none
}
