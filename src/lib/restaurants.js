import { effectiveAvoid } from './diet.js'

// Restaurants matched to faiths and food needs, by city (one of CITIES in places.js).
// Taipei, Kaohsiung and Pingtung have data so far.
//
// halal is a Muslim or halal-certified restaurant, friendly a Muslim-friendly one.
// Taipei: the Taipei Muslim-friendly restaurant map (A = halal, B = friendly; the
// source has no B5), names and addresses as the source writes them. Kaohsiung: the
// city's Muslim travel pages and Takao magazine, cross-checked with other listings;
// the friendly one is from the Tourism Administration's list. No Pingtung halal
// restaurant could be confirmed.
//
// vegetarian: kept only where several listings agree on the address and phone, and
// on what the menu covers. veg: 'vegan' has no egg or dairy at all, 'mixed' offers
// both 全素 and 蛋奶素 dishes. pungent (蔥蒜韭等五辛): 'some' means the menu marks
// many dishes without them; 'ask' means it isn't clear, so people should ask.
const SOURCES = {
  halal: {
    taipei: 'https://thpc.taiwantrade.com/restaurant_map',
    kaohsiung: 'https://theme.khh.travel/muslim/en/page-6.html',
  },
  vegetarian: 'https://vegemap.merit-times.com/restaurant_list',
}

// Where a list of one kind of restaurant in one city came from.
export function sourceFor(type, city) {
  return type === 'vegetarian' ? SOURCES.vegetarian : SOURCES.halal[city] || null
}

