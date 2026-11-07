// Reviewed notes the AI must stay within when explaining each date.
// Kept short and conservative on purpose. Practices differ between people,
// families and countries; the AI is told not to go beyond these notes.
// TODO before submission: have believers of each faith read their entries.

export const EVENT_FACTS = {
  // ---------- Islam ----------
  ramadanStart: {
    faith: 'islam',
    what: 'The first day of Ramadan, the ninth month of the Islamic lunar calendar and the month of fasting. The start depends on sighting the new moon, so it can shift by a day.',
    how: 'Adult Muslims who are able fast every day from dawn until sunset: no food and no drink, including water. Before dawn they eat a meal called suhur; at sunset they break the fast (iftar), often with dates and water. Many pray more and read the Quran, and there are extra night prayers. People who are ill, pregnant, travelling and some others are excused.',
    tips: [
      'Avoid planning lunch meetings or meal events during the day; an event after sunset works better.',
      'Do not offer food or drink or press anyone to eat. Not every Muslim fasts every day, and that is a personal matter.',
      'Energy can be lower in the afternoon; if possible, put demanding tasks earlier in the day.',
      'On shifts that cross sunset, a short break to break the fast is a kind gesture.',
    ],
  },
  ramadan: {
    faith: 'islam',
    what: 'Ramadan, the ninth month of the Islamic lunar calendar and the month of fasting. It lasts 29 or 30 days.',
    how: 'Adult Muslims who are able fast every day from dawn until sunset: no food and no drink, including water. They eat suhur before dawn and break the fast at sunset (iftar), often with dates and water. Many pray more and read the Quran. People who are ill, pregnant, travelling and some others are excused.',
    tips: [
      'Avoid planning lunch meetings or meal events during the day.',
      'Do not offer food or drink or press anyone to eat; whether someone fasts is personal.',
      'On shifts that cross sunset, a short break to break the fast is a kind gesture.',
    ],
  },
  eidFitr: {
    faith: 'islam',
    what: 'Eid al-Fitr, the festival at the end of Ramadan, on the first day of the month of Shawwal. In Indonesia it is called Lebaran or Idulfitri. The date depends on moon sighting and may shift by a day.',
    how: 'The day starts with a special Eid prayer in the morning, at a mosque or a large open-air gathering. People wear new or best clothes, visit family and friends, share food, and ask each other for forgiveness. In Taiwan many Indonesian workers gather with friends on this day.',
    tips: [
      'Some coworkers may ask for leave or a shift swap, especially for the morning prayer.',
      'A simple greeting is welcome: "Eid Mubarak", or in Indonesian "Selamat Hari Raya Idulfitri".',
      'Because the date can move by a day, confirm leave plans close to the date.',
    ],
  },
  eidAdha: {
    faith: 'islam',
    what: 'Eid al-Adha, the Festival of Sacrifice, on the 10th day of the month of Dhu al-Hijjah, during the Hajj pilgrimage. It remembers the prophet Ibrahim\'s willingness to obey God.',
    how: 'It begins with a morning Eid prayer. Families who can afford it sacrifice an animal (qurban) and share the meat with family, neighbours and people in need. It is a time for visiting and sharing meals.',
    tips: [
      'Some coworkers may ask for leave or a shift swap for the morning prayer.',
      'A simple greeting is welcome: "Eid Mubarak", or in Indonesian "Selamat Hari Raya Iduladha".',
    ],
  },
  islamicNewYear: {
    faith: 'islam',
    what: 'The Islamic New Year, the first day of the month of Muharram.',
    how: 'It is usually a quiet day of reflection rather than a big celebration. Some communities hold gatherings or talks.',
    tips: ['It usually needs no special arrangements at work.', 'A friendly greeting is fine, but there is no expectation of a party.'],
  },
  mawlid: {
    faith: 'islam',
    what: 'Mawlid (in Indonesian, Maulid Nabi), remembering the birth of the Prophet Muhammad, in the month of Rabi al-Awwal.',
    how: 'Many Muslims mark it with gatherings, prayers, recitations and shared food. Practice varies, and some Muslims do not celebrate it.',
    tips: ['Do not assume every Muslim coworker observes it.', 'It usually needs no special arrangements at work.'],
  },

  // ---------- Chinese lunar calendar: Buddhism and Taoism / folk religion ----------
  lunarFirst: {
    faith: 'folk',
    what: 'The 1st day of the month in the Chinese lunar calendar (初一).',
    how: 'Many Buddhists and followers of Taiwanese folk religion eat vegetarian on the 1st and 15th of each lunar month, and some offer incense at a temple or at a home shrine.',
    tips: [
      'If the team orders meals, include a vegetarian option.',
      'Vegetarian in Taiwan can mean different things: some people also avoid eggs, or onion, garlic, scallions and leeks. Ask the person.',
    ],
  },
  lunarFifteenth: {
    faith: 'folk',
    what: 'The 15th day of the month in the Chinese lunar calendar (十五), the day of the full moon.',
    how: 'Many Buddhists and followers of Taiwanese folk religion eat vegetarian on the 1st and 15th of each lunar month, and some offer incense at a temple or at a home shrine.',
    tips: [
      'If the team orders meals, include a vegetarian option.',
      'Vegetarian in Taiwan can mean different things: some people also avoid eggs, or onion, garlic, scallions and leeks. Ask the person.',
    ],
  },
  lunarNewYearEve: {
    faith: 'folk',
    what: 'Lunar New Year\'s Eve (除夕), the last day of the lunar year and a national holiday in Taiwan.',
    how: 'Families gather for a reunion dinner, and elders give red envelopes with money. Most Taiwanese travel back to their hometowns for the holiday.',
    tips: [
      'Taiwanese coworkers will likely travel home; plan schedules early.',
      'Coworkers from abroad may stay in the dormitory over the holiday; including them in a meal or small gathering is a kind gesture.',
    ],
  },
  lunarNewYear: {
    faith: 'folk',
    what: 'Lunar New Year (春節), the biggest holiday in Taiwan, with several days of national holiday.',
    how: 'People visit family and temples, give red envelopes, and exchange lucky greetings such as "新年快樂" (Happy New Year) and "恭喜發財" (wishing you prosperity). Some families avoid unlucky words or sweeping the floor on the first day.',
    tips: [
      'On the first workday after the holiday, many companies hold a small ceremony and give red envelopes.',
      'Saying "新年快樂" to Taiwanese coworkers is always welcome.',
    ],
  },
  lantern: {
    faith: 'folk',
    what: 'The Lantern Festival (元宵節), on the 15th day of the first lunar month, which ends the New Year season.',
    how: 'People eat sweet rice balls (湯圓 or 元宵), go to lantern shows and guess riddles written on lanterns. It is a normal workday.',
    tips: ['Sharing sweet rice balls at work is a common, friendly custom.'],
  },
  qingming: {
    faith: 'folk',
    what: 'Tomb-Sweeping Day (清明節), around 4 or 5 April, a national holiday in Taiwan for remembering ancestors.',
    how: 'Families clean their ancestors\' graves, make offerings, burn incense and remember those who have died. It is a respectful day, not a party.',
    tips: ['Taiwanese coworkers may travel to their hometowns.', 'Keep the tone respectful; it is a day of remembrance.'],
  },
  mazu: {
    faith: 'folk',
    what: 'The birthday of Mazu (媽祖), the sea goddess, one of the most popular deities in Taiwan, on the 23rd day of the third lunar month.',
    how: 'Temples hold big celebrations. Around this time there are large pilgrimages in which devotees walk with Mazu\'s palanquin for days, with firecrackers, music and temple fairs.',
    tips: [
      'Some coworkers may ask for leave to join a pilgrimage or temple event.',
      'Expect crowds and traffic near large Mazu temples, especially in central Taiwan.',
    ],
  },
  dragonBoat: {
    faith: 'folk',
    what: 'The Dragon Boat Festival (端午節), on the 5th day of the fifth lunar month, a national holiday in Taiwan.',
    how: 'People watch dragon boat races, eat zongzi (sticky rice dumplings wrapped in leaves), and hang mugwort at the door for protection.',
    tips: [
      'Zongzi often contain pork. If sharing them at work, offer a vegetarian or pork-free choice for Muslim and vegetarian coworkers.',
    ],
  },
  ghostFestival: {
    faith: 'folk',
    what: 'The Zhongyuan Festival (中元普渡), on the 15th day of the seventh lunar month, the high point of Ghost Month in Taiwanese folk religion.',
    how: 'People and many companies set out tables of food offerings, burn incense and paper money for wandering spirits, and hold a pudu (普渡) ceremony. Some avoid certain activities during Ghost Month, such as swimming at night.',
    tips: [
      'If the company holds a pudu ceremony, taking part should be voluntary. Coworkers of other faiths may prefer not to join, and that is fine.',
      'Offered food is often shared afterwards; it may contain pork, so offer other options.',
    ],
  },
  midAutumn: {
    faith: 'folk',
    what: 'The Mid-Autumn Festival (中秋節), on the 15th day of the eighth lunar month, a national holiday in Taiwan.',
    how: 'Families gather to look at the full moon, eat mooncakes and pomelo, and in Taiwan many people have barbecues.',
    tips: [
      'Mooncakes may contain lard or egg yolk. Check the ingredients if sharing with Muslim or vegetarian coworkers.',
      'Inviting coworkers from abroad to a team barbecue is a warm gesture.',
    ],
  },
  buddhaBirthday: {
    faith: 'buddhism',
    what: 'Buddha\'s Birthday (佛誕節). In Taiwan it is on the 8th day of the fourth lunar month; Vietnamese Buddhists celebrate it (Phật Đản) on the 15th day of the fourth lunar month. Buddhists in Thailand celebrate Visakha Bucha (Vesak) instead.',
    how: 'Temples hold a "bathing the Buddha" ceremony (浴佛), pouring water over a small statue of the baby Buddha. Many Buddhists eat vegetarian and do good deeds on this day.',
    tips: ['Include a vegetarian option if the team shares a meal.'],
  },
  ullambana: {
    faith: 'buddhism',
    what: 'Ullambana (盂蘭盆節), on the 15th day of the seventh lunar month, the same day as the Zhongyuan Festival.',
    how: 'Buddhists make offerings to the monastic community and dedicate merit to their parents and ancestors. It is linked to the value of caring for one\'s parents.',
    tips: ['Include a vegetarian option if the team shares a meal.', 'Some coworkers may visit a temple.'],
  },

  // ---------- Thai (Theravada) Buddhism ----------
  makhaBucha: {
    faith: 'buddhism',
    what: 'Makha Bucha, a Buddhist holy day on the full moon of the third Thai lunar month (February or March). It remembers a gathering of the Buddha\'s disciples to hear his teaching.',
    how: 'It is a public holiday in Thailand. Many Thai Buddhists go to the temple to make merit and listen to a sermon, and in the evening walk around the temple three times holding candles, incense and flowers (wian tian).',
    tips: [
      'Some coworkers may wish to visit a temple in the evening.',
      'Many Thais avoid alcohol on Buddhist holy days, so it is not a good day for a drinking party.',
    ],
  },
  visakhaBucha: {
    faith: 'buddhism',
    what: 'Visakha Bucha (Vesak), the most important Buddhist holy day in Thailand, on the full moon of the sixth Thai lunar month (May or June). It remembers the Buddha\'s birth, enlightenment and passing away.',
    how: 'It is a public holiday in Thailand. Thai Buddhists go to the temple, make merit, keep the precepts and join an evening candle procession around the temple (wian tian).',
    tips: [
      'Some coworkers may wish to visit a temple in the evening.',
      'Many Thais avoid alcohol on this day.',
    ],
  },
  asalhaBucha: {
    faith: 'buddhism',
    what: 'Asalha Bucha, on the full moon of the eighth Thai lunar month (usually July). It remembers the Buddha\'s first sermon. Buddhist Lent begins the next day.',
    how: 'It is a public holiday in Thailand. Thai Buddhists go to the temple, make merit and join an evening candle procession.',
    tips: ['Many Thais avoid alcohol on this day.'],
  },
  khaoPhansa: {
    faith: 'buddhism',
    what: 'The first day of Buddhist Lent (Vassa, พรรษา), a three-month period in the rainy season when monks stay at their temples.',
    how: 'People offer candles and robes to temples. Some lay Buddhists make a personal promise for the three months, for example not to drink alcohol.',
    tips: ['A coworker may not drink alcohol for the next three months; there is no need to press them at team dinners.'],
  },
  okPhansa: {
    faith: 'buddhism',
    what: 'The end of Buddhist Lent (ออกพรรษา), on the full moon of the eleventh Thai lunar month (October).',
    how: 'Monks finish the rains retreat. People make merit at the temple, and in the following month many temples hold kathin ceremonies to offer robes to monks.',
    tips: ['Some coworkers may wish to visit a temple on this day.'],
  },

  // ---------- Christianity ----------
  ashWednesday: {
    faith: 'catholic',
    what: 'Ash Wednesday, the first day of Lent, the 40-day season of preparation before Easter.',
    how: 'Catholics go to Mass and receive a cross of ash on the forehead. Adult Catholics fast (one full meal) and do not eat meat on this day. During Lent, many also avoid meat on Fridays.',
    tips: [
      'A coworker may have an ash mark on the forehead; it is intentional, so there is no need to point it out.',
      'Offer a meat-free option for team meals on this day and on Fridays in Lent.',
    ],
  },
  lentFriday: {
    faith: 'catholic',
    what: 'A Friday in Lent, the 40-day season of preparation before Easter.',
    how: 'Many Catholics do not eat meat on Fridays in Lent; fish and seafood are fine. It is widely kept by Filipino Catholics. Practice differs between countries and between people.',
    tips: [
      'If the team orders meals on these Fridays, include a fish or meat-free option.',
      'There is no need to ask a coworker how strictly they keep it.',
    ],
  },
  goodFriday: {
    faith: 'catholic',
    what: 'Good Friday, the Friday before Easter, remembering the death of Jesus on the cross.',
    how: 'It is a solemn day with church services in the afternoon or evening. Catholics fast and do not eat meat. In the Philippines the whole Holy Week is very important.',
    tips: [
      'Filipino and other Christian coworkers may wish to attend a service.',
      'Offer a meat-free option for team meals.',
    ],
  },
  easter: {
    faith: 'catholic',
    what: 'Easter Sunday, celebrating the resurrection of Jesus, the most important Christian feast.',
    how: 'Christians attend church services; families gather and share meals. Easter eggs are a popular custom.',
    tips: [
      'If possible, avoid scheduling Sunday overtime so coworkers can attend a service.',
      'A greeting such as "Happy Easter" is welcome.',
    ],
  },
  allSaints: {
    faith: 'catholic',
    what: 'All Saints\' Day, 1 November, a Catholic feast honouring all saints.',
    how: 'Catholics attend Mass. In the Philippines, on 1 and 2 November (All Souls\' Day) families visit the graves of loved ones.',
    tips: ['Filipino coworkers may miss being home with family at this time; a kind word helps.', 'Some may wish to attend Mass.'],
  },
  christmasEve: {
    faith: 'catholic',
    what: 'Christmas Eve, 24 December, the evening before Christmas.',
    how: 'Many Christians attend an evening or midnight church service and gather with family. In the Philippines families share a late-night feast called Noche Buena.',
    tips: ['Coworkers may hope to finish work in time for an evening service.'],
  },
  christmas: {
    faith: 'catholic',
    what: 'Christmas, 25 December, celebrating the birth of Jesus.',
    how: 'Christians attend church, share meals and exchange gifts. For Filipino coworkers it is the biggest holiday of the year, often spent far from family when working abroad.',
    tips: [
      'A greeting such as "Merry Christmas" (Filipino: "Maligayang Pasko") is welcome.',
      'A small team gathering can mean a lot to coworkers who are away from home.',
    ],
  },
}
