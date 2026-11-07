// Which days get a "send a greeting" button, and the reviewed hints the AI must
// stay within. Days of mourning, remembrance or penance (Good Friday, Ash
// Wednesday, Qingming, Ghost Festival, Ullambana, All Saints) and days whose
// observance is disputed within the faith (Mawlid) are left out on purpose:
// a cheerful message there could hurt more than help.
// Daily fasting and vegetarian days are left out too; only the start of Ramadan
// gets a greeting.
// TODO before submission: have believers of each faith read their entries.

export const GREETINGS = {
  ramadanStart: {
    hint: 'Wish them a good and blessed month of fasting, and say you will be considerate at work (meals, breaks).',
    phrases: ['Ramadan Mubarak', 'Ramadan Kareem', 'Indonesian: Selamat menunaikan ibadah puasa'],
  },
  eidFitr: {
    hint: 'Celebrate the end of Ramadan with them and wish them a happy day with family and friends.',
    phrases: ['Eid Mubarak', 'Indonesian: Selamat Hari Raya Idul Fitri, mohon maaf lahir dan batin'],
  },
  eidAdha: {
    hint: 'Wish them a happy Eid al-Adha with family and friends.',
    phrases: ['Eid Mubarak', 'Indonesian: Selamat Hari Raya Idul Adha'],
  },
  islamicNewYear: {
    hint: 'A quiet, simple wish for a good new year. Not every Muslim celebrates it, so keep it light.',
    phrases: ['Indonesian: Selamat Tahun Baru Islam'],
  },
  lunarNewYearEve: {
    hint: 'Wish them a warm reunion dinner with family.',
    phrases: ['Traditional Chinese: 除夕團圓', 'Vietnamese: Chúc mừng năm mới'],
  },
  lunarNewYear: {
    hint: 'Wish them a happy new year, good health and good luck.',
    phrases: ['Traditional Chinese: 新年快樂、恭喜發財', 'Vietnamese: Chúc mừng năm mới'],
  },
  lantern: {
    hint: 'Wish them a happy Lantern Festival, the last day of the new year celebrations.',
    phrases: ['Traditional Chinese: 元宵節快樂'],
  },
  dragonBoat: {
    hint: 'Wish them a happy and safe Dragon Boat Festival.',
    phrases: ['Traditional Chinese: 端午節快樂', 'Traditional Chinese: 端午安康'],
  },
  midAutumn: {
    hint: 'Wish them a happy Mid-Autumn Festival with family, under the full moon.',
    phrases: ['Traditional Chinese: 中秋節快樂', 'Vietnamese: Vui Tết Trung Thu'],
  },
  buddhaBirthday: {
    hint: "A peaceful, gentle wish for the Buddha's Birthday. Calm rather than party-like.",
    phrases: ['Happy Vesak', 'Traditional Chinese: 浴佛節快樂', 'Vietnamese: Mừng Phật Đản'],
  },
  visakhaBucha: {
    hint: 'A peaceful, gentle wish for Visakha Bucha, the most important Buddhist day in Thailand. Calm rather than party-like.',
    phrases: ['Happy Vesak', 'Thai: สุขสันต์วันวิสาขบูชา'],
  },
  easter: {
    hint: 'Wish them a happy Easter with family and their church.',
    phrases: ['Happy Easter', 'Indonesian: Selamat Paskah', 'Vietnamese: Chúc mừng lễ Phục Sinh'],
  },
  christmasEve: {
    hint: 'Wish them a warm Christmas Eve.',
    phrases: ['Merry Christmas', 'Indonesian: Selamat Natal', 'Vietnamese: Chúc mừng Giáng sinh'],
  },
  christmas: {
    hint: 'Wish them a merry Christmas with family and friends.',
    phrases: ['Merry Christmas', 'Indonesian: Selamat Natal', 'Vietnamese: Chúc mừng Giáng sinh'],
  },
}

export const GREETABLE = Object.keys(GREETINGS)
