// Project data — purpose-first. Tech stacks, timelines, roles and "who it helps"
// framing removed on purpose; each entry states what the thing is *for*.
// No trailing 句號 anywhere, per the site's typographic rules — the English
// copy follows the same rule (no closing full stop).
//
// Text fields are `{ zh, en }` pairs (see src/i18n.jsx); a plain string is
// shared by both languages.
//
// tint                 -> which pale sea rises over this scene (see Scene.jsx)
// image.wide === true  -> landscape shot   (50/50 layout, stacked vertically)
// image.wide falsy     -> portrait / GIF   (compact horizontal row)
// hidden === true      -> kept in source but not rendered

export const projects = [
  {
    id: 'resonance',
    name: { zh: '共振', en: 'Resonance' },
    latin: 'Resonance',
    tint: 'white',
    lead: {
      zh: '讓每個同頻的靈魂，透過真實故事彼此相遇',
      en: 'Where kindred souls find each other through real stories',
    },
    body: {
      zh: '一個以「思維」與「故事」為核心的社群平台，相信每一個平凡的生命裡，都藏著值得被世界聽見的智慧；讓真實的故事，成為傳遞正向思維的光——使世界因連結而更有意識、更溫暖',
      en: 'A community built around ideas and stories, grounded in the belief that every ordinary life holds wisdom worth hearing. Real stories become a light that carries positive thinking — so that, through connection, the world grows more mindful and a little warmer',
    },
    note: 'Let lives influence lives.',
    href: {
      zh: 'https://resonance-world.vercel.app/zh-TW',
      en: 'https://resonance-world.vercel.app/en',
    },
    hrefLabel: 'resonance-world.vercel.app',
    images: [
      {
        src: '/images/resonance/resonance-1.avif',
        alt: { zh: '共振平台畫面一', en: 'Resonance screen one' },
        wide: true,
      },
      {
        src: '/images/resonance/resonance-2.avif',
        alt: { zh: '共振平台畫面二', en: 'Resonance screen two' },
        wide: true,
      },
    ],
  },
  {
    id: 'tuckin',
    name: 'Tuckin',
    latin: 'Tuckin',
    tint: 'terracotta',
    lead: {
      zh: '一頓晚餐，把陌生的同學變成朋友',
      en: 'One dinner that turns classmates into friends',
    },
    body: {
      zh: '為成大學生打造的聚餐媒合平台：按一下預約，剩下的分組、投票、湊時間都交給系統，讓認識新朋友這件事幾乎沒有門檻，上線後累積 300 位使用者',
      en: 'A dinner-matching platform for NCKU students: tap once to book, and the system takes care of grouping, voting and finding a time — making meeting new people almost effortless. 300 users joined after launch',
    },
    href: 'https://github.com/ncchen99/Tuckin',
    hrefLabel: 'github.com/ncchen99/Tuckin',
    images: [
      { src: '/images/tuckin/screenshot-1.png', alt: { zh: 'Tuckin 主畫面', en: 'Tuckin home screen' } },
      { src: '/images/tuckin/screenshot-2.png', alt: { zh: 'Tuckin 預約流程', en: 'Tuckin booking flow' } },
      { src: '/images/tuckin/screenshot-3.png', alt: { zh: 'Tuckin 餐廳投票', en: 'Tuckin restaurant vote' } },
    ],
  },
  {
    id: 'ncku-ca',
    name: { zh: '成大社聯會官網', en: 'NCKU Club Association' },
    latin: 'NCKU-CA',
    tint: 'red',
    lead: {
      zh: '全校 230 個社團每天在使用的數位平臺',
      en: 'The platform 230 campus clubs rely on every day',
    },
    body: {
      zh: '把社團的活動報名、現場點名與保證金作業全面數位化，讓繁瑣的紙本流程變成線上填表與即時查詢，成為社聯會與社團幹部日常的營運骨幹',
      en: 'Event sign-ups, on-site check-in and club deposits, fully digitised — tedious paperwork becomes online forms and instant look-ups, and the platform now serves as the day-to-day backbone for the association and club officers',
    },
    href: 'https://ncku-ca.vercel.app',
    hrefLabel: 'ncku-ca.vercel.app',
    images: [
      {
        src: '/images/ncku-ca/demo3.png',
        alt: { zh: 'NCKU-CA 前臺畫面', en: 'NCKU-CA public site' },
        wide: true,
      },
      {
        src: '/images/ncku-ca/demo4.png',
        alt: { zh: 'NCKU-CA 後臺管理', en: 'NCKU-CA admin dashboard' },
        wide: true,
      },
    ],
  },
  {
    id: 'coffee-pocket',
    name: 'Coffee Pocket',
    latin: 'Coffee Pocket',
    tint: 'yellow',
    lead: {
      zh: '用一句話，找到剛好對味的咖啡廳',
      en: 'One sentence to find the café that’s just right',
    },
    body: {
      zh: '以臺南咖啡廳為主題的探索與收藏工具，用自然語言或標籤，就能找到「有插座、不限時、適合工作」的店家——把翻遍評論的十幾分鐘，變成一次幾秒鐘的搜尋',
      en: 'A tool for discovering and saving cafés in Tainan. Ask in plain language or pick tags to find places with “power outlets, no time limit, good for working” — turning fifteen minutes of scrolling through reviews into a search that takes seconds',
    },
    href: 'https://tainan-cafe.web.app/',
    hrefLabel: 'tainan-cafe.web.app',
    images: [
      { src: '/images/coffee-pocket/home.gif', alt: { zh: 'Coffee Pocket 首頁', en: 'Coffee Pocket home' } },
      {
        src: '/images/coffee-pocket/search.gif',
        alt: { zh: 'Coffee Pocket 語意搜尋', en: 'Coffee Pocket semantic search' },
      },
      {
        src: '/images/coffee-pocket/pocket.gif',
        alt: { zh: 'Coffee Pocket 口袋名單', en: 'Coffee Pocket saved list' },
      },
    ],
  },
  {
    id: 'zplit',
    name: 'Zplit',
    latin: 'Zplit',
    tint: 'sage',
    lead: {
      zh: '讓「先幫忙墊、之後一起算」變得毫無壓力',
      en: '“I’ll cover it now, we’ll settle up later” — without the awkwardness',
    },
    body: {
      zh: '即時同步的分帳工具，把一起出遊的團體帳，和朋友之間長期的往來帳合而為一，固定的朋友圈可以長期共用同一套工具，不必為每次聚會重新開始',
      en: 'A real-time bill-splitting app that brings group trip expenses and ongoing tabs between friends into one place, so a regular circle of friends can keep using the same ledger instead of starting over for every get-together',
    },
    href: 'https://zplit.web.app',
    hrefLabel: 'zplit.web.app',
    images: [
      { src: '/images/zplit/create-group.gif', alt: { zh: 'Zplit 建立群組', en: 'Zplit creating a group' } },
      { src: '/images/zplit/group-edit.gif', alt: { zh: 'Zplit 群組分帳', en: 'Zplit splitting a group bill' } },
      { src: '/images/zplit/personal-add.gif', alt: { zh: 'Zplit 個人往來', en: 'Zplit tab between friends' } },
    ],
  },
  {
    id: 'metro-sense',
    name: { zh: '捷境 MetroSense', en: 'MetroSense' },
    latin: 'MetroSense',
    tint: 'sky',
    hidden: true,
    lead: {
      zh: '一套捷運 App，同時懂通勤族與觀光客',
      en: 'One metro app for commuters and tourists alike',
    },
    body: {
      zh: '結合 AI 的台北捷運智能助手，以「通勤 / 旅遊」模式切換讓介面隨情境改變，並用語音問答取代層層選單，讓長輩與旅客也能無門檻地查詢路線，榮獲北捷黑客松第一名與宏碁特別獎',
      en: 'An AI assistant for the Taipei Metro. A Commute / Travel switch reshapes the interface to fit the moment, and voice Q&A replaces layers of menus so older riders and visitors can look up routes with ease. First place at the Taipei Metro Hackathon, plus the Acer Special Award',
    },
    href: 'https://metro-sense.vercel.app',
    hrefLabel: 'metro-sense.vercel.app',
    images: [
      {
        src: '/images/metro-sense/demo.png',
        alt: { zh: 'MetroSense 介面展示', en: 'MetroSense interface' },
        wide: true,
      },
    ],
  },
  {
    id: 'inksync',
    name: 'InkSync',
    latin: 'InkSync',
    tint: 'terracotta',
    hidden: true,
    lead: {
      zh: '用一支手機，同時點亮整面電子紙',
      en: 'Light up a whole wall of e-paper from a single phone',
    },
    body: {
      zh: '一套軟硬整合的 IoT 系統：手機 App 同時控制多台電子紙裝置的顯示內容，適用於展場看板與桌面資訊牌，相關電子紙提案獲元太科技創新設計工作坊第一名創新金獎',
      en: 'An IoT system spanning hardware and software: one phone app drives what many e-paper devices display at once, for exhibition signage and desk displays. The related e-paper proposal took first place — the Innovation Gold Award — at E Ink’s Innovative Design Workshop',
    },
    href: 'https://github.com/ncchen99/InkSync',
    hrefLabel: 'github.com/ncchen99/InkSync',
    images: [
      { src: '/images/inksync/epaper-device.jpg', alt: { zh: 'InkSync 電子紙裝置', en: 'InkSync e-paper device' } },
      { src: '/images/inksync/app-home.png', alt: { zh: 'InkSync App 首頁', en: 'InkSync app home' } },
      {
        src: '/images/inksync/app-device-menu.png',
        alt: { zh: 'InkSync 裝置選單', en: 'InkSync device menu' },
      },
    ],
  },
]
