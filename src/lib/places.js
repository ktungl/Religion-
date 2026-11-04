// Places of worship and prayer rooms, picked by the person's city and faiths.
//
// Only places with a street address from an official or directory source are
// listed; anything still unconfirmed stays in the research sheet. Times change,
// so the UI always shows the phone number and asks people to check first.
//
// Place shape:
//   faiths   -> which faith ids see it (see FAITHS in calendar.js)
//   type     -> 'mosque' | 'prayerRoom' | 'church' | 'temple' (label under places.types.*)
//   hours    -> opening hours as printed by the source, if any
//   services -> regular services: { day: 0-6 (Sunday = 0), time, lang, weeks? }
//               weeks limits it to those weeks of the month (1 = first)
//   friday   -> mosque holds Friday prayer at Dhuhr time (no fixed time published)
//   checked  -> when the details were last checked against the sources

export const CITIES = [
  'taipei',
  'newTaipei',
  'keelung',
  'taoyuan',
  'hsinchu',
  'taichung',
  'tainan',
  'kaohsiung',
  'yilan',
  'hualien',
  'pingtung',
  'other',
]

const CHECKED = '2026-11'

export const PLACES = [
  // ---------- Islam ----------
  {
    id: 'taipeiGrandMosque',
    name: '台北清真寺',
    en: 'Taipei Grand Mosque',
    city: 'taipei',
    faiths: ['islam'],
    type: 'mosque',
    address: '台北市大安區新生南路二段62號',
    friday: true,
  },
  {
    id: 'taipeiCulturalMosque',
    name: '台北文化清真寺',
    en: 'Taipei Cultural Mosque',
    city: 'taipei',
    faiths: ['islam'],
    type: 'mosque',
    address: '台北市中正區辛亥路一段25巷3號',
    friday: true,
  },
  {
    id: 'taipeiStationPrayer',
    name: '台北車站穆斯林祈禱室',
    en: 'Taipei Main Station prayer room',
    city: 'taipei',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '台北市中正區北平西路3號 B1',
    phone: '02-2381-5226 #2821',
  },
  {
    id: 'longgangMosque',
    name: '龍岡清真寺',
    en: 'Longgang Mosque',
    city: 'taoyuan',
    faiths: ['islam'],
    type: 'mosque',
    address: '桃園市中壢區龍東路216號',
    phone: '03-456-1234',
    hours: '07:00–20:00',
    friday: true,
  },
  {
    id: 'dayuanMosque',
    name: '大園清真寺',
    en: 'At-Taqwa Mosque',
    city: 'taoyuan',
    faiths: ['islam'],
    type: 'mosque',
    address: '桃園市大園區自立一街8-2號',
    friday: true,
  },
  {
    id: 'taoyuanAirportPrayer',
    name: '桃園機場祈禱室',
    en: 'Taoyuan Airport prayer room',
    city: 'taoyuan',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '桃園市大園區航站南路9號',
    phone: '03-273-5081',
  },
  {
    id: 'hsinchuIslamicCenter',
    name: '新竹伊斯蘭中心祈禱室',
    en: 'Hsinchu Islamic Center',
    city: 'hsinchu',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '新竹市東區竹蓮街74號',
  },
  {
    id: 'taichungMosque',
    name: '台中清真寺',
    en: 'Taichung Mosque',
    city: 'taichung',
    faiths: ['islam'],
    type: 'mosque',
    address: '台中市南屯區大墩南路457號',
    phone: '04-2473-2519',
    hours: '04:30–22:00',
    friday: true,
  },
  {
    id: 'thsrTaichungPrayer',
    name: '高鐵台中站穆斯林祈禱室',
    en: 'THSR Taichung Station prayer room',
    city: 'taichung',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '台中市烏日區站區二路8號 2樓',
  },
  {
    id: 'qingshuiPrayer',
    name: '清水服務區穆斯林祈禱室',
    en: 'Qingshui Service Area prayer room',
    city: 'taichung',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '台中市清水區吳厝二街87號',
  },
  {
    id: 'tcvghPrayer',
    name: '台中榮民總醫院穆斯林祈禱室',
    en: 'Taichung Veterans General Hospital prayer room',
    city: 'taichung',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '台中市西屯區臺灣大道四段1650號',
  },
  {
    id: 'cmuhPrayer',
    name: '中國醫藥大學附設醫院穆斯林祈禱室',
    en: 'China Medical University Hospital prayer room',
    city: 'taichung',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '台中市北區育德路2號',
  },
  {
    id: 'tainanMosque',
    name: '台南清真寺',
    en: 'Tainan Mosque',
    city: 'tainan',
    faiths: ['islam'],
    type: 'mosque',
    address: '台南市東區中華東路三段77巷34弄12號',
    friday: true,
  },
  {
    id: 'kaohsiungMosque',
    name: '高雄清真寺',
    en: 'Kaohsiung Mosque',
    city: 'kaohsiung',
    faiths: ['islam'],
    type: 'mosque',
    address: '高雄市苓雅區建軍路11號',
    phone: '07-749-6812',
    hours: '08:30–20:30',
    friday: true,
  },
  {
    id: 'kaohsiungStationPrayer',
    name: '高雄車站穆斯林祈禱室',
    en: 'Kaohsiung Station prayer room',
    city: 'kaohsiung',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '高雄市三民區建國二路318號 後站3樓',
    phone: '07-237-1507',
  },
  {
    id: 'kaohsiungAirportPrayer',
    name: '高雄國際機場穆斯林祈禱室',
    en: 'Kaohsiung Airport prayer room',
    city: 'kaohsiung',
    faiths: ['islam'],
    type: 'prayerRoom',
    address: '高雄市小港區中山四路2號',
    phone: '07-805-7631',
  },

  // ---------- Catholic ----------
  {
    id: 'stChristopher',
    name: '聖多福天主堂',
    en: "St. Christopher's Church",
    city: 'taipei',
    faiths: ['catholic'],
    type: 'church',
    address: '台北市中山區中山北路三段51號',
    phone: '02-2594-7914',
    services: [
      { day: 0, time: '07:30', lang: 'tl' },
      { day: 0, time: '09:00', lang: 'en' },
      { day: 0, time: '10:30', lang: 'en' },
      { day: 0, time: '12:00', lang: 'tl' },
      { day: 0, time: '16:30', lang: 'vi' },
      { day: 0, time: '18:00', lang: 'en' },
      { day: 6, time: '17:00', lang: 'en' },
    ],
  },
  {
    id: 'holyFamilyTaipei',
    name: '聖家堂',
    en: 'Holy Family Church',
    city: 'taipei',
    faiths: ['catholic'],
    type: 'church',
    address: '台北市大安區新生南路二段50號',
    phone: '02-2321-2444',
    services: [{ day: 0, time: '10:00', lang: 'id', weeks: [3, 4] }],
  },
  {
    id: 'christTheKingShilin',
    name: '士林耶穌君王堂',
    en: 'Christ the King Church, Shilin',
    city: 'taipei',
    faiths: ['catholic'],
    type: 'church',
    address: '台北市士林區中正路264號',
    phone: '02-2832-4270',
    services: [{ day: 0, time: '11:00', lang: 'id', weeks: [3, 4] }],
  },
  {
    id: 'stFrancisXavierWanlong',
    name: '聖方濟沙勿略堂',
    en: 'St. Francis Xavier Church, Wanlong',
    city: 'taipei',
    faiths: ['catholic'],
    type: 'church',
    address: '台北市文山區羅斯福路五段150巷25號',
    phone: '02-2932-4940',
    // First Friday of the month.
    services: [{ day: 5, time: '19:00', lang: 'id', weeks: [1] }],
  },
  {
    id: 'donBoscoTaipei',
    name: '聖若望鮑思高堂',
    en: 'St. John Bosco Church',
    city: 'taipei',
    faiths: ['catholic'],
    type: 'church',
    address: '台北市松山區民生東路三段123號',
    phone: '02-2715-5287',
    services: [
      { day: 0, time: '09:00', lang: 'zh' },
      { day: 0, time: '11:00', lang: 'en' },
    ],
  },
  {
    id: 'stAnthonyTucheng',
    name: '土城聖安多尼朝聖地',
    en: 'St. Anthony Shrine, Tucheng',
    city: 'newTaipei',
    faiths: ['catholic'],
    type: 'church',
    address: '新北市土城區中央路四段311號',
    phone: '02-2268-3841',
    services: [{ day: 0, time: '18:00', lang: 'vi' }],
  },
  {
    id: 'sacredHeartShulin',
    name: '樹林耶穌聖心堂',
    en: 'Sacred Heart Church, Shulin',
    city: 'newTaipei',
    faiths: ['catholic'],
    type: 'church',
    address: '新北市樹林區中山路一段154號',
    phone: '02-2681-1083',
    services: [
      { day: 0, time: '09:00', lang: 'zh' },
      { day: 0, time: '11:00', lang: 'en' },
      { day: 0, time: '15:00', lang: 'vi' },
    ],
  },
  {
    id: 'stJosephLinkou',
    name: '林口聖福若瑟天主堂',
    en: 'St. Joseph Freinademetz Church, Linkou',
    city: 'newTaipei',
    faiths: ['catholic'],
    type: 'church',
    address: '新北市林口區忠孝路594巷13號',
    services: [
      { day: 0, time: '09:00', lang: 'zh' },
      { day: 0, time: '11:00', lang: 'en' },
      { day: 0, time: '19:00', lang: 'vi' },
    ],
  },
  {
    id: 'chineseMartyrsBanqiao',
    name: '中華殉道聖人朝聖地',
    en: 'Chinese Martyrs Shrine, Banqiao',
    city: 'newTaipei',
    faiths: ['catholic'],
    type: 'church',
    address: '新北市板橋區南雅西路二段25號',
    phone: '02-2966-6446',
    services: [
      { day: 0, time: '11:00', lang: 'id', weeks: [2] },
      { day: 0, time: '11:00', lang: 'en', weeks: [1, 3, 4] },
    ],
  },
  {
    id: 'stPaulXinzhuang',
    name: '新莊聖保祿堂',
    en: 'St. Paul Church, Xinzhuang',
    city: 'newTaipei',
    faiths: ['catholic'],
    type: 'church',
    address: '新北市新莊區新興街1-1號',
    phone: '02-2993-3520',
    services: [
      { day: 0, time: '09:00', lang: 'zh' },
      { day: 0, time: '11:00', lang: 'en' },
    ],
  },
  {
    id: 'sacredHeartKeelung',
    name: '基隆耶穌聖心堂',
    en: 'Sacred Heart Church, Keelung',
    city: 'keelung',
    faiths: ['catholic'],
    type: 'church',
    address: '基隆市中山區西定路166號',
    phone: '02-2429-5837',
    services: [
      { day: 0, time: '11:00', lang: 'tl', weeks: [1] },
      { day: 0, time: '11:00', lang: 'en', weeks: [2, 3, 4, 5] },
    ],
  },
  {
    id: 'immaculateHeartTaoyuan',
    name: '桃園聖母聖心堂',
    en: 'Immaculate Heart of Mary Church, Taoyuan',
    city: 'taoyuan',
    faiths: ['catholic'],
    type: 'church',
    address: '桃園市桃園區成功路二段56號',
    phone: '03-332-2067',
    services: [
      { day: 0, time: '08:30', lang: 'zh' },
      { day: 0, time: '10:30', lang: 'en' },
      { day: 0, time: '18:00', lang: 'en' },
      { day: 0, time: '18:30', lang: 'vi' },
    ],
  },
  {
    id: 'hsinchuCathedral',
    name: '新竹聖母聖心主教座堂',
    en: 'Immaculate Heart of Mary Cathedral, Hsinchu',
    city: 'hsinchu',
    faiths: ['catholic'],
    type: 'church',
    address: '新竹市東區中正路156號',
    phone: '03-525-6057',
    services: [{ day: 0, time: '17:30', lang: 'vi' }],
  },
  {
    id: 'goodShepherdTaichung',
    name: '東海善牧天主堂',
    en: 'Good Shepherd Church, Tunghai',
    city: 'taichung',
    faiths: ['catholic'],
    type: 'church',
    address: '台中市西屯區台灣大道四段1766號',
    // Sources disagree on the Sunday time (16:00 or 16:30), so none is shown.
    services: [
      { day: 0, lang: 'vi' },
      { day: 6, time: '20:30', lang: 'vi' },
    ],
  },
  {
    id: 'immaculateConceptionTaichung',
    name: '無原罪聖母堂',
    en: 'Immaculate Conception Church, Taichung',
    city: 'taichung',
    faiths: ['catholic'],
    type: 'church',
    address: '台中市南區復興路三段366號',
    // Sunday is listed at 15:00 and 15:30 by different sources, so no time is shown.
    services: [
      { day: 0, lang: 'vi' },
      { day: 6, time: '19:00', lang: 'vi' },
    ],
  },
  {
    id: 'stPeterToucheng',
    name: '頭城聖伯多祿堂',
    en: 'St. Peter Church, Toucheng',
    city: 'yilan',
    faiths: ['catholic'],
    type: 'church',
    address: '宜蘭縣頭城鎮開蘭東路1號',
    phone: '03-977-7383',
    services: [{ day: 6, time: '19:00', lang: 'vi' }],
  },
  {
    id: 'assumptionLuodong',
    name: '羅東聖母升天堂',
    en: 'Assumption Church, Luodong',
    city: 'yilan',
    faiths: ['catholic'],
    type: 'church',
    address: '宜蘭縣羅東鎮北成路一段20號',
    phone: '03-951-2963',
    services: [
      { day: 6, time: '18:00', lang: 'vi' },
      { day: 6, time: '19:00', lang: 'en' },
    ],
  },
  {
    id: 'holyTrinitySuao',
    name: '蘇澳聖三堂',
    en: 'Holy Trinity Church, Suao',
    city: 'yilan',
    faiths: ['catholic'],
    type: 'church',
    address: '宜蘭縣蘇澳鎮中正路40號',
    phone: '03-996-2146',
    services: [{ day: 6, time: '18:15', lang: 'vi' }],
  },

  // ---------- Protestant ----------
  {
    id: 'breadOfLifeMission',
    name: '台北靈糧堂 宣教會堂（愛鄰樓）',
    en: 'Bread of Life Church, Mission Center',
    city: 'taipei',
    faiths: ['protestant'],
    type: 'church',
    address: '台北市大安區和平東路二段24號 愛鄰樓3樓',
    phone: '02-2362-3022',
    services: [{ day: 0, time: '14:50', lang: 'vi' }],
  },
  {
    id: 'breadOfLifeNanjing',
    name: '台北靈糧堂 南京會堂',
    en: 'Bread of Life Church, Nanjing',
    city: 'taipei',
    faiths: ['protestant'],
    type: 'church',
    address: '台北市中山區南京東路二段139號 B1',
    phone: '02-2362-3022',
    services: [
      { day: 0, time: '10:00', lang: 'id' },
      { day: 6, time: '17:00', lang: 'id' },
    ],
  },
  {
    id: 'breadOfLifeInternational',
    name: '台北靈糧堂 國際牧區復興會堂',
    en: 'Bread of Life Church, International',
    city: 'taipei',
    faiths: ['protestant'],
    type: 'church',
    address: '台北市大安區和平東路二段263號 B1',
    phone: '02-2362-3022',
    services: [{ day: 0, time: '10:00', lang: 'en' }],
  },
  {
    id: 'stJohnsCathedral',
    name: '聖約翰座堂（聖公會）',
    en: "St. John's Episcopal Cathedral",
    city: 'taipei',
    faiths: ['protestant'],
    type: 'church',
    address: '台北市大安區復興南路二段280號',
    services: [
      { day: 0, time: '09:00', lang: 'en' },
      { day: 0, time: '10:30', lang: 'zh' },
    ],
  },
  {
    id: 'tlcIndonesianTaichung',
    name: '台灣信義會 印尼語教會',
    en: 'TLC Gereja Indonesia',
    city: 'taichung',
    faiths: ['protestant'],
    type: 'church',
    address: '台中市中區綠川西街113號 2樓',
    services: [{ day: 0, time: '10:00', lang: 'id' }],
  },

  // ---------- Buddhism / Taoism and folk religion ----------
  {
    id: 'hsingTianKong',
    name: '行天宮',
    en: 'Hsing Tian Kong',
    city: 'taipei',
    faiths: ['folk'],
    type: 'temple',
    address: '台北市中山區民權東路二段109號',
    phone: '02-2502-7924',
    hours: '04:00–21:00',
  },
  {
    id: 'lungshanTemple',
    name: '艋舺龍山寺',
    en: 'Longshan Temple',
    city: 'taipei',
    faiths: ['buddhism', 'folk'],
    type: 'temple',
    address: '台北市萬華區廣州街211號',
    phone: '02-2302-5162',
    hours: '06:00–22:00',
  },
].map((p) => ({ checked: CHECKED, ...p }))

