// Back4App (Parse) connection. Import getParse() where data is needed;
// it stays unconnected until the keys are set in .env.local / Vercel.
import Parse from 'parse/dist/parse.min.js'

const APP_ID = import.meta.env.VITE_PARSE_APP_ID
const JS_KEY = import.meta.env.VITE_PARSE_JS_KEY

let ready = false

export function getParse() {
  if (!APP_ID || !JS_KEY) {
    throw new Error('Back4App keys missing: set VITE_PARSE_APP_ID and VITE_PARSE_JS_KEY')
  }
  if (!ready) {
    Parse.initialize(APP_ID, JS_KEY)
    Parse.serverURL = 'https://parseapi.back4app.com/'
    ready = true
  }
  return Parse
}
