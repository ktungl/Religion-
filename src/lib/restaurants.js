// Restaurants for team meals with Muslim coworkers, from the Taipei Muslim-friendly
// restaurant map: https://thpc.taiwantrade.com/restaurant_map
// halal: Muslim restaurant (A on the map). friendly: Muslim-friendly restaurant (B).
// The source has no B5. Names and addresses are kept as the source writes them.
export const RESTAURANTS_SOURCE = 'https://thpc.taiwantrade.com/restaurant_map'

export const RESTAURANTS = [
  { id: 'A1', type: 'halal', name: '阿里巴巴的廚房', nameEn: 'Alibaba Indian Kitchen', cuisine: 'indian', district: 'zhongshan', phone: '+886-2-2567-7163', address: '臺北市中山區南京東路2段56號2樓', addressEn: '2F., No. 56, Sec. 2, Nanjing E. Rd., Zhongshan Dist., Taipei City' },
  { id: 'A2', type: 'halal', name: '泰姬印度餐廳', nameEn: 'Taj Indian Restaurant', cuisine: 'indian', district: 'daan', phone: '+886-2-8773-0175', address: '臺北市大安區市民大道4段48巷1號', addressEn: 'No. 1, Ln. 48, Sec. 4, Shimin Blvd., Da’an Dist., Taipei City' },
  { id: 'A3', type: 'halal', name: '泰鄉雲店', nameEn: 'Halal Bismilla Restaurant', cuisine: 'thai', district: 'songshan', phone: '+886-2-2577-9271', address: '臺北市松山區北寧路40號1樓', addressEn: '1F., No. 40, Beining Rd., Songshan Dist., Taipei City' },
  { id: 'A4', type: 'halal', name: '清真泰富豪', nameEn: 'Yunus Halal Restaurant', cuisine: 'thai', district: 'songshan', phone: '+886-2-2579-0528', address: '臺北市松山區北寧路36號', addressEn: 'No. 36, Beining Rd., Songshan Dist., Taipei City' },
  { id: 'A5', type: 'halal', name: '清真昆明園餐廳', nameEn: 'Kunming Islamic Food', cuisine: 'yunnan', district: 'songshan', phone: '+886-2-2751-6776', address: '臺北市松山區復興北路81巷26號', addressEn: 'No. 26, Ln. 81, Fuxing N. Rd., Songshan Dist., Taipei City' },
  { id: 'A6', type: 'halal', name: '清真黃牛肉麵館', nameEn: 'Muslim Beef Noodles Restaurant', cuisine: 'noodles', district: 'zhongzheng', phone: '+886-2-2331-8203', address: '臺北市中正區延平南路23號', addressEn: 'No. 23, Yanping S. Rd., Zhongzheng Dist., Taipei City' },
  { id: 'A7', type: 'halal', name: '原味德里', nameEn: 'Dehli Express', cuisine: 'indian', district: 'zhongzheng', phone: '+886-935-943-961', address: '臺北市中正區忠孝西路1段49號微風廣場2樓', addressEn: '2F., Breeze Center, Taipei Main Station, No. 49, Sec. 1, Zhongxiao W. Rd., Zhongzheng Dist., Taipei City' },
  { id: 'A8', type: 'halal', name: '塔吉摩洛哥料理', nameEn: 'Tajin Moroccan Cuisine', cuisine: 'moroccan', district: 'daan', phone: '+886-2-2732-7296', address: '臺北市大安區基隆路2段144巷3號1樓', addressEn: '1F., No. 3, Ln. 144, Sec. 2, Keelung Rd., Da’an Dist., Taipei City' },
  { id: 'A9', type: 'halal', name: '饗印印度巴基斯坦料理餐廳', nameEn: 'Khana Khazana Indian Pakistani Restaurant', cuisine: 'pakistani', district: 'xinyi', phone: '+886-2-8786-9366', address: '臺北市信義區基隆路1段366號', addressEn: 'No. 366, Sec. 1, Keelung Rd., Xinyi Dist., Taipei City' },
  { id: 'A10', type: 'halal', name: '番紅花城土耳其餐廳', nameEn: 'Safranbolu Turkish Restaurant', cuisine: 'turkish', district: 'zhongshan', phone: '+886-2-2522-2939', address: '臺北市中山區南京東路2段60號1-2樓', addressEn: '1-2F., No. 60, Sec. 2, Nanjing E. Rd., Zhongshan Dist., Taipei City' },
  { id: 'A11', type: 'halal', name: '印度香料王餐廳', nameEn: 'Masala Art (Taipei Expo Park)', cuisine: 'indian', district: 'zhongshan', phone: '+886-985-147-888', address: '臺北市中山區玉門街1號花博公園集食行樂廣場', addressEn: 'No. 1, Yumen St., Zhongshan Dist., Taipei City' },
  { id: 'A12', type: 'halal', name: '羅亞咖啡及餐廳', nameEn: 'Royal Café', cuisine: 'indonesian', district: 'daan', phone: '+886-2-2364-1310', address: '臺北市大安區新生南路2段72號', addressEn: 'No. 72, Sec. 2, Xinsheng S. Rd., Da’an Dist., Taipei City' },
  { id: 'A13', type: 'halal', name: '加福堂附設餐飲店', nameEn: 'Toko Sakura', cuisine: 'indonesianSnacks', district: 'daan', phone: '+886-2-2391-6011', address: '臺北市大安區新生南路2段74號1樓', addressEn: '1F., No. 74, Sec. 2, Xinsheng S. Rd., Da’an Dist., Taipei City' },
  { id: 'A14', type: 'halal', name: '加祿堂附設餐飲店', nameEn: 'Toko Sakura', cuisine: 'indonesianSnacks', district: 'daan', phone: '+886-2-2364-3765', address: '臺北市大安區辛亥路1段27號1樓', addressEn: '1F., No. 27, Sec. 1, Xinhai Rd., Da’an Dist., Taipei City' },
  { id: 'A15', type: 'halal', name: '阿巴得印度廚房', nameEn: 'ABAD Indian Kitchen', cuisine: 'indian', district: 'songshan', phone: '+886-2-2546-0440', address: '臺北市松山區光復北路130號', addressEn: 'No. 130, Guangfu N. Rd., Songshan Dist., Taipei City' },
  { id: 'B1', type: 'friendly', name: '張家清真黃牛肉麵館', nameEn: 'Chang Beef Noodle Shop', cuisine: 'noodles', district: 'zhongzheng', phone: '+886-2-2331-2791', address: '臺北市中正區延平南路21號', addressEn: 'No. 21, Yanping S. Rd., Zhongzheng Dist., Taipei City' },
  { id: 'B2', type: 'friendly', name: '真的好海鮮餐廳', nameEn: 'Really Good Seafood', cuisine: 'seafood', district: 'daan', phone: '+886-2-2771-3000', address: '臺北市大安區復興南路1段222號', addressEn: 'No. 222, Sec. 1, Fuxing S. Rd., Da’an Dist., Taipei City' },
  { id: 'B3', type: 'friendly', name: '冰館', nameEn: 'Ice Monster', cuisine: 'desserts', district: 'daan', phone: '+886-2-8771-3263', address: '臺北市大安區忠孝東路4段297號', addressEn: 'No. 297, Sec. 4, Zhongxiao E. Rd., Da’an Dist., Taipei City' },
  { id: 'B4', type: 'friendly', name: '故宮晶華', nameEn: 'Silks Palace at the National Palace Museum', cuisine: 'taiwanese', district: 'shilin', phone: '+886-2-2882-9393', address: '臺北市士林區至善路2段221號', addressEn: 'No. 221, Sec. 2, Zhishan Rd., Shilin Dist., Taipei City' },
  { id: 'B6', type: 'friendly', name: '炸雞大獅', nameEn: 'Fried Chicken Master', cuisine: 'friedChicken', district: 'nangang', phone: '+886-2-7746-2978', address: '臺北市南港區經貿二路1號', addressEn: 'No. 1, Jingmao 2nd Rd., Nangang Dist., Taipei City' },
]

// Districts in the order they are offered as filters.
export const DISTRICTS = ['zhongshan', 'daan', 'songshan', 'zhongzheng', 'xinyi', 'shilin', 'nangang']

// Search by the Chinese address: Google Maps finds Taipei addresses more reliably that way.
export const mapLink = (p) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.address)}`
export const telLink = (p) => `tel:${p.phone.replace(/-/g, '')}`