// The app language a service language matches, for putting it first.
const LANG_FOR_LOCALE = { vi: 'vi', id: 'id', en: 'en', 'zh-TW': 'zh' }

export function placesFor(city, faiths, locale) {
  if (!city || !faiths?.length) return []
  const mine = LANG_FOR_LOCALE[locale]
  const list = PLACES.filter((p) => p.city === city && p.faiths.some((f) => faiths.includes(f)))
  // Places with a service in the person's language come first; keep source order otherwise.
  const score = (p) => (mine && mine !== 'zh' && p.services?.some((s) => s.lang === mine) ? 0 : 1)
  return list.map((p, i) => ({ p, i })).sort((a, b) => score(a.p) - score(b.p) || a.i - b.i).map(({ p }) => p)
}

// Which week of the month a date falls in (1 = days 1–7).
function weekOfMonth(d) {
  return Math.ceil(d.getDate() / 7)
}

// The next date (from today, inclusive) a service takes place, within eight weeks.
export function nextDate(service, from = new Date()) {
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  for (let i = 0; i < 56; i++) {
    const d = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i)
    if (d.getDay() !== service.day) continue
    if (service.weeks && !service.weeks.includes(weekOfMonth(d))) continue
    return d
  }
  return null
}

export function mapLink(place) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} ${place.address}`)}`
}