export const RESTAURANTS = [
  { city: 'taipei', id: 'A1', type: 'halal', name: '阿里巴巴的廚房', nameEn: 'Alibaba Indian Kitchen', cuisine: 'indian', district: 'zhongshan', phone: '+886-2-2567-7163', address: '臺北市中山區南京東路2段56號2樓', addressEn: '2F., No. 56, Sec. 2, Nanjing E. Rd., Zhongshan Dist., Taipei City' },
  { city: 'taipei', id: 'A2', type: 'halal', name: '泰姬印度餐廳', nameEn: 'Taj Indian Restaurant', cuisine: 'indian', district: 'daan', phone: '+886-2-8773-0175', address: '臺北市大安區市民大道4段48巷1號', addressEn: 'No. 1, Ln. 48, Sec. 4, Shimin Blvd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'A3', type: 'halal', name: '泰鄉雲店', nameEn: 'Halal Bismilla Restaurant', cuisine: 'thai', district: 'songshan', phone: '+886-2-2577-9271', address: '臺北市松山區北寧路40號1樓', addressEn: '1F., No. 40, Beining Rd., Songshan Dist., Taipei City' },
  { city: 'taipei', id: 'A4', type: 'halal', name: '清真泰富豪', nameEn: 'Yunus Halal Restaurant', cuisine: 'thai', district: 'songshan', phone: '+886-2-2579-0528', address: '臺北市松山區北寧路36號', addressEn: 'No. 36, Beining Rd., Songshan Dist., Taipei City' },
  { city: 'taipei', id: 'A5', type: 'halal', name: '清真昆明園餐廳', nameEn: 'Kunming Islamic Food', cuisine: 'yunnan', district: 'songshan', phone: '+886-2-2751-6776', address: '臺北市松山區復興北路81巷26號', addressEn: 'No. 26, Ln. 81, Fuxing N. Rd., Songshan Dist., Taipei City' },
  { city: 'taipei', id: 'A6', type: 'halal', name: '清真黃牛肉麵館', nameEn: 'Muslim Beef Noodles Restaurant', cuisine: 'noodles', district: 'zhongzheng', phone: '+886-2-2331-8203', address: '臺北市中正區延平南路23號', addressEn: 'No. 23, Yanping S. Rd., Zhongzheng Dist., Taipei City' },
  { city: 'taipei', id: 'A7', type: 'halal', name: '原味德里', nameEn: 'Dehli Express', cuisine: 'indian', district: 'zhongzheng', phone: '+886-935-943-961', address: '臺北市中正區忠孝西路1段49號微風廣場2樓', addressEn: '2F., Breeze Center, Taipei Main Station, No. 49, Sec. 1, Zhongxiao W. Rd., Zhongzheng Dist., Taipei City' },
  { city: 'taipei', id: 'A8', type: 'halal', name: '塔吉摩洛哥料理', nameEn: 'Tajin Moroccan Cuisine', cuisine: 'moroccan', district: 'daan', phone: '+886-2-2732-7296', address: '臺北市大安區基隆路2段144巷3號1樓', addressEn: '1F., No. 3, Ln. 144, Sec. 2, Keelung Rd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'A9', type: 'halal', name: '饗印印度巴基斯坦料理餐廳', nameEn: 'Khana Khazana Indian Pakistani Restaurant', cuisine: 'pakistani', district: 'xinyi', phone: '+886-2-8786-9366', address: '臺北市信義區基隆路1段366號', addressEn: 'No. 366, Sec. 1, Keelung Rd., Xinyi Dist., Taipei City' },
  { city: 'taipei', id: 'A10', type: 'halal', name: '番紅花城土耳其餐廳', nameEn: 'Safranbolu Turkish Restaurant', cuisine: 'turkish', district: 'zhongshan', phone: '+886-2-2522-2939', address: '臺北市中山區南京東路2段60號1-2樓', addressEn: '1-2F., No. 60, Sec. 2, Nanjing E. Rd., Zhongshan Dist., Taipei City' },
  { city: 'taipei', id: 'A11', type: 'halal', name: '印度香料王餐廳', nameEn: 'Masala Art (Taipei Expo Park)', cuisine: 'indian', district: 'zhongshan', phone: '+886-985-147-888', address: '臺北市中山區玉門街1號花博公園集食行樂廣場', addressEn: 'No. 1, Yumen St., Zhongshan Dist., Taipei City' },
  { city: 'taipei', id: 'A12', type: 'halal', name: '羅亞咖啡及餐廳', nameEn: 'Royal Café', cuisine: 'indonesian', district: 'daan', phone: '+886-2-2364-1310', address: '臺北市大安區新生南路2段72號', addressEn: 'No. 72, Sec. 2, Xinsheng S. Rd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'A13', type: 'halal', name: '加福堂附設餐飲店', nameEn: 'Toko Sakura', cuisine: 'indonesianSnacks', district: 'daan', phone: '+886-2-2391-6011', address: '臺北市大安區新生南路2段74號1樓', addressEn: '1F., No. 74, Sec. 2, Xinsheng S. Rd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'A14', type: 'halal', name: '加祿堂附設餐飲店', nameEn: 'Toko Sakura', cuisine: 'indonesianSnacks', district: 'daan', phone: '+886-2-2364-3765', address: '臺北市大安區辛亥路1段27號1樓', addressEn: '1F., No. 27, Sec. 1, Xinhai Rd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'A15', type: 'halal', name: '阿巴得印度廚房', nameEn: 'ABAD Indian Kitchen', cuisine: 'indian', district: 'songshan', phone: '+886-2-2546-0440', address: '臺北市松山區光復北路130號', addressEn: 'No. 130, Guangfu N. Rd., Songshan Dist., Taipei City' },
  { city: 'taipei', id: 'B1', type: 'friendly', name: '張家清真黃牛肉麵館', nameEn: 'Chang Beef Noodle Shop', cuisine: 'noodles', district: 'zhongzheng', phone: '+886-2-2331-2791', address: '臺北市中正區延平南路21號', addressEn: 'No. 21, Yanping S. Rd., Zhongzheng Dist., Taipei City' },
  { city: 'taipei', id: 'B2', type: 'friendly', name: '真的好海鮮餐廳', nameEn: 'Really Good Seafood', cuisine: 'seafood', district: 'daan', phone: '+886-2-2771-3000', address: '臺北市大安區復興南路1段222號', addressEn: 'No. 222, Sec. 1, Fuxing S. Rd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'B3', type: 'friendly', name: '冰館', nameEn: 'Ice Monster', cuisine: 'desserts', district: 'daan', phone: '+886-2-8771-3263', address: '臺北市大安區忠孝東路4段297號', addressEn: 'No. 297, Sec. 4, Zhongxiao E. Rd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'B4', type: 'friendly', name: '故宮晶華', nameEn: 'Silks Palace at the National Palace Museum', cuisine: 'taiwanese', district: 'shilin', phone: '+886-2-2882-9393', address: '臺北市士林區至善路2段221號', addressEn: 'No. 221, Sec. 2, Zhishan Rd., Shilin Dist., Taipei City' },
  { city: 'taipei', id: 'B6', type: 'friendly', name: '炸雞大獅', nameEn: 'Fried Chicken Master', cuisine: 'friedChicken', district: 'nangang', phone: '+886-2-7746-2978', address: '臺北市南港區經貿二路1號', addressEn: 'No. 1, Jingmao 2nd Rd., Nangang Dist., Taipei City' },
  { city: 'taipei', id: 'V1', type: 'vegetarian', veg: 'mixed', pungent: 'some', name: '祥和蔬食料理（鎮江店）', nameEn: 'Serenity Vegetarian', cuisine: 'sichuan', district: 'zhongzheng', phone: '+886-2-2357-0377', address: '臺北市中正區鎮江街1巷1號', addressEn: 'No. 1, Ln. 1, Zhenjiang St., Zhongzheng Dist., Taipei City' },
  { city: 'taipei', id: 'V2', type: 'vegetarian', veg: 'mixed', pungent: 'ask', name: '養心茶樓', nameEn: 'Yang Shin Vegetarian', cuisine: 'dimsum', district: 'zhongshan', phone: '+886-2-2542-8828', address: '臺北市中山區松江路128號2樓', addressEn: '2F., No. 128, Songjiang Rd., Zhongshan Dist., Taipei City' },
  { city: 'taipei', id: 'V3', type: 'vegetarian', veg: 'vegan', pungent: 'ask', name: 'Vegan Amore 蔬慕', nameEn: 'Vegan Amore', cuisine: 'fusion', district: 'datong', phone: '+886-2-2555-6090', address: '臺北市大同區承德路1段1號3樓', addressEn: '3F., No. 1, Sec. 1, Chengde Rd., Datong Dist., Taipei City' },
  { city: 'taipei', id: 'V4', type: 'vegetarian', veg: 'mixed', pungent: 'ask', name: '小小樹食（大安路）', nameEn: 'Little Tree Food', cuisine: 'fusion', district: 'daan', phone: '+886-2-2778-2277', address: '臺北市大安區大安路1段116巷17號', addressEn: 'No. 17, Ln. 116, Sec. 1, Da’an Rd., Da’an Dist., Taipei City' },
  { city: 'taipei', id: 'V5', type: 'vegetarian', veg: 'mixed', pungent: 'ask', name: '全國健康素食（士林店）', nameEn: 'Quanguo Vegetarian Buffet (Shilin)', cuisine: 'buffet', district: 'shilin', phone: '+886-2-2881-5876', address: '臺北市士林區中正路281號', addressEn: 'No. 281, Zhongzheng Rd., Shilin Dist., Taipei City' },
  { city: 'kaohsiung', id: 'KH1', type: 'halal', name: '高雄清真館', nameEn: 'Kaohsiung Halal Restaurant', cuisine: 'indonesian', district: 'lingya', phone: '+886-7-749-6277', address: '高雄市苓雅區建軍路13號', addressEn: 'No. 13, Jianjun Rd., Lingya Dist., Kaohsiung City' },
  { city: 'kaohsiung', id: 'KH2', type: 'halal', name: '棉花堡土耳其料理', nameEn: 'Pamukkale Turkish Restaurant', cuisine: 'turkish', district: 'zuoying', phone: '+886-7-557-1717', address: '高雄市左營區裕誠路429號', addressEn: 'No. 429, Yucheng Rd., Zuoying Dist., Kaohsiung City' },
  { city: 'kaohsiung', id: 'KH3', type: 'halal', name: '爪哇真美食（明華店）', nameEn: 'Jawawa Indonesian Restaurant', cuisine: 'indonesian', district: 'zuoying', phone: '+886-7-550-9889', address: '高雄市左營區明華一路168號', addressEn: 'No. 168, Minghua 1st Rd., Zuoying Dist., Kaohsiung City' },
  { city: 'kaohsiung', id: 'KH4', type: 'halal', name: '拉合爾異國美食', nameEn: 'Lahore Halal Restaurant', cuisine: 'pakistani', district: 'lingya', phone: '+886-7-726-6803', address: '高雄市苓雅區林泉街86號', addressEn: 'No. 86, Linchuan St., Lingya Dist., Kaohsiung City' },
  { city: 'kaohsiung', id: 'KF1', type: 'friendly', name: '福容大飯店高雄 田園咖啡廳', nameEn: 'Fullon Hotel Kaohsiung, Garden Café', cuisine: 'hotelBuffet', district: 'qianjin', phone: '+886-7-231-2333', address: '高雄市前金區六合二路161號', addressEn: 'No. 161, Liuhe 2nd Rd., Qianjin Dist., Kaohsiung City' },
  { city: 'kaohsiung', id: 'KV1', type: 'vegetarian', veg: 'mixed', pungent: 'ask', name: '食不二蔬食', nameEn: 'Shi Bu Er Vegetarian', cuisine: 'fusion', district: 'zuoying', phone: '+886-7-588-7366', address: '高雄市左營區南大路4號', addressEn: 'No. 4, Nanda Rd., Zuoying Dist., Kaohsiung City' },
  { city: 'pingtung', id: 'PV1', type: 'vegetarian', veg: 'mixed', pungent: 'ask', name: '小孩吃素（勝利店）', nameEn: 'Kids Eat Veggie (Shengli)', cuisine: 'fusion', district: 'pingtungCity', phone: '+886-8-765-5222', address: '屏東縣屏東市南京路41號', addressEn: 'No. 41, Nanjing Rd., Pingtung City, Pingtung County' },
]

export const restaurantsIn = (city) => RESTAURANTS.filter((r) => r.city === city)

// Districts in the order they are offered as filters.
export const DISTRICTS = [
  // Taipei
  'zhongshan', 'datong', 'daan', 'songshan', 'zhongzheng', 'xinyi', 'shilin', 'nangang',
  // Kaohsiung
  'lingya', 'zuoying', 'qianjin',
  // Pingtung
  'pingtungCity',
]

// ---------- Matching restaurants to people ----------

// Needs, roughly from strictest to mildest; each is checked against every restaurant.
export const NEEDS = ['halal', 'noPork', 'vegan', 'veg', 'noPungent', 'noBeef']

// Cuisines whose menus usually include vegetarian dishes.
const VEG_DISHES = ['indian', 'pakistani']

// What someone needs from a restaurant, from their food needs if they shared them,
// otherwise from their faith. Only Islam reliably implies a need (halal); many
// Buddhists and folk-religion believers eat meat, so that isn't assumed.
export function needsOf(diet, faiths = []) {
  const out = new Set()
  if (diet?.avoid?.length) {
    const a = new Set(effectiveAvoid(diet.avoid))
    const veg = a.has('meat') && a.has('seafood')
    if (a.has('halal')) out.add('halal')
    else if (a.has('pork') && !veg) out.add('noPork')
    if (veg && a.has('egg') && a.has('dairy')) out.add('vegan')
    else if (veg) out.add('veg')
    if (a.has('pungent')) out.add('noPungent')
    if (a.has('beef') && !veg) out.add('noBeef')
  } else if (!diet?.anything && faiths?.includes('islam')) {
    out.add('halal')
  }
  return out
}

// How well a restaurant meets one need: 'yes', 'ask' (possible, check when
// ordering) or 'no'.
export function fit(r, need) {
  const veg = r.type === 'vegetarian'
  switch (need) {
    case 'halal':
      // Vegetarian food has no meat, but cooking wine is common in Taiwan.
      return r.type === 'halal' ? 'yes' : 'ask'
    case 'noPork':
      return r.type === 'friendly' ? 'ask' : 'yes'
    case 'vegan':
      if (veg) return r.veg === 'vegan' ? 'yes' : 'ask'
      return 'no'
    case 'veg':
      if (veg) return 'yes'
      return VEG_DISHES.includes(r.cuisine) ? 'ask' : 'no'
    case 'noPungent':
      if (!veg) return 'no'
      // A menu that marks dishes without them lets people choose for themselves.
      return r.pungent === 'some' ? 'yes' : 'ask'
    case 'noBeef':
      if (r.cuisine === 'noodles') return 'no'
      return veg ? 'yes' : 'ask'
    default:
      return 'yes'
  }
}

// Restaurants that work for every need, best first. A 'no' rules a restaurant out,
// except for needs only some days call for (`soft`), which just lower its rank.
export function recommend(city, needs, soft = new Set()) {
  const list = [...needs]
  const miss = (n) => (soft.has(n) ? 0 : -99)
  return restaurantsIn(city).map((r, i) => {
    const fits = Object.fromEntries(list.map((n) => [n, fit(r, n)]))
    const score = list.reduce((sum, n) => sum + (fits[n] === 'yes' ? 2 : fits[n] === 'ask' ? 1 : miss(n)), 0)
    return { r, fits, score, i }
  })
    .filter((x) => x.score >= 0)
    .sort((a, b) => b.score - a.score || a.i - b.i)
}

// Search by the Chinese address: Google Maps finds Taipei addresses more reliably that way.
export const mapLink = (p) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`
export const telLink = (p) => `tel:${p.phone.replace(/-/g, '')}`
